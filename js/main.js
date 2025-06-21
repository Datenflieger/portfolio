const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const pageDots = document.querySelectorAll('.page-dot');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

let currentSectionIndex = 0;
const sectionIds = ['skills', 'projects', 'contact'];

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
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSection = e.target.getAttribute('data-section');
            navigateToSection(targetSection);
        });
    });

    pageDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const targetSection = e.target.getAttribute('data-section');
            navigateToSection(targetSection);
        });
    });

    menuBtn.addEventListener('click', toggleMobileMenu);

    document.addEventListener('keydown', handleKeyNavigation);

    document.addEventListener('wheel', handleWheelNavigation, { passive: false });

    setupTouchNavigation();

    const discordButtons = document.querySelectorAll('.discord-button');
    discordButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.open('https://discord.com/users/datenflieger', '_blank');
        });
    });
}

function navigateToSection(sectionId) {
    currentSectionIndex = sectionIds.indexOf(sectionId);

    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    pageDots.forEach(dot => {
        if (dot.getAttribute('data-section') === sectionId) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    if (mobileMenu.classList.contains('block')) {
        toggleMobileMenu();
    }
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('block');
}

function handleKeyNavigation(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigateToNextSection();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigateToPrevSection();
    }
}

function navigateToNextSection() {
    let nextIndex = currentSectionIndex + 1;
    if (nextIndex >= sectionIds.length) {
        nextIndex = 0;
    }
    navigateToSection(sectionIds[nextIndex]);
}

function navigateToPrevSection() {
    let prevIndex = currentSectionIndex - 1;
    if (prevIndex < 0) {
        prevIndex = sectionIds.length - 1;
    }
    navigateToSection(sectionIds[prevIndex]);
}

function handleWheelNavigation(e) {
    const privacyPopup = document.getElementById('privacy-policy-popup');
    const privacyPopupContent = privacyPopup ? privacyPopup.querySelector('.privacy-popup-content') : null;

    if (privacyPopup && !privacyPopup.classList.contains('hidden')) {
        if (privacyPopupContent && privacyPopupContent.contains(e.target)) {
            return; 
        } else {
            e.preventDefault();
            return;
        }
    }

    if (wheelTimeout) {
        e.preventDefault();
        return;
    }

    const activeSection = sections[currentSectionIndex];
    const isScrollable = activeSection.scrollHeight > activeSection.clientHeight;
    const scrollBuffer = 10;

    if (e.deltaY > 0) {
        if (isScrollable && (activeSection.scrollTop + activeSection.clientHeight < activeSection.scrollHeight - scrollBuffer)) {
            return; 
        } else {
            e.preventDefault();
            wheelTimeout = setTimeout(() => {
                wheelTimeout = null;
            }, 800);
            navigateToNextSection();
        }
    } else if (e.deltaY < 0) {
        if (isScrollable && activeSection.scrollTop > scrollBuffer) {
            return;
        } else {
            e.preventDefault();
            wheelTimeout = setTimeout(() => {
                wheelTimeout = null;
            }, 800);
            navigateToPrevSection();
        }
    }
}

let wheelTimeout = null;

function setupTouchNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                navigateToNextSection();
            } else if (diffX < -50) {
                navigateToPrevSection();
            }
        } else {
            if (diffY > 50) {
                navigateToNextSection();
            } else if (diffY < -50) {
                navigateToPrevSection();
            }
        }
    });
}

function setupProjectCarousel() {
    const carouselContainer = document.querySelector('.projects-carousel-container');
    const projectsGrid = document.querySelector('.projects-grid');
    const prevButton = document.getElementById('prevProjectBtn');
    const nextButton = document.getElementById('nextProjectBtn');
    const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));

    if (!carouselContainer || !projectsGrid || !prevButton || !nextButton || projectCards.length === 0) {
        console.warn('Project carousel elements not found or no project cards. Carousel functionality will not be enabled.');
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
        return;
    }

    let currentActiveIndex = 1;
    const cardWidth = projectCards[0].offsetWidth;
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const gap = 1.5 * rootFontSize;

    function updateCarouselView(activeIndex) {
        const viewportWidth = carouselContainer.offsetWidth;
        let offsetX = (viewportWidth / 2) - (cardWidth / 2) - (activeIndex * (cardWidth + gap));

        projectsGrid.style.transform = `translateX(${offsetX}px)`;

        projectCards.forEach((card, index) => {
            if (index === activeIndex) {
                card.classList.add('active-project-card');
            } else {
                card.classList.remove('active-project-card');
            }
        });
    }

    nextButton.addEventListener('click', () => {
        currentActiveIndex++;
        if (currentActiveIndex >= projectCards.length) {
            currentActiveIndex = 0;
        }
        updateCarouselView(currentActiveIndex);
    });

    prevButton.addEventListener('click', () => {
        currentActiveIndex--;
        if (currentActiveIndex < 0) {
            currentActiveIndex = projectCards.length - 1;
        }
        updateCarouselView(currentActiveIndex);
    });

    updateCarouselView(currentActiveIndex);

    window.addEventListener('resize', () => {
        updateCarouselView(currentActiveIndex); 
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

