// Wrap entire script in immediately-invoked function expression (IIFE) to enforce strict mode.
((function(){
    'use strict';

    // Declare variables.
    var scene, camera, renderer, materialBlue, materialRed, controls;
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

    // The speed is measured in units/second.
    sphere1.velocity = 50;
    sphere2.velocity = 50;

    sphere1.radius = 50;
    sphere2.radius = 50;

    var previousTime = 0;

    // Draw everything.
    function render(time) {

        // time is a decimal number representing the time in milliseconds.
        // Calculate the change in time in seconds since the last frame.
        var deltaTime = (time - previousTime) * 0.001;
        previousTime = time;

        // Check for a collision and reverse direction.
        if (Math.abs(sphere1.position.x - sphere2.position.x + deltaTime * (sphere2.velocity - sphere1.velocity)) <= sphere1.radius + sphere2.radius) {
            // Calclate new velocities.
            sphere1.velocity *= -1;
            sphere2.velocity *= -1;
        }

        // Update positions of spheres.
        sphere1.position.x -= deltaTime * sphere1.velocity;
        sphere2.position.x += deltaTime * sphere2.velocity;

        // Update the scene.
        renderer.render(scene, camera);

        // Add animation frame to call render().
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render); // Start animation.

    // Create a function that is called whenever the window is resized.
    window.addEventListener('resize', function() {

        // Resize the canvas.
        var width = window.innerWidth, height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

})()); // End IIFE.
