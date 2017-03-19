import * as THREE from 'three';

import earthShader from '../shaders/earth';


export default class Earth {
  public mesh: THREE.Mesh;
  public atmosphere: THREE.Mesh;

  public radius: number = 200;
  public widthSegments: number = 400;
  public heightSegments: number = 300;

  private geometry: THREE.SphereGeometry;
  private material: THREE.ShaderMaterial;
  private uniforms: any;

  constructor(private texture) {
    this.geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);

    this.uniforms = THREE.UniformsUtils.clone(earthShader.uniforms);
    this.uniforms.texture.value = texture;

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: earthShader.vertexShader,
      fragmentShader: earthShader.fragmentShader
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.y = Math.PI;
  }

  getMesh() {
    return this.mesh;
  }

  getPosition() {
    return this.getMesh().position;
  }

  getGeometry() {
    return this.geometry;
  }

  update() {
    this.getMesh().rotation.y += 0.005
  }
}
