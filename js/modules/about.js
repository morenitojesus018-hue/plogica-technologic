import { qs, qsa } from '../utils/helpers.js';

const MANIFESTO_DETAILS = {
    initial: {
        tag: 'ENFOQUE PLOGICA',
        title: 'Ideas que conectan oportunidades.',
        desc: 'Tecnología que las vuelve posibles.',
    },
    1: {
        tag: '01 · ENFOQUE CLAVE',
        title: 'Entender antes de construir',
        desc: 'Cada proyecto comienza identificando la necesidad real, el contexto y el resultado que se quiere alcanzar.',
    },
    2: {
        tag: '02 · APLICACIÓN REAL',
        title: 'Tecnología que funciona en el mundo real',
        desc: 'Diseñamos soluciones pensando en cómo serán utilizadas, operadas y evolucionadas en escenarios reales.',
    },
    3: {
        tag: '03 · VISIÓN DE FUTURO',
        title: 'Evolución constante',
        desc: 'Exploramos nuevas capacidades en automatización, inteligencia aplicada y sistemas conectados para seguir construyendo mejores soluciones.',
    },
};

export const initAbout = () => {
    const manifestoContainer = qs('.manifesto-blocks');
    const panel = qs('#aboutDynamicPanel');
    if (!manifestoContainer || !panel) return;

    const panelTag = qs('#panelTag', panel);
    const panelTitle = qs('#panelTitle', panel);
    const panelDesc = qs('#panelDesc', panel);
    const items = qsa('.manifesto-item', manifestoContainer);

    let currentActiveId = null;
    let transitionTimer;

    const updatePanelContent = (data) => {
        window.clearTimeout(transitionTimer);

        const applyContent = () => {
            if (panelTag) panelTag.textContent = data.tag;
            if (panelTitle) panelTitle.textContent = data.title;
            if (panelDesc) panelDesc.textContent = data.desc;
            panel.classList.remove('is-transitioning');
        };

        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            applyContent();
            return;
        }

        panel.classList.add('is-transitioning');
        transitionTimer = window.setTimeout(applyContent, 160);
    };

    items.forEach((item) => {
        item.addEventListener('click', () => {
            const manifestoId = item.getAttribute('data-manifesto');

            if (currentActiveId === manifestoId) {
                // Al presionar de nuevo la opción activa, vuelve al mensaje inicial
                item.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
                currentActiveId = null;
                updatePanelContent(MANIFESTO_DETAILS.initial);
            } else {
                items.forEach((other) => {
                    other.classList.remove('active');
                    other.setAttribute('aria-expanded', 'false');
                });

                item.classList.add('active');
                item.setAttribute('aria-expanded', 'true');
                currentActiveId = manifestoId;

                const detail = MANIFESTO_DETAILS[manifestoId] || MANIFESTO_DETAILS.initial;
                updatePanelContent(detail);
            }
        });
    });
};
