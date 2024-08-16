interface AudioContextConstructor {
  new (): AudioContext;
}

class PeaksEQ {
  private audioContext: AudioContext;
  private source: AudioBufferSourceNode | null = null;
  private filters: BiquadFilterNode[] = [];
  public level: number = 1;

  constructor() {
    const AudioContextClass: AudioContextConstructor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: AudioContextConstructor })
        .webkitAudioContext;
    this.audioContext = new AudioContextClass();
  }

  public setLevel(level: number): void {
    this.level = level;
    this.updateFilters();
  }

  private updateFilters(): void {
    // Remove existing filters
    if (this.source) {
      this.source.disconnect();
    }
    this.filters.forEach((filter) => filter.disconnect());
    this.filters = [];

    // Create new filters based on the current level
    const numBands = this.level + 1; // Level 1 has 2 bands, Level 2 has 3 bands, etc.
    const minFreq = 20;
    const maxFreq = 20000;

    for (let i = 0; i < numBands; i++) {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = "peaking";

      // Calculate frequency for this band
      const freq = Math.exp(
        Math.log(minFreq) +
          (Math.log(maxFreq) - Math.log(minFreq)) * (i / (numBands - 1))
      );

      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      this.filters.push(filter);
    }

    // Connect filters
    for (let i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }

    if (this.source) {
      this.source.connect(this.filters[0]);
    }
    this.filters[this.filters.length - 1].connect(
      this.audioContext.destination
    );
  }

  public async loadAudio(url: string): Promise<void> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    if (this.source) {
      this.source.stop();
      this.source.disconnect();
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = audioBuffer;
    this.source.connect(this.filters[0]);
  }

  public play(): void {
    if (this.source) {
      this.source.start();
    }
  }

  public stop(): void {
    if (this.source) {
      this.source.stop();
    }
  }

  public adjustEQ(index: number, gain: number): void {
    if (index >= 0 && index < this.filters.length) {
      this.filters[index].gain.setValueAtTime(
        gain,
        this.audioContext.currentTime
      );
    }
  }

  public getFrequencies(): number[] {
    return this.filters.map((filter) => Math.round(filter.frequency.value));
  }
}

export default PeaksEQ;

// Usage
const eq = new PeaksEQ();

// Set initial level
eq.setLevel(1); // Start with 2 bands

// Load audio
eq.loadAudio("path/to/your/audio/file.mp3")
  .then(() => {
    console.log("Audio loaded");
    // eq.play(); // Uncomment to auto-play
  })
  .catch((error) => console.error("Error loading audio:", error));

// Adjust EQ (example)
eq.adjustEQ(0, 3); // Boost first band by 3 dB
eq.adjustEQ(1, -2); // Cut second band by 2 dB

// Get frequencies for UI
console.log(eq.getFrequencies());

// Play and stop
document
  .getElementById("playButton")
  ?.addEventListener("click", () => eq.play());
document
  .getElementById("stopButton")
  ?.addEventListener("click", () => eq.stop());

// Level up (example)
document.getElementById("levelUpButton")?.addEventListener("click", () => {
  eq.setLevel(eq.level + 1);
  console.log(
    `Level increased to ${eq.level}, new frequencies:`,
    eq.getFrequencies()
  );
});
