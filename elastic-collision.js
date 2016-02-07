// Declare global variables.
var scene, camera, renderer, material, controls;
var sphere1, sphere2;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();

// Set coordinates for camera.
camera.position.x = 0;
camera.position.y = 300;
camera.position.z = 300;

// Add the renderer to the page.
renderer.setSize(window.innerWidth, window.innerHeight);

// Set background color to white.
renderer.setClearColor(0xffffff, 1);

document.body.appendChild(renderer.domElement);

// Create a basic blue material for the first sphere.
materialBlue = new THREE.MeshBasicMaterial({'color': 0x2196F3});
materialRed = new THREE.MeshBasicMaterial({'color': 0xf44336});

// Add orbit controls to enable moving around.
controls = new THREE.OrbitControls(camera, renderer.domElement);

// Create two sphere objects.
// SphereGeometry(radius, widthSegments, heightSegments);
sphere1 = new THREE.Mesh(new THREE.SphereGeometry(50, 30, 30), materialBlue);
sphere2 = new THREE.Mesh(new THREE.SphereGeometry(50, 30, 30), materialRed);

// Set positions for spheres.
sphere1.position.set(200, 0, 0);
sphere2.position.set(-200, 0, 0);

scene.add(sphere1);
scene.add(sphere2);


function render() {
    // Add animation frame to call render() about 30 times a second.
    requestAnimationFrame(render);

    // Update the scene.
    renderer.render(scene, camera);
}

render(); // Start animation.

// Create a function that is called whenever the window is resized.
window.addEventListener('resize', function() {
    var width = window.innerWidth, height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
