import { SERVICES } from '../data/services.js';
import { qs } from '../utils/helpers.js';

export const initServices = () => {
    const servicesGrid = qs('.services-grid');
    if (!servicesGrid) return;

    servicesGrid.replaceChildren(
        ...SERVICES.map((service) => {
            const card = document.createElement('article');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-icon">
                    <i class="fa-solid ${service.icon}"></i>
                </div>
                <h3 class="service-title"></h3>
                <p class="service-text"></p>
            `;
            card.querySelector('.service-title').textContent = service.title;
            card.querySelector('.service-text').textContent = service.description;
            return card;
        })
    );
};
