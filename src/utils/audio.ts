/**
 * Distraction-free ambient noise synthesizer using Web Audio API
 * Generates organic rain, pink/white noise, ocean waves, and breeze without any external media dependencies.
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private isRunning: boolean = false;
  private currentType: string = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public play(type: 'rain' | 'whitenoise' | 'waves' | 'breeze', volume: number = 0.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();

    this.setVolume(volume);
    this.currentType = type;
    this.isRunning = true;

    // Buffer of white noise (5 seconds loop)
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain' || type === 'breeze') {
        // Pink-ish noise
        const b0 = 0.99 * lastOut + white * 0.05;
        output[i] = b0;
        lastOut = b0;
      } else if (type === 'waves') {
        // Brown noise
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        output[i] = lastOut * 3.5;
      } else {
        // Pure soft white noise
        output[i] = white * 0.2;
      }
    }

    const whiteNoiseSource = this.ctx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    // Filter shaping
    const filter = this.ctx.createBiquadFilter();

    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      whiteNoiseSource.connect(filter);
      filter.connect(this.masterGain);
    } else if (type === 'breeze') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Slow LFO for gentle wind swell
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

      lfo.connect(filter.frequency);
      lfo.start();
      this.lfoNode = lfo;

      whiteNoiseSource.connect(filter);
      filter.connect(this.masterGain);
    } else if (type === 'waves') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);

      // Low frequency wave modulation (swell every 8 seconds)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(450, this.ctx.currentTime);

      lfo.connect(filter.frequency);
      lfo.start();
      this.lfoNode = lfo;

      whiteNoiseSource.connect(filter);
      filter.connect(this.masterGain);
    } else {
      // White noise / focus hum
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, this.ctx.currentTime);

      whiteNoiseSource.connect(filter);
      filter.connect(this.masterGain);
    }

    whiteNoiseSource.start();
    this.noiseNode = whiteNoiseSource;
    this.filterNode = filter;
  }

  public stop() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioScheduledSourceNode).stop();
      } catch {
        // ignore already stopped
      }
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    if (this.lfoNode) {
      try {
        this.lfoNode.stop();
      } catch {
        // ignore
      }
      this.lfoNode.disconnect();
      this.lfoNode = null;
    }
    if (this.filterNode) {
      this.filterNode.disconnect();
      this.filterNode = null;
    }
    this.isRunning = false;
    this.currentType = 'none';
  }

  public getStatus() {
    return {
      isPlaying: this.isRunning,
      type: this.currentType,
    };
  }
}

export const ambientSound = new AmbientSoundEngine();
