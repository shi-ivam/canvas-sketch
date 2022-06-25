const canvasSketch = require('canvas-sketch');
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');

// Setup our sketch
const settings = {
  context: 'webgl',
  dimensions:[1024, 1024],
  animate: true
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float time;
  varying vec2 vUv;


  void main () {
    vec2 center = vUv - 0.5;
    float distance = length(center);
  
    vec3 colorA = vec3(1.0, 0.0, 0.0);
    vec3 colorB = vec3(0.0, 0.0, 1.0);
    
    float alpha = smoothstep(0.251, 0.25, distance);

    vec3 color = mix(colorA, colorB,vUv.x);

    gl_FragColor = vec4(color, alpha);
    
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time
    }
  });
};

canvasSketch(sketch, settings);
