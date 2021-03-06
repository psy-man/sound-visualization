import './index.scss';
import App from './app/app';

import AudioHelper from './app/helpers/audio';
import TextureHelper from './app/helpers/texture';


const audioHelper = new AudioHelper;
const textureHelper = new TextureHelper;

const app = new App(audioHelper, textureHelper);

app.preload().then(([sound, textures]) => {
  document.getElementById('loading').remove();

  app.bootstrap(sound, textures)
});


