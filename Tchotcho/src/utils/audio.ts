// نظام صوت بسيط مبني بالكامل على Web Audio API - بدون أي ملفات صوتية خارجية

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private musicStep = 0;
  private musicOn = true;
  private sfxOn = true;
  private started = false;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new Ctx();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.18;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.35;
      this.sfxGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  init() {
    // يجب استدعاؤها بعد أول تفاعل من المستخدم (مطلب المتصفحات)
    const ctx = this.getCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    this.started = true;
  }

  setMusicEnabled(on: boolean) {
    this.musicOn = on;
    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(on ? 0.18 : 0, this.getCtx().currentTime, 0.05);
    }
    if (on) this.startMusic();
    else this.stopMusic();
  }

  setSfxEnabled(on: boolean) {
    this.sfxOn = on;
  }

  // --- أصوات اللعبة ---

  playFlap() {
    if (!this.sfxOn || !this.started) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + 0.08);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playScore() {
    if (!this.sfxOn || !this.started) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const notes = [880, 1108];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);
      gain.gain.setValueAtTime(0.0001, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.28, t + i * 0.07 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.07 + 0.18);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.2);
    });
  }

  playHit() {
    if (!this.sfxOn || !this.started) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;

    // ضربة - نويز قصير + نغمة هابطة
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    noise.connect(noiseGain);
    noiseGain.connect(this.sfxGain!);
    noise.start(t);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.3);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  playFall() {
    if (!this.sfxOn || !this.started) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.6);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  playClick() {
    if (!this.sfxOn || !this.started) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(560, t);
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  playSwoosh() {
    if (!this.sfxOn || !this.started) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(2000, t + 0.3);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain!);
    noise.start(t);
  }

  playNewRecord() {
    if (!this.sfxOn || !this.started) return;
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + i * 0.1);
      gain.gain.setValueAtTime(0.0001, t + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.25, t + i * 0.1 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.27);
    });
  }

  // --- موسيقى خلفية بسيطة (لوب لحن قصير) ---

  private musicPattern = [
    659.25, 0, 783.99, 0, 880, 783.99, 659.25, 0,
    587.33, 0, 659.25, 0, 783.99, 0, 0, 0,
    523.25, 0, 659.25, 0, 783.99, 698.46, 659.25, 0,
    587.33, 0, 523.25, 0, 440, 0, 0, 0,
  ];

  private scheduleMusicStep() {
    if (!this.musicOn || !this.ctx) return;
    const ctx = this.ctx;
    const freq = this.musicPattern[this.musicStep % this.musicPattern.length];
    const t = ctx.currentTime;

    if (freq > 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(gain);
      gain.connect(this.musicGain!);
      osc.start(t);
      osc.stop(t + 0.18);
    }

    this.musicStep++;
    this.musicTimer = window.setTimeout(() => this.scheduleMusicStep(), 180);
  }

  startMusic() {
    if (this.musicTimer !== null) return;
    if (!this.musicOn || !this.started) return;
    this.getCtx();
    this.scheduleMusicStep();
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const audioEngine = new AudioEngine();
