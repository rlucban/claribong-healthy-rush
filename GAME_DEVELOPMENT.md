# C'laribong: Healthy Rush 3D — Game Process & Development Documentation

> **Project Name:** C'laribong Healthy Rush 3D  
> **Type:** Browser-based 3D Web Game (no build step, no external assets)  
> **Engine:** [Three.js r128.0](https://unpkg.com/three@0.128.0) (loaded via CDN ES module)  
> **Core APIs:** HTML5 Canvas, WebGL, Web Audio API, Web Speech API, localStorage  
> **Input:** Keyboard (desktop) + Touch/Mouse (mobile & desktop)  
> **Persistence:** `localStorage` (high scores, skins, trivia, recipes, settings)

---

## Table of Contents

1. [Game Overview](#1-game-overview)
2. [Project Structure](#2-project-structure)
3. [Architecture & Data Flow](#3-architecture--data-flow)
4. [Game States & Screens](#4-game-states--screens)
5. [Core Gameplay Mechanics](#5-core-gameplay-mechanics)
6. [Items System](#6-items-system)
7. [Progression System](#7-progression-system)
8. [Nutrition Report Card](#8-nutrition-report-card)
9. [Skin & Reward System](#9-skin--reward-system)
10. [Fruit Trivia Encyclopedia](#10-fruit-trivia-encyclopedia)
11. [Fruit Recipe Book](#11-fruit-recipe-book)
12. [Audio Engine](#12-audio-engine)
13. [3D Rendering & Visuals](#13-3d-rendering--visuals)
14. [Input Handling](#14-input-handling)
15. [Responsive UI / CSS Architecture](#15-responsive-ui--css-architecture)
16. [Persistence Layer](#16-persistence-layer)
17. [Technical Challenges & Solutions](#17-technical-challenges--solutions)
18. [Development Guidelines](#18-development-guidelines)

---

## 1. Game Overview

**C'laribong: Healthy Rush 3D** is an educational, health-themed arcade game where the player
rolls a ball down a procedurally-generated fruit-themed track. The core message is simple:

> **Collect healthy foods — fruits, vegetables, and water — to stay energetic and unlock rewards. Avoid junk food and slime or your health collapses.**

The game blends **endless-runner mechanics** with **collectathon elements**, a **nutrition grading
system**, a **skin unlock tree**, a **fruit trivia encyclopedia**, and a **recipe book** that unlocks
as the player levels up. It is designed to be playable on both desktop and mobile browsers with no
installation required.

### Core Loop

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────────┐
│   Start     │ ──▶ │  Roll forward│ ──▶ │  Collect │ ──▶ │  Avoid Junk  │
│   Menu      │     │  down track  │     │  Fruits   │     │  & Slime     │
└─────────────┘     └──────────────┘     └──────────┘     └──────────────┘
                                                        │
                        ┌───────────────────────────────┘
                        ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Finish Line  │ ◀── │  Health > 0   │ ◀── │  Junk Impact│
│  Reached?    │     │   & Timer    │     │  / Slime Hit │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │ YES
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Victory    │     │ Nutrition    │     │ Recipe &     │
│   Screen     │     │ Grade Card   │     │ Skin Rewards │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Educational Themes

- **Nutrition awareness**: Each collectible has associated vitamin/calorie values
- **Healthy habit goals**: Daily targets for fruits, veggies, and water
- **Fruit trivia**: Fun facts about Filipino and international fruits
- **Cooking education**: Unlocked recipes teach real-world healthy cooking
- **Habit formation**: The grading system (A+ to D) gamifies dietary awareness

---

## 2. Project Structure

```
claribong-healthy-rush-main/
├── index.html              # All UI screens + DOM overlays
├── game.js                 # Main game logic (Game class + constants)  [~2,645 lines]
├── models.js               # Three.js 3D model factories + Skin registry  [~1,880 lines]
├── audio.js                # Web Audio API synth engine + SFX  [~632 lines]
├── style.css               # Full CSS — UI, HUD, animations, responsive  [~2,755 lines]
├── background.png          # Repeating fruit-pattern background texture
└── package-lock.json       # npm lockfile (name: "C'laribong Healthy Rush 3D")
```

### File Responsibilities

| File | Lines | Responsibility |
|------|-------|----------------|
| **index.html** | 555 | Single-page app shell with all screens, HUDs, overlays, and inline module entry (`<script type="module" src="game.js">`) |
| **game.js** | 2,645 | Game class: state machine, physics, collision, HUD, progression, input, persistence |
| **models.js** | 1,880 | 3D mesh factories (fruits, veggies, junk, power-ups, hazards, track segments, finish line), Skin registry, ParticleSystem class |
| **audio.js** | 632 | AudioEngine class: Web Audio synth, 3 music tracks, per-item SFX, health-reactive tempo |
| **style.css** | 2,755 | All visual styling: glass-morphism panels, HUD layouts, mobile dock, animations, theme colors |

### Entry Point

```html
<!-- index.html:552-554 -->
<script type="module" src="game.js"></script>
```

```js
// game.js:2642-2645
const game = new Game();
window.addEventListener('DOMContentLoaded', () => game.init());
export { game };
```

---

## 3. Architecture & Data Flow

```
                    ┌─────────────────────────────────────────────┐
                    │                  Window                    │
                    │  (DOMContentLoaded, resize, keydown, etc.) │
                    └──┬─────────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Game Class    │ ◀── import { audio } from './audio.js'
              │  (game.js)      │ ◀── import * as Models from './models.js'
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
  Three.js Scene      DOM           localStorage
  (Renderer,           (HUD,           (High score,
   Camera,            Screens,        Skins,
   Lights,            Overlays)        Trivia,
   Meshes,                             Recipes,
   Particles)                           Settings)
```

### Three.js Component Overview

| Component | Configuration |
|-----------|--------------|
| **Scene** | `FogExp2` with color `#c1ff72`, density `0.005` |
| **Camera** | `PerspectiveCamera(60°, w/h, 0.1, 1000)`, starts at `(0, 3.5, -7.5)` |
| **Renderer** | `WebGLRenderer({ antialias, alpha: true })`, soft PCF shadows, ACES Filmic tone mapping, exposure 1.3 |
| **Lights** | Ambient `#ffeedd` (0.9), Directional `#fff4e6` (1.6, casts shadows), Fill `#b3e5fc` (0.5) from below |
| **Player** | SphereGeometry (radius 0.38, 16×16 segments), with child PointLight |

### Game Loop

```js
// game.js:2170
tick(time) {
  requestAnimationFrame((t) => this.tick(t));
  const currentTime = time * 0.001;
  let dt = currentTime - this.lastTime;
  this.lastTime = currentTime;
  if (dt > 0.1) dt = 0.1;  // Clamp delta to prevent spiral of death

  if (this.state === 'playing') {
    this.updatePhysics(dt);
    this.checkCollisions();
    this.updateProceduralTrack();
  }
  this.particles.update(dt);
  this.updateCamera(dt);
  this.render();
}
```

The loop runs at 60 FPS via `requestAnimationFrame`, with `dt` clamped to 100ms.

---

## 4. Game States & Screens

### State Machine

| State | Trigger | Exit Condition |
|-------|---------|----------------|
| `menu` | Player clicks PLAY, or finishes game | START GAME clicked → `playing` |
| `playing` | Game starts | Health ≤ 0 → `gameover`; Distance ≥ finish line → `victory`; Pause button → `paused` |
| `paused` | ESC key or Pause button | Resume button → `playing`; Quit → `menu` |
| `gameover` | Health reaches 0 | Restart button / Victory screen |
| `victory` | Cross finish line | Menu | Restart button |

### Screen Inventory (HTML `<section>` elements)

| Screen | HTML ID | Purpose |
|--------|---------|---------|
| Start Menu | `start-screen` | Main hub with Play, Character Select, Trivia, Leaderboard, Grading, Recipes, Settings |
| Game Over | `game-over-screen` | Shows score, high score, grade, nutrition report, tip |
| Victory | `victory-screen` | Shows score, high score, grade, nutrition report, tip |
| Pause | `pause-screen` | Resume / Restart / Quit to Menu |
| Character Select | `char-select-screen` | 12-color swatch picker |
| Settings | `settings-screen` | Music/SFX toggles, game speed selector |
| Fruit Trivia | `trivia-screen` | Encyclopedia of unlocked fruit facts |
| Leaderboard | `leaderboard-screen` | Top 10 local high scores + star ratings |
| Grading System | `grading-screen` | Explains the A+ to D grade criteria |
| Fruit Recipes | `recipes-screen` | 10 unlockable recipes |
| Recipe Modal | `recipe-modal` | Pop-up when a new recipe unlocks |
| Trivia Toast | `trivia-toast` | Notification for newly unlocked fruit trivia |
| Achievement Toast | `achievement-toast` | Notification for newly unlocked skin |

---

## 5. Core Gameplay Mechanics

### Ball Physics

| Property | Value | Description |
|----------|-------|-------------|
| Radius | 0.38 | Ball size |
| Base Speed | 6 (normal) / 4 (easy) | Forward roll speed (units/sec) |
| Max Speed | 15 (normal) / 10 (easy) | At 100% track progress |
| Gravity | -24 | Jump arc gravity |
| Jump Power | 6.0 | Initial upward velocity |

**Acceleration**: Speed increases linearly as the player progresses through the track:
```js
const progressFactor = Math.min(1.0, this.distance / this.finishLineZ);
this.speed = this.baseSpeed + progressFactor * (this.maxSpeed - this.baseSpeed);
```

### Dynamic Ball Scaling

The ball morphs shape based on health state, creating a visual avatar of the player's diet:

| State | Scale | Visual Meaning |
|-------|-------|-----------------|
| Healthy (fruit collected) | `scaleSlim` = (0.75, 1.15, 0.75) | Slender, "fit" appearance |
| Unhealthy (junk hit) | `scaleBlob` = (1.6, 0.75, 1.6) | Bloated, "unhealthy" appearance |
| Super Mode | `scaleSuper` = (0.85, 1.05, 0.85) | Compact, energized |
| Default/Recovery | `scaleDefault` = (1, 1, 1) | Normal |

Scaling is smoothly lerped:
```js
this.ball.scale.x = THREE.MathUtils.lerp(this.ball.scale.x, this.ballTargetScale.x, 0.06);
```

### Track System

- **Track width**: 4.5 units
- **Segment length**: 20 units
- **Finish line**: Z = 1500 units
- **Zones**: `['watermelon', 'mango', 'papaya']` — cycles every 6 segments (120 meters)
- **Segments**: Procedurally spawned and cleaned up (max 8 active) as the ball advances

Each segment is a 3D box with a **canvas-generated texture** mapped to the top face:
- Watermelon zone: pink pulp with black seeds, mint green rinds
- Mango zone: orange texture (implied)
- Papaya zone: orange-red texture (implied)

Track edges glow with theme-specific colors and have a translucent sci-fi aesthetic.

### Camera System

```js
// Third-person isometric follow
const targetCamX = this.ball.position.x;
const targetCamY = this.ball.position.y + 2.4;
const targetCamZ = this.ball.position.z - 6.5;

// In menu state: lazy orbit around origin point (5, 5)
// In gameplay: smooth lerp following, with screen shake on junk impact
```

### Jumping

- Triggered by: Spacebar / ArrowUp / quick tap on mobile
- Ball must be on ground (y ≤ radius + 0.05)
- Single jump only (no double jump)
- Slime obstacles are low to the ground; jumping avoids them

### Super Mode (Rainbow Rush)

| Condition | Effect |
|-----------|--------|
| Health reaches 100% | Automatically activates |
| Duration | 6 seconds |
| Speed multiplier | 1.8x |
| Invincibility | Yes (junk food gives +250 score instead of damage) |
| Visual | Ball cycles through rainbow HSL colors, point light follows |
| Audio | Tempo increases to 145 BPM, C Major scale, hi-hats on off-beats |
| On exit | Health resets to 75%, speed returns to 1.0x, ball scale resets to default |

### Fruit Frenzy (Pre-Race Boost)

| Property | Value |
|----------|-------|
| Duration | 5 seconds |
| Effect | Only healthy fruits spawn (no junk food, no slime, no power-ups) |
| Visible | "🍓 FRUIT FRENZY" badge with countdown timer on HUD |

---

## 6. Items System

### Spawn Logic

Items spawn at 3 Z-offsets per segment (5m, 10m, 15m) with a 70% chance each, in random lanes (Left: -1.5, Center: 0, Right: 1.5).

| Item Type | Roll Range | Healthy? | Effects |
|-----------|-----------|----------|---------|
| **Magnet** | 3% | Yes | Pulls nearby collectibles for 10 seconds |
| **Shield** | 3% | Yes | Absorbs next junk hit |
| **Fruit** | 30% (+100% during Frenzy) | Yes | +150 score, +10 vitamins, +50 calories, +10 HP (+20 for water) |
| **Veggie** | 14% | Yes | +150 score, +10 vitamins, +10 HP |
| **Water** | 10% | Yes | +150 score, +20 HP, +10 vitamins, +50 calories |
| **Junk Food** | 28% | No | -16 HP, -100% speed (0.55x for 2s), +400 calories, -2 vitamins, toxic bump |
| **Slime** | 12% | No | -16 HP, speed penalty, toxic bump |

### Healthy Fruits (5 types)

| Fruit | Color | Trivia Entry |
|-------|-------|-------------|
| Mango | `#f39c12` (golden orange) | Mangga — "King of Fruits" |
| Banana | `#ffea00` (yellow) | Saging — "Energy Powerhouse" |
| Watermelon | `#ff6595` (pink) | Pakwan — "Summer Cooler" |
| Papaya | `#ff8c42` (orange) | Papaya — "Digestive Helper" |
| Calamansi | `#8bc34a` (green) | Calamansi — "Citrus Powerhouse" |

### Healthy Vegetables (4 types)

| Veggie | Color |
|--------|-------|
| Carrot | `#ff7f27` |
| Broccoli | `#2e9e44` |
| Squash (Kalabasa) | `#e67e22` |
| Eggplant (Talong) | `#6c2c91` |

### Junk Foods (6 types)

| Junk | Color | Description |
|------|-------|-------------|
| Burger | Brown/Orange | Bun, patty, cheese, lettuce, sesame seeds |
| Soda | `#dc143c` (red) | Can with white stripe, silver rims |
| Donut | Brown/Pink | Glazed with sprinkles |
| Fries | Brown/Yellow | In red box with golden chips |
| Hotdog | Tan/Red | Bun with sausage and mustard |
| Chips | `#d32f2f` (red) | Bag with gold foil bottom |

### Hazards

| Hazard | Hit Radius | Effect |
|--------|-----------|--------|
| Slime | 0.9 | Same damage as junk food, toxic bump |

### Power-ups

| Power-up | Visual | Duration |
|-----------|--------|----------|
| Magnet | Blue horseshoe with silver tips | 10 seconds (countdown shown) |
| Shield | Golden translucent sphere | One-hit absorption (permanent until consumed) |

### Additional Models (Unused / Reserved)

The models.js file also defines models for **Dalandan**, **Apple**, **Pineapple**, **Lanzones**, **Santol**, **Mangosteen**, **Rambutan**, **Atis**, and **Chico** — Filipino tropical fruits. These are fully modeled and color-coded but **not currently wired** into the spawn logic (only mango, banana, watermelon, papaya, and calamansi appear in-game).

---

## 7. Progression System

### 10 Levels

The track (1,500 units) is divided into 10 levels. Level increases as the ball advances:

```js
const level = Math.min(10, Math.max(1, Math.floor(this.distance / (this.finishLineZ / 10)) + 1));
```

### Recipe Rewards

Each level-up triggers a recipe unlock popup (5-second auto-dismiss with progress bar):

| Level | Recipe | Fruit Used | Color |
|-------|--------|-----------|-------|
| 1 | Mango Graham Float | 🥭 | `#f39c12` |
| 2 | Banana Oat Smoothie | 🍌 | `#ffea00` |
| 3 | Watermelon Mint Juice | 🍉 | `#ff6595` |
| 4 | Papaya & Calamansi Salad | 🍈 | `#ff8c42` |
| 5 | Calamansi Honey Drink | 🍋 | `#8bc34a` |
| 6 | Carrot & Ginger Juice | 🥕 | `#ff7f27` |
| 7 | Broccoli Stir-Fry with Garlic | 🥦 | `#2e9e44` |
| 8 | Ginataang Kalabasa | 🎃 | `#e67e22` |
| 9 | Tortang Talong | 🍆 | `#6c2c91` |
| 10 | Fruit Salad Supreme | 🍓 | `#ff6595` |

### Daily Goal Targets

Visible on the desktop HUD and mobile top panel:

| Goal | Target | Tracking Metric |
|------|--------|-----------------|
| 🍎 Fruits | 3 | `fruitsCollectedInRun` |
| 🥦 Vegetables | 3 | `veggiesCollectedInRun` |
| 💧 Water | 5 | `waterCollectedInRun` |

Progress bars fill as items are collected.

---

## 8. Nutrition Report Card (Star Rating System)

At game over or victory, the player receives a **3-star rating** based on three specific run objectives:

```js
// Star 1: Completion / Survival
const star1 = this.distance >= this.finishLineZ * 0.5;

// Star 2: Nutrition Goals
const star2 = this.runFruits >= 3 && this.runVeggies >= 3 && this.runWater >= 5;

// Star 3: Mastery & Skill
const star3 = this.healthyCombo >= 5 || purity >= 75;
```

| Stars | Title | Color | Description |
|-------|-------|-------|-------------|
| **3** | PERFECT RUN! | `#00e676` (green) | Mastered all three objectives |
| **2** | GREAT JOB! | `#ffea00` (yellow) | Achieved two of three objectives |
| **1** | GOOD EFFORT! | `#ff9100` (orange) | Achieved one objective |
| **0** | TRY AGAIN! | `#ff1744` (red) | Fell short on all objectives |

### Star Criteria

**🟢 Star 1 — Completion/Survival**: Awarded if the player reached at least halfway through the track (Level 5+, i.e. `distance >= finishLineZ * 0.5`) or crossed the finish line.

**🟢 Star 2 — Nutrition Goals**: Awarded if the player fulfilled all daily targets in a single run: `runFruits >= 3` AND `runVeggies >= 3` AND `runWater >= 5`.

**🟢 Star 3 — Mastery & Skill**: Awarded if the player achieved a 5x healthy combo streak (`maxHealthyCombo >= 5`) OR maintained 75%+ purity ratio (`healthyItems / totalItems >= 0.75`).

### Supporting Metrics

**Purity**: `healthyItems / totalItems` where healthy items = Fruits + Vegetables + Water, and total items = healthy + junk + slime.
**Healthy Combo**: Consecutive healthy items collected without hitting junk/slime. Best streak stored in `maxHealthyCombo`.
**Super Mode Count**: Each Super Mode activation increments `superModeCount` (used in achievement/skin unlocking).

The report card (with star icons, checklist, and purity stats) is also saved to the leaderboard.

---

## 9. Skin & Reward System

### Unlocked Skins (5 total)

| Skin | Color | Unlock Requirement |
|------|-------|-------------------|
| Classic Glow | `#ffffff` | Default (always unlocked) |
| Kiwi Fusion | `#00e676` | Collect 20 fruits (lifetime) |
| Liquid Gold | `#ffd700` | Score 3,000+ points |
| Retro Matrix | `#00f0ff` | Trigger Super Mode 3 times (lifetime) |
| Toxic Ooze | `#39ff14` | Eat 15 junk items (lifetime) |

### Skin Materials

- **Classic Glow**: Standard `MeshPhysicalMaterial` with white emissive
- **Kiwi Fusion**: Canvas texture with green flesh, white streaks, black seeds
- **Liquid Gold**: Chrome-like `MeshPhysicalMaterial` with high metalness/clearcoat
- **Retro Matrix**: Canvas texture with cyan grid pattern and intersection dots
- **Toxic Ooze**: Canvas texture with dark green bubbling veins and toxic glow

### Achievement Tracking (Lifetime Stats)

Stored in localStorage:
- `fr_total_fruits` — total fruits collected across all runs
- `fr_total_junk` — total junk items hit across all runs
- `fr_total_supers` — total super mode activations
- `fr_unlocked_skins` — array of unlocked skin IDs
- `fr_equipped_skin` — currently selected skin ID

---

## 10. Fruit Trivia Encyclopedia

### Unlock Mechanism

Collecting any fruit for the **first time** in any run unlocks its trivia entry:

```js
unlockTriviaEntry(fruitType) {
  if (!FRUIT_TRIVIA[fruitType]) return false;
  if (this.unlockedTrivia.includes(fruitType)) return false;
  this.unlockedTrivia.push(fruitType);
  localStorage.setItem('fr_unlocked_trivia', JSON.stringify(this.unlockedTrivia));
  this.showTriviaToast(fruitType);
  return true;
}
```

### Available Entries (8 fruits)

| Fruit | Emoji | Color | Tagline |
|-------|-------|-------|---------|
| Mango | 🥭 | `#f39c12` | The King of Fruits |
| Banana | 🍌 | `#ffea00` | The Energy Powerhouse |
| Watermelon | 🍉 | `#ff6595` | The Summer Cooler |
| Papaya | 🍈 | `#ff8c42` | The Digestive Helper |
| Calamansi | 🍋 | `#8bc34a` | The Tiny Citrus Powerhouse |
| Carrot | 🥕 | `#ff7f27` | The Eye-Friendly Veggie |
| Broccoli | 🥦 | `#2e9e44` | The Green Super Veggie |
| Water | 💧 | `#42a5f5` | The Liquid of Life |

Each entry includes: spelling, health benefits, vitamin content, 3 fun facts.

### Toast Notification

When a new entry is unlocked, a floating glass-morphism toast appears showing the emoji, name, and tagline for 4 seconds.

---

## 11. Fruit Recipe Book

### Unlock Mechanism

Recipes unlock as the player **levels up** during a run (each of the 10 levels unlocks one recipe).

### Recipe Data Structure

Each recipe in `FRUIT_RECIPES` includes:

- `level` — required run level (1–10)
- `name` — recipe title
- `emoji` — visual icon
- `fruit` — primary ingredient fruit ID
- `color` — theme color
- `benefit` — nutritional benefit summary
- `ingredients` — array of ingredient strings
- `steps` — array of cooking step strings

The recipe modal shows a "LEVEL X UNLOCKED!" tag badge and auto-dismisses after 5 seconds with a shrinking progress bar.

---

## 12. Audio Engine

### Architecture

The `AudioEngine` class (`audio.js`) is a **pure Web Audio API** implementation with no external
libraries. It uses a **live scheduler** pattern (inspired by [HTML5 Rocks scheduler article](https://webaudio.github.io/web-audio-api/))
with a 25ms lookahead.

### Music Tracks (3)

| Track | Style | Bass | Lead | Delay | Characteristics |
|-------|-------|------|------|-------|-----------------|
| Chiptune Chill | Retro 8-bit | Triangle | Sine | 0.3s | Relaxing, arpeggiated |
| Fruit Disco | Funky | Square | Triangle | 0.18s | Upbeat, syncopated |
| Neon Heavy | Synthwave | Sawtooth | Sawtooth | 0.4s | Aggressive, driving |

Each track has:
- **Bass pattern**: 8-step sequence (bass note indices)
- **Melody patterns**: 3 rows of 8-step melodies (randomly selected each measure)
- **Octave shift**: Controls bass register

### Health-Reactive Music

The music dynamically changes based on player state:

| State | Scale | Wave Type | Filter Cutoff | Tempo |
|-------|-------|-----------|---------------|-------|
| Menu/Game Over | Ambient A minor chord | Sine | N/A | 110 / 60 BPM |
| Playing (healthy) | A Minor | Triangle | 800 Hz | 110 BPM |
| Playing (sick <30 HP) | Locrian (dissonant) | Sawtooth | 350 Hz, detuned | 110 BPM |
| Super Mode | C Major (bright) | Sawtooth | 1800 Hz | 145 BPM |

### Sound Effects

| Event | Sound | Technique |
|-------|-------|-----------|
| Fruit collect | Per-fruit pitch sweep | Oscillator freq exponential ramp |
| Junk hit | Low detuned saw buzz + noise | 2 oscillators + biquad filter + white noise |
| Super mode | C Major arpeggio | 7-note ascending sequence |
| Game over | Descending sawtooth slide | Lowpass filter sweep |
| Shield/break | High synth ping | Simple oscillator burst |

### Persistence

Audio settings stored in localStorage:
- `fr_volume` (0.0–1.0)
- `fr_music_enabled` ("1" or "0")
- `fr_sfx_enabled` ("1" or "0")

---

## 13. 3D Rendering & Visuals

### Procedural Model Generation

All 3D models are built **procedurally** using Three.js primitive geometries (Sphere, Cylinder,
Box, Cone, Torus, Tube, Icosahedron). No external model files are loaded.

### Model Categories

| Category | Models | Geometry Examples |
|----------|--------|---------------------|
| **Fruits** (5 in-game + 9 extra) | Mango, Banana, Watermelon, Papaya, Calamansi | Sphere, Cone, Cylinder, Box |
| **Vegetables** (4) | Carrot, Broccoli, Squash, Eggplant | Cone, Cylinder, Sphere |
| **Junk Food** (6) | Burger, Soda, Donut, Fries, Hotdog, Chips | Box, Cylinder, Torus, Sphere |
| **Power-ups** (2) | Magnet, Shield | Torus, Sphere |
| **Hazards** (1) | Slime | Cylinder + Sphere bubbles |
| **Track** | Segments, Finish Line, Germs | Box, Cylinder, Torus |

### Particle System

The `ParticleSystem` class (`models.js:958`) manages two particle types:

1. **Trail particles**: Spawn near the ball's rear, drift up and back, shrink over 1s
2. **Explosion particles**: Radial burst at collection points, spherical velocity, 0.5–1.0s lifespan
3. **Toxic smoke**: Purple/magenta spheres that grow and fade, used on junk hits

Particles use `BoxGeometry(0.08, 0.08, 0.08)` with `MeshBasicMaterial` for performance.

### Dynamic Textures

Track segments use canvas-generated textures (`getFruitTrackTexture()` in `models.js:7`) that
render watermelon-like patterns with seeds, rinds, and color bands at runtime. These are cached
to avoid regeneration.

### Ball State Visuals

| State | Material Changes | Light Changes |
|-------|-----------------|---------------|
| Healthy | Color = fruit color, emissive = fruit color, intensity 1.2, roughness 0.05 | Light color = fruit color, intensity 5.0 |
| Junk hit | Color = `#8a0a3c`, emissive = `#3a0a1e`, roughness 0.9 | Light color = `#ce3a8a`, intensity 4.5 |
| Super mode | Rainbow HSL cycling | Rainbow HSL cycling |
| Default recovery | Restored to skin material | Restored to skin color |

---

## 14. Input Handling

### Desktop Keyboard

| Key | Action |
|-----|--------|
| `ArrowLeft` / `A` | Steer left (held = continuous) |
| `ArrowRight` / `D` | Steer right (held = continuous) |
| `Space` / `ArrowUp` | Jump |
| `Escape` | Pause toggle |

### Mobile / Touch

#### Touch Steering (Primary)
- **Direct mapping**: Screen X position maps directly to track X position
- **Continuous**: `isSteering` boolean flips true on `touchstart`/`mousedown`, false only on `touchend`/`mouseup`
- **No snap-back**: Releasing the finger holds the ball's current lane
- **Jump**: Quick tap (<250ms, <12px movement) triggers a jump
- **UI isolation**: Touches on buttons, dock items, swatches, etc. are excluded from steering via `isUiTarget()` check

#### Mobile Dock Navigation (Bottom Bar)
Seven circular buttons that appear on touch devices:

| Button | Emoji | Action |
|--------|-------|--------|
| Trivia | 💡 | Open Fruit Trivia Book |
| Fruits | 🍎 | Flash "COLLECT FRUITS!" word |
| Veggies | 🥦 | Flash "EAT VEGGIES!" word |
| Water | 💧 | Flash "DRINK WATER!" word |
| Stats | 📊 | Open Leaderboard |
| Music | 🎵 | Cycle music track |
| Mute | 🔊 | Toggle mute |

#### Input Cooldown System
A 500ms input cooldown (`inputCooldownUntil`) prevents accidental UI interactions during the start
transition. After game over/victory, a 1000ms cooldown prevents accidental restarts.

### Input Event Architecture

```
Window-level listeners (game.js:794-944):
├── keydown / keyup        → Held-key continuous steering
├── mousedown / mousemove / mouseup → Mouse steering
├── touchstart / touchmove / touchend / touchcancel → Touch steering
└── (Keyboard: Escape for pause, Space/ArrowUp for jump)

UI Buttons use bindPress() (game.js:757) which:
- Applies 500ms start cooldown
- Debounces click/tap duplicates (400ms)
- Suppresses synthesized clicks after touch events
```

---

## 15. Responsive UI / CSS Architecture

### CSS Structure

The stylesheet (`style.css`, ~2,755 lines) uses CSS custom properties for theming and a
component-based class naming system.

#### Theme Colors

```css
:root {
  --bg-dark: #14281D;        /* Deep forest green */
  --panel-bg: #fff0f3;       /* Soft pinkish cream */
  --text-heading: #ff5079;   /* Coral pink */
  --glow-red: #ff1744;
  --glow-green: #00e676;
  --glow-blue: #2979ff;
  --glow-purple: #d500f9;
  --glow-yellow: #ffea00;
  --glow-orange: #ff9100;
}
```

#### Responsive Layouts

| Breakpoint | Layout |
|-----------|--------|
| **≥ 768px** (Desktop) | Full HUD: score/level/goal cards top-left, health bar/top-right, pause button, audio widget |
| **< 768px** (Mobile) | Minimal top goal bar, 3-column stat row, floating frenzy/buff/powerup badges, bottom dock navigation |

#### CSS State Classes

Body-level classes drive visibility:
- `.in-menu` — hides gameplay HUD, shows blurred 3D backdrop
- `.playing` — locks all menu screens (pointer-events: none), enables HUD

Screen-level `.active` class controls which `<section>` is visible.

---

## 16. Persistence Layer

All data is stored in `localStorage` with the `fr_` key prefix.

| Key | Type | Description |
|-----|------|-------------|
| `fruit_roller_highscore` | Number | Global high score |
| `fr_total_fruits` | Number | Lifetime fruit collected |
| `fr_total_junk` | Number | Lifetime junk items hit |
| `fr_total_supers` | Number | Lifetime Super Mode activations |
| `fr_unlocked_skins` | JSON Array | Unlocked skin IDs |
| `fr_equipped_skin` | String | Currently selected skin |
| `fr_char_color` | String (hex) | Selected character color |
| `fr_game_speed` | String | "easy" or "normal" |
| `fr_unlocked_trivia` | JSON Array | Unlocked fruit trivia entries |
| `fr_unlocked_recipes` | JSON Array | Unlocked recipe levels |
| `fr_leaderboard` | JSON Array | Top 10 scores with grades |
| `fr_volume` | Number | Master volume 0–1 |
| `fr_music_enabled` | String | "1" or "0" |
| `fr_sfx_enabled` | String | "1" or "0" |

---

## 17. Technical Challenges & Solutions

### Challenge 1: Touch Steering Without UI Interference
**Problem**: On mobile, the first touch of a game often starts on the "PLAY" button. If that touch
is held and dragged, it should steer the ball — not trigger UI actions.

**Solution**: A `pendingSteerTouchId` mechanism remembers the touch that began on a UI element
during the start cooldown. On `touchmove`, if the active touch matches this pending ID, it
handsoffs to steering immediately with no distance threshold.

### Challenge 2: Synthesized Click Suppression
**Problem**: Touch/pointer events trigger a "synthesized click" ~300ms after `touchend`, which
could re-trigger the last UI action (e.g., restarting the game).

**Solution**: `bindPress()` tracks whether a press originated from touch/pointer. If so, the
trailing synthesized click is suppressed entirely.

### Challenge 3: Menu Screen Reopening During Gameplay
**Problem**: Accidental taps near the START area or holding a tap could reopen the main menu
mid-race.

**Solution**: `body.playing` class applies `pointer-events: none` to all menu screens. The menu
only returns via explicit "Quit to Menu" button or game end state.

### Challenge 4: Health-Reactive Music Timing
**Problem**: The Web Audio scheduler must adjust tempo and scale smoothly without skipping beats
as health fluctuates.

**Solution**: The `scheduleNote()` function reads live `gameState` and `health` values on each
scheduled note. Tempo changes via `setHealth()` use gradual `linearRampToValueAtTime` for smooth
transitions.

### Challenge 5: Procedural Track Memory Management
**Problem**: Infinite-looking track could accumulate meshes and cause memory leaks.

**Solution**: Segments are despawned when they fall 25 units behind the ball (`updateProceduralTrack`).
Items are removed when they pass 8 units behind. A maximum of 8 active segments are kept.

---

## 18. Development Guidelines

### Running the Game

No build step is required. Simply open `index.html` in a modern browser:

```bash
# No server needed for development, but a local server avoids CORS issues
npx serve .
# or
python -m http.server 8000
```

### Dependencies

- **Three.js r128.0** — loaded via CDN from `unpkg.com` (no npm install needed)
- **Web Audio API** — natively in all modern browsers
- **Web Speech API** — for text-to-speech (female voice)
- **localStorage** — for persistence (6KB+ limit, no backend)

### Adding New Content

**New Fruit/Veggie/Junk Model:**
1. Add a `create<Type>()` function in `models.js`
2. Register it in the appropriate factory dispatcher (`createFruit`, `createVeggie`, `createJunk`)
3. Add to the `fruitColors` map in `game.js` if it's a healthy fruit
4. Optionally add a `FRUIT_TRIVIA` entry

**New Skin:**
1. Add a material factory function in `models.js`
2. Add an entry to the `SKINS` array with `id`, `name`, `color`, `requirement`, and `createMaterial`

**New Music Track:**
1. Add a track object to `this.tracks` in the `AudioEngine` constructor
2. Include `name`, `bassPattern`, `melodyPattern`, `bassType`, `leadType`, `bassOctaveShift`, `delayTime`, `delayFeedback`

### Coding Conventions

- **ES Modules**: `import`/`export` throughout, no globals except `window.gameAudio` for dev
- **Constants in UPPER_SNAKE_CASE**: `FRUIT_TRIVIA`, `FRUIT_RECIPES`, `NUTRITION_TIPS`
- **CamelCase for methods**: `handleItemCollision`, `spawnNextSegment`
- **Three.js naming**: `create<Type>()` for model factories
- **No comments in production code**: Code is self-documenting with descriptive variable names
- **localStorage keys** use the `fr_` prefix consistently

### Key Source Locations

| Feature | File | Key Locations |
|---------|------|---------------|
| Game state & tick loop | `game.js` | Lines 247–487 (class/ctor), 2170–2272 (tick), 2274–2389 (updatePhysics) |
| Item spawning | `game.js` | Lines 1226–1348 (spawnInitialTrack, spawnNextSegment, spawnItemsOnSegment) |
| Collision & collection | `game.js` | Lines 2024–2160 (checkCollisions, handleItemCollision) |
| Super mode | `game.js` | Lines 2145–2183 (activate/deactivate) |
| HUD updates | `game.js` | Lines 1780–1842 (updateHUD) |
| Star calculation | `game.js` | Lines 2635–2730 (calculateStarRating, getStarTitle, getStarColor, saveToLeaderboard, showLeaderboard) |
| Input handling | `game.js` | Lines 794–1064 (setupEvents, bindPress, steering) |
| 3D models | `models.js` | Lines 53–1880 (all create<Type> functions) |
| Audio engine | `audio.js` | Lines 1–628 (AudioEngine class) |

---

## Appendix: Game Balance Summary

### Scoring

| Action | Points |
|--------|--------|
| Distance traveled | `speed * multiplier * dt * 0.15` per frame |
| Collect healthy item | +150 |
| Super mode bonus (healthy item) | +150 (double) |
| Smash junk in super mode | +250 |

### Health

| Starting | 50/100 |
|----------|--------|
| Heal (fruit/veggie) | +10 (or +20 for water) |
| Damage (junk/slime) | -16 |
| Super mode activation | At 100% health |
| Super mode exit | Reset to 75% |
| Game over | At 0% health |

### Speed Multipliers

| State | Multiplier | Duration |
|-------|------------|----------|
| Healthy collect | 1.35x | 1.5 seconds |
| Junk hit | 0.55x | 2.0 seconds |
| Super mode | 1.8x | 6 seconds |
| Fruit Frenzy | N/A (only healthy items spawn) | 5 seconds |
