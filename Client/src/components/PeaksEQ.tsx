export type FrequencyBand = "low" | "mid" | "high";

export class PeaksEQ {
  private context: AudioContext;
  private eqNodes: { [key in FrequencyBand]: BiquadFilterNode };
  private gainNode: GainNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.eqNodes = this.createEQ();
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0.5; // Set volume to 50%
  }

  private createEQ(): { [key in FrequencyBand]: BiquadFilterNode } {
    const createFilter = (
      type: BiquadFilterType,
      frequency: number,
      gain = 0
    ) => {
      const filter = this.context.createBiquadFilter();
      filter.type = type;
      filter.frequency.value = frequency;
      filter.gain.value = gain;
      return filter;
    };

    return {
      low: createFilter("lowshelf", 320),
      mid: createFilter("peaking", 1000),
      high: createFilter("highshelf", 3200),
    };
  }

  public connectSource(source: AudioNode): void {
    source.connect(this.gainNode);
  }

  public connectDestination(destination: AudioNode): void {
    this.gainNode
      .connect(this.eqNodes.low)
      .connect(this.eqNodes.mid)
      .connect(this.eqNodes.high)
      .connect(destination);
  }

  public bypass(destination: AudioNode): void {
    this.gainNode.connect(destination);
  }

  public disconnect(): void {
    this.gainNode.disconnect();
    Object.values(this.eqNodes).forEach((node) => node.disconnect());
  }

  public resetEQ(): void {
    Object.values(this.eqNodes).forEach((node) => {
      node.gain.value = 0;
    });
  }

  public boostBand(band: FrequencyBand, gain: number): void {
    this.eqNodes[band].gain.value = gain;
  }

  public getRandomBand(): FrequencyBand {
    const bands: FrequencyBand[] = ["low", "mid", "high"];
    return bands[Math.floor(Math.random() * bands.length)];
  }
}
