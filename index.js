document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) {
        alert('No file selected.');
        return;
    }

    // Validate file type
    const allowedTypes = ['model/gltf+json', 'model/gltf-binary'];
    if (!allowedTypes.includes(file.type)) {
        alert('Invalid file format. Please select a .gltf or .glb file.');
        return;
    }

    console.log('Selected file:', file);
    loadModel(file);
});

function loadModel(file) {
    const url = URL.createObjectURL(file); // Creates a URL for the file
    console.log('File URL:', url);

    loader.load(
        url,
        (gltf) => {
            console.log('GLTF loaded:', gltf);
            const model = gltf.scene;

            // Clear previous models from the scene
            clearScene();
            scene.add(gridHelper, plane, model);

            // Center model and adjust camera
            fitCameraToObject(camera, model);

            console.log('Model loaded successfully!');
            controls.update();

            // Cleanup the Object URL to free memory
            URL.revokeObjectURL(url);
        },
        (xhr) => {
            if (xhr.total) {
                console.log(`Loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
            }
        },
        (error) => {
            console.error('Error loading model:', error);
            alert('Failed to load model. Please check the file and try again.');
            URL.revokeObjectURL(url); // Cleanup even on failure
        }
    );
}

function clearScene() {
    // Remove all objects except essential ones
    scene.children.forEach((object) => {
        if (!['gridHelper', 'plane'].includes(object.name)) {
            scene.remove(object);
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((mat) => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
    });

    console.log('Scene cleared.');
}
