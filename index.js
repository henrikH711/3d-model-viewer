import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

// Controls
new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);

// File input handler
document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadModel(URL.createObjectURL(file));
});

// Model loader
const loader = new GLTFLoader();
function loadModel(url) {
  loader.load(url, (gltf) => {
    scene.clear(); // Remove all objects
    scene.add(gltf.scene); // Add new model
    fitCameraToObject(gltf.scene); // Adjust camera
  });
}

// Adjust camera to fit object
function fitCameraToObject(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  camera.position.set(center.x, center.y, size * 1.5);
  camera.lookAt(center);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
