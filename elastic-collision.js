// Wrap entire script in immediately-invoked function expression (IIFE) to enforce strict mode.
((function(){
    'use strict';

    // Declare variables.
    var scene, camera, renderer, materialBlue, materialRed, controls;
    var sphere1 = {}, sphere2 = {};

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
    sphere1.mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 30, 30), materialRed);
    sphere2.mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 30, 30), materialBlue);

    // Set positions for spheres.
    sphere1.mesh.position.set(-200, 0, 0);
    sphere2.mesh.position.set(200, 0, 0);

    scene.add(sphere1.mesh);
    scene.add(sphere2.mesh);

    // The speed is measured in units/second.
    sphere1.velocity = 50;
    sphere2.velocity = 50;

    sphere1.mass = 1000;
    sphere2.mass = 1000;

    // Assuming constant density, the radius is proportional to the cube root of mass.
    sphere1.radius = 5 * Math.pow(sphere1.mass, 1/3);
    sphere2.radius = 5 * Math.pow(sphere2.mass, 1/3);

    var previousTime = 0, running = false;

    // Draw everything.
    function render(time) {
        var deltaTime, distance;

        // time is a decimal number representing the time in milliseconds.
        // Calculate the change in time in seconds since the last frame.
        deltaTime = (time - previousTime) * 0.001;
        previousTime = time;

        // Move spheres.
        if (running) {
            // Check for a collision and reverse direction.
            distance = Math.abs(sphere1.mesh.position.x - sphere2.mesh.position.x + deltaTime * (sphere2.velocity - sphere1.velocity));
            if (distance <= sphere1.radius + sphere2.radius && sphere1.velocity > 0) {
                // Calclate new velocities.
                sphere1.velocity *= -1;
                sphere2.velocity *= -1;
            }

            // Update positions of spheres.
            sphere1.mesh.position.x += deltaTime * sphere1.velocity;
            sphere2.mesh.position.x -= deltaTime * sphere2.velocity;
        }

        // Update the scene.
        renderer.render(scene, camera);

        // Add animation frame to call render().
        requestAnimationFrame(render);
    }

    window.addEventListener('load', function () {
        document.getElementById('start-button').addEventListener('click', function() {
            if (running) {
                running = false;
                this.value = 'Start';

            } else {
                running = true;
                this.value = 'Stop';

            }
        }, false);

        document.getElementById('reset-button').addEventListener('click', function() {
            scene.remove(sphere1.mesh);
            scene.remove(sphere2.mesh);

            sphere1.mass = parseInt(document.getElementById('mass1').value, 10);
            sphere2.mass = parseInt(document.getElementById('mass2').value, 10);
            sphere1.velocity = parseInt(document.getElementById('velocity1').value, 10);
            sphere2.velocity = parseInt(document.getElementById('velocity2').value, 10);
            sphere1.radius = 5 * Math.pow(sphere1.mass, 1/3);
            sphere2.radius = 5 * Math.pow(sphere2.mass, 1/3);

            // Create two sphere objects.
            sphere1.mesh = new THREE.Mesh(new THREE.SphereGeometry(sphere1.radius, 30, 30), materialRed);
            sphere2.mesh = new THREE.Mesh(new THREE.SphereGeometry(sphere2.radius, 30, 30), materialBlue);
            sphere1.mesh.position.set(-200, 0, 0);
            sphere2.mesh.position.set(200, 0, 0);
            scene.add(sphere1.mesh);
            scene.add(sphere2.mesh);
        }, false);
    }, false);


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
