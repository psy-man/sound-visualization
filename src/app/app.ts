import * as THREE from 'three';
import AudioHelper from './helpers/audio';

import Earth from './objects/earth';
import Atmosphere from './objects/atmosphere';
import TextureHelper from './helpers/texture';
import Galaxy from './objects/galaxy';
import Ring from './objects/ring';

import {Point} from './interfaces/point';


export default class App {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  private objects: any = {};

  private earth: THREE.Mesh;

  private frequencyData: Uint8Array;

  private WIDTH: number;
  private HEIGHT: number;

  private mouse: Point = { x: 0, y: 0 };
  private mouseOnDown: Point = { x: 0, y: 0 };
  private targetOnDown: Point  = { x: 0, y: 0 };
  private target: Point = { x: Math.PI * 3/2, y: Math.PI / 6.0 };
  private rotation: Point = { x: 0, y: 0 };

  private PI_HALF: number = Math.PI / 2;

  private distance: number = 1000;
  private distanceTarget: number = 1000;

  private direction: number = 1;

  constructor(public audio: AudioHelper, public textures: TextureHelper) {
    this.updateScreenResolution();

    this.frequencyData = new Uint8Array(audio.analyser.frequencyBinCount);
  }

  preload() {
    const promises: Promise<any>[] = [
      this.audio.loadSound('assets/music/simatics.mp3'),
      this.textures.load([
        {id: 'earth', url: 'assets/images/world.jpg'},
        {id: 'galaxy', url: 'assets/images/starfield.png'}
      ])
    ];

    return Promise.all(promises);
  }

  bootstrap(sound, textures) {
    this.createScene();
    this.initEvents();

    const earth = new Earth(textures.earth);
    const atmosphere = new Atmosphere(earth.getGeometry());
    const galaxy = new Galaxy(textures.galaxy);

    this.addObject('earth', earth);
    this.addObject('atmosphere', atmosphere);
    this.addObject('galaxy', galaxy);

    for (let i = 0; i < this.audio.analyser.frequencyBinCount; i++) {
      this.addObject(`ring-${i}`, new Ring(i, this.frequencyData));
    }

    this.render();

    sound.start(0, 0)
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    Object.values(this.objects).forEach(object => object.update());

    this.rotation.x += (this.target.x - this.rotation.x) * 0.15 + this.frequencyData[this.frequencyData.length - 1] / 1000;


    if (this.rotation.y > 0.7) {
      this.direction = -1;
    }

    this.rotation.y += (this.target.y - this.rotation.y) * 0.15 + this.frequencyData[this.frequencyData.length - this.frequencyData.length / 2] / 1500 * this.direction;

    this.distance += (this.distanceTarget - this.distance) * 0.3;

    this.camera.position.x = this.distance * Math.sin(this.rotation.x) * Math.cos(this.rotation.y);
    this.camera.position.y = this.distance * Math.sin(this.rotation.y);
    this.camera.position.z = this.distance * Math.cos(this.rotation.x) * Math.cos(this.rotation.y);

    this.camera.lookAt(this.objects.earth.getPosition());

    this.audio.analyser.getByteFrequencyData(this.frequencyData);

    this.renderer.render(this.scene, this.camera);
  }

  addObject(id, mesh) {
    this.objects[id] = mesh;
    this.scene.add(mesh.getMesh());
  }

  private createScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, this.WIDTH / this.HEIGHT, 1, 10000);
    this.camera.position.z = this.distance;

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

    document.body.appendChild(this.renderer.domElement);
  }

  private zoom(delta) {
    this.distanceTarget -= delta;

    this.distanceTarget = this.distanceTarget > 1000 ? 1000 : this.distanceTarget;
    this.distanceTarget = this.distanceTarget < 350 ? 350 : this.distanceTarget;
  }

  private initEvents() {
    document.body.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    document.body.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);

    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }

  private onMouseDown(event) {
    event.preventDefault();

    const onMouseMove = (event) => {
      this.mouse.x = -event.clientX;
      this.mouse.y = event.clientY;

      const zoomDamp = this.distance / 1000;

      this.target.x = this.targetOnDown.x + (this.mouse.x - this.mouseOnDown.x) * 0.005 * zoomDamp;
      this.target.y = this.targetOnDown.y + (this.mouse.y - this.mouseOnDown.y) * 0.005 * zoomDamp;

      this.target.y = this.target.y > this.PI_HALF ? this.PI_HALF : this.target.y;
      this.target.y = this.target.y < - this.PI_HALF ? - this.PI_HALF : this.target.y;
    };

    const removeEvents = () => {
      document.body.removeEventListener('mousemove', onMouseMove, false);
      document.body.removeEventListener('mouseup', removeEvents, false);
      document.body.removeEventListener('mouseout', removeEvents, false);
      document.body.style.cursor = 'auto';
    };

    document.body.addEventListener('mousemove', onMouseMove, false);
    document.body.addEventListener('mouseup', removeEvents, false);
    document.body.addEventListener('mouseout', removeEvents, false);

    this.mouseOnDown.x = -event.clientX;
    this.mouseOnDown.y = event.clientY;

    this.targetOnDown.x = this.target.x;
    this.targetOnDown.y = this.target.y;

    document.body.style.cursor = 'move';
  }

  private onMouseWheel(event) {
    event.preventDefault();
    this.zoom(event.wheelDeltaY * 0.3);
    return false;
  }

  private updateScreenResolution() {
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
  }

  private onWindowResize() {
    this.updateScreenResolution();

    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
  }
}
