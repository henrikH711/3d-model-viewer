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
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);

// Helpers
const gridHelper = new THREE.GridHelper(10, 10); // 10x10 grid
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5); // Axes with length 5
scene.add(axesHelper);

// File input handler
document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadModel(URL.createObjectURL(file));
});

// Drag-and-drop handler
document.body.addEventListener('dragover', (e) => {
  e.preventDefault(); // Prevent default drag behavior
  e.dataTransfer.dropEffect = 'copy';
});

document.body.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) loadModel(URL.createObjectURL(file));
});

// Reset button
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset Scene';
resetButton.style.position = 'absolute';
resetButton.style.top = '10px';
resetButton.style.left = '10px';
resetButton.style.zIndex = '1000';
resetButton.addEventListener('click', resetScene);
document.body.appendChild(resetButton);

// Model loader
const loader = new GLTFLoader();
function loadModel(url) {
  loader.load(url, (gltf) => {
    gltf.scene.scale.set(1, 1, 1); // Scale the model
    scene.clear(); // Remove all objects except helpers
    scene.add(gridHelper);
    scene.add(axesHelper);
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
  controls.target.set(center.x, center.y, center.z); // Focus controls on model
  controls.update();
}

// Reset the scene
function resetScene() {
  scene.clear();
  scene.add(gridHelper);
  scene.add(axesHelper);
  camera.position.set(0, 2, 5); // Reset camera
  controls.target.set(0, 0, 0); // Reset controls
  controls.update();
}

// Responsive resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
