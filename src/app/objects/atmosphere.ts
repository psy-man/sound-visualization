import * as THREE from 'three';
import atmosphereShader from '../shaders/atmosphere';


export default class Atmosphere {

  public mesh: THREE.Mesh;

  private material: THREE.ShaderMaterial;
  private uniforms: any;

  constructor(private geometry: THREE.SphereGeometry) {

    this.uniforms = THREE.UniformsUtils.clone(atmosphereShader.uniforms);

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: atmosphereShader.vertexShader,
      fragmentShader: atmosphereShader.fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.setScalar(1.2);
  }

  getMesh() {
    return this.mesh;
  }

  update() {
  }
}
