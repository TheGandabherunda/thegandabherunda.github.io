// --- DOM Content Loaded Logic ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Time Updater (Footer)
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

    // 2. Project Scroll & Filter Logic (Index Page)
    const scrollContainer = document.getElementById('projects-scroll-container');
    const leftBtn = document.getElementById('scroll-left-btn');
    const rightBtn = document.getElementById('scroll-right-btn');
    const filterButtonsContainer = document.getElementById('filter-buttons');
    const projectTiles = document.querySelectorAll('.project-tile');

    const updateButtonState = () => {
        if (!scrollContainer || !leftBtn || !rightBtn) return;
        const tolerance = 1;
        leftBtn.disabled = scrollContainer.scrollLeft <= 0;
        rightBtn.disabled = scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - tolerance;
    };

    if (scrollContainer && leftBtn && rightBtn) {
        const scrollAmount = 384 + 32; // w-96 (384px) + gap-8 (32px)
        rightBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'auto' });
        });
        leftBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'auto' });
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
                   updateButtonState();
                }
            }
        });
    }

    // 3. Advanced Metal & Light Logo Effect
    class LogoEffect {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) return;

            this.lightSource = document.getElementById('light-source');
            this.diffuseSource = document.getElementById('diffuse-source');
            this.diffuseFilter = document.getElementById('diffuse-filter');
            this.specularFilter = document.getElementById('specular-filter');
            this.shadowFilter = document.getElementById('dynamic-shadow');

            // SVG ViewBox dimensions
            this.vbWidth = 1038;
            this.vbHeight = 762;

            // Base intensities
            this.baseDiffuse = 1.2;
            this.baseSpecular = 2.5;

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

    // Initialize the logo effect
    new LogoEffect('main-logo-link');
});
