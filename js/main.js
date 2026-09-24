/* Punto de entrada de la aplicación vanilla de Plogica Technologic. */
import { onDomReady } from './utils/helpers.js';
import { initNavigation } from './modules/navigation.js';
import { initServices } from './modules/services.js';
import { initAbout } from './modules/about.js';
import { initPortfolio } from './modules/portfolio.js';
import { initContact } from './modules/contact.js';
import { initHeroNetwork } from './modules/hero-network.js';

onDomReady(() => {
    initNavigation();
    initServices();
    initAbout();
    initPortfolio();
    initContact();
    initHeroNetwork();
});
