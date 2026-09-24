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
                <div class="service-card-header">
                    <div class="service-icon" aria-hidden="true">
                        <i class="fa-solid ${service.icon}"></i>
                    </div>
                    <span class="service-num" aria-hidden="true">${service.num}</span>
                </div>
                <div class="service-card-body">
                    <h3 class="service-title"></h3>
                    <p class="service-text"></p>
                </div>
                <div class="service-card-footer">
                    <a href="#contacto" class="service-action" aria-label="Consultar sobre ${service.title}">
                        <span>Ver capacidad</span>
                        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </a>
                </div>
            `;
            card.querySelector('.service-title').textContent = service.title;
            card.querySelector('.service-text').textContent = service.description;
            return card;
        })
    );
};
