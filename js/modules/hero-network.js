import { qs } from '../utils/helpers.js';

const MAX_DEVICE_PIXEL_RATIO = 2;
const CONNECTION_DISTANCE = 175;

const initHeroNetwork = () => {
    const heroBackground = qs('.hero-bg');
    if (!heroBackground || !('requestAnimationFrame' in window)) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-network';
    canvas.setAttribute('aria-hidden', 'true');
    heroBackground.appendChild(canvas);

    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let nodes = [];
    let width = 0;
    let height = 0;
    let animationFrame = null;
    let isVisible = true;
    let lastTimestamp = 0;

    const createNodes = () => {
        const nodeCount = Math.min(30, Math.max(14, Math.round(width / 58)));

        nodes = Array.from({ length: nodeCount }, (_, index) => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: index % 7 === 0 ? 2.4 : 1.4,
            driftX: (Math.random() - 0.5) * 0.12,
            driftY: (Math.random() - 0.5) * 0.08,
            phase: Math.random() * Math.PI * 2,
        }));
    };

    const drawFrame = (deltaSeconds) => {
        context.clearRect(0, 0, width, height);

        nodes.forEach((node) => {
            if (deltaSeconds > 0) {
                node.x += node.driftX * deltaSeconds * 60;
                node.y += node.driftY * deltaSeconds * 60;

                if (node.x < -20) node.x = width + 20;
                if (node.x > width + 20) node.x = -20;
                if (node.y < -20) node.y = height + 20;
                if (node.y > height + 20) node.y = -20;
            }
        });

        for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
            const firstNode = nodes[firstIndex];

            for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
                const secondNode = nodes[secondIndex];
                const distance = Math.hypot(firstNode.x - secondNode.x, firstNode.y - secondNode.y);

                if (distance > CONNECTION_DISTANCE) continue;

                const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.18;
                context.beginPath();
                context.moveTo(firstNode.x, firstNode.y);
                context.lineTo(secondNode.x, secondNode.y);
                context.strokeStyle = `rgba(23, 185, 174, ${opacity})`;
                context.lineWidth = 1;
                context.stroke();
            }
        }

        nodes.forEach((node) => {
            const breathing = reducedMotionQuery.matches
                ? 0
                : Math.sin(performance.now() / 1800 + node.phase) * 0.35;

            context.beginPath();
            context.arc(node.x, node.y, node.radius + breathing, 0, Math.PI * 2);
            context.fillStyle = 'rgba(23, 185, 174, 0.42)';
            context.fill();
        });
    };

    const resizeCanvas = () => {
        const bounds = heroBackground.getBoundingClientRect();
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);

        width = bounds.width;
        height = bounds.height;
        canvas.width = Math.floor(width * devicePixelRatio);
        canvas.height = Math.floor(height * devicePixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        createNodes();
        drawFrame(0);
    };

    const stopAnimation = () => {
        if (animationFrame === null) return;
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
        lastTimestamp = 0;
    };

    const animate = (timestamp) => {
        if (!isVisible || reducedMotionQuery.matches) {
            animationFrame = null;
            drawFrame(0);
            return;
        }

        const deltaSeconds = lastTimestamp
            ? Math.min(timestamp - lastTimestamp, 40) / 1000
            : 0;
        lastTimestamp = timestamp;
        drawFrame(deltaSeconds);
        animationFrame = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
        if (animationFrame !== null || !isVisible || reducedMotionQuery.matches) return;
        animationFrame = requestAnimationFrame(animate);
    };

    const updateMotionPreference = () => {
        stopAnimation();
        drawFrame(0);
        startAnimation();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    if ('addEventListener' in reducedMotionQuery) {
        reducedMotionQuery.addEventListener('change', updateMotionPreference);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) startAnimation();
            else stopAnimation();
        });
        observer.observe(heroBackground);
    }

    startAnimation();
};

export { initHeroNetwork };
