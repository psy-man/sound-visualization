import App from './app/app';
import AudioHelper from './app/audio';

const audioHelper = new AudioHelper;
const app = new App(audioHelper);

app.bootstrap().then(() => console.log('App started'));
