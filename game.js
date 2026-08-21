import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { audio, menuAudio } from './audio.js';
import * as Models from './models.js';

const NUTRITION_TIPS = [
  "A balanced diet keeps your body strong and your mind sharp! 💖",
  "Eat the rainbow — colorful fruits bring a variety of vitamins! 🌈",
  "Drink water throughout the day to stay hydrated and focused. 💧",
  "Fruits are nature's candy — sweet, delicious, and full of fiber! 🍓",
  "Swap sugary snacks for fresh fruit to keep your energy steady. ⚡",
  "Vegetables add vitamins and crunch to every meal. 🥦",
  "A handful of nuts is a great pick-me-up snack. 🥜",
  "Limit processed junk food to keep your health bar glowing. 💚"
];

// Simple English spoken names for Text-to-Speech. Only the plain food name is
// spoken on collection — never Tagalog translations or vitamin details.
const SPOKEN_FOOD_NAMES = {
  mango: 'Mango',
  banana: 'Banana',
  watermelon: 'Watermelon',
  papaya: 'Papaya',
  calamansi: 'Calamansi',
  carrot: 'Carrot',
  broccoli: 'Broccoli',
  squash: 'Squash',
  eggplant: 'Eggplant',
  water: 'Water',
  burger: 'Burger',
  soda: 'Soda',
  donut: 'Donut',
  fries: 'Fries',
  hotdog: 'Hotdog',
  chips: 'Chips',
  slime: 'Slime',
  magnet: 'Magnet',
  shield: 'Shield'
};

const FRUIT_TRIVIA = {
  mango: {
    name: 'Mangga (Mango)', emoji: '🥭', color: '#f39c12',
    spelling: 'M-A-N-G-G-A',
    tagline: 'The King of Fruits',
    benefits: 'Called the King of Fruits, mangga is bursting with Vitamins A and C, which are essential for eye health, immune function, and glowing skin.',
    vitamins: 'Rich in: Vitamin A, Vitamin C, Vitamin B6, Folate, Potassium, Copper',
    funFact: 'The Philippines is one of the world\'s top mango producers! The Philippine Carabao mango won the title of the sweetest mango variety in the world in the Guinness World Records.',
    funFact2: 'Mangoes belong to the same family as cashews and poison ivy (Anacardiaceae)!',
    funFact3: 'A mango tree can live for over 300 years and still produce fruit. Some trees in the Philippines are older than 100 years!'
  },
  banana: {
    name: 'Saging (Banana)', emoji: '🍌', color: '#ffea00',
    spelling: 'S-A-G-I-N-G',
    tagline: 'The Energy Powerhouse',
    benefits: 'Rich in potassium and natural sugars for instant energy. The perfect pre-workout snack! Supports heart health and muscle function.',
    vitamins: 'Rich in: Vitamin B6, Vitamin C, Potassium, Magnesium, Manganese',
    funFact: 'Bananas are technically berries (yes, really!), and the banana plant is not a tree — it is the world\'s largest herb!',
    funFact2: 'The tryptophan in saging helps your body produce serotonin, the "feel-good" chemical that lifts your mood.',
    funFact3: 'There are many kinds of saging in the Philippines, including lakatan, latundan, and the giant saba used for banana cue!'
  },
  watermelon: {
    name: 'Pakwan (Watermelon)', emoji: '🍉', color: '#ff6595',
    spelling: 'P-A-K-W-A-N',
    tagline: 'The Summer Cooler',
    benefits: 'Pakwan is over 90% water, making it super hydrating on a hot day. It is also packed with lycopene, an antioxidant that protects your heart.',
    vitamins: 'Rich in: Vitamin C, Vitamin A, Lycopene, Potassium, Water',
    funFact: 'Watermelons are 92% water and are both a fruit and a vegetable — they belong to the gourd family like squash and cucumber!',
    funFact2: 'In the Philippines, pakwan is a summer fiesta favorite, often enjoyed cold with a pinch of salt or as refreshing fruit shake.',
    funFact3: 'The heaviest watermelon ever grown weighed over 150 kilograms — heavier than two adults combined!'
  },
  papaya: {
    name: 'Papaya', emoji: '🍈', color: '#ff8c42',
    spelling: 'P-A-P-A-Y-A',
    tagline: 'The Digestive Helper',
    benefits: 'Papaya contains papain, a natural enzyme that helps break down proteins and ease digestion. It is also rich in Vitamin C for strong immunity.',
    vitamins: 'Rich in: Vitamin C, Vitamin A, Folate (B9), Papain, Potassium',
    funFact: 'Papaya is native to the tropics and thrives all year round in the Philippines — no wonder it is a common backyard tree!',
    funFact2: 'The enzyme papain from papaya is so powerful that it is used as a meat tenderizer in cooking.',
    funFact3: 'Green (unripe) papaya is used as a vegetable in dishes like atchara and tinola in the Philippines.'
  },
  calamansi: {
    name: 'Calamansi', emoji: '🍋', color: '#8bc34a',
    spelling: 'C-A-L-A-M-A-N-S-I',
    tagline: 'The Tiny Citrus Powerhouse',
    benefits: 'Don\'t let its small size fool you — calamansi is packed with Vitamin C that boosts immunity and helps the body absorb iron!',
    vitamins: 'Rich in: Vitamin C, Calcium, Potassium, Antioxidants',
    funFact: 'Calamansi is a Philippine native and the go-to citrus for sawsawan (dipping sauce) in almost every Filipino household!',
    funFact2: 'Despite its green skin, ripe calamansi is sweet and tangy. It turns yellow-orange when fully ripe.',
    funFact3: 'Calamansi juice with honey is a famous Filipino home remedy for sore throats and colds.'
  },
  carrot: {
    name: 'Karot (Carrot)', emoji: '🥕', color: '#ff7f27',
    spelling: 'K-A-R-O-T',
    tagline: 'The Eye-Friendly Veggie',
    benefits: 'Karot is famous for beta-carotene, which the body turns into Vitamin A — essential for sharp eyesight, healthy skin, and a strong immune system.',
    vitamins: 'Rich in: Vitamin A (Beta-Carotene), Vitamin K, Fiber, Potassium',
    funFact: 'Carrots were originally purple and white! The orange carrot was bred in the Netherlands in the 17th century.',
    funFact2: 'Carrots are about 88% water, making them a crunchy, low-calorie snack that helps keep you hydrated.',
    funFact3: 'Eating too many carrots can make your skin turn slightly orange — a harmless condition called carotenemia!'
  },
  broccoli: {
    name: 'Broccoli', emoji: '🥦', color: '#2e9e44',
    spelling: 'B-R-O-C-C-O-L-I',
    tagline: 'The Green Super Veggie',
    benefits: 'Broccoli is loaded with Vitamin C, fiber, and antioxidants that support your immune system, bones, and heart health.',
    vitamins: 'Rich in: Vitamin C, Vitamin K, Folate (B9), Fiber, Calcium',
    funFact: 'Broccoli is a real "flower" — the green heads are actually clusters of unopened flower buds!',
    funFact2: 'Broccoli belongs to the same plant family as cabbage, kale, and cauliflower — the mighty cabbage family.',
    funFact3: 'Broccoli has more Vitamin C than an orange by weight, gram for gram!'
  },
  squash: {
    name: 'Kalabasa (Squash)', emoji: '🎃', color: '#e67e22',
    spelling: 'K-A-L-A-B-A-S-A',
    tagline: 'The Golden Veggie',
    benefits: 'Kalabasa is a rich source of beta-carotene (Vitamin A) and fiber, which support good eyesight, digestion, and a healthy heart.',
    vitamins: 'Rich in: Vitamin A, Vitamin C, Fiber, Potassium, Iron',
    funFact: 'Kalabasa is a staple in ginataang kalabasa — the beloved Filipino coconut-milk stew with sitaw and pork.',
    funFact2: 'Technically, squash is a fruit because it grows from a flower, but we eat it like a vegetable!',
    funFact3: 'The kalabasa plant\'s flowers are also edible — they are stuffed and fried in some provinces as pinakroos.'
  },
  eggplant: {
    name: 'Talong (Eggplant)', emoji: '🍆', color: '#6c2c91',
    spelling: 'T-A-L-O-N-G',
    tagline: 'The Purple Fiber Friend',
    benefits: 'Talong is rich in dietary fiber and antioxidants called nasunin, which protect brain cells and support heart health.',
    vitamins: 'Rich in: Fiber, Manganese, Folate (B9), Potassium, Antioxidants',
    funFact: 'Talong is the star of tortang talong — a Filipino omelette made with fire-grilled eggplant, eggs, and ground meat.',
    funFact2: 'Eggplants come in many colors — white, green, purple, and even striped — but the glossy purple kind is the most common.',
    funFact3: 'Eggplant is technically a berry! It belongs to the same family as tomatoes and potatoes.'
  },
  water: {
    name: 'Water', emoji: '💧', color: '#42a5f5',
    spelling: 'W-A-T-E-R',
    tagline: 'The Liquid of Life',
    benefits: 'Drinking water keeps your body hydrated, helps your brain focus, and keeps your skin fresh. Aim for 8 glasses a day!',
    vitamins: 'Rich in: Hydration, Essential Minerals (depends on source)',
    funFact: 'The human body is about 60% water — your brain and heart are around 73% water!',
    funFact2: 'You can survive weeks without food, but only about 3 days without water.',
    funFact3: 'In the Philippines, drinking water is also called "tubig" — always choose water over sugary drinks!'
  }
};

class Game {
  constructor() {
    this.container = document.getElementById('canvas-container');
    
    // Core Three.js components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    
    // Game state variables
    this.state = 'menu'; // 'menu', 'playing', 'gameover', 'paused'
    this.isPaused = false;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('fruit_roller_highscore') || '0', 10);
    this.health = 50; // starts at 50%
    this.speed = 6; // units per second (rolls forward)
    this.maxSpeed = 15;
    this.baseSpeed = 6;
    this.distance = 0;
    this.lastTime = 0;
    
    // Track parameters
    this.trackWidth = 4.5;
    this.segmentLength = 20;
    this.nextSegmentZ = 0; // next Z coordinate to place segment
    this.activeSegments = [];
    this.activeItems = [];
    this.zones = ['watermelon', 'mango', 'papaya'];
    this.currentZoneIndex = 0;
    this.segmentsSpawningInZone = 0;
    
    // Player controls & state
    this.ball = null;
    this.ballLight = null;
    this.playerLaneX = 0; // -1.5 (Left), 0 (Center), 1.5 (Right)
    this.playerTargetX = 0; // target X position for smoothing lane changes
    this.ballRadius = 0.38;
    this.isJumping = false;
    this.vy = 0; // Y velocity for jump physics
    this.gravity = -24;
    this.jumpPower = 6.0;
    
    // Speed modifiers and timers
    this.speedMultiplier = 1.0;
    this.speedBoostTimer = 0;
    this.speedPenaltyTimer = 0;
    
    // Super mode (rainbow) state
    this.isSuperMode = false;
    this.superModeTimer = 0;
    this.superModeDuration = 6.0; // 6 seconds
    
    // Particle feedback colours - vivid, high-contrast
    this.fruitColors = {
      mango: 0xf39c12,
      banana: 0xffea00,
      watermelon: 0xff6595,
      papaya: 0xff8c42,
      calamansi: 0x8bc34a,
      carrot: 0xff7f27,
      broccoli: 0x2e9e44,
      squash: 0xe67e22,
      eggplant: 0x6c2c91,
      water: 0x42a5f5
    };
    this.junkColor = 0xce3a8a;
    this.lastEatenItem = 'none';

    // Touch/Mouse steering mechanics
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.isSwiping = false;
    this.touchActive = false; // finger/mouse is down while playing
    // Continuous active-steering boolean: flips true on touchstart/mousedown
    // and false ONLY on touchend/touchcancel/mouseup — never a timer, never
    // tied to a hold-delay or distance threshold.
    this.isSteering = false;
    this.activeTouchId = null;     // identifier of the touch currently steering
    this.pendingSteerTouchId = null; // a touch that began on the START button
    // Input cooldown (ms): a safety window right after the race starts so
    // accidental taps during the start transition are ignored by UI buttons.
    this.inputCooldownUntil = 0;

    // Held-key tracking for continuous movement
    this.keys = { left: false, right: false };
    this.horizontalSpeed = 5.0;

    // ---- DYNAMIC BALL SCALING ----
    // Target scale values (lerp'd in tick)
    this.ballTargetScale = new THREE.Vector3(1, 1, 1);
    // Scale presets
    this.scaleDefault = new THREE.Vector3(1, 1, 1);
    this.scaleSlim = new THREE.Vector3(0.75, 1.15, 0.75);
    this.scaleBlob = new THREE.Vector3(1.6, 0.75, 1.6);
    this.scaleSuper = new THREE.Vector3(0.85, 1.05, 0.85);

    // ---- ACHIEVEMENT & SKIN SYSTEM ----
    this.fruitsCollectedInRun = 0;
    this.fruitsCollectedTotal = parseInt(localStorage.getItem('fr_total_fruits') || '0', 10);
    this.junkHitInRun = 0;
    this.junkHitTotal = parseInt(localStorage.getItem('fr_total_junk') || '0', 10);
    this.superModeTriggeredInRun = 0;
    this.superModeTriggeredTotal = parseInt(localStorage.getItem('fr_total_supers') || '0', 10);

    // ---- Purity Ratio Index (New Grading System) ----
    this.runFruits = 0;
    this.runVeggies = 0;
    this.runWater = 0;
    this.runJunk = 0;
    this.healthyCombo = 0;
    this.maxHealthyCombo = 0;
    this.superModeCount = 0;

     // Unlocked skin IDs (always includes 'default')
    this.unlockedSkins = JSON.parse(localStorage.getItem('fr_unlocked_skins') || '["default"]');
    this.equippedSkinId = localStorage.getItem('fr_equipped_skin') || 'default';
    this.skinBaseMat = null; // the base skin material (before game effects modify it)

    // ---- HIGH SCORE / LEVEL PROGRESSION TRACKING (for skin unlocks) ----
    this.bestScore = this.highScore;
    this.highestLevel = parseInt(localStorage.getItem('fr_highest_level') || '0', 10);
    this.currentLevel = 0;

    // ---- FINISH LINE & BUMPS SYSTEM ----
    this.finishLineZ = 1500;
    this.hasSpawnedFinishLine = false;
    this.finishLineMesh = null;
    this.ballBumps = [];
    this.ballGerms = [];

    // Character color & settings
    this.selectedCharColor = localStorage.getItem('fr_char_color') || null;
    this.gameSpeedMode = localStorage.getItem('fr_game_speed') || 'normal';

    // ---- FRUIT ENCYCLOPEDIA / TRIVIA BOOK ----
    this.unlockedTrivia = JSON.parse(localStorage.getItem('fr_unlocked_trivia') || '[]');

    // ---- LEVEL PROGRESSION TOAST ----
    this.lastShownLevel = 0;

    // ---- FRUIT FRENZY (Pre-Race Power Booster) ----
    this.fruitFrenzyTimer = 0;
    this.fruitFrenzyDuration = 5;

    // ---- DAILY GOAL TARGETS ----
    this.goalTargets = { fruits: 3, veggies: 3, water: 5 };
    this.veggieItems = new Set(['carrot', 'broccoli', 'squash', 'eggplant']);

    // ---- PAUSE MENU LEVEL MISSIONS (Fruit Ninja-style) ----
    this.missionTargets = { produce: 5, water: 3 };

    // ---- SCREEN SHAKE & DANGER FLASH ----
    this.shakeIntensity = 0;
    this.dangerFlashTimer = 0;

    // Cache DOM Elements
    this.dom = {
      startScreen: document.getElementById('start-screen'),
      gameOverScreen: document.getElementById('game-over-screen'),
      gameoverTipText: document.getElementById('gameover-tip-text'),
      scoreVal: document.getElementById('score-val'),
      healthFill: document.getElementById('health-fill'),
      healthStatus: document.getElementById('health-status-text'),
      buffDisplay: document.getElementById('buff-display'),
      buffDot: document.querySelector('.buff-dot'),
      buffText: document.getElementById('buff-text'),
      startBtn: document.getElementById('start-btn'),
      restartBtn: document.getElementById('restart-btn'),
      muteBtn: document.getElementById('mute-btn'),
      musicBtn: document.getElementById('music-btn'),
      musicTrackName: document.getElementById('music-track-name'),
      warningOverlay: document.getElementById('warning-overlay'),
      menuHighScore: document.getElementById('menu-highscore'),
      endScore: document.getElementById('end-score'),
      endHighScore: document.getElementById('end-highscore'),
      verdictText: document.getElementById('verdict-text'),
      achievementToast: document.getElementById('achievement-toast'),
      toastDesc: document.getElementById('toast-desc'),
      progressPercent: document.getElementById('progress-percent'),
      progressFill: document.getElementById('progress-fill'),
      victoryScreen: document.getElementById('victory-screen'),
      vicScore: document.getElementById('vic-score'),
      vicHighScore: document.getElementById('vic-highscore'),
      vicVerdict: document.getElementById('vic-verdict-text'),
      vicRestartBtn: document.getElementById('vic-restart-btn'),
      flashWordOverlay: document.getElementById('flash-word-overlay'),
      pauseScreen: document.getElementById('pause-screen'),
      resumeBtn: document.getElementById('resume-btn'),
      pauseCardsContainer: document.getElementById('pause-cards-container'),
      
      restartBtnPause: document.getElementById('restart-btn-pause'),
      quitBtn: document.getElementById('quit-btn'),
      charBtn: document.getElementById('char-btn'),
      settingsBtn: document.getElementById('settings-btn'),
      charSelectScreen: document.getElementById('char-select-screen'),
      settingsScreen: document.getElementById('settings-screen'),
      charBackBtn: document.getElementById('char-back-btn'),
      charSaveBtn: document.getElementById('char-save-btn'),
      settingsBackBtn: document.getElementById('settings-back-btn'),
      settingsHowToPlayBtn: document.getElementById('settings-howtoplay-btn'),
      previewBall: document.getElementById('preview-ball'),
      colorGrid: document.getElementById('color-grid'),
      musicToggle: document.getElementById('music-toggle'),
      sfxToggle: document.getElementById('sfx-toggle'),
      musicStatus: document.getElementById('music-status'),
      sfxStatus: document.getElementById('sfx-status'),
      speedOpts: document.querySelectorAll('.speed-opt'),
      triviaBtn: document.getElementById('trivia-btn'),
      triviaScreen: document.getElementById('trivia-screen'),
      triviaGrid: document.getElementById('trivia-grid'),
      triviaBackBtn: document.getElementById('trivia-back-btn'),
      frenzyDisplay: document.getElementById('frenzy-display'),
      frenzyTimer: document.getElementById('frenzy-timer'),
      frenzyDisplayMobile: document.getElementById('frenzy-display-mobile'),
      frenzyTimerMobile: document.getElementById('frenzy-timer-mobile'),
      buffDisplayMobile: document.getElementById('buff-display-mobile'),
      buffTextMobile: document.getElementById('buff-text-mobile'),
      mobileScoreVal: document.getElementById('mobile-score-val'),
      mobileLevelVal: document.getElementById('mobile-level-val'),
      levelVal: document.getElementById('level-val'),
      goalFruits: document.getElementById('goal-fruits'),
      goalVeggies: document.getElementById('goal-veggies'),
      goalWater: document.getElementById('goal-water'),
      goalFruitsFill: document.getElementById('goal-fruits-fill'),
      goalVeggiesFill: document.getElementById('goal-veggies-fill'),
      goalWaterFill: document.getElementById('goal-water-fill'),
      mobileGoalFill: document.getElementById('mobile-goal-fill'),
      mobileGoalCount: document.getElementById('mobile-goal-count'),
      volumeFill: document.getElementById('volume-fill'),
      musicPlayBtn: document.getElementById('music-play-btn'),
      pauseBtn: document.getElementById('pause-btn'),
      mobilePauseBtn: document.getElementById('mobile-pause-btn'),
      dockTrivia: document.getElementById('dock-trivia'),
      dockFruits: document.getElementById('dock-fruits'),
      dockVeggies: document.getElementById('dock-veggies'),
      dockWater: document.getElementById('dock-water'),
      dockStats: document.getElementById('dock-stats'),
      dockMusic: document.getElementById('dock-music'),
      dockMute: document.getElementById('dock-mute'),
      magTimerMobile: document.getElementById('magnet-timer-mobile'),
      dangerOverlay: document.getElementById('danger-overlay'),
      triviaToast: document.getElementById('trivia-toast'),
      triviaToastTitle: document.getElementById('trivia-toast-title'),
      triviaToastDesc: document.getElementById('trivia-toast-desc'),
      gradingBtn: document.getElementById('grading-btn'),
      gradingScreen: document.getElementById('grading-screen'),
      gradingBackBtn: document.getElementById('grading-back-btn'),
      howToPlayModal: document.getElementById('howtoplay-modal'),
      modalCloseBtn: document.getElementById('modal-close-btn'),
      modalBackdrop: document.querySelector('#howtoplay-modal .modal-backdrop')
    };
  }

  init() {
    // Initial load: only the Main Menu is visible. The gameplay HUD stays
    // hidden (via body.in-menu) and the 3D backdrop renders blurred behind
    // the menu card until "START GAME" is clicked.
    document.body.classList.add('in-menu');
    this.setupThree();
    this.setupEvents();
this.updateHighScoreDisplay();
       // Initialize and immediately attempt automatic menu audio playback
    menuAudio.init();
    menuAudio.playMenuBGM();

    // Universal audio auto-unlocker: resumes AudioContext & ensures BGM starts
    const unlockAllAudio = () => {
      if (menuAudio.ctx && menuAudio.ctx.state === 'suspended') {
        menuAudio.ctx.resume().catch(() => {});
      }
      if (audio.ctx && audio.ctx.state === 'suspended') {
        audio.ctx.resume().catch(() => {});
      }
      menuAudio.playMenuBGM();
      
      // Unlock Speech Synthesis (TTS)
      if ('speechSynthesis' in window) {
        try {
          const silentUtterance = new SpeechSynthesisUtterance('');
          window.speechSynthesis.speak(silentUtterance);
          window.speechSynthesis.getVoices();
        } catch (e) {}
      }
    };

    ['touchstart', 'touchend', 'pointerdown', 'pointerup', 'click', 'mousedown', 'keydown', 'scroll'].forEach(evt => {
      window.addEventListener(evt, unlockAllAudio, { capture: true, passive: true });
      document.addEventListener(evt, unlockAllAudio, { capture: true, passive: true });
    });
    
    // Check persistent unlocks against stored stats (high score / level)
    // before rendering the skin grid so already-earned skins display unlocked.
    this.checkAchievements();
    this.initSkinSelector();
    this.initCharSelect();
    this.initSettings();
    
    // Initial scene track layout (spawn starting sequence)
    this.resetGameValues();
    this.spawnInitialTrack();
    
    // Start drawing frame updates
    requestAnimationFrame((t) => this.tick(t));
  }

  setupThree() {
    // 1. Scene & Volumetric Fog - bright cheerful sky for educational feel
    this.scene = new THREE.Scene();
    // Transparent background so the repeating CSS fruit background is visible
    this.scene.background = null;
    this.scene.fog = new THREE.FogExp2(0xc1ff72, 0.005);

    // 2. Camera Setup (Isometric/Third-person tilt)
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 3.5, -7.5);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.container.appendChild(this.renderer.domElement);
    // Tag the WebGL canvas so CSS state rules (#game-canvas, .threejs-canvas)
    // can hide it in the menu and show it during gameplay.
    this.renderer.domElement.id = 'game-canvas';
    this.renderer.domElement.classList.add('threejs-canvas', 'game-canvas');

    // 4. Lighting System - warm, bright, welcoming
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
    this.scene.add(ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xfff4e6, 1.6);
    this.dirLight.position.set(8, 15, -8);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 40;
    const d = 6;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    // Warm fill light from below to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0xb3e5fc, 0.5);
    fillLight.position.set(-5, -3, 5);
    this.scene.add(fillLight);

    // 5. Particles Engine
    this.particles = new Models.ParticleSystem(this.scene);

    // 6. Player Ball
    this.createPlayerBall();
  }

  createPlayerBall() {
    const ballGeo = new THREE.SphereGeometry(this.ballRadius, 16, 16);
    // Create material from equipped skin
    this.applySkin(this.equippedSkinId);

    this.ball = new THREE.Mesh(ballGeo, this.ballMat);
    this.ball.position.set(0, this.ballRadius, 0);
    this.ball.castShadow = true;
    this.ball.receiveShadow = true;
    this.scene.add(this.ball);

    // Dynamic point light attached to the ball to glow up the track beneath it
    this.ballLight = new THREE.PointLight(0xffffff, 4.5, 12);
    this.ballLight.position.set(0, 0.5, 0);
    this.ball.add(this.ballLight);
  }

  // ---- SKIN SYSTEM ----
  applySkin(skinId) {
    const skinDef = Models.SKINS.find(s => s.id === skinId);
    if (!skinDef) return;

    this.skinBaseMat = skinDef.createMaterial();
    this.ballMat = this.skinBaseMat;
    this.equippedSkinId = skinId;

    // Apply to existing ball mesh if it exists
    if (this.ball) {
      this.ball.material = this.ballMat;
    }

    // Update point light color to match skin
    if (this.ballLight) {
      const c = new THREE.Color(skinDef.color);
      this.ballLight.color.copy(c);
    }

    // Save preference
    localStorage.setItem('fr_equipped_skin', skinId);
  }

  addBallBump() {
    if (!this.ball) return;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = this.ballRadius;

    const bumpGeo = new THREE.SphereGeometry(0.06 + Math.random() * 0.04, 6, 6);
    // distort geometry
    const pos = bumpGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      pos.setX(i, x * (1 + (Math.random() - 0.5) * 0.3));
      pos.setY(i, y * (1 + (Math.random() - 0.5) * 0.3));
      pos.setZ(i, z * (1 + (Math.random() - 0.5) * 0.3));
    }
    bumpGeo.computeVertexNormals();

    const bumpMat = new THREE.MeshStandardMaterial({
      color: 0xce3a8a,
      roughness: 0.9,
      flatShading: true
    });
    const bump = new THREE.Mesh(bumpGeo, bumpMat);
    bump.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    this.ball.add(bump);
    this.ballBumps.push(bump);
  }

  removeBallBump() {
    if (this.ballBumps && this.ballBumps.length > 0) {
      const bump = this.ballBumps.pop();
      this.ball.remove(bump);
    }
  }

  initSkinSelector() {
    const skinGrid = document.getElementById('skin-grid');
    if (!skinGrid) return;

    this.refreshSkinGrid();

    // Add click listeners - only in menu state
    this.bindPress(skinGrid, (e) => {
      const card = e.target.closest('.skin-card');
      if (!card) return;
      const skinId = card.dataset.skinId;
      if (!skinId) return;

      // Check if unlocked
      if (!this.unlockedSkins.includes(skinId)) return;

      this.applySkin(skinId);
      this.refreshSkinGrid();
    }, ['menu']);
  }

  refreshSkinGrid() {
    const skinGrid = document.getElementById('skin-grid');
    if (!skinGrid) return;

    skinGrid.innerHTML = '';
    Models.SKINS.forEach(skin => {
      const isUnlocked = this.unlockedSkins.includes(skin.id);
      const isEquipped = this.equippedSkinId === skin.id;

      const card = document.createElement('div');
      card.className = `skin-card${isEquipped ? ' active' : ''}${!isUnlocked ? ' locked' : ''}`;
      card.dataset.skinId = skin.id;

      let reqText = 'Default';
      if (!isUnlocked) {
        reqText = skin.requirementLabel
          .replace(' to Unlock', '')
          .replace('Score 10,000 or Level 10', '10k / Lv10')
          .replace('Score 4,000', '4k pts')
          .replace('Score 6,000', '6k pts')
          .replace('Score 8,000', '8k pts');
      } else {
        reqText = isEquipped ? '✓ Equipped' : 'Tap to Equip';
      }

      card.innerHTML = `
        <div class="skin-preview-wrap">
          <div class="skin-preview" style="background: ${skin.color};">
            ${!isUnlocked ? '<span class="lock-icon" aria-hidden="true">🔒</span>' : ''}
          </div>
          ${isEquipped ? '<span class="equipped-badge">ON</span>' : ''}
        </div>
        <span class="skin-name">${skin.name}</span>
        <span class="skin-req ${isEquipped ? 'equipped' : (!isUnlocked ? 'locked' : 'unlocked')}">
          ${reqText}
        </span>
      `;

      skinGrid.appendChild(card);
    });
  }

  // Evaluate a single requirement object against the player's current stats.
  // Supports the legacy types (fruits / score / super / junk) plus the new
  // high-score / level progression types used by the roller unlock system.
  isRequirementMet(req) {
    if (!req) return true;
    switch (req.type) {
      case 'fruits':
        return this.fruitsCollectedTotal >= req.value;
      case 'score':
        return this.bestScore >= req.value;
      case 'highscore':
        return this.highScore >= req.value;
      case 'super':
        return this.superModeTriggeredTotal >= req.value;
      case 'junk':
        return this.junkHitTotal >= req.value;
      case 'level':
        return this.highestLevel >= req.value;
      default:
        return false;
    }
  }

  checkAchievements() {
    let newlyUnlocked = [];

    Models.SKINS.forEach(skin => {
      if (this.unlockedSkins.includes(skin.id)) return; // already unlocked
      if (!skin.requirement) return; // default, always unlocked

      let met = this.isRequirementMet(skin.requirement);
      // OR-condition: e.g. Toxic Ooze requires High Score >= 10,000 OR Level >= 10
      if (!met && skin.requirement.or) {
        met = this.isRequirementMet(skin.requirement.or);
      }

      if (met) {
        this.unlockedSkins.push(skin.id);
        newlyUnlocked.push(skin);
      }
    });

    if (newlyUnlocked.length > 0) {
      // Save unlocks
      localStorage.setItem('fr_unlocked_skins', JSON.stringify(this.unlockedSkins));
      // Show achievement toast for first new unlock
      this.showAchievementToast(newlyUnlocked[0]);
    }
  }

  showAchievementToast(skin) {
    if (!this.dom.achievementToast) return;
    const desc = this.dom.toastDesc;
    if (desc) {
      desc.textContent = `"${skin.name}" skin unlocked!`;
    }
    this.dom.achievementToast.classList.add('show');

    if (this.achievementToastTimeout) clearTimeout(this.achievementToastTimeout);
    this.achievementToastTimeout = setTimeout(() => {
      this.dom.achievementToast.classList.remove('show');
    }, 3500);
  }

  // ---- EVENTS ----

  // Bind a press handler for both mouse and touch input. Uses 'click',
  // 'pointerdown', and 'touchstart' so taps and clicks never double-fire
  // and never get swallowed by the game loop.
  //
  // Two safety guards live here:
  // 1. INPUT COOLDOWN — a press fired during the 500ms start transition is
  //    ignored, so stray taps right after "START GAME" never hit UI buttons.
  // 2. SYNTHESIZED-CLICK SUPPRESSION — after a touch/pen press the browser
  //    later dispatches a fake 'click'. If the player HOLDS the tap past the
  //    debounce window, that click would re-fire the handler (and restart the
  //    run / reopen the menu). Any press that originated from touch/pen marks
  //    the element so its trailing synthesized click is dropped entirely.
  bindPress(el, handler, allowedStates = null) {
    if (!el) return;
    let lastFired = 0;
    let firedByTouch = false;

    const fire = (e) => {
      const now = performance.now();
      if (now < this.inputCooldownUntil) return; // start-transition cooldown
      if (now - lastFired < 400) return; // debounce click/tap duplicates
      // State guard: if allowedStates is provided, only fire when current state matches
      if (allowedStates !== null && !allowedStates.includes(this.state)) return;
      lastFired = now;
      if (e.cancelable) e.preventDefault();
      handler(e);
    };
    const fireFromTouch = (e) => {
      firedByTouch = true;
      fire(e);
    };

    el.addEventListener('click', (e) => {
      // Drop the synthesized click that follows a touch/pen press.
      if (firedByTouch) return;
      fire(e);
    });
    el.addEventListener('pointerdown', (e) => {
      // Only touch/pen presses leave a suppressed click behind; a real mouse
      // press resets the marker so genuine clicks/keyboard presses stay live.
      firedByTouch = !!(e.pointerType && e.pointerType !== 'mouse');
      fire(e);
    });
    el.addEventListener('touchstart', fireFromTouch, { passive: false });
    // Keyboard activation (Enter/Space) dispatches only a 'click' — never a
    // pointer event — so clear the touch marker and let it fire.
    el.addEventListener('keydown', () => {
      firedByTouch = false;
    });
  }

  setupEvents() {
    // Keyboard inputs
    window.addEventListener('keydown', (e) => {
      // Escape toggles pause when playing or paused, closes modal when in menu
      if (e.key === 'Escape') {
        if (this.state === 'playing' || this.state === 'paused') {
          e.preventDefault();
          this.togglePause();
          return;
        }
        if (this.state === 'menu' && this.dom.howToPlayModal && !this.dom.howToPlayModal.hidden) {
          e.preventDefault();
          this.closeHowToPlayModal();
          return;
        }
      }

      if (this.state !== 'playing') return;

      // Track held keys for continuous left/right movement
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = true;
      } else if (e.key === ' ' || e.key === 'ArrowUp') {
        this.jump();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.state !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.keys.left = false;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.keys.right = false;
      }
    });

    // Touch & mouse steering.
    // Option A: the touch/mouse X maps DIRECTLY to a track X position.
    // Option B: the ball lerps toward that target each frame (see update()).
    // Releasing the finger NEVER snaps the ball back to center — it holds
    // the lane it was steered to until steered elsewhere.
    //
    // ISOLATED INPUT LAYERS:
    // - Steering is bound at WINDOW level so the very first touch of a run
    //   (even one that starts on the START button and is held) hands off to
    //   steering instantly. `isSteering` is a continuous Boolean: true on
    //   touchstart/mousedown, false only on touchend/touchcancel/mouseup.
    // - Taps on interactive UI widgets (buttons, dock, skin cards, etc.)
    //   are skipped by isUiTarget() so UI never steers the ball.
    // - NO menu/reset logic is bound to touchend or screen release.
    //   touchend ONLY clears the steering flag — the ball keeps its lane.
    const isUiTarget = (el) => {
      if (!el || !el.closest) return false;
      return !!el.closest('button, input, label, .dock-btn, .round-btn, .color-swatch, .skin-card, .speed-opt, .toggle-switch, .volume-bar, .audio-icon-btn');
    };
    const beginSteer = (clientX) => {
      this.isSwiping = true;
      this.touchActive = true;
      this.isSteering = true;
      this.playerTargetX = this.screenXToTrackX(clientX);
    };

    window.addEventListener('mousedown', (e) => {
      if (this.state !== 'playing') return;
      if (isUiTarget(e.target)) return;
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;
      this.touchStartTime = performance.now();
      beginSteer(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isSteering || this.state !== 'playing') return;
      this.playerTargetX = this.screenXToTrackX(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      this.isSwiping = false;
      this.touchActive = false;
      this.isSteering = false;
    });

    window.addEventListener('touchstart', (e) => {
      if (this.state !== 'playing') return;
      const touch = e.touches[0];
      if (!touch) return;
      // A touch that lands on a UI widget during the start transition (e.g.
      // the finger that just tapped START and is still down) is remembered so
      // its first drag takes over steering immediately — no hold-delay.
      if (isUiTarget(e.target)) {
        if (performance.now() < this.inputCooldownUntil) {
          this.pendingSteerTouchId = touch.identifier;
        }
        return;
      }
      e.preventDefault(); // block swipe-back nav, pull-to-refresh, pinch-zoom
      this.pendingSteerTouchId = null;
      this.activeTouchId = touch.identifier;
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.touchStartTime = performance.now();
      beginSteer(touch.clientX);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (this.state !== 'playing') return;
      const touch = e.touches[0];
      if (!touch) return;
      if (!this.isSteering) {
        // Hand off the finger that began on the START button: the moment it
        // drags, steering engages instantly (no distance threshold, no wait).
        if (this.pendingSteerTouchId !== null && touch.identifier === this.pendingSteerTouchId) {
          this.pendingSteerTouchId = null;
          this.activeTouchId = touch.identifier;
          this.touchStartX = touch.clientX;
          this.touchStartY = touch.clientY;
          this.touchStartTime = performance.now();
          beginSteer(touch.clientX);
        }
        return;
      }
      if (touch.identifier !== this.activeTouchId) return;
      e.preventDefault();
      this.playerTargetX = this.screenXToTrackX(touch.clientX);
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      // A quick, still tap = jump (the old on-screen jump button is gone).
      // Steering position is preserved; the ball does NOT return to center.
      // This handler performs NO game/menu/UI actions — it only clears the
      // continuous steering flag, so releasing a finger can never reset the
      // run or reopen the Main Menu.
      const touch = e.changedTouches && e.changedTouches[0];
      const wasTap = this.isSteering &&
        touch &&
        (performance.now() - this.touchStartTime) < 250 &&
        Math.abs(touch.clientX - this.touchStartX) < 12 &&
        Math.abs(touch.clientY - this.touchStartY) < 12;
      this.pendingSteerTouchId = null;
      this.activeTouchId = null;
      this.isSwiping = false;
      this.touchActive = false;
      this.isSteering = false;
      if (wasTap && this.state === 'playing') this.jump();
    });

    window.addEventListener('touchcancel', () => {
      this.pendingSteerTouchId = null;
      this.activeTouchId = null;
      this.isSwiping = false;
      this.touchActive = false;
      this.isSteering = false;
    });

    // Button interactions
    this.bindPress(this.dom.startBtn, () => this.startGame(), ['menu']);
    this.bindPress(this.dom.restartBtn, () => this.startGame(), ['gameover']);
    this.bindPress(this.dom.muteBtn, () => this.toggleMute()); // global

    // Menu navigation - only in menu state
    this.bindPress(this.dom.charBtn, () => this.showCharSelect(), ['menu']);
    this.bindPress(this.dom.settingsBtn, () => this.showSettings(), ['menu']);
    this.bindPress(this.dom.charBackBtn, () => this.goToMenu(), ['menu']);
    this.bindPress(this.dom.charSaveBtn, () => this.saveCharSelection(), ['menu']);
    this.bindPress(this.dom.settingsBackBtn, () => this.goToMenu(), ['menu']);
    this.bindPress(this.dom.settingsHowToPlayBtn, () => {
      if (this.state !== 'menu') return;
      this.openHowToPlayModal();
    }, ['menu']);

    // Leaderboard - only in menu state
    const ldBtn = document.getElementById('leaderboard-btn');
    this.bindPress(ldBtn, () => this.showLeaderboard(), ['menu']);
    const ldBackBtn = document.getElementById('leaderboard-back-btn');
    this.bindPress(ldBackBtn, () => {
      this.unlockMenuScreens();
      document.getElementById('leaderboard-screen').classList.remove('active');
      this.dom.startScreen.classList.add('active');
      document.body.classList.add('in-menu');
    }, ['menu']);

    // Trivia Book - only in menu state
    this.bindPress(this.dom.triviaBtn, () => this.showTriviaBook(), ['menu']);
    this.bindPress(this.dom.triviaBackBtn, () => this.hideTriviaBook(), ['menu']);

    // Grading System Screen - only in menu state
    this.bindPress(this.dom.gradingBtn, () => {
      this.dom.startScreen.classList.remove('active');
      this.dom.gradingScreen.classList.add('active');
    }, ['menu']);
    this.bindPress(this.dom.gradingBackBtn, () => {
      this.unlockMenuScreens();
      this.dom.gradingScreen.classList.remove('active');
      this.dom.startScreen.classList.add('active');
      document.body.classList.add('in-menu');
    }, ['menu']);

    this.bindPress(this.dom.modalCloseBtn, () => this.closeHowToPlayModal(), ['menu']);
    this.bindPress(this.dom.modalBackdrop, () => this.closeHowToPlayModal(), ['menu']);

    // Victory restart - only in victory state
    this.bindPress(this.dom.vicRestartBtn, () => this.startGame(), ['victory']);

    // Music track cycling button - only in menu state
    this.bindPress(this.dom.musicBtn, () => this.cycleTrack(), ['menu']);

    // Music on/off + volume bar (inside the audio widget)
    this.bindPress(this.dom.musicPlayBtn, () => this.toggleMusic());
    const volBar = document.getElementById('volume-bar');
    if (volBar) {
      const setVolFromEvent = (e) => {
        const rect = volBar.getBoundingClientRect();
        const x = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - rect.left;
        const v = Math.max(0, Math.min(1, x / rect.width));
        audio.setVolume(v);
        menuAudio.setVolume(v); // Sync procedural menu audio volume
        if (this.dom.volumeFill) this.dom.volumeFill.style.width = `${v * 100}%`;
      };
      volBar.addEventListener('click', setVolFromEvent);
      volBar.addEventListener('touchstart', setVolFromEvent, { passive: true });
      if (this.dom.volumeFill) {
        this.dom.volumeFill.style.width = `${audio.volume * 100}%`;
      }
    }

    // Pause controls
    //
    // BUG FIX (mobile): Previously a single shared `onPauseInput` was bound to
    // touchstart, click, pointerdown AND keydown. On mobile a single tap
    // fires BOTH pointerdown and touchstart, causing togglePause() to fire
    // twice — pause then immediately resume — making the button appear
    // non-responsive.
    //
    // Fix: a dedicated touchstart listener handles touch exclusively;
    // pointerdown skips touch pointer-types; click suppresses the
    // synthesized tap-click to avoid a second toggle.
    if (this.dom.pauseBtn) {
      const pauseBtn = this.dom.pauseBtn;
      let touchHandled = false;

      // --- Dedicated touchstart listener (mobile) ---
      pauseBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        touchHandled = true;
        if (this.state === 'playing' || this.state === 'paused') {
          this.togglePause();
        }
      }, { passive: false });

      // --- Click handler (mouse / desktop) ---
      // Suppresses the synthesized click that follows a touch tap so the
      // game never toggles twice on a single tap.
      pauseBtn.addEventListener('click', (e) => {
        if (touchHandled) {
          touchHandled = false;
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        if (this.state === 'playing' || this.state === 'paused') {
          this.togglePause();
        }
      }, { passive: false });

      // --- Pointerdown (mouse/pen only — touch is handled above) ---
      // Sets touchHandled so the subsequent click (which always fires after
      // pointerup) is suppressed — preventing a double-toggle on desktop too.
      pauseBtn.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') {
          e.stopPropagation();
          return;
        }
        touchHandled = true;
        e.stopPropagation();
        e.preventDefault();
        if (this.state === 'playing' || this.state === 'paused') {
          this.togglePause();
        }
      }, { passive: false });

      // --- Keyboard activation ---
      pauseBtn.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        if (this.state === 'playing' || this.state === 'paused') {
          this.togglePause();
        }
      });
    }
    this.bindPress(this.dom.mobilePauseBtn, () => this.togglePause(), ['playing', 'paused']);
    this.bindPress(this.dom.resumeBtn, () => this.togglePause(), ['paused']);
    this.bindPress(this.dom.quitBtn, () => this.quitToMenu(), ['paused']);
    this.bindPress(this.dom.restartBtnPause, () => this.startGame(), ['paused']);

    // Mobile navigation dock - only in menu state (hidden during gameplay via CSS)
    this.bindPress(this.dom.dockTrivia, () => this.showTriviaBook(), ['menu']);
    this.bindPress(this.dom.dockStats, () => this.showLeaderboard(), ['menu']);
    this.bindPress(this.dom.dockMusic, () => this.cycleTrack(), ['menu']);
    this.bindPress(this.dom.dockMute, () => this.toggleMute()); // global
    this.bindPress(this.dom.dockFruits, () => this.showFlashWord('COLLECT FRUITS!', 0xff6b81), ['menu']);
    this.bindPress(this.dom.dockVeggies, () => this.showFlashWord('EAT VEGGIES!', 0x48bb78), ['menu']);
    this.bindPress(this.dom.dockWater, () => this.showFlashWord('DRINK WATER!', 0x38bdf8), ['menu']);

    // Show mobile controls on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('touch-device');
    }

    // Window resize + orientation change for responsive canvas
    // Uses visualViewport API where available (handles iOS Safari dynamic toolbar)
    const handleResize = () => {
      const w = window.visualViewport ? window.visualViewport.width  : window.innerWidth;
      const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      if (this.camera) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
      }
      if (this.renderer) {
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    };
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 300);
    });

    // Extra safeguard: prevent browser gestures (pull-to-refresh, swipe-back)
    // on the canvas container during gameplay. This catches any touches that
    // might not be handled by the window-level steering listeners.
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
      canvasContainer.addEventListener('touchstart', (e) => {
        if (this.state === 'playing' || this.state === 'paused') {
          e.preventDefault();
        }
      }, { passive: false });
      canvasContainer.addEventListener('touchmove', (e) => {
        if (this.state === 'playing' || this.state === 'paused') {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }

  moveLane(direction) {
    // Visually Left is +X, Visually Right is -X
    let currentLane = 0;
    if (this.playerTargetX > 0.5) currentLane = -1; // +X is left visually
    else if (this.playerTargetX < -0.5) currentLane = 1; // -X is right visually

    let targetLane = currentLane + direction;
    // clamp within track borders
    targetLane = Math.max(-1, Math.min(1, targetLane));
    
    this.playerTargetX = targetLane * -1.5;
  }

  // Map a screen X coordinate to a track X position (direct touch steering).
  // Screen-left edge maps to +X (visually left), screen-right edge to -X
  // (visually right), clamped to the playable track borders.
  screenXToTrackX(clientX) {
    const normalized = Math.max(0, Math.min(1, clientX / window.innerWidth));
    const halfTrack = this.trackWidth * 0.5 - this.ballRadius;
    const trackX = this.trackWidth * 0.5 - normalized * this.trackWidth;
    return Math.max(-halfTrack, Math.min(halfTrack, trackX));
  }

  jump() {
    if (this.isJumping) return;
    if (!this.ball) return;
    if (this.ball.position.y > this.ballRadius + 0.05) return;
    this.isJumping = true;
    this.vy = this.jumpPower;
  }

  toggleMute() {
    const isMuted = audio.toggleMute();
    menuAudio.toggleMute(); // Sync procedural menu audio mute state
    this.dom.muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
    if (this.dom.dockMute) this.dom.dockMute.textContent = isMuted ? '🔇' : '🔊';
  }

  toggleMusic() {
    const enabled = audio.toggleMusic();
    if (this.dom.musicPlayBtn) this.dom.musicPlayBtn.textContent = enabled ? '⏸' : '▶';
    return enabled;
  }

  cycleTrack() {
    audio.init();
    const trackName = audio.nextTrack();
    if (this.dom.musicTrackName) {
      this.dom.musicTrackName.textContent = trackName;
    }
  }

  updateHighScoreDisplay() {
    this.dom.menuHighScore.textContent = this.highScore;
    this.dom.endHighScore.textContent = this.highScore;
  }

  resetGameValues() {
    this.score = 0;
    this.health = 50;
    this.distance = 0;
    this.speed = this.baseSpeed;
    this.speedMultiplier = 1.0;
    this.runCalories = 0;
    this.runVitamins = 0;
    this.hasShield = false;
    this.magnetTimer = 0;
    const magIcon = document.getElementById('magnet-icon');
    const shieldIcon = document.getElementById('shield-icon');
    const magIconM = document.getElementById('magnet-icon-mobile');
    const shieldIconM = document.getElementById('shield-icon-mobile');
    if (magIcon) magIcon.style.display = 'none';
    if (shieldIcon) shieldIcon.style.display = 'none';
    if (magIconM) magIconM.style.display = 'none';
    if (shieldIconM) shieldIconM.style.display = 'none';
    
    this.isJumping = false;
    this.vy = 0;
    this.playerLaneX = 0;
    this.playerTargetX = 0;
    this.keys = { left: false, right: false };
    this.isSwiping = false;
    this.touchActive = false;
    this.isSteering = false;
    this.activeTouchId = null;
    this.pendingSteerTouchId = null;
    
    this.isSuperMode = false;
    this.superModeTimer = 0;
    this.speedBoostTimer = 0;
    this.speedPenaltyTimer = 0;
    
    this.nextSegmentZ = 0;
    this.currentZoneIndex = 0;
    this.segmentsSpawningInZone = 0;
    
    this.lastEatenItem = 'none';

    // Reset run-specific achievement counters
    this.fruitsCollectedInRun = 0;
    this.veggiesCollectedInRun = 0;
    this.waterCollectedInRun = 0;
    this.junkHitInRun = 0;
    this.superModeTriggeredInRun = 0;
    this.lastShownLevel = 0;

    // Reset Purity Ratio Index metrics
    this.runFruits = 0;
    this.runVeggies = 0;
    this.runWater = 0;
    this.runJunk = 0;
    this.healthyCombo = 0;
    this.maxHealthyCombo = 0;
    this.superModeCount = 0;

    // Reset fruit frenzy
    this.fruitFrenzyTimer = 0;
    if (this.dom.frenzyDisplay) this.dom.frenzyDisplay.classList.remove('visible');
    if (this.dom.frenzyTimer) this.dom.frenzyTimer.textContent = '0';
    if (this.dom.frenzyDisplayMobile) this.dom.frenzyDisplayMobile.classList.remove('visible');
    if (this.dom.frenzyTimerMobile) this.dom.frenzyTimerMobile.textContent = '0';

    // Reset shake and danger
    this.shakeIntensity = 0;
    this.dangerFlashTimer = 0;
    if (this.dom.dangerOverlay) this.dom.dangerOverlay.classList.remove('active');

    // Clear 3D items & tracks
    this.clearTracksAndItems();
    
    // Reset finish line
    this.hasSpawnedFinishLine = false;
    if (this.finishLineMesh) {
      this.scene.remove(this.finishLineMesh);
      this.finishLineMesh = null;
    }

    // Reset ball bumps and germs
    if (this.ballBumps) {
      this.ballBumps.forEach(b => this.ball.remove(b));
      this.ballBumps = [];
    }
    if (this.ballGerms) {
      this.ballGerms.forEach(g => this.scene.remove(g.mesh));
      this.ballGerms = [];
    }

    // Reset player position and skin
    if (this.ball) {
      this.ball.position.set(0, this.ballRadius, 0);
      this.ball.scale.set(1, 1, 1);
      this.ballTargetScale.copy(this.scaleDefault);
      this.applySkin(this.equippedSkinId);
    }
    
    this.particles.clear();
    this.updateHUD();
    this.dom.warningOverlay.classList.remove('flashing');
    this.dom.buffDisplay.classList.remove('visible');
    if (this.dom.buffDisplayMobile) this.dom.buffDisplayMobile.classList.remove('visible');
  }

  clearTracksAndItems() {
    this.activeSegments.forEach(seg => this.scene.remove(seg));
    this.activeSegments = [];

    this.activeItems.forEach(item => this.scene.remove(item.mesh));
    this.activeItems = [];
  }

  spawnInitialTrack() {
    // Place a flat starting platform (first segment is empty of hazards)
    const startSeg = Models.createTrackSegment(this.trackWidth, this.segmentLength, 'plain');
    startSeg.position.set(0, 0, this.segmentLength / 2);
    this.scene.add(startSeg);
    this.activeSegments.push(startSeg);
    this.nextSegmentZ = this.segmentLength;

    // Spawn 5 normal gameplay segments ahead
    for (let i = 0; i < 5; i++) {
      this.spawnNextSegment();
    }
  }

  spawnNextSegment() {
    const theme = this.zones[this.currentZoneIndex];
    const segment = Models.createTrackSegment(this.trackWidth, this.segmentLength, theme);
    segment.position.set(0, 0, this.nextSegmentZ + this.segmentLength / 2);
    
    this.scene.add(segment);
    this.activeSegments.push(segment);
    
    // Spawn healthy fruits/junk foods on this segment (except right at the start and near the finish line)
    if (this.nextSegmentZ > 20 && this.nextSegmentZ < this.finishLineZ - 60) {
      this.spawnItemsOnSegment(this.nextSegmentZ, theme);
    }
    
    this.nextSegmentZ += this.segmentLength;
    this.segmentsSpawningInZone++;

    // Switch fruit zones every 6 segments (120 meters)
    if (this.segmentsSpawningInZone >= 6) {
      this.segmentsSpawningInZone = 0;
      this.currentZoneIndex = (this.currentZoneIndex + 1) % this.zones.length;
    }
  }

  spawnItemsOnSegment(startZ, zoneTheme) {
    // 3 spawn spots along the 20-meter segment (at 5m, 10m, 15m)
    const spots = [5, 10, 15];
    const lanes = [-1.5, 0, 1.5]; // Left, Center, Right

    spots.forEach(zOffset => {
      const itemZ = startZ + zOffset;
      // 70% chance of spawning items at this Z row
      if (Math.random() > 0.3) {
        const laneIdx = Math.floor(Math.random() * 3);
        const laneX = lanes[laneIdx];
        
        // During Fruit Frenzy: only healthy fruits for the first 5 seconds
        const isFrenzy = this.fruitFrenzyTimer > 0;

        const roll = Math.random();
        let itemMesh = null;
        let itemType = '';
        let isHealthy = true;

        if (!isFrenzy && roll < 0.03) {
          // Magnet power-up
          isHealthy = true;
          itemType = 'magnet';
          itemMesh = Models.createMagnet();
        } else if (!isFrenzy && roll < 0.06) {
          // Shield power-up
          isHealthy = true;
          itemType = 'shield';
          itemMesh = Models.createShield();
        } else if (isFrenzy || roll < 0.36) {
          // Healthy local fruit (30% chance, or 100% during frenzy)
          isHealthy = true;
          const fruits = ['mango', 'banana', 'watermelon', 'papaya', 'calamansi'];
          let fruitType = fruits[Math.floor(Math.random() * fruits.length)];
          if (zoneTheme === 'watermelon' && Math.random() > 0.5) fruitType = 'watermelon';
          if (zoneTheme === 'mango' && Math.random() > 0.5) fruitType = 'mango';
          if (zoneTheme === 'papaya' && Math.random() > 0.5) fruitType = 'papaya';

          itemType = fruitType;
          itemMesh = Models.createFruit(fruitType);

        } else if (!isFrenzy && roll < 0.5) {
          // Healthy veggie (14% chance)
          isHealthy = true;
          const veggies = ['carrot', 'broccoli', 'squash', 'eggplant'];
          itemType = veggies[Math.floor(Math.random() * veggies.length)];
          itemMesh = Models.createVeggie(itemType);

        } else if (!isFrenzy && roll < 0.6) {
          // Water bottle for the drink-water goal (10% chance)
          isHealthy = true;
          itemType = 'water';
          itemMesh = Models.createWater();

        } else if (!isFrenzy && roll < 0.88) {
          // Unhealthy fast food (28% chance)
          isHealthy = false;
          const junks = ['burger', 'soda', 'donut', 'fries', 'hotdog', 'chips'];
          itemType = junks[Math.floor(Math.random() * junks.length)];
          itemMesh = Models.createJunk(itemType);

        } else {
          // Slime Hazard (12% chance)
          isHealthy = false;
          itemType = 'slime';
          itemMesh = Models.createSlimeObstacle();
        }

        if (itemMesh) {
          // Set mesh placement position
          const heightOffset = itemType === 'slime' ? 0.17 : 0.65;
          itemMesh.position.set(laneX, heightOffset, itemZ);
          this.scene.add(itemMesh);
          
          this.activeItems.push({
            mesh: itemMesh,
            type: itemType,
            isHealthy: isHealthy,
            x: laneX,
            z: itemZ
          });
        }
      }
    });
  }

  // Instantly pull every pre-game menu overlay out of the hit-test path when
  // a race starts. Inline `display:none` (not just the .active class) also
  // stops browsers from dispatching a synthesized 'click' for a held tap that
  // started on a menu button — that click is what used to reset/reopen the
  // Main Menu after a touch-hold near START.
  lockMenuScreens() {
    ['start-screen', 'char-select-screen', 'settings-screen', 'trivia-screen', 'leaderboard-screen', 'grading-screen'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
      el.style.visibility = 'hidden';
    });
  }

  // Reverse lockMenuScreens() whenever the player returns to the menu so the
  // overlays become visible/interactive again.
  unlockMenuScreens() {
    ['start-screen', 'char-select-screen', 'settings-screen', 'trivia-screen', 'leaderboard-screen', 'grading-screen'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.display = '';
      el.style.pointerEvents = '';
      el.style.visibility = '';
    });
  }

  startGame() {
    // Safety guard: ignore stray re-entry (e.g. a synthesized click racing in
    // right after this call) during the start-transition cooldown.
    if (performance.now() < this.inputCooldownUntil) return;
    // 500ms input cooldown: accidental taps during the start transition are
    // ignored by UI overlays (checked inside bindPress / bindSteer paths).
    this.inputCooldownUntil = performance.now() + 500;

    // Kill every Main Menu overlay IMMEDIATELY so no touch/mouse event can
    // register on any menu button once the 3D track loop begins.
    this.lockMenuScreens();

    audio.init();
    audio.resume();
    this.resetGameValues();

    // Apply speed setting
    if (this.gameSpeedMode === 'easy') {
      this.baseSpeed = 4;
      this.maxSpeed = 10;
      this.speed = this.baseSpeed;
    } else {
      this.baseSpeed = 6;
      this.maxSpeed = 15;
      this.speed = this.baseSpeed;
    }

    // Apply custom character color
    if (this.selectedCharColor && this.ball && this.ballMat) {
      const c = new THREE.Color(this.selectedCharColor);
      this.ballMat.color.copy(c);
      this.ballMat.emissive.copy(c);
      this.ballMat.emissiveIntensity = 0.25;
      if (this.ballLight) {
        this.ballLight.color.copy(c);
      }
    }
    
    // Transitions
    // START GAME clicked: reveal the active gameplay HUD behind the menu.
    // STRICT GAME STATE PROTECTION: entering "PLAYING" force-hides every
    // pre-game menu screen (see body.playing rules in style.css). While
    // this class is present, no touch, swipe, or key event may bring the
    // Main Menu back — it can only re-appear via "QUIT TO MENU" in the
    // Pause modal (quitToMenu) or after the game ends (gameOver/victory).
    document.body.classList.remove('in-menu');
    document.body.classList.remove('gameover');
    document.body.classList.remove('victory');
    document.body.classList.add('playing');
    if (this.dom.charSelectScreen) this.dom.charSelectScreen.classList.remove('active');
    if (this.dom.settingsScreen) this.dom.settingsScreen.classList.remove('active');
    this.dom.startScreen.classList.remove('active');
    this.dom.gameOverScreen.classList.remove('active');
    if (this.dom.victoryScreen) {
      this.dom.victoryScreen.classList.remove('active');
    }
    if (this.dom.pauseScreen) {
      this.dom.pauseScreen.classList.remove('active');
    }
    
    // Start Fruit Frenzy (5 seconds of only healthy fruits)
    this.fruitFrenzyTimer = this.fruitFrenzyDuration;
    if (this.dom.frenzyDisplay) this.dom.frenzyDisplay.classList.add('visible');
    if (this.dom.frenzyTimer) this.dom.frenzyTimer.textContent = Math.ceil(this.fruitFrenzyTimer);
    if (this.dom.frenzyDisplayMobile) this.dom.frenzyDisplayMobile.classList.add('visible');
    if (this.dom.frenzyTimerMobile) this.dom.frenzyTimerMobile.textContent = Math.ceil(this.fruitFrenzyTimer);

    this.state = 'playing';
    if (this.dom.pauseBtn) {
      this.dom.pauseBtn.style.display = 'flex';
    }
    audio.setGameState('playing');
    audio.setHealth(this.health);

    // Update music track name display
    if (this.dom.musicTrackName) {
      this.dom.musicTrackName.textContent = audio.getTrackName();
    }
    menuAudio.stopBGM(); // Stop procedural menu music when gameplay starts
  }

  pauseGame() {
    if (this.state !== 'playing') return;
    this.isPaused = true;
    this.state = 'paused';
    if (this.dom.pauseScreen) this.dom.pauseScreen.classList.add('active');
    // Refresh live mission progress before showing the paused overlay
    this.updatePauseMissions();
    audio.suspend();
  }

  resumeGame() {
    if (this.state !== 'paused') return;
    this.isPaused = false;
    this.state = 'playing';
    if (this.dom.pauseScreen) this.dom.pauseScreen.classList.remove('active');
    audio.resume();
  }

  togglePause() {
    if (this.state === 'playing') this.pauseGame();
    else if (this.state === 'paused') this.resumeGame();
  }

  // ---- HOW TO PLAY MODAL ----

  openHowToPlayModal() {
    if (this.dom.howToPlayModal) {
      this.dom.howToPlayModal.hidden = false;
      // Force reflow to enable transition
      this.dom.howToPlayModal.offsetHeight;
      this.dom.howToPlayModal.classList.add('active');
    }
  }

  closeHowToPlayModal() {
    if (this.dom.howToPlayModal) {
      this.dom.howToPlayModal.classList.remove('active');
      this.dom.howToPlayModal.addEventListener('transitionend', () => {
        this.dom.howToPlayModal.hidden = true;
      }, { once: true });
    }
  }

  updatePauseMissions() {
    const container = document.getElementById('pause-cards-container');
    if (!container) return;

    // Mission 1 — DO'S: Fresh Fruits & Vegetables (combined count)
    const produceCount = this.fruitsCollectedInRun + this.veggiesCollectedInRun;
    const produceTarget = this.missionTargets.produce;
    const producePct = Math.min(100, (produceCount / produceTarget) * 100);

    // Mission 2 — DO'S: Water Bottles (hydration)
    const waterCount = this.waterCollectedInRun;
    const waterTarget = this.missionTargets.water;
    const waterPct = Math.min(100, (waterCount / waterTarget) * 100);

    // Rule 3 — DON'TS: Junk Food + Slime warning
    const junkHits = this.junkHitInRun;

    // Generate full card DOM structures
    container.innerHTML = `
      <!-- Mission 1 Card -->
      <div class="pause-card-item green-border">
        <div class="pause-card-icon">🍎🥦</div>
        <div class="pause-card-content">
          <div class="pause-card-title">COLLECT 5 FRESH FRUITS & VEGETABLES</div>
          <div class="pause-card-progress-bar"><div class="fill" style="width: ${producePct}%;"></div></div>
        </div>
        <div class="pause-card-count">${produceCount}/${produceTarget}</div>
      </div>

      <!-- Mission 2 Card -->
      <div class="pause-card-item green-border">
        <div class="pause-card-icon">💧</div>
        <div class="pause-card-content">
          <div class="pause-card-title">DRINK 3 WATER BOTTLES</div>
          <div class="pause-card-progress-bar"><div class="fill" style="width: ${waterPct}%;"></div></div>
        </div>
        <div class="pause-card-count">${waterCount}/${waterTarget}</div>
      </div>

      <!-- Mission 3 Card (Junk Warning) -->
      <div class="pause-card-item orange-border">
        <div class="pause-card-icon">🚫🍔</div>
        <div class="pause-card-content">
          <div class="pause-card-title">AVOID PROCESSED JUNK FOOD & SLIME!</div>
          <div class="pause-warning-pill">⚠ DRAINS YOUR HEALTH BAR! <b>${junkHits} JUNK HITS</b></div>
        </div>
      </div>
    `;
  }

  showRandomTip(targetEl) {
    if (!targetEl) return;
    targetEl.textContent = NUTRITION_TIPS[Math.floor(Math.random() * NUTRITION_TIPS.length)];
  }

  quitToMenu() {
    this.state = 'menu';
    this.inputCooldownUntil = performance.now() + 600; // brief cooldown so trailing touches don't immediately hit menu buttons
    if (this.dom.pauseScreen) this.dom.pauseScreen.classList.remove('active');
    if (this.dom.pauseBtn) this.dom.pauseBtn.style.display = 'none';
    audio.setGameState('menu');
    menuAudio.playMenuBGM(); // Resume cheerful menu BGM
    this.resetGameValues();
    this.showMenuScreen();
  }

  // ---- MENU NAVIGATION ----

  showMenuScreen() {
    // Returning to the menu is permitted ONLY via the Pause "Quit to
    // Menu" button (Condition A) or after a game ends — never while the
    // game is actively PLAYING.
    document.body.classList.remove('playing');
    document.body.classList.remove('gameover');
    document.body.classList.remove('victory');
    document.body.classList.add('in-menu');
    this.unlockMenuScreens();
    this.dom.startScreen.classList.add('active');
    if (this.dom.charSelectScreen) this.dom.charSelectScreen.classList.remove('active');
    if (this.dom.settingsScreen) this.dom.settingsScreen.classList.remove('active');
    this.state = 'menu';
    menuAudio.playMenuBGM();
  }

  showCharSelect() {
    if (this.state !== 'menu') return; // menu-only: never during gameplay
    document.body.classList.add('in-menu');
    this.dom.startScreen.classList.remove('active');
    if (this.dom.charSelectScreen) this.dom.charSelectScreen.classList.add('active');
    if (this.dom.settingsScreen) this.dom.settingsScreen.classList.remove('active');

    // Update preview ball to current color
    this.updateCharPreview();
  }

  // SAVE ONLY: persist the chosen ball color and return to the Main Menu.
  // This NEVER launches gameplay — the player starts via START GAME.
  saveCharSelection() {
    if (this.state !== 'menu') return; // menu-only: never during gameplay
    if (this.selectedCharColor) {
      localStorage.setItem('fr_char_color', this.selectedCharColor);
    }
    this.goToMenu();
  }

  showSettings() {
    if (this.state !== 'menu') return; // menu-only: never during gameplay
    document.body.classList.add('in-menu');
    this.dom.startScreen.classList.remove('active');
    if (this.dom.charSelectScreen) this.dom.charSelectScreen.classList.remove('active');
    if (this.dom.settingsScreen) this.dom.settingsScreen.classList.add('active');
  }

  goToMenu() {
    document.body.classList.remove('playing');
    document.body.classList.remove('gameover');
    document.body.classList.remove('victory');
    document.body.classList.add('in-menu');
    this.unlockMenuScreens();
    if (this.dom.charSelectScreen) this.dom.charSelectScreen.classList.remove('active');
    if (this.dom.settingsScreen) this.dom.settingsScreen.classList.remove('active');
    if (this.dom.triviaScreen) this.dom.triviaScreen.classList.remove('active');
    this.dom.startScreen.classList.add('active');
    this.state = 'menu';
    menuAudio.playMenuBGM();
  }

  // ---- FRUIT TRIVIA BOOK ----

  showTriviaBook() {
    if (this.state !== 'menu') return; // menu-only: never during gameplay
    document.body.classList.add('in-menu');
    this.dom.startScreen.classList.remove('active');
    if (this.dom.charSelectScreen) this.dom.charSelectScreen.classList.remove('active');
    if (this.dom.settingsScreen) this.dom.settingsScreen.classList.remove('active');
    this.renderTriviaBook();
    if (this.dom.triviaScreen) this.dom.triviaScreen.classList.add('active');
  }

  hideTriviaBook() {
    document.body.classList.add('in-menu');
    this.unlockMenuScreens();
    if (this.dom.triviaScreen) this.dom.triviaScreen.classList.remove('active');
    this.dom.startScreen.classList.add('active');
  }

  unlockTriviaEntry(fruitType) {
    if (!FRUIT_TRIVIA[fruitType]) return false;
    if (this.unlockedTrivia.includes(fruitType)) return false;
    this.unlockedTrivia.push(fruitType);
    localStorage.setItem('fr_unlocked_trivia', JSON.stringify(this.unlockedTrivia));
    this.showTriviaToast(fruitType);
    return true;
  }

  showTriviaToast(fruitType) {
    const data = FRUIT_TRIVIA[fruitType];
    if (!data || !this.dom.triviaToast) return;
    if (this.dom.triviaToastTitle) this.dom.triviaToastTitle.textContent = `${data.emoji} ${data.name} Unlocked!`;
    if (this.dom.triviaToastDesc) this.dom.triviaToastDesc.innerHTML = `<strong>${data.tagline}</strong> &mdash; ${data.benefits}`;
    this.dom.triviaToast.classList.add('show');

    if (this.triviaToastTimeout) clearTimeout(this.triviaToastTimeout);
    this.triviaToastTimeout = setTimeout(() => {
      if (this.dom.triviaToast) this.dom.triviaToast.classList.remove('show');
    }, 4000);
  }

  renderTriviaBook() {
    if (!this.dom.triviaGrid) return;
    this.dom.triviaGrid.innerHTML = '';
    const fruitIds = Object.keys(FRUIT_TRIVIA);

    fruitIds.forEach(id => {
      const data = FRUIT_TRIVIA[id];
      const isUnlocked = this.unlockedTrivia.includes(id);
      const entry = document.createElement('div');
      entry.className = `trivia-entry ${isUnlocked ? 'unlocked' : 'locked'}`;

      if (isUnlocked) {
        entry.innerHTML = `
          <div class="trivia-entry-header">
            <div class="trivia-emoji">${data.emoji}</div>
            <div>
              <div class="trivia-name" style="color:${data.color}">${data.name}</div>
              <div class="trivia-tagline">${data.tagline}</div>
              <div class="trivia-spelling">📝 ${data.spelling}</div>
            </div>
          </div>
          <div class="trivia-benefits">${data.benefits}</div>
          <div class="trivia-vitamins">🧪 ${data.vitamins}</div>
          <div class="trivia-fun-fact">💡 ${data.funFact}</div>
          <div class="trivia-fun-fact">📚 ${data.funFact2}</div>
          <div class="trivia-fun-fact">🌟 ${data.funFact3}</div>
        `;
      } else {
        entry.innerHTML = `<div class="trivia-locked-text">🔒</div>`;
      }

      this.dom.triviaGrid.appendChild(entry);
    });
  }

  // ---- CHARACTER SELECT ----

  initCharSelect() {
    if (!this.dom.colorGrid) return;

    // Load saved color as active
    const savedColor = this.selectedCharColor;

    this.bindPress(this.dom.colorGrid, (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (!swatch) return;

      // Deselect all
      this.dom.colorGrid.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const color = swatch.dataset.color;
      this.selectedCharColor = color;
      localStorage.setItem('fr_char_color', color);
      this.updateCharPreview();

      // Preview on 3D ball
      this.previewCharColor(color);
    }, ['menu']);

    // Highlight saved
    if (savedColor) {
      const activeSwatch = this.dom.colorGrid.querySelector(`.color-swatch[data-color="${savedColor}"]`);
      if (activeSwatch) activeSwatch.classList.add('active');
    }
  }

  updateCharPreview() {
    if (!this.dom.previewBall) return;
    const color = this.selectedCharColor || this.getDefaultBallColor();
    this.dom.previewBall.style.background = `radial-gradient(circle at 35% 35%, #ffffff, ${color})`;
    this.dom.previewBall.style.boxShadow = `0 0 30px ${color}80, 0 8px 30px rgba(0,0,0,0.3)`;
  }

  getDefaultBallColor() {
    // Return the equipped skin's color
    const skinDef = Models.SKINS.find(s => s.id === this.equippedSkinId);
    return skinDef ? skinDef.color : '#ff1744';
  }

  previewCharColor(hexColor) {
    // Apply color to the 3D ball in the main scene for live preview
    if (this.ball && this.ballMat) {
      const c = new THREE.Color(hexColor);
      this.ballMat.color.copy(c);
      this.ballMat.emissive.copy(c);
      this.ballMat.emissiveIntensity = 0.3;
      if (this.ballLight) {
        this.ballLight.color.copy(c);
      }
      this.refreshSkinGrid();
    }
  }

  // ---- SETTINGS ----

  initSettings() {
    // Music toggle
    if (this.dom.musicToggle) {
      this.dom.musicToggle.checked = audio.musicEnabled;
      this.dom.musicStatus.textContent = audio.musicEnabled ? 'ON' : 'OFF';
      this.dom.musicToggle.addEventListener('change', () => {
        const on = audio.toggleMusic();
        this.dom.musicStatus.textContent = on ? 'ON' : 'OFF';
      });
    }

    // SFX toggle
    if (this.dom.sfxToggle) {
      this.dom.sfxToggle.checked = audio.sfxEnabled;
      this.dom.sfxStatus.textContent = audio.sfxEnabled ? 'ON' : 'OFF';
      this.dom.sfxToggle.addEventListener('change', () => {
        const on = audio.toggleSfx();
        this.dom.sfxStatus.textContent = on ? 'ON' : 'OFF';
      });
    }

    // Speed selection
    if (this.dom.speedOpts) {
      this.dom.speedOpts.forEach(btn => {
        this.bindPress(btn, () => {
          this.dom.speedOpts.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.gameSpeedMode = btn.dataset.speed;
          localStorage.setItem('fr_game_speed', this.gameSpeedMode);
        }, ['menu']);
      });

      // Restore saved speed
      const savedSpeed = this.gameSpeedMode;
      this.dom.speedOpts.forEach(btn => {
        if (btn.dataset.speed === savedSpeed) {
          btn.classList.add('active');
        }
      });
    }
  }

  gameOver() {
    this.state = 'gameover';
    // Cooldown guard (1000ms): ignore lingering taps/touches at the bottom of the screen so Game Over screen doesn't instantly restart
    this.inputCooldownUntil = performance.now() + 1000;
    // Condition B: the game ended — lift the in-game menu protection so
    // the Game Over screen (and menu navigation from it) may show.
    document.body.classList.remove('playing');
    document.body.classList.remove('victory');
    document.body.classList.add('gameover');
    if (this.dom.pauseBtn) {
      this.dom.pauseBtn.style.display = 'none';
    }
    audio.setGameState('gameover');
    audio.playGameOver();

    // Update lifetime totals
    this.fruitsCollectedTotal += this.fruitsCollectedInRun;
    this.junkHitTotal += this.junkHitInRun;
    this.superModeTriggeredTotal += this.superModeTriggeredInRun;

    localStorage.setItem('fr_total_fruits', this.fruitsCollectedTotal.toString());
    localStorage.setItem('fr_total_junk', this.junkHitTotal.toString());
    localStorage.setItem('fr_total_supers', this.superModeTriggeredTotal.toString());
    localStorage.setItem('fr_unlocked_trivia', JSON.stringify(this.unlockedTrivia));

    // Check high score
    if (this.score > this.highScore) {
      this.highScore = Math.round(this.score);
      this.bestScore = this.highScore;
      localStorage.setItem('fruit_roller_highscore', this.highScore.toString());
      this.updateHighScoreDisplay();
    }

    // Update highest level reached (for Toxic Ooze unlock)
    const finalLevel = Math.min(10, Math.max(1, Math.floor(this.distance / (this.finishLineZ / 10)) + 1));
    if (finalLevel > this.highestLevel) {
      this.highestLevel = finalLevel;
      localStorage.setItem('fr_highest_level', this.highestLevel.toString());
    }

    // Check achievements after updating totals
    this.checkAchievements();
    this.refreshSkinGrid();

    this.dom.endScore.textContent = Math.round(this.score);
    
    const starInfo = this.calculateStarRating();
    
    // Set star icons
    const starEls = ['go-star1', 'go-star2', 'go-star3'];
    const starFlags = [starInfo.star1, starInfo.star2, starInfo.star3];
    for (let i = 0; i < 3; i++) {
      const el = document.getElementById(starEls[i]);
      if (el) {
        el.classList.toggle('earned', starFlags[i]);
        el.classList.toggle('star-dim', !starFlags[i]);
      }
    }
    
    const goStarTitle = document.getElementById('go-star-title');
    if (goStarTitle) {
      goStarTitle.textContent = starInfo.title;
      goStarTitle.style.color = starInfo.color;
    }
    
    const goStarCount = document.getElementById('go-star-count');
    if (goStarCount) goStarCount.textContent = `${starInfo.stars}/3`;
    
    // Set checklist
    const goCheck1 = document.getElementById('go-check1');
    if (goCheck1) goCheck1.textContent = starInfo.star1 ? '✅' : '❌';
    const goCheck2 = document.getElementById('go-check2');
    if (goCheck2) goCheck2.textContent = starInfo.star2 ? '✅' : '❌';
    const goCheck3 = document.getElementById('go-check3');
    if (goCheck3) goCheck3.textContent = starInfo.star3 ? '✅' : '❌';
    
    // Purity info
    const goPurity = document.getElementById('go-purity');
    if (goPurity) goPurity.textContent = `${Math.round(starInfo.purity)}%`;
    const goHealthy = document.getElementById('go-healthy');
    if (goHealthy) goHealthy.textContent = starInfo.healthyItems;
    const goTotal = document.getElementById('go-total');
    if (goTotal) goTotal.textContent = starInfo.totalItems;
    const goCombo = document.getElementById('go-combo');
    if (goCombo) goCombo.textContent = starInfo.maxHealthyCombo;
    
    this.saveToLeaderboard(this.score, starInfo);

    // Provide an interesting healthy/unhealthy habits summary verdict based on the ball's final state
    if (this.health >= 70) {
      this.dom.verdictText.className = 'health-verdict healthy';
      this.dom.verdictText.textContent = "🏆 HEALTH SUPERHERO! You rolled clean, collected organic fruits, and stayed energetic!";
    } else if (this.health >= 35) {
      this.dom.verdictText.className = 'health-verdict healthy';
      this.dom.verdictText.textContent = "👍 WELL BALANCED! A decent diet, keeping active, but could grab more berries!";
    } else {
      this.dom.verdictText.className = 'health-verdict unhealthy';
      this.dom.verdictText.textContent = "🍔 TOXIC DIET FAILURE! Too much high-sodium junk and sluggish sugars deflated your health!";
    }

    this.dom.gameOverScreen.classList.add('active');
    this.showRandomTip(this.dom.gameoverTipText);
  }

  updateHUD() {
    this.dom.scoreVal.textContent = Math.round(this.score);
    if (this.dom.mobileScoreVal) this.dom.mobileScoreVal.textContent = Math.round(this.score);

    // Level from progress through the track (1..10)
    const level = Math.min(10, Math.max(1, Math.floor(this.distance / (this.finishLineZ / 10)) + 1));
    this.currentLevel = level;
    // Persist highest level reached for skin unlock checks
    if (this.state === 'playing' && level > this.highestLevel) {
      this.highestLevel = level;
      localStorage.setItem('fr_highest_level', this.highestLevel.toString());
    }
    if (this.dom.levelVal) this.dom.levelVal.textContent = level;
    if (this.dom.mobileLevelVal) this.dom.mobileLevelVal.textContent = level;

    // Celebrate level progression with a simple toast (no recipe unlocks)
    if (this.state === 'playing' && level > this.lastShownLevel) {
      this.lastShownLevel = level;
      this.showFlashWord(`LEVEL ${level} COMPLETED!`, 0xffbd59);
    }

    // Daily goal progress bars
    const t = this.goalTargets;
    const goals = [
      { count: this.fruitsCollectedInRun, target: t.fruits, el: this.dom.goalFruits, fill: this.dom.goalFruitsFill },
      { count: this.veggiesCollectedInRun, target: t.veggies, el: this.dom.goalVeggies, fill: this.dom.goalVeggiesFill },
      { count: this.waterCollectedInRun, target: t.water, el: this.dom.goalWater, fill: this.dom.goalWaterFill }
    ];
    let goalTotal = 0;
    let goalTargetTotal = 0;
    goals.forEach(g => {
      const pct = Math.min(100, (g.count / g.target) * 100);
      if (g.el) g.el.textContent = `${g.count}/${g.target}`;
      if (g.fill) g.fill.style.width = `${pct}%`;
      goalTotal += g.count;
      goalTargetTotal += g.target;
    });
    if (this.dom.mobileGoalFill) {
      this.dom.mobileGoalFill.style.width = `${Math.min(100, (goalTotal / goalTargetTotal) * 100)}%`;
    }
    if (this.dom.mobileGoalCount) {
      this.dom.mobileGoalCount.textContent = `${goalTotal}/${goalTargetTotal}`;
    }

    // Health bar adjustments
    const healthPercent = Math.max(0, Math.min(100, this.health));
    this.dom.healthFill.style.width = `${healthPercent}%`;
    if (this.dom.healthStatus) {
      this.dom.healthStatus.textContent = `${Math.round(healthPercent)} / 100`;
    }
    if (this.health < 30) {
      this.dom.healthFill.classList.add('toxic');
      this.dom.healthStatus.textContent = 'Sluggish Acid 💀';
      this.dom.healthStatus.style.color = '#ce3a8a';
      this.dom.warningOverlay.classList.add('flashing');
    } else {
      this.dom.healthStatus.textContent = 'Standard';
      this.dom.healthStatus.style.color = '#2D3748';
      this.dom.warningOverlay.classList.remove('flashing');
    }

    // Update level progress bar
    if (this.dom.progressFill && this.dom.progressPercent) {
      const progressFraction = Math.max(0, Math.min(1.0, this.distance / this.finishLineZ));
      const percentage = Math.round(progressFraction * 100);
      this.dom.progressFill.style.width = `${percentage}%`;
      this.dom.progressPercent.textContent = `${percentage}%`;
    }
  }

  // Female-voice text-to-speech helper. Forces a female voice by name
  // filter; falls back to the device's default voice when none match.
  speakFemale(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Helper to select and apply female voice
    const applyVoice = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      const femaleVoice = voices.find(v =>
        /female|samantha|zira|google us english|natural female/i.test(v.name)
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 1.2;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    };
    
    // If voices are already loaded, apply immediately
    if (window.speechSynthesis.getVoices().length > 0) {
      applyVoice();
    } else {
      // Wait for voices to load (Chrome loads them asynchronously)
      const onVoicesLoaded = () => {
        applyVoice();
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesLoaded);
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesLoaded);
      // Fallback timeout in case event doesn't fire
      setTimeout(applyVoice, 200);
    }
  }

  handleItemCollision(item) {
    this.scene.remove(item.mesh);

    // Speak ONLY the simple English food name in a female voice (e.g.
    // "Apple", "Banana", "Carrot"). No Tagalog translations and no vitamin
    // details are included in the spoken string.
    const spokenName = SPOKEN_FOOD_NAMES[item.type] ||
      (item.type.charAt(0).toUpperCase() + item.type.slice(1));
    this.speakFemale(spokenName);

    // Flash word on screen
    const pColor = this.fruitColors[item.type] || (item.isHealthy ? 0x69ffb4 : this.junkColor);
    if (item.type !== 'magnet' && item.type !== 'shield') {
      this.showFlashWord(item.type, pColor);
    }

    if (item.type === 'magnet') {
      audio.playCollect('strawberry');
      this.magnetTimer = 10;
      const magIcon = document.getElementById('magnet-icon');
      const magIconM = document.getElementById('magnet-icon-mobile');
      if (magIcon) magIcon.style.display = 'flex';
      if (magIconM) magIconM.style.display = 'flex';
      this.showFlashWord('MAGNET!', 0x00e5ff);
      return;
    }

    if (item.type === 'shield') {
      audio.playCollect('orange');
      this.hasShield = true;
      const shieldIcon = document.getElementById('shield-icon');
      const shieldIconM = document.getElementById('shield-icon-mobile');
      if (shieldIcon) shieldIcon.style.display = 'flex';
      if (shieldIconM) shieldIconM.style.display = 'flex';
      this.showFlashWord('SHIELD!', 0xffea00);
      return;
    }

    if (item.isHealthy) {
      // ------------------------------------
      // HEALTHY COLLECTION LOGIC
      // ------------------------------------
      audio.playCollect(item.type);
      this.score += 150;
      this.runVitamins += 10;
      this.runCalories += 50;
      this.lastEatenItem = item.type;

      // Classify toward daily goal (fruits vs veggies vs water)
      if (item.type === 'water') {
        this.waterCollectedInRun++;
        this.runWater++;
      } else if (this.veggieItems.has(item.type)) {
        this.veggiesCollectedInRun++;
        this.runVeggies++;
      } else {
        this.fruitsCollectedInRun++;
        this.runFruits++;
      }

      // Purity Ratio Index: track healthy combo streak
      this.healthyCombo++;
      this.maxHealthyCombo = Math.max(this.maxHealthyCombo, this.healthyCombo);

      // Unlock trivia entry on first collect of each fruit type
      this.unlockTriviaEntry(item.type);
      
      const pColor = this.fruitColors[item.type] || 0x69ffb4;
      this.particles.spawnExplosion(item.mesh.position, pColor, 15);

      // Heal/remove a ball bump
      this.removeBallBump();

      // Increase healthiness
      if (!this.isSuperMode) {
        // Water bottles restore extra health
        const healAmount = item.type === 'water' ? 20 : 10;
        this.health = Math.min(100, this.health + healAmount);
        audio.setHealth(this.health);

        // Transition ball visual material
        this.ballMat.color.setHex(pColor);
        this.ballMat.emissive.setHex(pColor);
        this.ballLight.color.setHex(pColor);
        this.ballLight.intensity = 5.0;
        this.ballMat.emissiveIntensity = 1.2;
        this.ballMat.roughness = 0.05;

        // DYNAMIC SCALE: Slim down when healthy
        this.ballTargetScale.copy(this.scaleSlim);

        // Speed temporary boost
        this.speedMultiplier = 1.35;
        this.speedBoostTimer = 1.5; // seconds
        this.speedPenaltyTimer = 0; // cancel slow penalty

        // Trigger super mode at 100% health
        if (this.health >= 100) {
          this.activateSuperMode();
        }
      } else {
        // Super mode double score bonus
        this.score += 150;
      }

      // Display dynamic HUD message
      const buffMsg = item.type === 'water'
        ? 'HYDRATED! +20 HP'
        : `${item.type.toUpperCase()} BOOST!`;
      this.showBuffAlert(buffMsg, pColor);

    } else {
      // ------------------------------------
      // UNHEALTHY IMPACT LOGIC
      // ------------------------------------
      if (this.isSuperMode) {
        // Invulnerable in super mode: smash junk food for extra score!
        audio.playCollect('strawberry');
        this.score += 250;
        this.particles.spawnExplosion(item.mesh.position, 0xffea00, 20);
        this.showBuffAlert("SMASHED JUNK! +250", 0xffea00);
        return;
      }

      if (this.hasShield) {
        audio.playCollect('blueberry'); // generic breaking sound
        this.hasShield = false;
        const shieldIcon = document.getElementById('shield-icon');
        const shieldIconM = document.getElementById('shield-icon-mobile');
        if (shieldIcon) shieldIcon.style.display = 'none';
        if (shieldIconM) shieldIconM.style.display = 'none';
        this.particles.spawnExplosion(item.mesh.position, 0xffea00, 20);
        this.showBuffAlert("SHIELD PROTECTED YOU!", 0xffea00);
        return;
      }

      this.runCalories += 400;
      this.runVitamins = Math.max(0, this.runVitamins - 2);

      audio.playHit();
      this.particles.spawnExplosion(item.mesh.position, this.junkColor, 12);
      this.particles.spawnToxicSmoke(this.ball.position, 10);

      // Danger flash overlay + screen shake
      this.dangerFlashTimer = 0.3;
      if (this.dom.dangerOverlay) this.dom.dangerOverlay.classList.add('active');
      this.shakeIntensity = 0.4;

      this.health = Math.max(0, this.health - 16);
      audio.setHealth(this.health);
      this.junkHitInRun++;
      this.runJunk++;
      this.healthyCombo = 0;

      // Add a visual toxic bump
      this.addBallBump();
      
      // Sluggish visuals and penalty
      this.ballMat.color.setHex(0x8a0a3c);
      this.ballMat.emissive.setHex(0x3a0a1e);
      this.ballLight.color.setHex(0xce3a8a);
      this.ballMat.emissiveIntensity = 0.3;
      this.ballMat.roughness = 0.9; // sluggish friction

      // DYNAMIC SCALE: Bloat up when eating junk
      this.ballTargetScale.copy(this.scaleBlob);

      this.speedMultiplier = 0.55;
      this.speedPenaltyTimer = 2.0; // seconds sluggish penalty
      this.speedBoostTimer = 0; // cancel boosts

      this.showBuffAlert(`${item.type.toUpperCase()} DETOX PENALTY!`, this.junkColor);

      if (this.health <= 0) {
        this.gameOver();
      }
    }

    this.updateHUD();
  }

  activateSuperMode() {
    this.isSuperMode = true;
    this.superModeTimer = this.superModeDuration;
    this.speedMultiplier = 1.8;
    this.superModeTriggeredInRun++;
    this.superModeCount++;
    this.ballTargetScale.copy(this.scaleSuper);
    audio.setGameState('super');
    audio.playSuperMode();
    this.showBuffAlert("★ SUPER FRUIT RUSH ★", 0xffea00);
  }

  deactivateSuperMode() {
    this.isSuperMode = false;
    this.health = 75; // reset health to 75%
    this.speedMultiplier = 1.0;
    this.ballTargetScale.copy(this.scaleDefault);

    // Restore skin base material properties
    this.applySkin(this.equippedSkinId);
    
    audio.setGameState('playing');
    audio.setHealth(this.health);
    
    this.showBuffAlert("SUPER MODE ENDED", 0xffffff);
    this.updateHUD();
  }

  showBuffAlert(text, colorHex) {
    const colorStr = `#${colorHex.toString(16).padStart(6, '0')}`;
    this.dom.buffText.textContent = text;
    this.dom.buffDot.style.color = colorStr;
    this.dom.buffDisplay.style.color = colorStr;
    this.dom.buffDisplay.classList.add('visible');
    if (this.dom.buffTextMobile) this.dom.buffTextMobile.textContent = text;
    if (this.dom.buffDisplayMobile) this.dom.buffDisplayMobile.classList.add('visible');
    
    // auto hide after 1.8 seconds
    if (this.buffHideTimeout) clearTimeout(this.buffHideTimeout);
    this.buffHideTimeout = setTimeout(() => {
      this.dom.buffDisplay.classList.remove('visible');
      if (this.dom.buffDisplayMobile) this.dom.buffDisplayMobile.classList.remove('visible');
    }, 1800);
  }

  showFlashWord(text, colorHex) {
    if (!this.dom.flashWordOverlay) return;
    
    this.dom.flashWordOverlay.classList.remove('flash-active');
    void this.dom.flashWordOverlay.offsetWidth; // Trigger reflow to restart CSS animation
    
    this.dom.flashWordOverlay.textContent = text;
    const colorStr = `#${colorHex.toString(16).padStart(6, '0')}`;
    this.dom.flashWordOverlay.style.color = colorStr;
    this.dom.flashWordOverlay.style.borderColor = colorStr;
    this.dom.flashWordOverlay.style.boxShadow = `0 10px 40px rgba(0,0,0,0.4), 0 0 30px ${colorStr}66, inset 0 1px 0 rgba(255,255,255,0.15)`;
    this.dom.flashWordOverlay.classList.add('flash-active');
  }

  tick(time) {
    requestAnimationFrame((t) => this.tick(t));

    // Calculate delta time
    const currentTime = time * 0.001; // seconds
    let dt = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Safeguard against background tabs / extreme lags
    if (dt > 0.1) dt = 0.1;

    if (this.state === 'playing') {
      this.updatePhysics(dt);
      this.checkCollisions();
      this.updateProceduralTrack();

      // Magnet pull logic
      if (this.magnetTimer > 0) {
        this.magnetTimer -= dt;
        const magTimerUI = document.getElementById('magnet-timer');
        const magTimerUIM = this.dom.magTimerMobile;
        if (magTimerUI) magTimerUI.textContent = Math.ceil(this.magnetTimer);
        if (magTimerUIM) magTimerUIM.textContent = Math.ceil(this.magnetTimer);
        
        this.activeItems.forEach(item => {
          if ((item.isHealthy || item.type === 'shield') && item.mesh) {
            const dist = this.ball.position.distanceTo(item.mesh.position);
            if (dist < 20 && item.mesh.position.z < this.ball.position.z + 5) {
              item.mesh.position.lerp(this.ball.position, 0.08);
            }
          }
        });

        if (this.magnetTimer <= 0) {
          const magIcon = document.getElementById('magnet-icon');
          const magIconM = document.getElementById('magnet-icon-mobile');
          if (magIcon) magIcon.style.display = 'none';
          if (magIconM) magIconM.style.display = 'none';
        }
      }
    }

    // Always update visual particles and render scene
    this.particles.update(dt);
    
    // Smooth lane changes visuals (horizontal sliding) + dynamic scaling
    if (this.ball && this.state === 'playing') {
      this.ball.position.x = THREE.MathUtils.lerp(this.ball.position.x, this.playerTargetX, 0.12);
      
      // DYNAMIC SCALE LERP: Smooth morphing between slim/blob/default
      this.ball.scale.x = THREE.MathUtils.lerp(this.ball.scale.x, this.ballTargetScale.x, 0.06);
      this.ball.scale.y = THREE.MathUtils.lerp(this.ball.scale.y, this.ballTargetScale.y, 0.06);
      this.ball.scale.z = THREE.MathUtils.lerp(this.ball.scale.z, this.ballTargetScale.z, 0.06);

      // Auto spin the ball forward based on rolling distance
      const spinSpeed = (this.speed * this.speedMultiplier * dt) / this.ballRadius;
      this.ball.rotateOnAxis(new THREE.Vector3(1, 0, 0), spinSpeed);

      // Rainbow color shifting in super mode
      if (this.isSuperMode) {
        const hue = (currentTime * 1.5) % 1.0;
        const color = new THREE.Color().setHSL(hue, 1.0, 0.5);
        this.ballMat.color.copy(color);
        this.ballMat.emissive.copy(color);
        this.ballLight.color.copy(color);
      }

      // Update Orbiting Germs when health is low
      if (this.health < 40 && this.state === 'playing') {
        if (this.ballGerms.length < 3) {
          const germMesh = Models.createGermMesh();
          this.scene.add(germMesh);
          this.ballGerms.push({
            mesh: germMesh,
            angle: Math.random() * Math.PI * 2,
            speed: 3 + Math.random() * 2,
            orbitRadius: 0.6 + Math.random() * 0.2,
            offsetY: (Math.random() - 0.5) * 0.4
          });
        }

        this.ballGerms.forEach(g => {
          g.angle += g.speed * dt;
          g.mesh.position.set(
            this.ball.position.x + Math.cos(g.angle) * g.orbitRadius,
            this.ball.position.y + g.offsetY,
            this.ball.position.z + Math.sin(g.angle) * g.orbitRadius
          );
          g.mesh.rotation.x += 1.5 * dt;
          g.mesh.rotation.y += 2.0 * dt;
        });
      } else {
        // Clear germs if healthy or not playing
        if (this.ballGerms && this.ballGerms.length > 0) {
          this.ballGerms.forEach(g => this.scene.remove(g.mesh));
          this.ballGerms = [];
        }
      }
    }

    this.updateCamera(dt);
    this.render();
  }

  updatePhysics(dt) {
    // 1. Jump Physics
    if (this.isJumping) {
      this.ball.position.y += this.vy * dt;
      this.vy += this.gravity * dt;
      
      // Land on track surface
      if (this.ball.position.y <= this.ballRadius) {
        this.ball.position.y = this.ballRadius;
        this.isJumping = false;
        this.vy = 0;
      }
    }

    // 2. Timers decrement
    if (this.isSuperMode) {
      this.superModeTimer -= dt;
      
      // Spawn rainbow trails
      const randHue = Math.random();
      const c = new THREE.Color().setHSL(randHue, 1.0, 0.6);
      this.particles.spawnTrail(this.ball.position, c, 1);
      
      if (this.superModeTimer <= 0) {
        this.deactivateSuperMode();
      }
    } else {
      // Speed multipliers decay to 1.0
      if (this.speedBoostTimer > 0) {
        this.speedBoostTimer -= dt;
        // Spawn active trail of fruit color
        const color = this.fruitColors[this.lastEatenItem] || 0xffffff;
        this.particles.spawnTrail(this.ball.position, color, 1);
        
        if (this.speedBoostTimer <= 0) {
          this.speedMultiplier = 1.0;
          this.ballTargetScale.copy(this.scaleDefault); // return to default scale
          this.updateHUD();
        }
      }

      if (this.speedPenaltyTimer > 0) {
        this.speedPenaltyTimer -= dt;
        // Spawn dark smoke particles
        this.particles.spawnToxicSmoke(this.ball.position, 1);
        
        if (this.speedPenaltyTimer <= 0) {
          this.speedMultiplier = 1.0;
          this.ballTargetScale.copy(this.scaleDefault); // return to default scale
          // Restore skin material properties
          this.applySkin(this.equippedSkinId);
          this.updateHUD();
        }
      }
    }

    // 3. Forward roll physics
    const currentFrameSpeed = this.speed * this.speedMultiplier;
    this.ball.position.z += currentFrameSpeed * dt;
    this.distance = this.ball.position.z;
    this.score += currentFrameSpeed * dt * 0.15; // points for distance

    // Acceleration based on progress (like piano tiles / track length)
    const progressFactor = Math.min(1.0, this.distance / this.finishLineZ);
    this.speed = this.baseSpeed + progressFactor * (this.maxSpeed - this.baseSpeed);

    // 4. Fruit Frenzy timer countdown
    if (this.fruitFrenzyTimer > 0) {
      this.fruitFrenzyTimer -= dt;
      if (this.dom.frenzyTimer) {
        this.dom.frenzyTimer.textContent = Math.ceil(this.fruitFrenzyTimer);
      }
      if (this.dom.frenzyTimerMobile) {
        this.dom.frenzyTimerMobile.textContent = Math.ceil(this.fruitFrenzyTimer);
      }
      if (this.fruitFrenzyTimer <= 0) {
        this.fruitFrenzyTimer = 0;
        if (this.dom.frenzyDisplay) this.dom.frenzyDisplay.classList.remove('visible');
        if (this.dom.frenzyDisplayMobile) this.dom.frenzyDisplayMobile.classList.remove('visible');
      }
    }

    // 5. Danger flash timer decay
    if (this.dangerFlashTimer > 0) {
      this.dangerFlashTimer -= dt;
      if (this.dangerFlashTimer <= 0) {
        this.dangerFlashTimer = 0;
        if (this.dom.dangerOverlay) this.dom.dangerOverlay.classList.remove('active');
      }
    }

    // 6. Screen shake decay
    if (this.shakeIntensity > 0) {
      this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 2);
    }

    // 7. Horizontal movement from held keys (ignored while touch steering)
    if (!this.isSteering) {
      if (this.keys.left) {
        this.playerTargetX += this.horizontalSpeed * dt;
      }
      if (this.keys.right) {
        this.playerTargetX -= this.horizontalSpeed * dt;
      }
    }
    const halfTrack = this.trackWidth * 0.5 - this.ballRadius;
    this.playerTargetX = Math.max(-halfTrack, Math.min(halfTrack, this.playerTargetX));

    // Sync score on HUD
    this.updateHUD();

    // Check for Victory (finish line crossed)
    if (this.distance >= this.finishLineZ && this.state === 'playing') {
      this.victory();
    }
  }

  checkCollisions() {
    const ballPos = this.ball.position;

    for (let i = this.activeItems.length - 1; i >= 0; i--) {
      const item = this.activeItems[i];
      const itemPos = item.mesh.position;

      // Spin the collectible mesh for animation
      item.mesh.rotation.y += 1.8 * 0.016; // rough estimate
      if (item.type !== 'slime') {
        item.mesh.position.y = (item.type === 'burger' || item.type === 'donut' ? -0.06 : 0.65) + Math.sin(this.lastTime * 4 + item.z) * 0.1;
      }

      // Check distance sphere collision
      const deltaZ = itemPos.z - ballPos.z;
      
      // If item passed, clear it from scene to conserve memory
      if (deltaZ < -8) {
        this.scene.remove(item.mesh);
        this.activeItems.splice(i, 1);
        continue;
      }

      // AABB/Sphere overlap check
      const distance = ballPos.distanceTo(itemPos);
      const hitRadius = item.type === 'slime' ? 0.9 : 0.75;
      
      if (distance < (this.ballRadius + hitRadius)) {
        this.handleItemCollision(item);
        this.activeItems.splice(i, 1);
      }
    }
  }

  updateProceduralTrack() {
    // Stop spawning new standard segments if we've reached the finish line Z
    if (this.nextSegmentZ < this.finishLineZ + 60) {
      if (this.ball.position.z > this.nextSegmentZ - 80) {
        this.spawnNextSegment();
      }
    }

    // Spawn the finish line structure once Z is reached and it hasn't been spawned yet
    if (this.nextSegmentZ >= this.finishLineZ && !this.hasSpawnedFinishLine) {
      this.finishLineMesh = Models.createFinishLine(this.trackWidth);
      this.finishLineMesh.position.set(0, 0, this.finishLineZ);
      this.scene.add(this.finishLineMesh);
      this.hasSpawnedFinishLine = true;
    }

    // Clean up segments far behind
    if (this.activeSegments.length > 8) {
      const oldSeg = this.activeSegments[0];
      if (oldSeg.position.z < this.ball.position.z - 25) {
        this.scene.remove(oldSeg);
        this.activeSegments.shift();
      }
    }
  }

  victory() {
    this.state = 'victory';
    // Cooldown guard (1000ms): ignore lingering taps/touches at the bottom of the screen
    this.inputCooldownUntil = performance.now() + 1000;
    // The race ended — lift the in-game menu protection so the Victory
    // screen may show.
    document.body.classList.remove('playing');
    document.body.classList.remove('gameover');
    document.body.classList.add('victory');
    if (this.dom.pauseBtn) {
      this.dom.pauseBtn.style.display = 'none';
    }
    audio.setGameState('menu'); // return soundtrack to menu state (silent)
    menuAudio.stopBGM(); // Ensure menu music is stopped — menu is silent
    
    // Voice speech synthesis congratulating the player (female voice)
    this.speakFemale("Congratulations! You won!");

    // Update lifetime totals
    this.fruitsCollectedTotal += this.fruitsCollectedInRun;
    this.junkHitTotal += this.junkHitInRun;
    this.superModeTriggeredTotal += this.superModeTriggeredInRun;

    localStorage.setItem('fr_total_fruits', this.fruitsCollectedTotal.toString());
    localStorage.setItem('fr_total_junk', this.junkHitTotal.toString());
    localStorage.setItem('fr_total_supers', this.superModeTriggeredTotal.toString());
    localStorage.setItem('fr_unlocked_trivia', JSON.stringify(this.unlockedTrivia));

    // Check high score
    if (this.score > this.highScore) {
      this.highScore = Math.round(this.score);
      this.bestScore = this.highScore;
      localStorage.setItem('fruit_roller_highscore', this.highScore.toString());
      this.updateHighScoreDisplay();
    }

    // Update highest level reached (for Toxic Ooze unlock)
    const finalLevel = Math.min(10, Math.max(1, Math.floor(this.distance / (this.finishLineZ / 10)) + 1));
    if (finalLevel > this.highestLevel) {
      this.highestLevel = finalLevel;
      localStorage.setItem('fr_highest_level', this.highestLevel.toString());
    }

    this.checkAchievements();
    this.refreshSkinGrid();

    // Show Victory Screen UI
    if (this.dom.vicScore) this.dom.vicScore.textContent = Math.round(this.score);
    if (this.dom.vicHighScore) this.dom.vicHighScore.textContent = this.highScore;

    const starInfo = this.calculateStarRating();
    
    // Set star icons
    const vicStarEls = ['vic-star1', 'vic-star2', 'vic-star3'];
    const vicStarFlags = [starInfo.star1, starInfo.star2, starInfo.star3];
    for (let i = 0; i < 3; i++) {
      const el = document.getElementById(vicStarEls[i]);
      if (el) {
        el.classList.toggle('earned', vicStarFlags[i]);
        el.classList.toggle('star-dim', !vicStarFlags[i]);
      }
    }
    
    const vicStarTitle = document.getElementById('vic-star-title');
    if (vicStarTitle) {
      vicStarTitle.textContent = starInfo.title;
      vicStarTitle.style.color = starInfo.color;
    }
    
    const vicStarCount = document.getElementById('vic-star-count');
    if (vicStarCount) vicStarCount.textContent = `${starInfo.stars}/3`;
    
    // Set checklist
    const vicCheck1 = document.getElementById('vic-check1');
    if (vicCheck1) vicCheck1.textContent = starInfo.star1 ? '✅' : '❌';
    const vicCheck2 = document.getElementById('vic-check2');
    if (vicCheck2) vicCheck2.textContent = starInfo.star2 ? '✅' : '❌';
    const vicCheck3 = document.getElementById('vic-check3');
    if (vicCheck3) vicCheck3.textContent = starInfo.star3 ? '✅' : '❌';
    
    // Purity info
    const vicPurity = document.getElementById('vic-purity');
    if (vicPurity) vicPurity.textContent = `${Math.round(starInfo.purity)}%`;
    const vicHealthy = document.getElementById('vic-healthy');
    if (vicHealthy) vicHealthy.textContent = starInfo.healthyItems;
    const vicTotal = document.getElementById('vic-total');
    if (vicTotal) vicTotal.textContent = starInfo.totalItems;
    const vicCombo = document.getElementById('vic-combo');
    if (vicCombo) vicCombo.textContent = starInfo.maxHealthyCombo;
    
    this.saveToLeaderboard(this.score, starInfo);

    if (this.dom.vicVerdict) {
      if (this.health >= 70) {
        this.dom.vicVerdict.className = 'health-verdict healthy';
        this.dom.vicVerdict.textContent = "🏆 PERFECT HEALTH! You crossed the finish line in pristine shape!";
      } else if (this.health >= 35) {
        this.dom.vicVerdict.className = 'health-verdict healthy';
        this.dom.vicVerdict.textContent = "👍 DECENT HABITS! You finished the race, but try to avoid a few more burgers next time!";
      } else {
        this.dom.vicVerdict.className = 'health-verdict unhealthy';
        this.dom.vicVerdict.textContent = "🤢 TOXIC VICTORY! You crossed the line, but you are bloated with junk! Eat healthier next time!";
      }
    }

    if (this.dom.victoryScreen) {
      this.dom.victoryScreen.classList.add('active');
    }
  }

  updateCamera(dt) {
    if (!this.ball) return;
    
    const targetCamX = this.ball.position.x;
    const targetCamY = this.ball.position.y + 2.4;
    const targetCamZ = this.ball.position.z - 6.5;

    if (this.state === 'menu') {
      // Lazy orbit animation on starting screen
      const angle = this.lastTime * 0.25;
      this.camera.position.set(
        Math.sin(angle) * 7.0,
        3.5,
        -5.0
      );
      this.camera.lookAt(0, 0.5, 5);
    } else {
      // Smooth dynamic track camera following behind ball
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, 0.08);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetCamY, 0.08);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetCamZ, 0.08);

      // Screen shake offset
      if (this.shakeIntensity > 0) {
        const sx = (Math.random() - 0.5) * this.shakeIntensity * 0.5;
        const sy = (Math.random() - 0.5) * this.shakeIntensity * 0.5;
        this.camera.position.x += sx;
        this.camera.position.y += sy;
      }
      
      this.camera.lookAt(
        this.ball.position.x,
        this.ball.position.y + 0.4,
        this.ball.position.z + 2.8
      );

      // Follow directional light shadow mapping target
      this.dirLight.position.set(
        this.ball.position.x + 5,
        this.ball.position.y + 12,
        this.ball.position.z - 8
      );
      this.dirLight.target = this.ball;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  // ---- STAR RATING HELPERS ----

  getStarTitle(stars) {
    const titles = {
      3: 'PERFECT RUN!',
      2: 'GREAT JOB!',
      1: 'GOOD EFFORT!',
      0: 'TRY AGAIN!'
    };
    return titles[stars] || 'TRY AGAIN!';
  }

  getStarColor(stars) {
    const colors = {
      3: '#00e676',
      2: '#ffea00',
      1: '#ff9100',
      0: '#ff1744'
    };
    return colors[stars] || '#ff1744';
  }

  calculateStarRating() {
    const healthyItems = this.runFruits + this.runVeggies + this.runWater;
    const totalItems = healthyItems + this.runJunk;
    const purity = totalItems > 0 ? (healthyItems / totalItems) * 100 : 0;

    // Star 1: Completion / Survival — reached halfway or finished
    const star1 = this.distance >= this.finishLineZ * 0.5;

    // Star 2: Nutrition Goals — meet all daily targets in a single run
    const star2 = this.runFruits >= 3 && this.runVeggies >= 3 && this.runWater >= 5;

    // Star 3: Mastery & Skill — 5x healthy combo OR 75%+ purity
    const star3 = this.healthyCombo >= 5 || purity >= 75;

    const stars = (star1 ? 1 : 0) + (star2 ? 1 : 0) + (star3 ? 1 : 0);
    const title = this.getStarTitle(stars);
    const color = this.getStarColor(stars);

    return {
      stars,
      title,
      color,
      purity,
      healthyItems,
      totalItems,
      maxHealthyCombo: this.maxHealthyCombo,
      superModeCount: this.superModeCount,
      star1,
      star2,
      star3
    };
  }

  saveToLeaderboard(score, starInfo) {
    let board = JSON.parse(localStorage.getItem('fr_leaderboard') || '[]');
    const dateStr = new Date().toLocaleDateString();
    const starIcons = '⭐'.repeat(starInfo.stars) + '☆'.repeat(3 - starInfo.stars);
    board.push({
      score: Math.round(score),
      stars: starInfo.stars,
      starIcons: starIcons,
      title: starInfo.title,
      purity: Math.round(starInfo.purity),
      healthyItems: starInfo.healthyItems,
      totalItems: starInfo.totalItems,
      maxHealthyCombo: starInfo.maxHealthyCombo,
      date: dateStr
    });
    // Sort descending by score
    board.sort((a, b) => b.score - a.score);
    board = board.slice(0, 10); // Keep top 10
    localStorage.setItem('fr_leaderboard', JSON.stringify(board));
  }

  showLeaderboard() {
    if (this.state !== 'menu') return; // menu-only: never during gameplay
    document.body.classList.add('in-menu');
    const list = document.getElementById('leaderboard-list');
    const board = JSON.parse(localStorage.getItem('fr_leaderboard') || '[]');
    if (!list) return;

    if (board.length === 0) {
      list.innerHTML = '<div style="text-align:center; padding: 20px; color:var(--text-muted);">No records yet. Play a game!</div>';
    } else {
      list.innerHTML = board.map((entry, idx) => {
        const entryColor = this.getStarColor(entry.stars);
        return `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--parchment-dark); padding:10px 15px; margin-bottom:8px; border-radius:8px; border-left:4px solid ${entryColor}; border: 1px solid var(--parchment-border);">
          <div style="display:flex; gap:15px; align-items:center;">
            <span style="font-size:1.2rem; font-weight:bold; color:var(--text-muted);">#${idx + 1}</span>
            <div>
              <div style="font-weight:bold; font-size:1.1rem; color:var(--text-main);">Score: <span style="color:var(--text-heading)">${entry.score}</span></div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${entry.date}</div>
            </div>
          </div>
          <div style="text-align:right; font-size:0.8rem;">
            <div>Rating <strong style="font-size:1.1rem; color:${entryColor};">${entry.stars} Stars ${entry.starIcons}</strong></div>
            <div style="color:var(--text-muted);">Purity: ${entry.purity}% | Healthy: ${entry.healthyItems}/${entry.totalItems} | Combo: ${entry.maxHealthyCombo}</div>
          </div>
        </div>
        `;
      }).join('');
    }

    this.dom.startScreen.classList.remove('active');
    document.getElementById('leaderboard-screen').classList.add('active');
  }
}

// Initialise on load
const game = new Game();
window.addEventListener('DOMContentLoaded', () => game.init());
export { game };
