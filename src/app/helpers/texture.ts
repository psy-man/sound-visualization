import * as THREE from 'three';


export default class TextureHelper {
  private loader: THREE.TextureLoader = new THREE.TextureLoader();

  constructor() {
    this.loader.crossOrigin = 'true';
  }

  async load(urlList) {
    const textures = {};

    const promises = urlList.map(texture => this.loadTextureAsync(texture));
    const response: any = await Promise.all(promises);

    for (const {id, texture} of response) {
      textures[id] = texture;
    }

    return textures;
  }

  private loadTextureAsync(item) {
    return new Promise(resolve => {
      const onLoad = (texture) => resolve(Object.assign(item, {texture}));

      this.loader.load(item.url, onLoad);
    });
  }
}
