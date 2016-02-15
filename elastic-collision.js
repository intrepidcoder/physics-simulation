// The main function is called immediately as soon as the page starts loading.
((function main() {
    // Enforce stricter syntax.
    'use strict';

    // Declare variables.
    var scene,
    camera,
    renderer,
    materialBlue,
    materialRed,
    controls,
    sphere1 = {}, // Create objects to store the various properties of the spheres.
    sphere2 = {},
    previousTime = 0,
    running = false,
    reset = true;

    // Create objects for 3D environment.
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer();

    // Set possition of camera.
    camera.position.x = 0;
    camera.position.y = 300;
    camera.position.z = 300;

    // Set the size of the renderer.
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set background color to white.
    renderer.setClearColor(0xffffff, 1);

    // Add the canvas to the page.
    document.body.appendChild(renderer.domElement);

    // Create basic blue and red materials for the spheres.
    materialBlue = new THREE.MeshBasicMaterial({'color': 0x2196F3});
    materialRed = new THREE.MeshBasicMaterial({'color': 0xf44336});

    // Add orbit controls to allow looking around.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Update the environment to create animation. Loops continuously.
    function render(time) {
        var deltaTime,
        distance;

        // The variable time is a floating point number that contains the time in milliseconds.
        // Calculate the change in time in seconds since the last frame.
        deltaTime = (time - previousTime) * 0.001;
        previousTime = time;

        // Move spheres.
        if (running) {
            // Check for a collision and reverse direction.
            distance = Math.abs(sphere1.mesh.position.x - sphere2.mesh.position.x) - deltaTime * (sphere1.velocity - sphere2.velocity);
            if (distance <= sphere1.radius + sphere2.radius && (sphere1.velocity > 0 || sphere2.velocity < 0)) {
                // Store initial velocities.
                var v1 = sphere1.velocity, v2 = sphere2.velocity;

                // Calclate new velocities.
                sphere1.velocity = ((sphere1.mass - sphere2.mass)*v1 + 2 * sphere2.mass * v2)/(sphere1.mass + sphere2.mass);
                sphere2.velocity = ((sphere2.mass - sphere1.mass)*v2 + 2 * sphere1.mass * v1)/(sphere1.mass + sphere2.mass);
            }

            // Update positions of spheres.
            sphere1.mesh.position.x += deltaTime * sphere1.velocity;
            sphere2.mesh.position.x += deltaTime * sphere2.velocity;
        }

        // Update the scene.
        renderer.render(scene, camera);

        // Call render function again as soon as possible.
        requestAnimationFrame(render);
    }

    // Reset the spheres to their initial positions.
    function updateSpheres() {
        // Remove the old spheres from the environment if necessary.
        scene.remove(sphere1.mesh);
        scene.remove(sphere2.mesh);

        // Read the mass and velocity from the input controls.
        sphere1.mass = parseInt(document.getElementById('mass1').value, 10);
        sphere2.mass = parseInt(document.getElementById('mass2').value, 10);
        sphere1.velocity = parseInt(document.getElementById('velocity1').value, 10);
        sphere2.velocity = -parseInt(document.getElementById('velocity2').value, 10);

        // Limit range of mass and velocity.
        sphere1.mass = Math.min(Math.max(sphere1.mass, 1), 10000);
        sphere2.mass = Math.min(Math.max(sphere2.mass, 1), 10000);
        sphere1.velocity = Math.min(Math.max(sphere1.velocity, 0), 1000);
        sphere2.velocity = Math.max(Math.min(sphere2.velocity, 0), -1000);

        // Assuming constant density, the radius of a sphere is proportional to the cube root of the mass.
        sphere1.radius = 5 * Math.pow(sphere1.mass, 1/3);
        sphere2.radius = 5 * Math.pow(sphere2.mass, 1/3);

        // Create 3D mesh objects to display the spheres in the environment.
        // The arguments for SphereGeometry are: radius, widthSegments, heightSegments.
        sphere1.mesh = new THREE.Mesh(new THREE.SphereGeometry(sphere1.radius, 30, 30), materialRed);
        sphere2.mesh = new THREE.Mesh(new THREE.SphereGeometry(sphere2.radius, 30, 30), materialBlue);

        // Set the spheres' positions.
        sphere1.mesh.position.set(-200, 0, 0);
        sphere2.mesh.position.set(200, 0, 0);

        // Add the new spheres to the environment.
        scene.add(sphere1.mesh);
        scene.add(sphere2.mesh);
    }

    // Create a function that is called once the window is fully loaded.
    window.addEventListener('load', function() {
        updateSpheres();

        // Create a function that is called when the start button is clicked.
        document.getElementById('start-button').addEventListener('click', function() {
            if (running) {
                // Pause the animation
                running = false;
                this.value = 'Start';
                document.getElementById('reset-button').disabled = false;

            } else {
                // If the spheres have been reset, update them in case the controls have been changed.
                if (reset) {
                    updateSpheres();
                }

                // Start the animation.
                running = true;
                reset = false;
                this.value = 'Stop';
                document.getElementById('reset-button').disabled = true;
            }
        }, false);

        // Create a function that is called when the reset button is clicked.
        document.getElementById('reset-button').addEventListener('click', function() {
            if (!running) {
                // Reset the spheres.
                updateSpheres();
                reset = true;
            }
        }, false);

        document.getElementById('controls').addEventListener('keydown', function(event) {
            event.stopPropagation();
        }, false);
    }, false); // End window load event.


    // Create a function that is called whenever the window is resized.
    window.addEventListener('resize', function() {

        // Resize the canvas.
        var width = window.innerWidth, height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Start animation.
    requestAnimationFrame(render);

})()); // End main.
