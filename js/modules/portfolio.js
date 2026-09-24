import { PROJECTS } from '../data/projects.js';
import { qs } from '../utils/helpers.js';

export const initPortfolio = () => {
    const portfolioGrid = qs('.portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.replaceChildren(
        ...PROJECTS.map((project) => {
            const card = document.createElement('article');
            card.className = 'portfolio-card';
            card.innerHTML = `
                <div class="portfolio-thumb" aria-hidden="true">
                    <i class="fa-solid ${project.icon}"></i>
                </div>
                <div class="portfolio-body">
                    <h3 class="portfolio-title"></h3>
                    <p class="portfolio-text"></p>
                    <a href="" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                        Ver proyecto <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            `;
            card.querySelector('.portfolio-title').textContent = project.title;
            card.querySelector('.portfolio-text').textContent = project.description;
            card.querySelector('a').href = project.url;
            return card;
        })
    );
};
