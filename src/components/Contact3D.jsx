import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Contact3D = () => {
    const containerRef = useRef();

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // --- SETUP ---
        const scene = new THREE.Scene();

        // Renderer setup with high performance settings
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 8;

        // --- OBJECTS (Original Design Restored) ---
        // 1. Core Geometry
        const coreGeo = new THREE.IcosahedronGeometry(2, 2);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // 2. Inner Glow
        const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.25
        });
        const innerCore = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerCore);

        // 3. Particle System
        const particlesCount = 800; // Standard count
        const positions = new Float32Array(particlesCount * 3);
        const velocities = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }

        const partGeo = new THREE.BufferGeometry();
        partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const partMat = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: 0.03,
            transparent: true,
            opacity: 0.2
        });
        const particleSystem = new THREE.Points(partGeo, partMat);
        scene.add(particleSystem);

        // --- INTERACTIVITY ---
        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) - 0.5;
            mouseY = (event.clientY / window.innerHeight) - 0.5;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // --- ANIMATION ---
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            // Rotations
            core.rotation.y += 0.002;
            core.rotation.x += 0.001;
            innerCore.rotation.y -= 0.004;

            // Pulse
            const time = Date.now() * 0.002;
            const pulse = 1 + Math.sin(time) * 0.1;
            innerCore.scale.set(pulse, pulse, pulse);

            // Particles
            const posAttr = partGeo.getAttribute('position');
            const arr = posAttr.array;
            for (let i = 0; i < particlesCount; i++) {
                arr[i * 3] += velocities[i * 3];
                arr[i * 3 + 1] += velocities[i * 3 + 1];
                arr[i * 3 + 2] += velocities[i * 3 + 2];

                // Boundary check
                if (Math.abs(arr[i * 3]) > 10) arr[i * 3] *= -0.9;
                if (Math.abs(arr[i * 3 + 1]) > 10) arr[i * 3 + 1] *= -0.9;
                if (Math.abs(arr[i * 3 + 2]) > 10) arr[i * 3 + 2] *= -0.9;
            }
            posAttr.needsUpdate = true;

            // Camera interaction
            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        // --- ROBUST RESIZE HANDLING ---
        // Usamos ResizeObserver en lugar de window.resize para detectar cambios reales en el contenedor
        // Esto soluciona problemas cuando el contenedor carga con tamaño 0 y luego crece
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width === 0 || height === 0) return; // Ignore zero size

                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        });
        resizeObserver.observe(container);

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            resizeObserver.disconnect();
            cancelAnimationFrame(frameId);

            // Clean simple removal
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }

            // Dispose Three.js resources
            scene.clear();
            renderer.dispose();
            coreGeo.dispose();
            coreMat.dispose();
            innerGeo.dispose();
            innerMat.dispose();
            partGeo.dispose();
            partMat.dispose();
        };

    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none' // Click-through
            }}
        />
    );
};

export default Contact3D;
