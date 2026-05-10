// --- DOM Content Loaded Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // 0. Smooth Scroll (Lenis)
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 0a. Reset Scroll to Top on Load
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }



    // 2. Advanced Metal & Light Logo Effect
    class LogoEffect {
        constructor(config) {
            this.container = document.getElementById(config.containerId);
            if (!this.container) return;

            this.lightSource = document.getElementById(config.lightSourceId);
            this.diffuseSource = document.getElementById(config.diffuseSourceId);
            this.diffuseFilter = document.getElementById(config.diffuseFilterId);
            this.specularFilter = document.getElementById(config.specularFilterId);
            this.shadowFilter = document.getElementById(config.shadowFilterId);

            // SVG ViewBox dimensions
            this.vbWidth = config.vbWidth || 1038;
            this.vbHeight = config.vbHeight || 762;

            // Base intensities
            this.baseDiffuse = config.baseDiffuse || 1.2;
            this.baseSpecular = config.baseSpecular || 2.5;

            this.init();
        }

        init() {
            window.addEventListener('mousemove', (e) => this.handleUpdate(e));
            this.container.addEventListener('mouseleave', () => this.reset());
        }

        handleUpdate(e) {
            const rect = this.container.getBoundingClientRect();

            // Calculate mouse position relative to logo center
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = e.clientX - centerX;
            const distY = e.clientY - centerY;

            // Map mouse position to SVG ViewBox coordinates
            const sensitivity = 1.2;
            const svgX = (this.vbWidth / 2) + (distX * (this.vbWidth / window.innerWidth) * sensitivity);
            const svgY = (this.vbHeight / 2) + (distY * (this.vbHeight / window.innerHeight) * sensitivity);

            // 1. Move the Light Sources
            if (this.lightSource) {
                this.lightSource.setAttribute('x', svgX);
                this.lightSource.setAttribute('y', svgY);
            }
            if (this.diffuseSource) {
                this.diffuseSource.setAttribute('x', svgX);
                this.diffuseSource.setAttribute('y', svgY);
            }

            // 2. Realistic Light Falloff (Inverse-Square simulation)
            const distance = Math.sqrt(distX**2 + distY**2);
            const maxRadius = 1000;
            const falloff = Math.max(0, 1 - (distance / maxRadius));

            if (this.diffuseFilter) {
                this.diffuseFilter.setAttribute('diffuseConstant', (this.baseDiffuse * falloff).toFixed(2));
            }
            if (this.specularFilter) {
                this.specularFilter.setAttribute('specularConstant', (this.baseSpecular * falloff).toFixed(2));
            }

            // 3. Physical Shadow Parallax (Grounded)
            if (this.shadowFilter) {
                const shadowMax = 5; // Much smaller to prevent floating look
                const shadowX = (distX / window.innerWidth) * -shadowMax;
                const shadowY = (distY / window.innerHeight) * -shadowMax;
                this.shadowFilter.setAttribute('dx', shadowX.toFixed(1));
                this.shadowFilter.setAttribute('dy', shadowY.toFixed(1));
            }

            // 4. Update CSS Glow Proximity
            const intensity = Math.max(0, 1 - (distance / 500));
            this.container.style.setProperty('--glow-opacity', intensity.toFixed(2));
            this.container.style.setProperty('--light-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            this.container.style.setProperty('--light-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        }

        reset() {
            // Return lights to center and base intensities
            const centerX = this.vbWidth / 2;
            const centerY = this.vbHeight / 2;

            if (this.lightSource) {
                this.lightSource.setAttribute('x', centerX);
                this.lightSource.setAttribute('y', centerY);
            }
            if (this.diffuseSource) {
                this.diffuseSource.setAttribute('x', centerX);
                this.diffuseSource.setAttribute('y', centerY);
            }
            if (this.diffuseFilter) {
                this.diffuseFilter.setAttribute('diffuseConstant', this.baseDiffuse);
            }
            if (this.specularFilter) {
                this.specularFilter.setAttribute('specularConstant', this.baseSpecular);
            }

            this.container.style.setProperty('--glow-opacity', '0');
            if (this.shadowFilter) {
                this.shadowFilter.setAttribute('dx', 0);
                this.shadowFilter.setAttribute('dy', 0);
            }
        }
    }

    // Initialize Hero Logo Effect
    new LogoEffect({
        containerId: 'main-logo-link',
        lightSourceId: 'light-source',
        diffuseSourceId: 'diffuse-source',
        diffuseFilterId: 'diffuse-filter',
        specularFilterId: 'specular-filter',
        shadowFilterId: 'dynamic-shadow'
    });

    // Initialize Preloader Logo Effect
    new LogoEffect({
        containerId: 'preloader-logo-container',
        lightSourceId: 'preloader-light-source',
        diffuseSourceId: 'preloader-diffuse-source',
        diffuseFilterId: 'preloader-diffuse-filter',
        specularFilterId: 'preloader-specular-filter',
        shadowFilterId: 'preloader-dynamic-shadow'
    });

    // Initialize Footer Logo Effect
    new LogoEffect({
        containerId: 'footer-logo-link',
        lightSourceId: 'footer-light-source',
        diffuseSourceId: 'footer-diffuse-source',
        diffuseFilterId: 'footer-diffuse-filter',
        specularFilterId: 'footer-specular-filter',
        shadowFilterId: 'footer-dynamic-shadow'
    });

    // Initialize Page Content Logo Effect (About/Terms/Privacy)
    new LogoEffect({
        containerId: 'target-logo-link',
        lightSourceId: 'page-light-source',
        diffuseSourceId: 'page-diffuse-source',
        diffuseFilterId: 'page-diffuse-filter',
        specularFilterId: 'page-specular-filter',
        shadowFilterId: 'page-dynamic-shadow'
    });

    // 4. Preloader Lifecycle & Seamless Transition
    const preloader = document.getElementById('preloader');
    const mainLogoLink = document.getElementById('main-logo-link');
    const projectTargetLogo = document.querySelector('.project-page-logo'); // For project pages
    const genericTargetLogo = document.getElementById('target-logo-link'); // For About/Privacy

    if (preloader) {
        const tl = gsap.timeline();

        // 1. Logo Scale Down - Smooth snap
        tl.fromTo('.preloader-logo-wrapper',
            { scale: 5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" }
        );

        // 2. Crossover Text (Behind Logo) - Start INSTANTLY, move elegantly
        tl.set('.preloader-word', { opacity: 1 }, 0);
        tl.fromTo('.preloader-row-1 .preloader-word',
            { x: '150vw' },
            { x: '-150vw', duration: 2.2, ease: "power2.inOut" },
            0
        );

        tl.fromTo('.preloader-row-2 .preloader-word',
            { x: '-150vw' },
            { x: '150vw', duration: 2.2, ease: "power2.inOut" },
            0
        );

        // 3. SEAMLESS MOVE: Transition preloader logo to hero position
        // Calculate exact center-to-center deltas for pixel-perfect landing
        const preWrapper = document.querySelector('.preloader-logo-wrapper');
        const targetElement = mainLogoLink || projectTargetLogo || genericTargetLogo;

        if (targetElement) {
            // Force temporary visibility and reset transforms to get TRUE final coordinates
            const originalOpacity = targetElement.style.opacity;
            const originalVisibility = targetElement.style.visibility;
            const parentElement = targetElement.closest('.project-page-main, .privacy-main, .hero-section');
            const parentTransform = parentElement ? parentElement.style.transform : null;

            // Prepare target for measurement - Ensure it's part of layout but invisible
            gsap.set(targetElement, { opacity: 0, visibility: 'visible', clearProps: "transform" });
            if (parentElement) gsap.set(parentElement, { clearProps: "transform", opacity: 1, visibility: 'visible' });

            const targetRect = targetElement.getBoundingClientRect();
            const currentRect = preWrapper.getBoundingClientRect();

            const moveX = (targetRect.left + targetRect.width / 2) - (currentRect.left + currentRect.width / 2);
            const moveY = (targetRect.top + targetRect.height / 2) - (currentRect.top + currentRect.height / 2);

            // Restore original state for measurement purposes
            gsap.set(targetElement, { opacity: originalOpacity, visibility: originalVisibility || 'hidden' });
            if (parentElement) {
                if (parentTransform) gsap.set(parentElement, { transform: parentTransform });
                // Only set opacity: 0 for project pages where we do a simple fade-in.
                // The Hero Section on index page should remain part of its existing TL reveal.
                if (!mainLogoLink) gsap.set(parentElement, { opacity: 0 });
            }

            // UNLOCK positioning so it can scroll during movement
            tl.set(preloader, { position: 'absolute' }, "-=0.5");

            // 3a. Show Scroll Bar early (as logo starts moving)
            tl.to('.scroll-progress-container', {
                opacity: 1,
                duration: 0.5
            }, "-=0.5");

            tl.to(preWrapper, {
                x: moveX,
                y: moveY,
                width: targetRect.width,
                height: targetRect.height,
                duration: 1.2,
                ease: "power3.inOut"
            }, "<");
        }

        // Clear preloader background
        tl.to(preloader, {
            backgroundColor: 'transparent',
            duration: 1.2
        }, "<");

        // INSTANT HAND-OFF: Remove fixed preloader as soon as logo arrives
        tl.add(() => {
            if (targetElement) {
                gsap.set(targetElement, { opacity: 1, visibility: 'visible' });
            }
            if (preloader) preloader.remove();
        });

        // 4. Reveal Screen Content
        if (mainLogoLink) {
            // Index Page Reveal - FORCE OPACITY
            tl.to('.hero-section', { opacity: 1, duration: 0.1 }, "-=0.1");

            tl.to('.hero-title', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            }, "-=0.6");

            tl.to('.hero-marquee-wrapper, .hero-subtitle', {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out"
            }, "<");

            tl.to('.projects-section, .thank-you-section', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                stagger: 0.3,
                ease: "power2.out"
            }, "-=0.4");
        } else {
            // Project Page/Standard Page Reveal
            tl.to('.project-page-main, .privacy-main, .about-main', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            }, "-=0.6");
        }
    }

    // 4a. Footer Scroll Animation
    gsap.utils.toArray('.footer').forEach(footer => {
        gsap.fromTo(footer,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: footer,
                    start: "top bottom-=100px", // Starts when footer is 100px from bottom of viewport
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 5. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        const updateProgressBar = (instant = false) => {
            const winScroll = lenis.scroll; // Use lenis scroll position
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;

            if (instant) {
                gsap.set(progressBar, { height: scrolled + "%" });
            } else {
                gsap.to(progressBar, {
                    height: scrolled + "%",
                    duration: 0.8,
                    ease: "elastic.out(1, 0.8)",
                    overwrite: "auto"
                });
            }
        };

        // Use Lenis scroll event for better sync
        lenis.on('scroll', () => updateProgressBar());

        // Initial call to set state
        updateProgressBar(true);
    }

    // 6. Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    let isMagnetMode = false;

    if (cursor) {
        // Track mouse movement
        window.addEventListener('mousemove', (e) => {
            if (isMagnetMode) return; // Don't follow mouse in magnet mode

            // Using GSAP for ultra-smooth tracking
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        });

        // Add hover effect for clickable items
        const interactiveElements = document.querySelectorAll('a, button, .filter-btn, .project-tile, .nav-arrow-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.classList.contains('footer-link')) {
                    isMagnetMode = true;
                    cursor.classList.add('magnet-mode');
                    const rect = el.getBoundingClientRect();
                    gsap.to(cursor, {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        width: rect.width,
                        height: rect.height,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else if (el.classList.contains('project-tile')) {
                    cursor.classList.add('project-hover');
                    gsap.to(cursor, {
                        width: 52,
                        height: 19,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    cursor.classList.add('hover');
                }
            });

            el.addEventListener('mouseleave', () => {
                isMagnetMode = false;
                cursor.classList.remove('hover');
                cursor.classList.remove('project-hover');
                cursor.classList.remove('magnet-mode');

                // Only reset if not moving into text-mode (which handles its own reset)
                if (!cursor.classList.contains('text-mode')) {
                    gsap.to(cursor, {
                        width: 16,
                        height: 16,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });

        // Hide cursor when it leaves the window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });

        // 6b. Click Animation (Scale down on click)
        window.addEventListener('mousedown', () => {
            gsap.to(cursor, {
                scale: 0.7,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        window.addEventListener('mouseup', () => {
            gsap.to(cursor, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        // 6a. Dynamic Text Adaptation
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, li, span');
        textElements.forEach(el => {
            if (el.closest('a') || el.closest('button') || el.closest('.filter-btn')) return;

            el.addEventListener('mouseenter', () => {
                const style = window.getComputedStyle(el);
                const fontSize = parseFloat(style.fontSize);
                const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;
                const targetHeight = Math.max(fontSize, lineHeight);

                cursor.classList.add('text-mode');

                gsap.to(cursor, {
                    width: 2,
                    height: targetHeight,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('text-mode');

                gsap.to(cursor, {
                    width: 16,
                    height: 16,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
});
