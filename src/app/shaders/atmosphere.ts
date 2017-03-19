const atmosphereShader = {
  uniforms: {
    "c":   { type: "f", value: 0.6 },
    "p":   { type: "f", value: 4 }
  },
  vertexShader: [
    'varying vec3 vNormal;',
    'void main() {',
      'vNormal = normalize( normalMatrix * normal );',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join('\n'),
    fragmentShader: [
     'uniform float c;',
      'uniform float p;',
      'varying vec3 vNormal;',
      'void main()',
      '{',
        'float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );',
        'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
      '}'
  ].join('\n')
};

export default atmosphereShader;
