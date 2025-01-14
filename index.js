import * as THREE from 'three';
import { GLTFLoader } from 'filepath';

// Function to load a GLTF model via drag-and-drop
export const LoadGLTFByFileInput = (scene, renderer) => {
  // Add a drag-and-drop event listener to the document body
  document.body.addEventListener('dragover', (event) => {
    event.preventDefault(); // Prevent default drag behavior
    event.dataTransfer.dropEffect = 'copy'; // Indicate a copy action
  });

  document.body.addEventListener('drop', (event) => {
    event.preventDefault();

    // Get the dropped file
    const file = event.dataTransfer.files[0];

    if (file && file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
      const url = URL.createObjectURL(file); // Create a temporary URL for the file
      loadModel(url, scene);
    } else {
      console.error('Please drop a valid .glb or .gltf file.');
    }
  });

  // Function to load the GLTF model
  const loadModel = (url, scene) => {
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // Scale the model as needed
        scene.clear(); 
        scene.add(model); 
        fitCameraToObject(renderer.camera, model); // Adjust the camera
        console.log('Model loaded successfully.');
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  };

  const fitCameraToObject = (camera, obj) => {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    camera.position.set(center.x, center.y, size * 1.5); // Adjust camera position
    camera.lookAt(center); // Point camera at the center of the model
  };
};
