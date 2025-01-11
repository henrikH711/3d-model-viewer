import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//lightning
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // env light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

// GLTF modell load
const loader = new GLTFLoader();
loader.load(
  '/models/model.glb', // Modell lib path
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0); // Modell pos
    model.scale.set(1, 1, 1); // Modell size
  },
  undefined,
  (error) => {
    console.error('Hiba a modell betöltésekor:', error);
  }
);

//cam_pos
camera.position.z = 5;

// anim loop
const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
