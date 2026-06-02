/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Custom high-end Web Audio Ambient Synthesizer
// Synthesizes realistic, relaxing soundscapes natively in the browser!
// Zero network downloads, infinite loops with zero loading delay.

let audioCtx: AudioContext | null = null;
let rainNode: AudioNode | null = null;
let windNode: AudioNode | null = null;
let birdsInterval: any = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Helper to create white/brown noise buffer
function createNoiseBuffer(ctx: AudioContext, type: "white" | "brown") {
  const bufferSize = ctx.sampleRate * 2; // 2 seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    if (type === "brown") {
      // Brown noise formula (filtered accumulation)
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Compensate volume level
    } else {
      data[i] = white * 0.5;
    }
  }
  return buffer;
}

export function startAmbientSound(track: "rain" | "wind" | "sunny") {
  try {
    const ctx = getAudioContext();
    stopAmbientSound(); // clear any previous

    if (track === "rain") {
      // Rain Synthesizer: Brown noise + lowpass filter + slight high frequency crackles represent drops
      const source = ctx.createBufferSource();
      source.buffer = createNoiseBuffer(ctx, "brown");
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(450, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime); // Gentle rain volume

      source.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);
      
      source.start(0);
      rainNode = source;
    } 
    else if (track === "wind") {
      // Wind Synthesizer: Filtered noise modulated by LFO to simulate rising and falling gust speeds
      const source = ctx.createBufferSource();
      source.buffer = createNoiseBuffer(ctx, "brown");
      source.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.Q.setValueAtTime(2.0, ctx.currentTime);
      bandpass.frequency.setValueAtTime(300, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      // Low Frequency Oscillator to modulate bandpass frequency
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // Ultra slow sweeps (0.08Hz)
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(150, ctx.currentTime); // sweep range +-150Hz

      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency);
      
      source.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(0);
      source.start(0);

      windNode = source;
    } 
    else if (track === "sunny") {
      // Sunny Day Ambient: Soft, sweeping warm wind (0.02 vol) + procedural bird chirps every 4-8 seconds
      const source = ctx.createBufferSource();
      source.buffer = createNoiseBuffer(ctx, "brown");
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(250, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, ctx.currentTime);

      source.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
      windNode = source;

      // Start procedural bird synth loop
      const playChirp = () => {
        const chirper = ctx.createOscillator();
        chirper.type = "sine";
        
        // Frequency sweep for a beautiful bird chirp
        const startFreq = 2000 + Math.random() * 1000;
        const endFreq = startFreq + 800;
        
        chirper.frequency.setValueAtTime(startFreq, ctx.currentTime);
        chirper.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.12);

        const chirpGain = ctx.createGain();
        chirpGain.gain.setValueAtTime(0.015, ctx.currentTime);
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

        chirper.connect(chirpGain);
        chirpGain.connect(ctx.destination);
        
        chirper.start(0);
        chirper.stop(ctx.currentTime + 0.16);
      };

      // Play 2-3 chirps randomly every few seconds
      const triggerBirds = () => {
        playChirp();
        setTimeout(playChirp, 180);
        if (Math.random() > 0.5) {
          setTimeout(playChirp, 360);
        }
      };

      birdsInterval = setInterval(triggerBirds, 5000);
    }
  } catch (err) {
    console.error("Failed to start synthesizer audio:", err);
  }
}

export function stopAmbientSound() {
  try {
    if (rainNode) {
      (rainNode as any).stop();
      rainNode = null;
    }
    if (windNode) {
      (windNode as any).stop();
      windNode = null;
    }
    if (birdsInterval) {
      clearInterval(birdsInterval);
      birdsInterval = null;
    }
  } catch (e) {
    // Ignore stop crashes
  }
}
