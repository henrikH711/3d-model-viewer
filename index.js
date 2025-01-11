import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Three.js alapbeállítások
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 2, 5);

// Világítás
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Orbit Controls (kamera mozgatása egérrel)
const controls = new OrbitControls(camera, renderer.domElement);

// Fájl betöltés kezelése
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file); // Hozz létre egy ideiglenes URL-t a fájlhoz
    loadModel(url);
  }
});

// Modell betöltése
const loader = new GLTFLoader();
function loadModel(url) {
  loader.load(
    url,
    (gltf) => {
      // Töröld az előző modellt a jelenetből
      clearScene();

      const model = gltf.scene;
      scene.add(model);
      model.position.set(0, 0, 0);
      model.scale.set(1, 1, 1);

      // Automatikus kamera fókusz
      focusCameraOnModel(model);
    },
    undefined,
    (error) => {
      console.error('Error loading model:', error);
    }
  );
}

// Korábbi modellek eltávolítása a jelenetből
function clearScene() {
  while (scene.children.length > 2) { // Az alapvilágítást ne távolítsuk el
    scene.remove(scene.children[2]);
  }
}


function focusCameraOnModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

  camera.position.set(center.x, center.y + 2, center.z + cameraZ * 1.5);
  camera.lookAt(center);
}

// Animációs loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
