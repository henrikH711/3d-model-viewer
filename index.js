import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, camera, and renderer setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Helpers
scene.add(new THREE.GridHelper(10, 10), new THREE.AxesHelper(5));

// Plane for shadows
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.2 })
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// GLTFLoader
const loader = new GLTFLoader();

function loadModel(url) {
    loader.load(
        url,
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            scene.add(model);

            fitCameraToObject(model);
        },
        undefined,
        (error) => {
            console.error('Error loading model:', error);
            alert('Failed to load model. Please check the file.');
        }
    );
}

function fitCameraToObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    const distance = size * 1.5;
    camera.position.set(center.x, center.y + distance / 2, center.z + distance);
    controls.target.copy(center);
    controls.update();
}

// File input
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        loadModel(url);
    }
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
