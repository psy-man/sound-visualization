import * as THREE from 'three';


export default class Galaxy {
  public mesh: THREE.Mesh;

  public radius: number = 1400;
  public widthSegments: number = 32;
  public heightSegments: number = 32;

  private geometry: THREE.SphereGeometry;
  private material: THREE.MeshBasicMaterial;

  constructor(private texture) {
    this.geometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);

    this.material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: texture
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  getMesh() {
    return this.mesh;
  }

  update() {
    this.getMesh().rotateX(0.001);
    this.getMesh().rotateY(-0.001);
  }
}
