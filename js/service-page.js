import { onDomReady } from './utils/helpers.js';
import { initScrollReveal } from './modules/scroll-reveal.js';

const SERVICE_REVEAL_SELECTORS = [
    '.service-hero-content',
    '.service-signal-panel',
    '.service-copy-grid',
    '.service-heading',
    '.service-capability-card',
    '.service-fit-intro',
    '.service-fit-list li',
    '.service-process-list li',
    '.service-benefits-heading',
    '.service-benefits-grid article',
    '.service-cta-panel',
];

onDomReady(() => {
    initScrollReveal({
        selectors: SERVICE_REVEAL_SELECTORS,
        mobileGroupedSelectors: [],
        mobileGroupReplacements: [],
        staggerGroups: [
            '.service-capability-grid',
            '.service-fit-list',
            '.service-process-list',
            '.service-benefits-grid',
        ],
    });
});
