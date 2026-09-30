import { qsa } from '../utils/helpers.js';

const REVEAL_SELECTORS = [
    '.hero-badge',
    '.hero-title',
    '.hero-subtitle',
    '.hero-manifesto',
    '.hero-actions',
    '.section-heading',
    '.service-card',
    '.manifesto-item',
    '.about-identity-callout',
    '.principle-node',
    '.focus-area-card',
    '.project-card',
    '.contact-info',
    '.contact-form',
];

const MOBILE_GROUPED_SELECTORS = [
    '.manifesto-item',
    '.principle-node',
];

export const initScrollReveal = ({
    selectors: customSelectors = REVEAL_SELECTORS,
    mobileGroupedSelectors = MOBILE_GROUPED_SELECTORS,
    mobileGroupReplacements = ['.about-manifesto', '.about-principles-wrapper'],
    staggerGroups = [],
} = {}) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const selectors = isMobile
        ? customSelectors.filter((selector) => !mobileGroupedSelectors.includes(selector))
        : [...customSelectors];

    if (isMobile) selectors.push(...mobileGroupReplacements);

    const elements = qsa(selectors.join(','));
    if (!elements.length) return;

    // Hysteresis: an element enters at 16% (12% on mobile), but is only
    // rearmed once its visible area falls to 3% or less.
    const enterThreshold = isMobile ? 0.12 : 0.16;
    const resetThreshold = 0.03;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const element = entry.target;

            if (entry.intersectionRatio >= enterThreshold) {
                element.classList.add('is-visible');
                return;
            }

            if (entry.intersectionRatio <= resetThreshold) {
                element.classList.remove('is-visible');
            }
        });
    }, {
        threshold: [0, resetThreshold, enterThreshold],
        rootMargin: '0px 0px -4% 0px',
    });

    elements.forEach((element) => {
        element.classList.add('scroll-reveal');
        observer.observe(element);
    });

    staggerGroups.forEach((selector) => {
        qsa(selector).forEach((group) => {
            [...group.children].forEach((element, index) => {
                element.style.setProperty('--reveal-order', index % (isMobile ? 2 : 4));
            });
        });
    });
};
