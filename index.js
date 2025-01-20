import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Plane for shadows
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.ShadowMaterial({ opacity: 0.2 })
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// GLTF model loader
const loader = new GLTFLoader();

function loadModel(url) {
    loader.load(
        url,
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            // Center and scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            fitCameraToModel(camera, model);
            controls.update();
        },
        (xhr) => console.log(`Loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`),
        (error) => console.error('Error loading model:', error)
    );
}

// Adjust camera to fit the model
function fitCameraToModel(camera, model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    const distance = size / Math.tan((camera.fov / 2) * (Math.PI / 180));
    camera.position.set(center.x, center.y + distance / 2, center.z + distance * 1.5);
    controls.target.copy(center);
}

// File input handler
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        loadModel(URL.createObjectURL(file));
    }
});

// Resize handler
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
