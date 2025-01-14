import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5); // Light source position
scene.add(directionalLight);

// Orbit controls for navigation
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 5);
controls.update();

// Helpers
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// GLTFLoader
const loader = new GLTFLoader();

// Property window
const propertyWindow = document.getElementById('property-window');
const modelNameElem = document.getElementById('model-name');
const modelSizeElem = document.getElementById('model-size');
const modelCenterElem = document.getElementById('model-center');

// Show model properties
function showModelProperties(model, name) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    modelNameElem.textContent = `Name: ${name}`;
    modelSizeElem.textContent = `Size: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`;
    modelCenterElem.textContent = `Center: (${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)})`;

    propertyWindow.style.display = 'block';
}

// Load model function
function loadModel(url, name = 'Unnamed Model') {
    loader.load(
        url,
        (gltf) => {
            const model = gltf.scene;
            console.log('Model loaded successfully:', model);

            // Adjust scale and center model
            model.scale.set(1, 1, 1);
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center); // Center model at (0, 0, 0)

            // Clear the scene except helpers
            clearScene();
            scene.add(gridHelper);
            scene.add(axesHelper);
            scene.add(model);

            // Show properties
            showModelProperties(model, name);

            // Adjust camera to fit model
            fitCameraToObject(camera, model);
            controls.update();
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the model:', error);
        }
    );
}

// Adjust camera to fit object
function fitCameraToObject(camera, object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians
    const distance = size / (2 * Math.tan(fov / 2)); // Calculate distance

    camera.position.set(center.x, center.y, distance * 1.5); // Adjust distance
    controls.target.set(center.x, center.y, center.z); // Focus controls on the model
    controls.update();
}

// Clear all objects except helpers
function clearScene() {
    while (scene.children.length > 2) {
        scene.remove(scene.children[2]);
    }
}

// Handle file input
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        console.log('File URL:', url); // This should print the URL of the selected file
        loadModel(url, file.name);
    }
});

// Reset button
document.getElementById('reset-scene').addEventListener('click', () => {
    clearScene();
    propertyWindow.style.display = 'none'; // Hide property window
    camera.position.set(0, 2, 5); // Reset camera
    controls.target.set(0, 0, 0); // Reset controls
    controls.update();
});

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
