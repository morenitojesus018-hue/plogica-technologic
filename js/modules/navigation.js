import { qs, qsa } from '../utils/helpers.js';

const MOBILE_BREAKPOINT = 768;

const closeMobileMenu = (navToggle, navMenu) => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
};

const initMobileMenu = () => {
    const navToggle = qs('#navToggle');
    const navMenu = qs('#navMenu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    qsa('a', navMenu).forEach((link) => {
        link.addEventListener('click', () => closeMobileMenu(navToggle, navMenu));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMobileMenu(navToggle, navMenu);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            closeMobileMenu(navToggle, navMenu);
        }
    });
};

const initHeaderScroll = () => {
    const header = qs('.header');
    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
};

const initActiveLinks = () => {
    const sections = qsa('section[id]');
    const links = qsa('.nav-link');

    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                if (entry.target.id === 'inicio') {
                    links.forEach((link) => link.classList.remove('active'));
                    return;
                }

                links.forEach((link) => {
                    const matches = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active', matches);
                });
            });
        },
        { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
};

export const initNavigation = () => {
    initMobileMenu();
    initHeaderScroll();
    initActiveLinks();
};
