// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('matrix-rain');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 14;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Matrix Rain
new MatrixRain();

// Three.js Scene Setup
let scene, camera, renderer, controls;
let matrixGrid, robot, particles;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

// Initialize the 3D scene
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('game-canvas').appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x00ff00, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create Matrix grid
    createMatrixGrid();

    // Create floating objects
    createFloatingObjects();

    // Create robot
    createRobot();

    // Create particle system
    createParticleSystem();

    // Add point lights for dramatic effect
    addPointLights();

    // Set camera position
    camera.position.z = 15;

    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('touchmove', onTouchMove, false);
}

// Create Matrix-style grid
function createMatrixGrid() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.2,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });

    matrixGrid = new THREE.Group();
    const gridSize = 10;
    const spacing = 2;

    for (let x = -gridSize; x <= gridSize; x += spacing) {
        for (let z = -gridSize; z <= gridSize; z += spacing) {
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x, 0, z);
            matrixGrid.add(cube);
        }
    }

    scene.add(matrixGrid);
}

// Create floating geometric objects
function createFloatingObjects() {
    const objects = [];
    const geometries = [
        new THREE.IcosahedronGeometry(0.5),
        new THREE.TorusGeometry(0.5, 0.2),
        new THREE.OctahedronGeometry(0.5),
        new THREE.TetrahedronGeometry(0.5)
    ];

    const materials = [
        new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.6,
            emissive: 0x00ff00,
            emissiveIntensity: 0.5
        }),
        new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.4,
            emissive: 0x00ff00,
            emissiveIntensity: 0.3
        }),
        new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
            emissive: 0x00ff00,
            emissiveIntensity: 0.4
        }),
        new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7,
            emissive: 0x00ff00,
            emissiveIntensity: 0.6
        })
    ];

    for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        objects.push({
            mesh,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: (Math.random() - 0.5) * 0.02
        });

        scene.add(mesh);
    }

    return objects;
}

// Create robot with Matrix-style effects
function createRobot() {
    const robotGroup = new THREE.Group();

    // Robot body
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    robotGroup.add(body);

    // Robot head
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.9,
        emissive: 0x00ff00,
        emissiveIntensity: 0.6
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    robotGroup.add(head);

    // Add holographic rings
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.6;
    robotGroup.add(ring);

    robotGroup.position.y = 2;
    scene.add(robotGroup);
    robot = robotGroup;
}

// Create particle system for Matrix rain effect
function createParticleSystem() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50;
        positions[i + 1] = (Math.random() - 0.5) * 50;
        positions[i + 2] = (Math.random() - 0.5) * 50;

        velocities[i] = (Math.random() - 0.5) * 0.1;
        velocities[i + 1] = (Math.random() - 0.5) * 0.1;
        velocities[i + 2] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00ff00,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Add point lights for dramatic effect
function addPointLights() {
    const colors = [0x00ff00, 0x00ff00, 0x00ff00];
    const positions = [
        { x: 5, y: 5, z: 5 },
        { x: -5, y: -5, z: -5 },
        { x: 0, y: 0, z: 5 }
    ];

    colors.forEach((color, index) => {
        const light = new THREE.PointLight(color, 1, 10);
        light.position.set(
            positions[index].x,
            positions[index].y,
            positions[index].z
        );
        scene.add(light);
    });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement
function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

// Handle touch movement
function onTouchMove(event) {
    event.preventDefault();
    mouseX = (event.touches[0].clientX - window.innerWidth / 2) / 100;
    mouseY = (event.touches[0].clientY - window.innerHeight / 2) / 100;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update matrix grid rotation
    if (matrixGrid) {
        matrixGrid.rotation.y += 0.001;
    }

    // Update robot rotation based on mouse position
    if (robot) {
        targetRotationX += (mouseY - targetRotationX) * 0.05;
        targetRotationY += (mouseX - targetRotationY) * 0.05;
        robot.rotation.x = targetRotationX;
        robot.rotation.y = targetRotationY;
    }

    // Update particle system
    if (particles) {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Reset particles that go too far
            if (Math.abs(positions[i]) > 25 || Math.abs(positions[i + 1]) > 25 || Math.abs(positions[i + 2]) > 25) {
                positions[i] = (Math.random() - 0.5) * 10;
                positions[i + 1] = (Math.random() - 0.5) * 10;
                positions[i + 2] = (Math.random() - 0.5) * 10;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
    }

    // Update floating objects
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child !== robot) {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
            child.position.y += Math.sin(Date.now() * 0.001) * 0.01;
        }
    });

    renderer.render(scene, camera);
}

// Initialize scene and start animation
initScene();
animate();

// Add 3D card effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Add 3D effect to CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mousemove', (e) => {
        const rect = ctaButton.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        ctaButton.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.1, 1.1, 1.1)`;
    });

    ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 