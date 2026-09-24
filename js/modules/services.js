import { SERVICES } from '../data/services.js';
import { qs } from '../utils/helpers.js';

/**
 * Selecciona una capacidad en el formulario de contacto y desplaza la vista suavemente.
 * @param {string} capability - Nombre exacto de la capacidad tecnológica.
 */
export const selectCapabilityInContactForm = (capability) => {
    const interestSelect = document.getElementById('interest');
    if (interestSelect && capability) {
        interestSelect.value = capability;
        interestSelect.dispatchEvent(new Event('change'));

        // Efecto visual sutil de confirmación de preselección
        interestSelect.classList.remove('highlight-pulse');
        void interestSelect.offsetWidth;
        interestSelect.classList.add('highlight-pulse');
    }

    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
};

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
                    <a href="#contacto" class="service-action" data-capability="${service.title}" aria-label="Hablemos de ${service.title}">
                        <span>Hablemos de esta solución</span>
                        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </a>
                </div>
            `;
            card.querySelector('.service-title').textContent = service.title;
            card.querySelector('.service-text').textContent = service.description;
            return card;
        })
    );

    // Delegación de eventos para clicks en los CTA de capacidades
    document.addEventListener('click', (event) => {
        const actionBtn = event.target.closest('[data-capability]');
        if (!actionBtn) return;

        const capability = actionBtn.getAttribute('data-capability');
        if (capability) {
            event.preventDefault();
            selectCapabilityInContactForm(capability);
        }
    });
};
