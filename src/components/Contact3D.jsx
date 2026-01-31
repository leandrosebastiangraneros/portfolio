import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Contact3D = () => {
    const containerRef = useRef();
    const isVisible = useRef(true);

    useEffect(() => {
        if (!containerRef.current) return;

        // Detect Mobile for performance profiling
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Intersection Observer logic to pause rendering when not in view
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        observer.observe(containerRef.current);

        // Scene setup
        const scene = new THREE.Scene();
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: !isMobile, // Disable on mobile
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Core Geometry (Lower complexity on mobile)
        const coreGeo = new THREE.IcosahedronGeometry(2, isMobile ? 1 : 2);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // Inner Glow
        const innerGeo = new THREE.IcosahedronGeometry(1.2, 1);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.25
        });
        const innerCore = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerCore);

        // Particle System (Drastically reduced for mobile)
        const particlesCount = isMobile ? 200 : 800;
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
            size: isMobile ? 0.05 : 0.03,
            transparent: true,
            opacity: 0.2
        });

        const particleSystem = new THREE.Points(partGeo, partMat);
        scene.add(particleSystem);

        camera.position.z = 8;

        // Mouse move effect (Skip logic on mobile handled by listener absence)
        let mouseX = 0;
        let mouseY = 0;
        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) - 0.5;
            mouseY = (event.clientY / window.innerHeight) - 0.5;
        };
        if (!isMobile) window.addEventListener('mousemove', handleMouseMove);

        // Animation Loop
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            // Only update and render if visible or mobile optimization permits
            if (!isVisible.current) return;

            core.rotation.y += 0.002;
            core.rotation.x += 0.001;
            innerCore.rotation.y -= 0.004;

            // Pulse effect
            const time = Date.now() * 0.002;
            const pulse = 1 + Math.sin(time) * 0.1;
            innerCore.scale.set(pulse, pulse, pulse);

            // Particles flow (Simplified update)
            const posAttr = partGeo.getAttribute('position');
            const arr = posAttr.array;
            for (let i = 0; i < particlesCount; i++) {
                arr[i * 3] += velocities[i * 3];
                arr[i * 3 + 1] += velocities[i * 3 + 1];
                arr[i * 3 + 2] += velocities[i * 3 + 2];

                if (Math.abs(arr[i * 3]) > 10) arr[i * 3] *= -0.9;
                if (Math.abs(arr[i * 3 + 1]) > 10) arr[i * 3 + 1] *= -0.9;
                if (Math.abs(arr[i * 3 + 2]) > 10) arr[i * 3 + 2] *= -0.9;
            }
            posAttr.needsUpdate = true;

            // Camera follow
            if (!isMobile) {
                camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
                camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
            } else {
                core.scale.set(0.6, 0.6, 0.6);
            }
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (!isMobile) window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
            cancelAnimationFrame(frameId);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            scene.clear();
            renderer.dispose();
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
