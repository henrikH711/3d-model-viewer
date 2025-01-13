import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, camera, renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting setup
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

// Orbit controls setup
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);

// Helpers: Grid and Axes
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Property window
const propertyWindow = document.getElementById('property-window');

// Function to update property window
function updatePropertyWindow(obj) {
  const position = obj.position;
  const rotation = obj.rotation;
  const scale = obj.scale;

  propertyWindow.innerHTML = `
    <h3>Model Properties</h3>
    <p><strong>Position:</strong> (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})</p>
    <p><strong>Rotation:</strong> (${THREE.MathUtils.radToDeg(rotation.x).toFixed(2)}°, ${THREE.MathUtils.radToDeg(rotation.y).toFixed(2)}°, ${THREE.MathUtils.radToDeg(rotation.z).toFixed(2)}°)</p>
    <p><strong>Scale:</strong> (${scale.x.toFixed(2)}, ${scale.y.toFixed(2)}, ${scale.z.toFixed(2)})</p>
  `;
  propertyWindow.style.display = 'block'; // Show the window
}

// File input handler
document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) loadModel(URL.createObjectURL(file));
});

// Reset button
document.getElementById('reset-button').addEventListener('click', resetScene);

// Drag-and-drop handler
document.body.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

document.body.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) loadModel(URL.createObjectURL(file));
});

// GLTF loader
const loader = new GLTFLoader();
function loadModel(url) {
  loader.load(url, (gltf) => {
    gltf.scene.scale.set(1, 1, 1); // Scale the model
    scene.clear(); // Remove all objects except helpers
    scene.add(gridHelper);
    scene.add(axesHelper);
    scene.add(gltf.scene); // Add new model
    fitCameraToObject(gltf.scene); // Adjust camera
    updatePropertyWindow(gltf.scene); // Update property window
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
  propertyWindow.style.display = 'none'; // Hide property window
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
