class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicEnabled = localStorage.getItem('fr_music_enabled') !== '0';
    this.sfxEnabled = localStorage.getItem('fr_sfx_enabled') !== '0';
    this.volume = parseFloat(localStorage.getItem('fr_volume') || '1');
    this.masterVolume = null;
    
    // Synth scheduler settings
    this.schedulerTimer = null;
    this.currentBeat = 0;
    this.tempo = 110; // BPM
    this.nextNoteTime = 0.0;
    this.scheduleAheadTime = 0.1; // seconds
    this.lookahead = 25.0; // ms
    
    // Dynamic music states
    this.gameState = 'menu'; // 'menu', 'playing', 'super', 'gameover'
    this.health = 50; // 0 - 100
    
    // Scale patterns
    this.scales = {
      healthy: [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440], // A Minor
      super: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C Major (bright)
      unhealthy: [196.00, 207.65, 233.08, 246.94, 277.18, 293.66, 311.13, 349.23] // Dissonant / Locrian
    };
    
    // Music Track Arrangements
    this.tracks = [
      { // Track 0: Chiptune Chill
        name: 'Chiptune Chill',
        bassPattern: [0, 0, 3, 3, 4, 4, 7, 5],
        melodyPattern: [
          [4, -1, 5, 7, -1, 4, 2, 0],
          [7, -1, 6, 5, -1, 7, 9, 7],
          [-1, 2, 4, -1, 5, 4, 2, 0]
        ],
        bassType: 'triangle',
        leadType: 'sine',
        bassOctaveShift: 4,
        delayTime: 0.3,
        delayFeedback: 0.3
      },
      { // Track 1: Fruit Disco
        name: 'Fruit Disco',
        bassPattern: [0, 4, 0, 4, 3, 7, 3, 5],
        melodyPattern: [
          [0, 2, 4, 7, 4, 2, 0, -1],
          [4, 5, 7, -1, 7, 5, 4, 2],
          [7, -1, 5, 4, -1, 2, 4, 7]
        ],
        bassType: 'square',
        leadType: 'triangle',
        bassOctaveShift: 3,
        delayTime: 0.18,
        delayFeedback: 0.2
      },
      { // Track 2: Neon Heavy
        name: 'Neon Heavy',
        bassPattern: [0, 0, 0, 3, 5, 5, 3, 0],
        melodyPattern: [
          [-1, 7, 5, -1, 4, -1, 2, 0],
          [5, -1, -1, 7, -1, 5, 4, -1],
          [0, 2, -1, 4, 5, -1, 7, 5]
        ],
        bassType: 'sawtooth',
        leadType: 'sawtooth',
        bassOctaveShift: 4,
        delayTime: 0.4,
        delayFeedback: 0.45
      }
    ];
    this.currentTrackIndex = 0;
    this.currentMelodyRow = 0;
  }

  init() {
    if (this.ctx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    
    // Create master volume node
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.setValueAtTime(this.muted ? 0 : this.volume * 0.15, this.ctx.currentTime);
    
    // Create a simple delay node for a spacey echo effect
    this.delayNode = this.ctx.createDelay(1.0);
    this.delayNode.delayTime.setValueAtTime(0.3, this.ctx.currentTime);
    
    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.setValueAtTime(0.3, this.ctx.currentTime);
    
    // Connect delay circuit
    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayNode.connect(this.masterVolume);
    
    // Connect master to destination
    this.masterVolume.connect(this.ctx.destination);
    
    // Start music scheduler
    this.nextNoteTime = this.ctx.currentTime;
    this.scheduler();
  }

  setGameState(state) {
    this.gameState = state;
    if (state === 'playing') {
      this.tempo = 110;
    } else if (state === 'super') {
      this.tempo = 145;
    } else if (state === 'gameover') {
      this.tempo = 60;
    }
  }

  setHealth(health) {
    this.health = health;
    if (this.gameState === 'playing') {
      // Dynamically alter tempo and master detune based on healthiness
      if (health > 70) {
        this.tempo = 110 + (health - 70) * 0.8; // Speed up slightly when super healthy
      } else if (health < 30) {
        this.tempo = 110 - (30 - health) * 1.5; // Slow down drastically when sick
      } else {
        this.tempo = 110;
      }
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.ctx) {
      const targetGain = this.muted ? 0 : this.volume * 0.15;
      this.masterVolume.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }
    return this.muted;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    localStorage.setItem('fr_volume', this.volume.toString());
    if (this.ctx && this.masterVolume) {
      const targetGain = this.muted ? 0 : this.volume * 0.15;
      this.masterVolume.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }
    return this.volume;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('fr_music_enabled', this.musicEnabled ? '1' : '0');
    if (!this.musicEnabled && this.schedulerTimer) {
      // Silence any playing notes
    }
    return this.musicEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem('fr_sfx_enabled', this.sfxEnabled ? '1' : '0');
    return this.sfxEnabled;
  }

  suspend() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    // Update delay settings for new track
    if (this.delayNode && this.ctx) {
      const track = this.tracks[this.currentTrackIndex];
      this.delayNode.delayTime.linearRampToValueAtTime(track.delayTime, this.ctx.currentTime + 0.1);
      this.delayFeedback.gain.linearRampToValueAtTime(track.delayFeedback, this.ctx.currentTime + 0.1);
    }
    return this.tracks[this.currentTrackIndex].name;
  }

  getTrackName() {
    return this.tracks[this.currentTrackIndex].name;
  }

  // Synthesize a short white noise buffer for impact sounds
  createNoiseBuffer() {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 0.2; // 0.2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Play sound effects
  playCollect(fruitType) {
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    this.init();
    
    // Ensure context is running
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    // Connect to echo delay for premium feel
    gain.connect(this.delayNode);

    let baseFreq = 440;
    let type = 'sine';
    
    // Custom note and sound shape per fruit
    switch (fruitType) {
      case 'strawberry': // Cute high pop
        baseFreq = 880;
        type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.08);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.15);
        break;
        
      case 'orange': // Warm bell
        baseFreq = 554.37; // C#5
        type = 'sine';
        osc.type = type;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.linearRampToValueAtTime(659.25, t + 0.15); // Glide to E5
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.32);
        break;
        
      case 'banana': // Playful slide
        baseFreq = 392; // G4
        type = 'triangle';
        osc.type = type;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(784, t + 0.2); // Octave jump
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.27);
        break;
        
      case 'kiwi': // Multi-note click
        baseFreq = 659.25; // E5
        type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, t);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.setValueAtTime(0.4, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.16);
        
        // Second note
        setTimeout(() => {
          if (this.muted || !this.ctx) return;
          const osc2 = this.ctx.createOscillator();
          const gain2 = this.ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(this.masterVolume);
          osc2.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
          gain2.gain.setValueAtTime(0.3, this.ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
          osc2.start(this.ctx.currentTime);
          osc2.stop(this.ctx.currentTime + 0.12);
        }, 50);
        break;
        
      case 'blueberry': // Tiny synth ping
        baseFreq = 1046.50; // C6
        type = 'sine';
        osc.type = type;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(523.25, t + 0.1); // Slide down
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.18);
        break;

      case 'water': // Refreshing bubbling splash
        baseFreq = 1318.51; // E6
        type = 'triangle';
        osc.type = type;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(1975.53, t + 0.12); // Glide to B6
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.2);

        // Little second bubble note
        setTimeout(() => {
          if (this.muted || !this.ctx) return;
          const osc2 = this.ctx.createOscillator();
          const gain2 = this.ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(this.masterVolume);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(1567.98, this.ctx.currentTime); // G6
          osc2.frequency.exponentialRampToValueAtTime(2093, this.ctx.currentTime + 0.1); // C7
          gain2.gain.setValueAtTime(0.25, this.ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
          osc2.start(this.ctx.currentTime);
          osc2.stop(this.ctx.currentTime + 0.14);
        }, 60);
        break;

      default: // Cheerful generic pop for other collectibles
        baseFreq = 660;
        type = 'triangle';
        osc.type = type;
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(880, t + 0.1);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
    }
  }

  playHit() {
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    this.init();
    
    const t = this.ctx.currentTime;
    
    // Low frequency detuned saw buzz
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    
    osc1.frequency.setValueAtTime(150, t);
    osc1.frequency.exponentialRampToValueAtTime(60, t + 0.25);
    osc2.frequency.setValueAtTime(147, t);
    osc2.frequency.exponentialRampToValueAtTime(58, t + 0.25);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.linearRampToValueAtTime(100, t + 0.25);
    
    gainNode.gain.setValueAtTime(0.7, t);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterVolume);
    
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);

    // Play a noise burst for the squelch
    const noiseBuffer = this.createNoiseBuffer();
    if (noiseBuffer) {
      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(300, t);
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
      
      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterVolume);
      
      noiseNode.start(t);
      noiseNode.stop(t + 0.2);
    }
  }

  playSuperMode() {
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    this.init();
    
    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Arpeggio C major
    
    notes.forEach((freq, idx) => {
      const delay = idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + delay);
      
      gain.gain.setValueAtTime(0.3, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.2);
      
      osc.connect(gain);
      gain.connect(this.masterVolume);
      gain.connect(this.delayNode);
      
      osc.start(t + delay);
      osc.stop(t + delay + 0.22);
    });
  }

  playGameOver() {
    if (!this.ctx || this.muted || !this.sfxEnabled) return;
    
    const t = this.ctx.currentTime;
    
    // Sad falling slide
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(55, t + 1.2);
    
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 1.2);
    
    // Connect lowpass filter to make it rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.linearRampToValueAtTime(100, t + 1.2);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start(t);
    osc.stop(t + 1.3);
  }

  // Synth Scheduler loop
  scheduler() {
    if (!this.ctx || !this.musicEnabled) return;
    
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime);
      this.nextStep();
    }
    
    this.schedulerTimer = setTimeout(() => this.scheduler(), this.lookahead);
  }

  nextStep() {
    // 8-step sequencer loop
    const secondsPerBeat = 60.0 / this.tempo / 2; // Eighth notes
    this.nextNoteTime += secondsPerBeat;
    
    this.currentBeat = (this.currentBeat + 1) % 8;
    if (this.currentBeat === 0) {
      // Pick next random melody row every measure
      const track = this.tracks[this.currentTrackIndex];
      this.currentMelodyRow = Math.floor(Math.random() * track.melodyPattern.length);
    }
  }

  scheduleNote(beat, time) {
    if (this.gameState === 'menu' || this.gameState === 'gameover') {
      // Play a simple slow ambient background chord
      if (beat === 0) {
        this.playChord(time, [110, 165, 220], 2.0, 'sine'); // A minor 5th chord
      }
      return;
    }

    // Determine scale based on health
    let scale = this.scales.healthy;
    let waveType = 'triangle';
    let filterCutoff = 800;
    
    if (this.gameState === 'super') {
      scale = this.scales.super;
      waveType = 'sawtooth';
      filterCutoff = 1800; // Bright filter
    } else if (this.health < 30) {
      scale = this.scales.unhealthy;
      waveType = 'sawtooth';
      filterCutoff = 350; // Sluggish, muddy sound
    }

    // 1. Play Bass Note (every beat, or syncopated)
    if (beat % 2 === 0) {
      const track = this.tracks[this.currentTrackIndex];
      const bassIndex = track.bassPattern[Math.floor(beat / 2)];
      const bassFreq = scale[bassIndex % scale.length] / track.bassOctaveShift;
      
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFilter = this.ctx.createBiquadFilter();
      
      bassOsc.type = track.bassType;
      bassOsc.frequency.setValueAtTime(bassFreq, time);
      
      // Detune bass slightly if unhealthy
      if (this.health < 30) {
        bassOsc.detune.setValueAtTime(Math.sin(time * 10) * 15, time);
      }
      
      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(this.health < 30 ? 200 : 400, time);
      
      bassGain.gain.setValueAtTime(0.4, time);
      bassGain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      
      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.masterVolume);
      
      bassOsc.start(time);
      bassOsc.stop(time + 0.35);
    }

    // 2. Play Lead Melody (with delay)
    const track = this.tracks[this.currentTrackIndex];
    const melodyIndex = track.melodyPattern[this.currentMelodyRow][beat];
    if (melodyIndex !== -1) {
      const melodyFreq = scale[melodyIndex % scale.length];
      
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      const leadFilter = this.ctx.createBiquadFilter();
      
      leadOsc.type = waveType;
      leadOsc.frequency.setValueAtTime(melodyFreq, time);
      
      // Pitch wobble (vibrato) if super mode or unhealthy
      if (this.gameState === 'super') {
        leadOsc.frequency.linearRampToValueAtTime(melodyFreq * 1.01, time + 0.1);
        leadOsc.frequency.linearRampToValueAtTime(melodyFreq * 0.99, time + 0.2);
      } else if (this.health < 30) {
        // Slow detuning wobble
        leadOsc.frequency.setValueAtTime(melodyFreq + Math.sin(time * 5) * 8, time);
      }
      
      leadFilter.type = 'lowpass';
      leadFilter.frequency.setValueAtTime(filterCutoff, time);
      
      leadGain.gain.setValueAtTime(0.18, time);
      leadGain.gain.exponentialRampToValueAtTime(0.005, time + 0.22);
      
      leadOsc.connect(leadFilter);
      leadFilter.connect(leadGain);
      leadGain.connect(this.masterVolume);
      
      // Connect melody to delay for retro ambiance
      leadGain.connect(this.delayNode);
      
      leadOsc.start(time);
      leadOsc.stop(time + 0.25);
    }

    // 3. Play a soft Hi-Hat click on off-beats for rhythm
    if (beat % 2 === 1 && this.gameState === 'super') {
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      
      hatOsc.type = 'triangle';
      hatOsc.frequency.setValueAtTime(8000, time);
      
      hatGain.gain.setValueAtTime(0.015, time);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
      
      hatOsc.connect(hatGain);
      hatGain.connect(this.masterVolume);
      
      hatOsc.start(time);
      hatOsc.stop(time + 0.06);
    }
  }

  playChord(time, freqs, duration, type) {
    if (!this.ctx || this.muted) return;
    
    freqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, time);
      
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.linearRampToValueAtTime(0.001, time + duration);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterVolume);
      
      osc.start(time);
      osc.stop(time + duration + 0.1);
    });
  }
}

// Export single instance
// ============================================
// SIMPLE MENU AUDIO — Native Web Audio Synthesizer (Guaranteed Playback)
// ============================================
class WebMenuAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.masterGain = null;
    // Upbeat 8-bit style melody: C4-E4-G4-C5-E5-G5-C5 (arpeggiated major chord)
    this.notes = [
      261.63, 329.63, 392.00, 523.25, // C4-E4-G4-C5
      392.00, 523.25, 659.25, 523.25, // G4-C5-E5-C5
      392.00, 329.63, 261.63, 329.63  // G4-E4-C4-E4
    ];
    this.step = 0;
    this.intervalMs = 280; // Slightly faster for more energy
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime); // Boosted master volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMenuBGM() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.step = 0;

    const playNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      
      // Dual oscillator: Sine (warmth) + Triangle (bite) for 8-bit richness
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc2.detune.value = 2; // Slight detune for chorus effect
      
      const freq = this.notes[this.step % this.notes.length];
      osc1.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Boosted note gain for louder, punchier sound
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);
      
      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.4);
      osc2.stop(this.ctx.currentTime + 0.4);
      
      this.step++;
      this.timer = setTimeout(playNote, this.intervalMs);
    };

    playNote();
  }

  stopBGM() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setVolume(v) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, v)) * 0.5, this.ctx.currentTime);
    }
  }

  toggleMute() {
    if (this.masterGain && this.ctx) {
      this.muted = !this.muted;
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.5, this.ctx.currentTime);
      return this.muted;
    }
    return false;
  }
}

export const menuAudio = new WebMenuAudio();
window.menuAudio = menuAudio; // Global access for menu toggle button

export const audio = new AudioEngine();
window.gameAudio = audio; // Expose globally for dev/testing console access
