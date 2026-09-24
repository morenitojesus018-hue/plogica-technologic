/* Punto de entrada de la aplicación vanilla de Plogica Technologic. */
import { onDomReady } from './utils/helpers.js';
import { initNavigation } from './modules/navigation.js';
import { initServices } from './modules/services.js';
import { initPortfolio } from './modules/portfolio.js';
import { initContact } from './modules/contact.js';

onDomReady(() => {
    initNavigation();
    initServices();
    initPortfolio();
    initContact();
});
