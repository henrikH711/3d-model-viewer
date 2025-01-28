//script for site
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log('Selected file:', file);
        loadModel(file);
    } else {
        alert('No file selected.');
    }
});

function loadModel(file) {
    const url = URL.createObjectURL(file); // Dynamically creates a URL
    console.log('File URL:', url); // Debug the generated URL
    loader.load(
        url,
        (gltf) => {
            console.log('GLTF loaded:', gltf); // Debug the loaded glTF object
            const model = gltf.scene;

          

            console.log('Model position after centering:', model.position);

            // Clear the scene + adds model
            clearScene();
            scene.add(gridHelper, plane, model);

            // Camera

            fitCameraToObject(camera, model);
            console.log('Camera position after fitting:', camera.position);
            controls.update();
            
            console.log('Model loaded successfully!');
        },
        (xhr) => {
            console.log(`Loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
        },
//error handling too
        (error) => { 
            console.error('An error occurred while loading the model:', error);
            alert('Failed to load model. Please check the file and try again.');
        }
    );
}
