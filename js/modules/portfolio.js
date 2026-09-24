import { PROJECTS } from '../data/projects.js';
import { qs } from '../utils/helpers.js';

const createExternalLink = (project) => {
    const link = document.createElement('a');
    link.className = 'button-link project-action';
    link.href = project.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = project.cta;
    link.insertAdjacentHTML('beforeend', ' <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>');
    return link;
};

const createVisual = (project) => {
    const visual = document.createElement('div');
    visual.className = `project-visual project-visual--${project.visual}`;
    visual.setAttribute('aria-hidden', 'true');

    if (project.visual === 'atalaya') {
        visual.innerHTML = `
            <div class="project-visual-orbit project-visual-orbit--one"></div>
            <div class="project-visual-orbit project-visual-orbit--two"></div>
            <div class="project-visual-brand">
                <span>ATALAYA</span>
                <strong>24H</strong>
            </div>
            <span class="project-visual-caption">CIUDADANÍA · TERRITORIO · RESPUESTA</span>
        `;
    } else if (project.visual === 'quant') {
        visual.innerHTML = `
            <div class="quant-signal quant-signal--one"></div>
            <div class="quant-signal quant-signal--two"></div>
            <div class="quant-signal quant-signal--three"></div>
            <div class="quant-core"><span>Q</span></div>
            <div class="quant-label">MEMORIA · ESCENARIOS · EVOLUCIÓN</div>
        `;
    } else {
        visual.innerHTML = `
            <span class="demo-visual-index">${project.id === 'ferreteria' ? '01' : '02'}</span>
            <i class="fa-solid ${project.id === 'ferreteria' ? 'fa-screwdriver-wrench' : 'fa-leaf'}"></i>
        `;
    }

    return visual;
};

const createCard = (project) => {
    const card = document.createElement('article');
    card.className = `project-card project-card--${project.type}`;

    const body = document.createElement('div');
    body.className = 'project-card-body';

    const label = document.createElement('span');
    label.className = 'project-label';
    label.textContent = project.label;

    const title = document.createElement('h3');
    title.className = 'project-title';
    title.textContent = project.title;

    body.append(label, title);

    if (project.shortTitle) {
        const shortTitle = document.createElement('p');
        shortTitle.className = 'project-short-title';
        shortTitle.textContent = project.shortTitle;
        body.append(shortTitle);
    }

    if (project.status) {
        const status = document.createElement('p');
        status.className = 'project-status';
        status.textContent = project.status;
        body.append(status);
    }

    if (project.date) {
        const date = document.createElement('span');
        date.className = 'project-date';
        date.textContent = project.date;
        body.append(date);
    }

    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description;
    body.append(description);

    if (project.detail) {
        const detail = document.createElement('p');
        detail.className = 'project-detail';
        detail.textContent = project.detail;
        body.append(detail);
    }

    if (project.execution) {
        const execution = document.createElement('p');
        execution.className = 'project-execution';
        execution.textContent = project.execution;
        body.append(execution);
    }

    if (project.url) {
        body.append(createExternalLink(project));
    } else {
        const statusCta = document.createElement('span');
        statusCta.className = 'project-action project-action--status';
        statusCta.textContent = project.cta;
        body.append(statusCta);
    }

    card.append(createVisual(project), body);
    return card;
};

export const initPortfolio = () => {
    const portfolioGrid = qs('.portfolio-grid');
    if (!portfolioGrid) return;

    const headingTag = qs('.section-tag', qs('.portfolio'));
    const headingTitle = qs('.section-title', qs('.portfolio'));
    const headingSubtitle = qs('.section-subtitle', qs('.portfolio'));
    if (headingTag) headingTag.textContent = 'PROYECTOS';
    if (headingTitle) headingTitle.textContent = 'Tecnología que pasa de la idea al mundo real.';
    if (headingSubtitle) headingSubtitle.textContent = 'Productos propios, desarrollos demostrativos y soluciones que continúan evolucionando.';

    const featured = PROJECTS.find((project) => project.type === 'featured');
    const development = PROJECTS.find((project) => project.type === 'development');
    const demos = PROJECTS.filter((project) => project.type === 'demo');

    const demoGroup = document.createElement('div');
    demoGroup.className = 'project-demo-group';
    demoGroup.innerHTML = '<span class="project-group-label">EXPERIENCIAS Y DEMOSTRACIONES</span><div class="project-demo-grid"></div>';
    const demoGrid = demoGroup.querySelector('.project-demo-grid');
    demos.forEach((project) => demoGrid.append(createCard(project)));

    portfolioGrid.replaceChildren(
        featured && createCard(featured),
        development && createCard(development),
        demoGroup,
    );

    portfolioGrid.querySelectorAll('.project-card').forEach((card) => {
        if (card.parentElement === portfolioGrid) card.classList.add('project-card--primary-grid-item');
    });
};
