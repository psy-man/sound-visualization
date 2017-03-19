import * as THREE from 'three';


export default class Ring {
  public mesh: THREE.Mesh;

  public innerRadius: number = 260;
  public outerRadius: number = 264;
  public thetaSegments: number = 120;

  private geometry: THREE.RingGeometry;
  private material: THREE.MeshBasicMaterial;

  constructor(private index, private frequencyData) {
    this.geometry = new THREE.RingGeometry(this.innerRadius, this.outerRadius, this.thetaSegments);

    this.material = new THREE.MeshBasicMaterial({
      color: 0xa7a7a7,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.rotation.x = Math.random();
    this.mesh.rotation.y = Math.random();

    this.mesh.updateMatrix();
  }

  getMesh() {
    return this.mesh;
  }

  update() {
    this.getMesh().visible = this.frequencyData[this.index] / 100 > 1;

    this.getMesh().rotation.x += this.frequencyData[this.index] / 20000;
    this.getMesh().rotation.y += this.frequencyData[this.index] / 20000;

    this.getMesh().scale.x = Math.max( this.frequencyData[this.index] / 95, 1 );
    this.getMesh().scale.y = Math.max( this.frequencyData[this.index] / 95, 1 );
    this.getMesh().scale.z = Math.max( this.frequencyData[this.index] / 95, 1 );

    this.getMesh().updateMatrix();
  }
}
