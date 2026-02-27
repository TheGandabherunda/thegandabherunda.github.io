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
});