// --- Initial Theme Application ---
// Runs immediately to prevent FOUC
(function() {
    const storedTheme = localStorage.getItem('theme-preference');
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = storedTheme || systemTheme;
    document.documentElement.setAttribute('data-theme', initialTheme);
})();

// --- DOM Content Loaded Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Page Load Animation
    const animatedItems = document.querySelectorAll('.animate-on-load');
    const isMainIndex = document.getElementById('projects-scroll-container') !== null;
    animatedItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * (isMainIndex ? 50 : 100)); // Quicker cascade on the main page
    });

    // 2. Time Updater (Footer)
    const timeElement = document.getElementById('time');
    if (timeElement) {
        function updateTime() {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            };
            timeElement.textContent = now.toLocaleTimeString('en-US', options);
        }
        updateTime();
        setInterval(updateTime, 60000);
    }

    // 3. Hover Effects (Index Page)
    const bgOverlay = document.getElementById('background-overlay');
    const logoOverlay = document.getElementById('logo-overlay');
    const hoverLogo = document.getElementById('hover-logo');
    const fadeElements = document.querySelectorAll(
        '#main-logo-link, .hero-section h1, .hero-section p, .projects-section h2, .project-tile, #filter-container, #nav-arrow-container, section.px-8 h2, footer h4, footer ul a, .mt-16 p'
    );
    const projectTiles = document.querySelectorAll('.project-tile');
    const interactiveElements = document.querySelectorAll('.project-tile, footer a, #main-logo-link');
    const themeSwitcherContainer = document.querySelector('.theme-switcher-container');
    const allContentToFadeOnThemeHover = document.querySelectorAll(
        'main, footer > .flex, .mt-16 > p, .mt-16 .text-right'
    );

    if (themeSwitcherContainer) {
        themeSwitcherContainer.addEventListener('mouseenter', () => {
            allContentToFadeOnThemeHover.forEach(el => {
                el.style.transition = 'opacity 0.3s ease-in-out';
                el.style.opacity = '0.10';
            });
        });

        themeSwitcherContainer.addEventListener('mouseleave', () => {
            allContentToFadeOnThemeHover.forEach(el => {
                el.style.opacity = '1';
            });
        });
    }

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', e => {
            const currentItem = e.currentTarget;

            fadeElements.forEach(el => {
                el.style.opacity = '0.10';
                el.style.transition = 'opacity 0.3s ease-in-out';
            });

            currentItem.style.opacity = '1';

            if (currentItem.closest('footer')) {
                const parentSection = currentItem.closest('.animate-on-load');
                if (parentSection) {
                    const heading = parentSection.querySelector('h4');
                    if(heading) heading.style.opacity = '1';
                }
            }

            if (currentItem.id === 'main-logo-link') {
                const heroH1 = document.querySelector('.hero-section h1');
                const heroP = document.querySelector('.hero-section p');
                if (heroH1) heroH1.style.opacity = '1';
                if (heroP) heroP.style.opacity = '1';
            }

            const isProjectHover = currentItem.classList.contains('project-tile') || currentItem.id === 'main-logo-link';
            if (isProjectHover && hoverLogo && bgOverlay && logoOverlay) {
                const logoSrc = currentItem.dataset.logo;
                const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
                const gradient = isDarkMode ? currentItem.dataset.gradientDark : currentItem.dataset.gradient;

                if (logoSrc && gradient) {
                    hoverLogo.setAttribute('src', logoSrc);
                    bgOverlay.style.backgroundImage = gradient;
                    bgOverlay.style.opacity = '0.15';
                    logoOverlay.style.opacity = '1';
                }

                projectTiles.forEach(tile => {
                    if (tile !== currentItem) {
                        tile.classList.add('grayscale');
                    }
                });

                 if (currentItem.id === 'main-logo-link') {
                     projectTiles.forEach(tile => tile.classList.add('grayscale'));
                 }
            }
        });

        element.addEventListener('mouseleave', () => {
            fadeElements.forEach(el => {
                el.style.opacity = '1';
            });
            projectTiles.forEach(tile => {
                tile.classList.remove('grayscale');
            });
            if (bgOverlay) bgOverlay.style.opacity = '0';
            if (logoOverlay) logoOverlay.style.opacity = '0';
        });
    });

    // 4. Project Scroll & Filter Logic (Index Page)
    const scrollContainer = document.getElementById('projects-scroll-container');
    const leftBtn = document.getElementById('scroll-left-btn');
    const rightBtn = document.getElementById('scroll-right-btn');
    const filterButtonsContainer = document.getElementById('filter-buttons');

    const updateButtonState = () => {
        if (!scrollContainer || !leftBtn || !rightBtn) return;
        const tolerance = 1;
        leftBtn.disabled = scrollContainer.scrollLeft <= 0;
        rightBtn.disabled = scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - tolerance;
    };

    if (scrollContainer && leftBtn && rightBtn) {
        const scrollAmount = 384 + 32; // w-96 (384px) + gap-8 (32px)
        rightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        leftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        scrollContainer.addEventListener('scroll', updateButtonState);
        window.addEventListener('resize', updateButtonState);
        updateButtonState();
    }

    if (filterButtonsContainer && projectTiles.length > 0) {
        filterButtonsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.filter-btn');
            if (button) {
                const filter = button.dataset.filter;

                const activeBtn = filterButtonsContainer.querySelector('.active');
                if (activeBtn) activeBtn.classList.remove('active');
                button.classList.add('active');

                projectTiles.forEach(tile => {
                    const category = tile.dataset.category;
                    if (filter === 'all' || filter === category) {
                        tile.classList.remove('hidden');
                    } else {
                        tile.classList.add('hidden');
                    }
                });

                if (scrollContainer) {
                   scrollContainer.scrollLeft = 0;
                   setTimeout(updateButtonState, 50);
                }
            }
        });
    }

    // 5. Theme Switcher Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        htmlEl.className = theme; // Required for View Transition API targeting
        if (themeToggle) themeToggle.setAttribute('aria-label', theme);
    };

    if (themeToggle) {
        const toggleTheme = (event) => {
            const newTheme = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

            if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                localStorage.setItem('theme-preference', newTheme);
                applyTheme(newTheme);
                return;
            }

            const x = event.clientX;
            const y = event.clientY;
            const maxSize = Math.max(window.innerWidth, window.innerHeight) * 10;

            const transitionStyles = `
            ::view-transition-old(root),
            ::view-transition-new(root) {
                animation: none;
                mix-blend-mode: normal;
            }
            ::view-transition-group(root) {
                animation-duration: 1000ms;
                animation-timing-function: ease-in-out;
            }
            ::view-transition-new(root) {
                animation: themeReveal 1000ms ease-in-out;
                transform-origin: ${x}px ${y}px;
                mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-66 -66 132 132"><defs><filter id="blur"><feGaussianBlur stdDeviation="5"/></filter></defs><circle cx="0" cy="0" r="33" fill="black" filter="url(%23blur)"/></svg>') ${x}px ${y}px / 0 no-repeat;
            }
            ::view-transition-old(root),
            .dark::view-transition-old(root) {
                transform-origin: ${x}px ${y}px;
                animation: none;
                z-index: -1;
            }
            @keyframes themeReveal {
                0% { mask-position: ${x}px ${y}px; mask-size: 0; }
                100% { mask-position: ${x - maxSize / 2}px ${y - maxSize / 2}px; mask-size: ${maxSize}px; }
            }
            `;

            const styleSheet = document.createElement("style");
            styleSheet.id = "theme-transition-styles";
            styleSheet.textContent = transitionStyles;
            document.head.appendChild(styleSheet);

            const transition = document.startViewTransition(() => {
                localStorage.setItem('theme-preference', newTheme);
                applyTheme(newTheme);
            });

            transition.finished.then(() => {
                setTimeout(() => {
                    const styleElement = document.getElementById("theme-transition-styles");
                    if (styleElement) styleElement.remove();
                }, 100);
            }).catch((error) => {
                console.error("View transition failed:", error);
                localStorage.setItem('theme-preference', newTheme);
                applyTheme(newTheme);
            });
        };

        themeToggle.addEventListener('click', toggleTheme);
    }

    // Update on System Theme changes natively
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        const newSystemTheme = e.matches ? "dark" : "light";
        if (!localStorage.getItem('theme-preference')) {
            applyTheme(newSystemTheme);
        }
    });
});