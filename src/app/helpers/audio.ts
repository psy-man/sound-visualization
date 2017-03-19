export default class AudioHelper {
  public context: AudioContext = new AudioContext();
  public analyser: any;
  public gainNode: any;

  constructor() {
    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.context.destination);

    this.analyser.smoothingTimeConstant = 0.8;
    this.analyser.fftSize = 64;
    this.analyser.minDecibels = -140;
    this.analyser.maxDecibels = 0;

    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
  }

  public async loadSound(url: string) {
    return await fetch(url)
      .then(res => res.arrayBuffer())
      .then(async buffer => await this.getBufferSource(buffer))
      .catch(error => console.error(error));
  }

  private async getBufferSource(sound: ArrayBuffer) {
    const source = this.context.createBufferSource();

    source.connect(this.analyser);
    source.connect(this.gainNode);

    source.buffer = await this.context.decodeAudioData(sound);
    source.loop = true;

    return source;
  }
}
