// color palletes
import palletes from 'nice-color-palettes';
import random from 'canvas-sketch-util/random'


// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");


const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  dimensions: [1024, 1280],
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#fff", 0);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  // Setup camera controller





  // Setup your scene
  const scene = new THREE.Scene();

  // Color Pallete

  const colors = random.pick(palletes);


  // Setup a geometry
  const box = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(
      box,

      new THREE.MeshStandardMaterial({
        color: random.pick(colors),
      }
      )
    )
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    )
    mesh.scale.set(
      random.range(-0.5, 1),
      random.range(-0.5, 1),
      random.range(-0.5, 1),
    )
    mesh.scale.multiplyScalar(0.5)
    scene.add(mesh)
  }

  scene.add(new THREE.AmbientLight("#fff", 0.1));
  // setup light
  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(0,0, 4);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;
      const zoom = 1.85;
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update camera properties
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      scene.rotation.z = time;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
