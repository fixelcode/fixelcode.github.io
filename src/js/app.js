/**
 * --------------------------------------------------------------------------
 * Fixelcode (0.1.0): app.js
 * Licensed under MIT (https://github.com/fixelcode/fixelcode.github.io/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

'use strict';

let app = {
    name: 'Fixelcode',
};

app.elements = {
    canvas: document.getElementById('canvas')
};

app.init = () => {
    app.view.init();
    app.event.init();
};

app.event = {
    init: () => {
        window.addEventListener('resize', app.view.updateViewportHeight);
    },
};

app.view = {
    init: () => {
        app.view.updateViewportHeight();
        app.view.createBackgroundParticles();
    },

    // Update the height of the viewport. This is a workaround fix for [viewport height issue on mobile browsers](https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser) 
    updateViewportHeight: () => {
        document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
    },

    createBackgroundParticles: () => {
        if (!app.elements.canvas) return;

        // Create a scene
        const scene = new THREE.Scene();

        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Create a renderer with transparent background
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const canvas = document.getElementById('canvas');
        canvas.appendChild(renderer.domElement);

        // Create particle buffer geometry
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const velocities = [];
        for (let i = 0; i < 2500; i++) {
            vertices.push(THREE.MathUtils.randFloatSpread(2000));  // x
            vertices.push(THREE.MathUtils.randFloatSpread(2000));  // y
            vertices.push(THREE.MathUtils.randFloatSpread(2000));  // z

            velocities.push((Math.random() - 0.5) * 0.01);  // vx
            velocities.push((Math.random() - 0.5) * 0.01);  // vy
            velocities.push((Math.random() - 0.5) * 0.01);  // vz
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        // Create material for particles
        const material = new THREE.PointsMaterial({
            color: 0x000000,
            size: 0.1
        });

        // Create a particle system
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Function to animate the scene
        function animate() {
            requestAnimationFrame(animate);

            // Update positions of particles
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i++) {
                positions[i] += velocities[i];
            }
            particles.geometry.attributes.position.needsUpdate = true;

            // Rotate the particles
            particles.rotation.x += 0.001;
            particles.rotation.y += 0.001;

            renderer.render(scene, camera);
        }

        // Function to handle window resizing
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        // Add event listener for window resize
        window.addEventListener('resize', onWindowResize, false);

        animate();
    }
};

app.init();