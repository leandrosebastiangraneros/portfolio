import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Contact3D = () => {
    const containerRef = useRef();

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Core Geometry
        const coreGeo = new THREE.IcosahedronGeometry(2, 2);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1 /* Reducido de 0.2 para mayor sutileza */
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // Inner Glow
        const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.25 /* Reducido de 0.5 para no deslumbrar */
        });
        const innerCore = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerCore);

        // Particle System
        const particlesCount = 800;
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
            size: 0.03, /* Partículas más pequeñas */
            transparent: true,
            opacity: 0.2 /* Menos denso */
        });

        const particleSystem = new THREE.Points(partGeo, partMat);
        scene.add(particleSystem);

        camera.position.z = 8;

        // Mouse move effect
        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) - 0.5;
            mouseY = (event.clientY / window.innerHeight) - 0.5;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);

            core.rotation.y += 0.002;
            core.rotation.x += 0.001;
            innerCore.rotation.y -= 0.004;

            // Pulse effect
            const time = Date.now() * 0.002;
            innerCore.scale.set(
                1 + Math.sin(time) * 0.1,
                1 + Math.sin(time) * 0.1,
                1 + Math.sin(time) * 0.1
            );

            // Particles flow
            const positionsArr = partGeo.attributes.position.array;
            for (let i = 0; i < particlesCount; i++) {
                positionsArr[i * 3] += velocities[i * 3];
                positionsArr[i * 3 + 1] += velocities[i * 3 + 1];
                positionsArr[i * 3 + 2] += velocities[i * 3 + 2];

                // Wrap around particles
                if (Math.abs(positionsArr[i * 3]) > 10) positionsArr[i * 3] *= -0.9;
                if (Math.abs(positionsArr[i * 3 + 1]) > 10) positionsArr[i * 3 + 1] *= -0.9;
                if (Math.abs(positionsArr[i * 3 + 2]) > 10) positionsArr[i * 3 + 2] *= -0.9;
            }
            partGeo.attributes.position.needsUpdate = true;

            // Camera follow
            const isMobile = window.innerWidth < 768;
            const targetScale = isMobile ? 0.6 : 1;
            core.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);

            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
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
                pointerEvents: 'none'
            }}
        />
    );
};

export default Contact3D;
