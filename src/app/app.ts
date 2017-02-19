import AudioHelper from './audio';


export default class App {
  private sound: any;

  private WIDTH: number;
  private HEIGHT: number;

  constructor(public audio: AudioHelper) {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
  }

  async bootstrap() {
    this.sound = await this.audio.loadSound('/assets/music/turbo.mp3');

    const frequencyData = new Uint8Array(this.audio.analyser.frequencyBinCount);

    const canvas = document.querySelector('canvas');
    const drawContext = canvas.getContext('2d');
    drawContext.canvas.width = this.WIDTH;
    drawContext.canvas.height = this.HEIGHT;

    const renderFrame = () => {
      drawContext.clearRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(renderFrame);
      // update data in frequencyData
      this.audio.analyser.getByteFrequencyData(frequencyData);
      // render frame based on values in frequencyData

      for (let i = 0; i < this.audio.analyser.frequencyBinCount; i++) {
        let value = frequencyData[i];
        let percent = value / 256;
        let height = this.HEIGHT * percent;
        let offset = this.HEIGHT - height - 1;
        let barWidth = this.WIDTH/this.audio.analyser.frequencyBinCount;
        let hue = i/this.audio.analyser.frequencyBinCount * 360;

        drawContext.fillStyle = `hsl(${hue}, 100%, 50%)`;
        drawContext.fillRect(i * barWidth, offset, barWidth, height);
      }
    };


    this.sound.start(0.9, 150);
    renderFrame();
  }
}
