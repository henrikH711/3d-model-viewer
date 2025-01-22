import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Helpers
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const Axes = new THREE.Axes(5);
scene.add(Axes);


const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// GLTFLoader setup
const loader = new GLTFLoader();

function loadModel(url) {
    loader.load(
        url,
        (gltf) => {
            const model = gltf.scene;

            model.scale.set(1, 1, 1);
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

    
            clearScene();
            scene.add(gridHelper, Axes, plane, model);

            // Adjust camera
            fitCameraToObject(camera, model);
            controls.update();

            console.log(`Model "${name}" loaded successfully.`);
        },
        (xhr) => {
            console.log(`Model loading progress: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
        }, //errorhandling
        (error) => {
            console.error('An error occurred while loading the model:', error);
            alert('Failed to load model. Please check the file and try again.');
        }
    );
}


function clearScene() {
    scene.children = scene.children.filter(
        (child) => child === gridHelper || child === Axes || child === plane || child.type === 'Light'
    );
}

// Fit camera to the model
function fitCameraToObject(camera, object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians
    const distance = size / (2 * Math.tan(fov / 2)); // Calculate distance

    camera.position.set(center.x, center.y + distance / 2, center.z + distance * 1.5);
    controls.target.set(center.x, center.y, center.z);
    controls.update();
}

// File input
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadModel(url, file.name);
    }
});

// Reset 
document.getElementById('reset-scene').addEventListener('click', () => {
    clearScene();
    camera.position.set(0, 2, 5);
    controls.target.set(0, 0, 0);
    controls.update();
});

// Window resize 
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
