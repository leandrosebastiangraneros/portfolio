import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Globe3D() {
    const containerRef = useRef(null);
    const isVisible = useRef(true);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Detect Mobile for performance profiling
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Intersection Observer logic to pause rendering when not in view
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        observer.observe(container);

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 11;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        // Optimization: Reduce resolution on mobile
        renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Anti-alias toggle for mobile performance
        if (isMobile) {
            renderer.antialias = false;
        }

        // OrbitControls (Centered on origin)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.target.set(0, 0, 0);
        controls.rotateSpeed = 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8; // Slightly slower for elegance

        // FIX: Prioritize page scroll on mobile
        // Desactivamos la interacción táctil directa en el canvas para que no robe el scroll
        // El globo seguirá rotando solo (autoRotate) y será interactivo en Desktop (mouse)
        if (isMobile) {
            controls.enabled = false;
            renderer.domElement.style.pointerEvents = 'none'; // Passthrough touch events
        }

        // Groups
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // --- FIX: INTERNAL AXIS ---
        // We keep the globe at (0,0,0) so it spins on its own center.
        // The positioning is handled by the CSS container.
        globeGroup.position.set(0, 0, 0);

        // 1. Texture Loading
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');

        textureLoader.load(
            'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
            (texture) => {
                const image = texture.image;
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }

                context.putImageData(imageData, 0, 0);
                const processedTexture = new THREE.CanvasTexture(canvas);

                const continentMaterial = new THREE.MeshBasicMaterial({
                    map: processedTexture,
                    alphaMap: processedTexture,
                    transparent: true,
                    opacity: 0.35,
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                    alphaTest: 0.1
                });

                const continentSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(4.9, 64, 64),
                    continentMaterial
                );
                globeGroup.add(continentSphere);
            }
        );

        // 2. Wireframe / Core
        const coreGeometry = new THREE.SphereGeometry(5, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.1,
        });
        const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
        globeGroup.add(coreSphere);

        // 3. Points Cloud (Reduced for mobile performance)
        const particleCount = isMobile ? 500 : 2000;
        const positions = new Float32Array(particleCount * 3);
        const r = 5.05;
        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pointsMaterial = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: isMobile ? 0.05 : 0.04,
            transparent: true,
            opacity: 0.3
        });
        const points = new THREE.Points(particleGeometry, pointsMaterial);
        globeGroup.add(points);

        // 4. Satellites
        const satellites = [];
        const createSatellite = (altitude, speed, inclination, phase, color) => {
            const satGeo = new THREE.SphereGeometry(0.08, 8, 8);
            const satMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.9 });
            const satMesh = new THREE.Mesh(satGeo, satMat);

            const satellite = {
                mesh: satMesh,
                altitude: 5 + altitude,
                speed: speed,
                inclination: inclination,
                angle: phase
            };
            globeGroup.add(satMesh);
            satellites.push(satellite);
            return satellite;
        };

        // --- ADICIÓN: FUNCIÓN DE CONVERSIÓN Y MARCADOR ---
        const latLongToVector3 = (lat, lon, radius) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);

            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const z = (radius * Math.sin(phi) * Math.sin(theta));
            const y = (radius * Math.cos(phi));

            return new THREE.Vector3(x, y, z);
        };

        // Coordenadas de La Plata, Argentina
        const laPlataCoords = latLongToVector3(-34.9214, -57.9545, 5.1);

        // Crear Marcador (Punto brillante)
        const markerGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00f0ff, // Azul cian del sitio
            transparent: true,
            opacity: 1
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(laPlataCoords);
        globeGroup.add(marker);

        // Añadir un aro de brillo (Glow effect)
        const ringGeo = new THREE.RingGeometry(0.15, 0.25, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(laPlataCoords);
        ring.lookAt(new THREE.Vector3(0, 0, 0)); // Que mire al centro del globo
        globeGroup.add(ring);


        createSatellite(1.2, 0.005, 0.5, 0, 0xffffff);
        createSatellite(0.8, -0.008, -0.3, 2, 0x00f0ff);
        createSatellite(1.5, 0.004, 2.0, 4, 0xffffff);

        // Resize Logic
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        // Animation Loop
        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (!isVisible.current) return;

            satellites.forEach(sat => {
                sat.angle += sat.speed;
                const dist = sat.altitude;
                const x = dist * Math.cos(sat.angle);
                const z = dist * Math.sin(sat.angle);

                const pos = new THREE.Vector3(x, 0, z);
                pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
                pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), sat.inclination);
                sat.mesh.position.copy(pos);
            });

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            observer.disconnect();
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            scene.clear();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            id="globe-container"
            className="show-element interactive"
        />
    );
}
