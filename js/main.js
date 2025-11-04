const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupProjectCarousel();
    setupPrivacyPolicy();
});

function setupEventListeners() {
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
            });
        });
    }

    const discordButtons = document.querySelectorAll('.discord-button');
    discordButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.open('https://discord.com/users/datenflieger', '_blank');
        });
    });
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('block');
}

function setupProjectCarousel() {
    const prevBtn = document.getElementById('prevProjectBtn');
    const nextBtn = document.getElementById('nextProjectBtn');
    const container = document.querySelector('.projects-carousel-container');
    const grid = document.querySelector('.projects-grid');
    const cards = document.querySelectorAll('.project-card');

    if (!prevBtn || !nextBtn || !container || !grid || !cards.length) {
        console.error('Carousel: Missing elements');
        return;
    }

    console.log('Infinite Carousel initialized with', cards.length, 'cards');
    let currentIndex = 0;
    const totalCards = cards.length;

    function updateCarousel() {
        const containerWidth = container.offsetWidth;
        const cardWidth = cards[0].getBoundingClientRect().width;
        const style = window.getComputedStyle(grid);
        const gap = parseFloat(style.gap) || 20;
        
        const centerOffset = (containerWidth / 2) - (cardWidth / 2);
        const cardOffset = currentIndex * (cardWidth + gap);
        const translateX = centerOffset - cardOffset;
        
        grid.style.transform = `translateX(${translateX}px)`;
        console.log('Centered card', currentIndex, 'at offset:', translateX);

        cards.forEach((card, i) => {
            if (i === currentIndex) {
                card.classList.add('active-project-card');
            } else {
                card.classList.remove('active-project-card');
            }
        });

        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
    }

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalCards - 1;
        }
        console.log('Prev → Index:', currentIndex);
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= totalCards) {
            currentIndex = 0;
        }
        console.log('Next → Index:', currentIndex);
        updateCarousel();
    });

    updateCarousel();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextBtn.click();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prevBtn.click();
        }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCarousel, 150);
    });
}

function setupPrivacyPolicy() {
    const privacyButton = document.getElementById('privacy-policy-button');
    const privacyPopup = document.getElementById('privacy-policy-popup');
    const closePrivacyBtn = document.getElementById('close-privacy-btn');

    if (privacyButton && privacyPopup && closePrivacyBtn) {
        privacyButton.addEventListener('click', function() {
            privacyPopup.classList.remove('hidden');
        });

        closePrivacyBtn.addEventListener('click', function() {
            privacyPopup.classList.add('hidden');
        });

        privacyPopup.addEventListener('click', function(event) {
            if (event.target === privacyPopup) {
                privacyPopup.classList.add('hidden');
            }
        });
    } else {
        console.warn('Privacy policy elements (button, popup, or close button) not found. Feature may not work as expected.');
    }
}