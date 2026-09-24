import { qs } from '../utils/helpers.js';

const MAX_DEVICE_PIXEL_RATIO = 2;
const CONNECTION_DISTANCE = 190;
const NODE_ANCHORS = [
    [0.06, 0.18], [0.15, 0.30], [0.07, 0.48], [0.18, 0.62], [0.29, 0.16],
    [0.25, 0.80], [0.36, 0.28], [0.42, 0.78], [0.52, 0.15], [0.57, 0.84],
    [0.65, 0.26], [0.72, 0.72], [0.82, 0.16], [0.90, 0.35], [0.96, 0.60],
    [0.82, 0.86], [0.69, 0.48], [0.31, 0.48], [0.11, 0.82], [0.93, 0.12],
    [0.47, 0.48], [0.76, 0.92], [0.04, 0.70], [0.97, 0.78], [0.58, 0.40],
    [0.21, 0.12], [0.87, 0.54], [0.39, 0.92], [0.13, 0.44], [0.88, 0.78],
    [0.73, 0.12], [0.33, 0.68], [0.62, 0.64], [0.97, 0.22],
];

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
    let elapsedSeconds = 0;

    const createNodes = () => {
        const nodeCount = Math.min(NODE_ANCHORS.length, Math.max(18, Math.round(width / 42)));

        const anchorStep = (NODE_ANCHORS.length - 1) / (nodeCount - 1);

        nodes = Array.from({ length: nodeCount }, (_, index) => {
            const [anchorX, anchorY] = NODE_ANCHORS[Math.round(index * anchorStep)];
            const depth = 0.5 + ((index * 17) % 10) / 20;
            const spread = Math.min(width, height) * 0.018;

            return {
                x: anchorX * width + (Math.random() - 0.5) * spread,
                y: anchorY * height + (Math.random() - 0.5) * spread,
                radius: 1.6 + depth * 2.1,
                alpha: 0.34 + depth * 0.34,
                depth,
                driftX: (Math.random() - 0.5) * (0.08 + depth * 0.06),
                driftY: (Math.random() - 0.5) * (0.06 + depth * 0.04),
                phase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.7 + Math.random() * 0.7,
            };
        });
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

        const connectionCounts = nodes.map(() => 0);

        for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
            const firstNode = nodes[firstIndex];

            for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
                const secondNode = nodes[secondIndex];
                const distance = Math.hypot(firstNode.x - secondNode.x, firstNode.y - secondNode.y);

                if (
                    distance > CONNECTION_DISTANCE
                    || connectionCounts[firstIndex] >= 3
                    || connectionCounts[secondIndex] >= 3
                ) continue;

                const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.28;
                context.beginPath();
                context.moveTo(firstNode.x, firstNode.y);
                context.lineTo(secondNode.x, secondNode.y);
                context.strokeStyle = `rgba(23, 185, 174, ${opacity})`;
                context.lineWidth = firstNode.depth > 0.78 && secondNode.depth > 0.78 ? 1.15 : 0.85;
                context.stroke();
                connectionCounts[firstIndex] += 1;
                connectionCounts[secondIndex] += 1;
            }
        }

        nodes.forEach((node) => {
            const pulse = reducedMotionQuery.matches
                ? 0
                : Math.sin(elapsedSeconds * node.pulseSpeed + node.phase);
            const breathing = pulse * 0.55;
            const radius = node.radius + breathing * 0.35;

            if (node.depth > 0.72) {
                const glow = context.createRadialGradient(
                    node.x,
                    node.y,
                    0,
                    node.x,
                    node.y,
                    radius * 6
                );
                glow.addColorStop(0, `rgba(36, 220, 203, ${node.alpha * 0.22})`);
                glow.addColorStop(1, 'rgba(36, 220, 203, 0)');
                context.beginPath();
                context.arc(node.x, node.y, radius * 6, 0, Math.PI * 2);
                context.fillStyle = glow;
                context.fill();
            }

            context.beginPath();
            context.arc(node.x, node.y, radius, 0, Math.PI * 2);
            context.fillStyle = `rgba(23, 185, 174, ${Math.max(0.24, node.alpha + pulse * 0.06)})`;
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
        elapsedSeconds += deltaSeconds;
        drawFrame(deltaSeconds);
        animationFrame = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
        if (animationFrame !== null || !isVisible || reducedMotionQuery.matches) return;
        animationFrame = requestAnimationFrame(animate);
    };

    const updateMotionPreference = () => {
        stopAnimation();
        elapsedSeconds = 0;
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
