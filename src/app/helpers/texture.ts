import * as THREE from 'three';


export default class TextureHelper {
  private loader: THREE.TextureLoader = new THREE.TextureLoader();

  constructor() {
    this.loader.crossOrigin = 'true';
  }

  load(urlList) {
    return Promise.all(
      urlList.map(async texture => await this.loadTextureAsync(texture))
    )
  }

  private loadTextureAsync(item) {
    return new Promise(resolve => {
      const onLoad = (texture) => resolve(Object.assign(item, {texture}));

      this.loader.load(item.url, onLoad);
    });
  }
}
