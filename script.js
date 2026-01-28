/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Forzar scroll arriba al recargar: Asegura que la terminal de arranque sea visible
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Cursor Personalizado
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // --- PARALAJE DE ESTRELLAS Y DATOS HUD ---
    const starCanvas = document.getElementById('stars-canvas');
    const hudTopLeft = document.querySelector('.topleft-data');
    const hudBottomLeft = document.querySelector('.bottomleft-data');
    const hudTopRight = document.querySelector('.topright-data');
    const navLinksHud = document.querySelector('.bottom-nav');

    let isAutoScrolling = false;

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // El punto sigue al cursor exactamente
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Paralaje de Estrellas - Verificación de seguridad
        if (starCanvas) {
            const xPos = (mouseX / window.innerWidth - 0.5) * 20;
            const yPos = (mouseY / window.innerHeight - 0.5) * 20;
            starCanvas.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }
        // Mostrar cursor en el primer movimiento
        if (cursorDot.style.opacity === '0' || cursorDot.style.opacity === '') {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        }


        // El contorno sigue con un ligero retraso
        cursorOutline.style.left = `${mouseX}px`;
        cursorOutline.style.top = `${mouseY}px`;

        // Actualización de Coordenadas HUD
        const coordsEl = document.getElementById('mouse-coords');
        if (coordsEl) {
            coordsEl.textContent = `${String(mouseX).padStart(3, '0')} - ${String(mouseY).padStart(3, '0')}`;
        }
    });

    // Efectos hover para el cursor
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .vault-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Observador de Intersección para Animaciones de Scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
            } else {
                entry.target.classList.remove('show-element');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach((el) => observer.observe(el));

    // Desplazamiento suave para enlaces ancla
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                isAutoScrolling = true;

                // Forzar re-ejecución de animaciones
                let elementsToAnimate = Array.from(targetElement.querySelectorAll('.hidden-element'));

                // Si el objetivo es el hero, incluir también el contenedor del globo
                if (targetId === '#hero') {
                    const globe = document.getElementById('globe-container');
                    if (globe) elementsToAnimate.push(globe);
                }

                elementsToAnimate.forEach(el => {
                    el.style.transition = 'none';
                    el.classList.remove('show-element');
                    void el.offsetWidth;
                    el.style.transition = '';
                });

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Re-agregar clases después de una breve pausa
                setTimeout(() => {
                    elementsToAnimate.forEach(el => el.classList.add('show-element'));
                    isAutoScrolling = false;
                }, 50);
            }
        });
    });

    // --- EFECTO DE TEXTO DE DESENCRIPTACIÓN ---
    const hackerChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function decryptText(element, originalText) {
        let iteration = 0;
        const interval = setInterval(() => {
            const currentText = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    if (letter === ' ' || letter === '\n') return letter;
                    return hackerChars[Math.floor(Math.random() * hackerChars.length)];
                })
                .join('');

            element.innerHTML = currentText.replace(/\n/g, '<br>');

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 2;
        }, 30);
    }

    const animatedElements = document.querySelectorAll('.subtitle, .title, .role, .btn');
    animatedElements.forEach(el => {
        const originalText = el.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        setTimeout(() => {
            decryptText(el, originalText);
        }, 500);
    });

    // --- IMPLEMENTACIÓN DEL GLOBO THREE.JS ---
    const globeContainer = document.getElementById('globe-container');
    if (globeContainer) {
        try {
            if (typeof THREE === 'undefined') throw new Error("Three.js not loaded");

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            globeContainer.appendChild(renderer.domElement);

            // Manejador de redimensionamiento
            window.addEventListener('resize', () => {
                const width = globeContainer.clientWidth;
                const height = globeContainer.clientHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            });

            // Inicializar Grupos primero para evitar problemas en carga asíncrona
            const globeGroup = new THREE.Group();
            const continentHolder = new THREE.Group();
            globeGroup.add(continentHolder);
            window.globeGroup = globeGroup;
            window.continentHolder = continentHolder;

            const textureLoader = new THREE.TextureLoader();
            textureLoader.setCrossOrigin('anonymous');
            let continentMaterial;

            // Revertir a la textura estética anterior del globo
            textureLoader.load(
                'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
                function (texture) {
                    const image = texture.image;
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0);

                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    for (let i = 0; i < data.length; i += 4) {
                        // Invertir Mapa Especular:
                        // Original: Mar Blanco (Reflectante), Tierra Negra.
                        // Queremos: Mar Transparente (Negro), Tierra Opaca (Blanca).
                        // Así que invertimos los canales.
                        data[i] = 255 - data[i];     // R
                        data[i + 1] = 255 - data[i + 1]; // G
                        data[i + 2] = 255 - data[i + 2]; // B

                        // Nota: No es necesario tocar Alpha (data[i+3]) usualmente.
                        // Pero por seguridad si usamos transparencia:
                        // Alpha es usualmente 255 en jpg.
                    }

                    context.putImageData(imageData, 0, 0);
                    const processedTexture = new THREE.CanvasTexture(canvas);

                    continentMaterial = new THREE.MeshBasicMaterial({
                        map: processedTexture,
                        alphaMap: processedTexture, // Crítico: Usar textura invertida como máscara de transparencia
                        transparent: true,
                        opacity: 0,
                        color: 0xffffff, // Tierra Blanca para Modo Oscuro
                        side: THREE.DoubleSide,
                        alphaTest: 0.1
                    });

                    const continentSphere = new THREE.Mesh(new THREE.SphereGeometry(4.9, 32, 32), continentMaterial);
                    continentHolder.add(continentSphere);
                },
                undefined,
                function (err) { console.error("Globe Texture Load Fail:", err); }
            );



            const geometry = new THREE.SphereGeometry(5, 24, 24);
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.15,
                visible: true
            });
            const sphere = new THREE.Mesh(geometry, material);
            globeGroup.add(sphere);

            // 4. Puntos Vectoriales 
            const particleCount = 2000;
            const positions = new Float32Array(particleCount * 3);
            const originalPositions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                const phi = Math.acos(-1 + (2 * i) / particleCount);
                const theta = Math.sqrt(particleCount * Math.PI) * phi;
                const r = 5;
                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.sin(phi) * Math.sin(theta);
                const z = r * Math.cos(phi);
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;
                originalPositions[i * 3] = x;
                originalPositions[i * 3 + 1] = y;
                originalPositions[i * 3 + 2] = z;
            }

            const particleGeometry = new THREE.BufferGeometry();
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const pointsMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.05,
                transparent: true,
                opacity: 0.8
            });
            const points = new THREE.Points(particleGeometry, pointsMaterial);
            globeGroup.add(points);

            // 5. Resaltar Argentina
            let markerOrigPos = new THREE.Vector3();
            function createMarker(lat, lon, color) {
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lon + 180) * (Math.PI / 180);
                const r = 5;
                const x = -(r * Math.sin(phi) * Math.cos(theta));
                const y = (r * Math.cos(phi));
                const z = (r * Math.sin(phi) * Math.sin(theta));
                const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
                const markerMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
                const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                marker.position.set(x, y, z);
                markerOrigPos.set(x, y, z);
                return marker;
            }

            const argentinaMarker = createMarker(-34.6037, -58.3816, 0x75AADB);
            const ringGeometry = new THREE.RingGeometry(0.2, 0.28, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x75AADB, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.position.copy(argentinaMarker.position);
            ring.lookAt(new THREE.Vector3(0, 0, 0));

            globeGroup.add(argentinaMarker);
            globeGroup.add(ring);

            // --- SATÉLITES ---
            const satellites = [];
            function createSatellite(altitude, speed, inclination, phase, color) {
                // Malla del Satélite
                const satGeo = new THREE.SphereGeometry(0.08, 8, 8);
                const satMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
                const satMesh = new THREE.Mesh(satGeo, satMat);

                // Funcionalidad de Órbita
                const satellite = {
                    mesh: satMesh,
                    altitude: 5 + altitude,
                    speed: speed,
                    inclination: inclination, // Inclinación en radianes
                    angle: phase, // Posición inicial
                    color: color
                };



                globeGroup.add(satMesh);


                satellites.push(satellite);
            }

            // Agregar 3 Satélites
            createSatellite(1.2, 0.005, 0.5, 0, 0xffffff);      // Órbita alta, lenta
            createSatellite(0.8, -0.008, -0.3, 2, 0x75AADB);     // Órbita media, rápida, inversa, azulada
            createSatellite(1.5, 0.004, 2.0, 4, 0xffffff);      // Órbita polar

            scene.add(globeGroup);

            // Orientación inicial
            globeGroup.rotation.x = -0.35;
            globeGroup.rotation.z = 0.15;
            globeGroup.rotation.y = -1.2;

            camera.position.z = 10;

            let isDragging = false;
            let previousMouseX = 0;
            let previousMouseY = 0;

            globeContainer.addEventListener('mousedown', (e) => {
                if (globeContainer.classList.contains('interactive')) {
                    isDragging = true;
                    previousMouseX = e.clientX;
                    previousMouseY = e.clientY;
                    globeContainer.style.cursor = 'grabbing';
                }
            });
            window.addEventListener('mouseup', () => {
                isDragging = false;
                globeContainer.style.cursor = 'grab';
            });
            window.addEventListener('mousemove', (e) => {
                if (isDragging && globeContainer.classList.contains('interactive')) {
                    const deltaX = e.clientX - previousMouseX;
                    const deltaY = e.clientY - previousMouseY;
                    globeGroup.rotation.y += deltaX * 0.005;
                    globeGroup.rotation.x += deltaY * 0.005;
                }
                previousMouseX = e.clientX;
                previousMouseY = e.clientY;
            });

            // Mapeo de coordenadas para marcador en la silueta 8x12
            const silhouetteMarkerPos = new THREE.Vector3(1.1, 0.9, 0.2);

            const animate = () => {
                requestAnimationFrame(animate);

                const isBooting = !document.body.classList.contains('boot-complete');
                const aboutSection = document.getElementById('about');
                const viewportHeight = window.innerHeight;

                let morphFactor = 0;
                if (!isBooting && aboutSection) {
                    const aboutRect = aboutSection.getBoundingClientRect();
                    if (aboutRect.top < viewportHeight) {
                        morphFactor = Math.min(1, Math.max(0, (viewportHeight - aboutRect.top) / (viewportHeight * 0.7)));
                    }
                }

                if (true) {
                    globeContainer.classList.remove('morphing');
                    globeContainer.classList.add('interactive');

                    // Transición del globo de derecha-centro (3.5) a derecha-profunda (7.5) basado en scroll
                    globeGroup.position.x = 3.5 + (4 * morphFactor);

                    if (!isDragging) globeGroup.rotation.y += 0.002;

                    if (!isDragging && morphFactor > 0.1) {
                        globeGroup.rotation.y += ((-1) - globeGroup.rotation.y) * 0.05;
                        globeGroup.rotation.x += ((-0.5) - globeGroup.rotation.x) * 0.05;
                        globeGroup.rotation.z += ((0.15) - globeGroup.rotation.z) * 0.05;
                    }

                    for (let i = 0; i < particleCount; i++) {
                        const i3 = i * 3;
                        positions[i3] = originalPositions[i3];
                        positions[i3 + 1] = originalPositions[i3 + 1];
                        positions[i3 + 2] = originalPositions[i3 + 2];
                    }
                    particleGeometry.attributes.position.needsUpdate = true;

                    // Visibilidad dinámica: Alambre blanco al aterrizar, Negro/Oculto durante transiciones de scroll
                    if (isBooting || morphFactor < 0.2) {
                        pointsMaterial.color.setHex(0xffffff);
                        pointsMaterial.opacity = 0.8;
                        material.color.setHex(0xffffff);
                        sphere.visible = true;
                        points.visible = true;
                    } else {
                        // Perfil/Scroll profundo: Cambiar a negro u ocultar para estética de dashboard
                        pointsMaterial.color.setHex(0x000000);
                        sphere.visible = false;
                        points.visible = false;
                    }

                    // Continentes: Ocultos durante arranque, visibles al aterrizar
                    if (continentMaterial) {
                        if (isBooting) {
                            continentMaterial.opacity = 0;
                            continentMaterial.visible = false;
                        } else {
                            // Desvanecer al hacer scroll: Desvanecimiento lineal suave al bajar
                            const fadeFactor = Math.max(0, 1 - morphFactor);

                            continentMaterial.opacity = 0.4 * fadeFactor;
                            continentMaterial.visible = continentMaterial.opacity > 0.001;
                            // Modo Oscuro: Tierra Blanca
                            continentMaterial.color.setHex(0xffffff);
                        }
                    }

                    // Silueta del Mapa de Argentina Eliminada, pero marcador celeste restaurado


                    // Desvanecer marcadores también - Sincronizado con Material del Continente
                    const markerFade = Math.max(0, 1 - morphFactor);

                    if (argentinaMarker) {
                        argentinaMarker.material.opacity = 0.8 * markerFade;
                        argentinaMarker.visible = argentinaMarker.material.opacity > 0.001;
                    }
                    if (ring) {
                        ring.material.opacity = (0.5 + Math.sin(Date.now() * 0.005) * 0.3) * (0.5 * markerFade);
                        ring.visible = ring.material.opacity > 0.001;
                    }

                    // Animar Satélites
                    satellites.forEach(sat => {
                        sat.angle += sat.speed;
                        // Calcular posición basada en inclinación y ángulo
                        // Mecánica orbital simplificada:
                        // x = r * cos(angulo)
                        // z = r * sin(angulo)
                        // Luego rotar por inclinación alrededor del eje Z o X

                        const r = sat.altitude;
                        const x = r * Math.cos(sat.angle);
                        const z = r * Math.sin(sat.angle);

                        // Aplicar Inclinación (Rotación alrededor de Y para el visual de inclinación del anillo)
                        // Realmente, más simple: Posición en plano plano, luego aplicar rotación euler coincide con línea de órbita
                        const pos = new THREE.Vector3(x, 0, z);
                        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2); // Initial flat
                        pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), sat.inclination); // Tilt

                        sat.mesh.position.copy(pos);

                        // Desvanecer satélites
                        sat.mesh.material.opacity = 0.9 * markerFade;
                        sat.mesh.visible = sat.mesh.material.opacity > 0.001;
                        // sat.orbitLine.material.opacity = 0.15 * markerFade; // Eliminado
                        // sat.orbitLine.visible = sat.orbitLine.material.opacity > 0.01; // Eliminado
                    });
                }

                const ringScale = (1 + Math.sin(Date.now() * 0.005) * 0.4) * (1 + morphFactor * 0.5);
                ring.scale.set(ringScale, ringScale, 1);
                ring.material.opacity = (0.5 + Math.sin(Date.now() * 0.005) * 0.3) * (0.5 + morphFactor * 0.5);

                renderer.render(scene, camera);
            };
            animate();
        } catch (err) {
            console.error("Globe Error:", err);
            // If globe fails, make sure we don't block visibility
            globeContainer.style.display = 'none';
        }


        // --- LÓGICA DE SECUENCIA DE ARRANQUE ---
        const bootOverlay = document.getElementById('boot-overlay');

        if (bootOverlay) {
            // Check for skip parameter
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('skipBoot') === 'true') {
                completeBoot();
            } else {
                // Run the senior loading animation
                simulateLoading();
            }

            function simulateLoading() {
                const barFill = document.querySelector('.loader-bar-fill');
                const percentText = document.querySelector('.loader-percent');
                let progress = 0;

                // Random-ish increments to feel organic
                const interval = setInterval(() => {
                    const increment = Math.random() * 5 + 1; // 1% to 6% per tick
                    progress += increment;

                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        setTimeout(completeBoot, 200); // Shorter pause at 100%
                    }

                    if (barFill) barFill.style.width = `${progress}%`;
                    if (percentText) percentText.textContent = `${Math.floor(progress)}%`;
                }, 30); // 30ms interval = ~1 second total load time
            }

            function completeBoot() {
                const loaderContainer = document.querySelector('.loader-container');

                if (loaderContainer) loaderContainer.style.opacity = '0';
                if (bootOverlay) bootOverlay.style.opacity = '0';

                // Add the class that moves the globe
                document.body.classList.add('boot-complete');
                document.body.style.backgroundColor = '';

                // Reveal UI Elements - SYNCHRONIZED EXECUTION
                const hud = document.querySelector('.hud-overlay');
                const nav = document.querySelector('.navbar');
                const hero = document.querySelector('.hero-content');
                const globeContainer = document.getElementById('globe-container');

                // Double RequestAnimationFrame Pattern:
                // 1. First RAF: Waits for 'boot-complete' class to be processed (removing !important locks).
                // 2. Second RAF: Ensures a repaint has occurred.
                // 3. Execution: Adds .show-element classes to trigger CSS transitions smoothly.
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (hud) hud.classList.add('content-visible');
                        if (nav) nav.classList.add('content-visible');
                        if (hero) hero.classList.add('show-element');
                        if (globeContainer) globeContainer.classList.add('show-element');
                    });
                });

                setTimeout(() => {
                    if (bootOverlay) bootOverlay.style.display = 'none';
                }, 1500);
            }
        }
    }

    // --- ESTRELLAS DE FONDO ---
    if (starCanvas) {
        const ctx = starCanvas.getContext('2d');
        let width, height;
        let stars = [];
        function resizeStars() {
            width = window.innerWidth;
            height = window.innerHeight;
            starCanvas.width = width;
            starCanvas.height = height;
            initStars();
        }
        function initStars() {
            stars = [];
            const starCount = Math.floor((width * height) / 4000);
            for (let i = 0; i < starCount; i++) {
                stars.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1.5, speedX: (Math.random() - 0.5) * 0.2, speedY: (Math.random() - 0.5) * 0.2, opacity: Math.random() * 0.8 + 0.2 });
            }
        }
        function animateStars() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#ffffff';
            stars.forEach(star => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                star.x += star.speedX;
                star.y += star.speedY;
                if (star.x < 0) star.x = width; if (star.x > width) star.x = 0; if (star.y < 0) star.y = height; if (star.y > height) star.y = 0;
            });
            requestAnimationFrame(animateStars);
        }
        window.addEventListener('resize', resizeStars);
        resizeStars();
        animateStars();
    }
    // --- EFECTOS DE SCROLL ---
    // --- EFECTOS DE SCROLL OPTIMIZADOS ---
    // Optimización: Decoupled Scroll Handler
    // En lugar de calcular layout en cada evento scroll, solo guardamos el valor
    // y hacemos los cálculos costosos en el loop de requestAnimationFrame.

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        // No hacemos nada pesado aquí
    }, { passive: true }); // Passive listener improves scrolling performance

    let targetTimelineProgress = 0;
    let currentTimelineProgress = 0;

    const smoothTimelineScroll = () => {
        // Cálculo de Progreso movido al rAF loop
        const timelineSystem = document.querySelector('.vertical-timeline-system');
        if (timelineSystem) {
            const rect = timelineSystem.getBoundingClientRect(); // Costoso, pero necesario para posición relativa
            // Solo calculamos si es visible aproximadamente
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = (window.innerHeight / 2 - rect.top) / rect.height;
                targetTimelineProgress = Math.min(1, Math.max(0, progress));
            }
        }

        const activeFill = document.querySelector('.timeline-active-fill');
        const scrollingDot = document.querySelector('.timeline-scrolling-dot');
        const timelineMainLine = document.querySelector('.timeline-main-line');

        if (activeFill && scrollingDot && timelineMainLine) {
            currentTimelineProgress += (targetTimelineProgress - currentTimelineProgress) * 0.05;
            // Round to avoid pixel jitter
            const fillHeight = Math.round(currentTimelineProgress * timelineMainLine.offsetHeight * 10) / 10;

            activeFill.style.height = `${fillHeight}px`;
            scrollingDot.style.top = `${fillHeight}px`;
        }
        requestAnimationFrame(smoothTimelineScroll);
    };
    smoothTimelineScroll();

    // --- DASHBOARD DE HABILIDADES DINÁMICO ---
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const bar = entry.target.querySelector('.progress-bar');
            if (entry.isIntersecting) {
                const targetWidth = bar.getAttribute('data-width') || bar.style.width;
                if (!bar.getAttribute('data-width')) bar.setAttribute('data-width', targetWidth);

                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s cubic-bezier(0.19, 1, 0.22, 1)';
                    bar.style.width = targetWidth;
                }, 100);
            } else {
                bar.style.transition = 'none';
                bar.style.width = '0';
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.skill-module').forEach(mod => skillsObserver.observe(mod));

    // --- SALUDO DE CONTACTO SEGURO ---
    const secureEmail = document.querySelector('.secure-email');
    if (secureEmail) {
        const originalEmail = secureEmail.textContent;
        secureEmail.addEventListener('mouseenter', () => {
            let iteration = 0;
            const interval = setInterval(() => {
                secureEmail.textContent = originalEmail.split("").map((char, index) => {
                    if (index < iteration) return originalEmail[index];
                    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }).join("");
                if (iteration >= originalEmail.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
        });
    }

    // --- MINI TERMINAL (CTRL+K) ---
    const miniTerminal = document.getElementById('mini-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('mini-terminal-output');

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); miniTerminal.classList.toggle('terminal-hidden'); if (!miniTerminal.classList.contains('terminal-hidden')) terminalInput.focus(); }
        if (e.key === 'Escape') miniTerminal.classList.add('terminal-hidden');
    });
    terminalInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const cmd = terminalInput.value.toLowerCase().trim(); executeCommand(cmd); terminalInput.value = ''; } });

    function executeCommand(cmd) {
        if (!cmd) return;
        const line = document.createElement('div'); line.className = 'line cmd'; line.innerText = `> ${cmd}`; terminalOutput.appendChild(line);
        const response = document.createElement('div'); response.className = 'line';
        switch (cmd) {
            case 'help': response.innerText = 'AVAILABLE: PROJECTS, ABOUT, SKILLS, CONTACT, CV, CLEAR'; break;
            case 'projects': window.location.href = '#projects'; response.innerText = 'DISPLAYING PROJECT LOGS...'; miniTerminal.classList.add('terminal-hidden'); break;
            case 'about': window.location.href = '#about'; response.innerText = 'LEANDRO GRANEROS: IT SPECIALIST & WEB DEVELOPER.'; miniTerminal.classList.add('terminal-hidden'); break;
            case 'skills': window.location.href = '#skills'; response.innerText = 'CORE_STACK: JS, C, SQL, PYTHON, VBA, PS, UI/UX...'; miniTerminal.classList.add('terminal-hidden'); break;
            case 'contact': window.location.href = '#contact'; response.innerText = 'ESTABLISHING CONNECTION...'; miniTerminal.classList.add('terminal-hidden'); break;
            case 'cv': response.innerText = 'LINKING TO SECURE_CV_V2.025...'; break;
            case 'clear': terminalOutput.innerHTML = ''; return;
            default: response.innerText = `COMMAND NOT FOUND: ${cmd}. TYPE 'HELP'`;
        }
        terminalOutput.appendChild(response);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // --- EFECTO DE INCLINACIÓN 3D ---
    const tiltCards = document.querySelectorAll('.solid-card, .skill-module, .vault-item, .contact-terminal, .window-console');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // posición x dentro del elemento
            const y = e.clientY - rect.top;  // posición y dentro del elemento

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Máx rotación 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
});

// --- DATA AUTOMATION DASHBOARD LOGIC ---
function toggleDataAutomation() {
    const dashboard = document.getElementById('data-automation-dashboard');
    dashboard.classList.toggle('hidden-element');

    if (!dashboard.classList.contains('hidden-element')) {
        // Si se abre, iniciar la carga de datos
        fetchDataAutomation();
    }
}

async function fetchDataAutomation() {
    const apiStatus = document.getElementById('api-status');
    const tableBody = document.getElementById('stock-table-body');
    const logConsole = document.getElementById('process-log');

    apiStatus.textContent = "CONNECTING_TO_LOCALHOST:5000...";
    apiStatus.style.color = "var(--warning-yellow)";

    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">LOADING_DATA_STREAMS...</td></tr>';

    // Simular escritura en consola
    logConsole.innerHTML = "> inicializando protocolo de conexión...<br>";
    await new Promise(r => setTimeout(r, 500));
    logConsole.innerHTML += "> buscando servidor python local...<br>";

    try {
        // Intentar conectar con el backend real
        const response = await fetch('http://localhost:5000/api/optimizador');

        if (!response.ok) throw new Error("Server response not valid");

        const data = await response.json();

        logConsole.innerHTML += "> conexión exitosa. handshake validado.<br>> recibiendo datos optimizados por C-Logic...<br>";
        apiStatus.textContent = "SYSTEM_ONLINE [LOCAL_API_V1]";
        apiStatus.style.color = "var(--accent-green)";

        renderTable(data);

    } catch (error) {
        logConsole.innerHTML += "> ERROR DE CONEXIÓN: Servidor no encontrado.<br>> activando modo demostración (datos estáticos)...<br>";
        apiStatus.textContent = "OFFLINE_MODE [DEMO_DATA]";
        apiStatus.style.color = "var(--accent-cyan)";

        // DATOS DE FALLBACK (DEMO)
        // Esto asegura que el reclutador vea algo lindo aunque no corra el backend
        const demoData = [
            { id: 1, nombre: "Teclado Mecánico (DEMO)", stock_actual: 50, sugerencia_compra: 0, estado: "✅ Stock Saludable" },
            { id: 2, nombre: "Monitor 144hz (DEMO)", stock_actual: 10, sugerencia_compra: 35, estado: "⚠️ RESTOCK URGENTE" },
            { id: 3, nombre: "Mouse Gamer (DEMO)", stock_actual: 200, sugerencia_compra: 0, estado: "✅ Stock Saludable" },
            { id: 4, nombre: "GPU RTX 4090 (DEMO)", stock_actual: 2, sugerencia_compra: 15, estado: "⚠️ RESTOCK URGENTE" }
        ];

        await new Promise(r => setTimeout(r, 1000)); // Pequeña pausa dramática
        renderTable(demoData);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('stock-table-body');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');

        // Estilo condicional para el estado
        const statusStyle = item.sugerencia_compra > 0
            ? 'color: #ef4444; font-weight: bold;'
            : 'color: #22c55e;';

        row.innerHTML = `
            <td>#${String(item.id).padStart(3, '0')}</td>
            <td>${item.nombre}</td>
            <td>${item.stock_actual}</td>
            <td>${item.sugerencia_compra}</td>
            <td style="${statusStyle}">${item.estado}</td>
        `;
        tableBody.appendChild(row);
    });
}
