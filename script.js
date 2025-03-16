// Scena
const scene = new THREE.Scene();

// Kamera (gracz)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Oświetlenie
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512; // Zmniejszono dla wydajności
directionalLight.shadow.mapSize.height = 512;
scene.add(directionalLight);

// Tekstury
const textureLoader = new THREE.TextureLoader();
const groundTextures = {
    factory: textureLoader.load('https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg'),
    forest: textureLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg'),
    city: textureLoader.load('https://threejs.org/examples/textures/terrain/roughness_map.jpg'),
    arena: textureLoader.load('https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg'),
    space: textureLoader.load('https://threejs.org/examples/textures/lava/lavatile.jpg')
};
Object.values(groundTextures).forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
});
const wallTextures = {
    factory: textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg'),
    forest: textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg'),
    city: textureLoader.load('https://threejs.org/examples/textures/brick_roughness.jpg'),
    arena: textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg'),
    space: textureLoader.load('https://threejs.org/examples/textures/metal/Metal_Corrugated_001_basecolor.jpg')
};
const boxTextures = {
    factory: textureLoader.load('https://threejs.org/examples/textures/crate.gif'),
    forest: textureLoader.load('https://threejs.org/examples/textures/wood/wood_box.jpg'),
    city: textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg'),
    arena: textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg'),
    space: textureLoader.load('https://threejs.org/examples/textures/metal/Metal_Grid_002_basecolor.jpg')
};
const enemyTexture = textureLoader.load('https://threejs.org/examples/textures/lava/lavatile.jpg');

// Skyboxy
const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxes = {
    factory: skyboxLoader.load([
        'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
        'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
    ]),
    forest: skyboxLoader.load([
        'https://threejs.org/examples/textures/skyboxsun25deg/px.jpg',
        'https://threejs.org/examples/textures/skyboxsun25deg/nx.jpg',
        'https://threejs.org/examples/textures/skyboxsun25deg/py.jpg',
        'https://threejs.org/examples/textures/skyboxsun25deg/ny.jpg',
        'https://threejs.org/examples/textures/skyboxsun25deg/pz.jpg',
        'https://threejs.org/examples/textures/skyboxsun25deg/nz.jpg'
    ]),
    city: skyboxLoader.load([
        'https://threejs.org/examples/textures/cube/MilkyWay/posx.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/negx.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/posy.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/negy.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/posz.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/negz.jpg'
    ]),
    arena: skyboxLoader.load([
        'https://threejs.org/examples/textures/cube/pisa/px.jpg',
        'https://threejs.org/examples/textures/cube/pisa/nx.jpg',
        'https://threejs.org/examples/textures/cube/pisa/py.jpg',
        'https://threejs.org/examples/textures/cube/pisa/ny.jpg',
        'https://threejs.org/examples/textures/cube/pisa/pz.jpg',
        'https://threejs.org/examples/textures/cube/pisa/nz.jpg'
    ]),
    space: skyboxLoader.load([
        'https://threejs.org/examples/textures/cube/MilkyWay/posx.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/negx.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/posy.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/negy.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/posz.jpg',
        'https://threejs.org/examples/textures/cube/MilkyWay/negz.jpg'
    ])
};

// Definicje map
let currentMap = 'factory';
const maps = {
    factory: { ground: groundTextures.factory, wall: wallTextures.factory, box: boxTextures.factory, skybox: skyboxes.factory },
    forest: { ground: groundTextures.forest, wall: wallTextures.forest, box: boxTextures.forest, skybox: skyboxes.forest },
    city: { ground: groundTextures.city, wall: wallTextures.city, box: boxTextures.city, skybox: skyboxes.city },
    arena: { ground: groundTextures.arena, wall: wallTextures.arena, box: boxTextures.arena, skybox: skyboxes.arena },
    space: { ground: groundTextures.space, wall: wallTextures.space, box: boxTextures.space, skybox: skyboxes.space }
};

// Podłoże
const groundGeometry = new THREE.PlaneGeometry(50, 50);
let groundMaterial = new THREE.MeshStandardMaterial({ map: maps[currentMap].ground });
let ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Ściany
const wallGeometry = new THREE.BoxGeometry(50, 10, 1);
let wallMaterial = new THREE.MeshStandardMaterial({ map: maps[currentMap].wall });
const walls = [
    new THREE.Mesh(wallGeometry, wallMaterial),
    new THREE.Mesh(wallGeometry, wallMaterial),
    new THREE.Mesh(new THREE.BoxGeometry(1, 10, 50), wallMaterial),
    new THREE.Mesh(new THREE.BoxGeometry(1, 10, 50), wallMaterial)
];
walls[0].position.set(0, 5, -25);
walls[1].position.set(0, 5, 25);
walls[2].position.set(25, 5, 0);
walls[3].position.set(-25, 5, 0);
walls.forEach(wall => {
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
});

// Przeciwnicy
const enemies = [];
function spawnEnemy() {
    const enemy = new THREE.Group();
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const limbGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
    const material = new THREE.MeshStandardMaterial({ map: enemyTexture });

    const head = new THREE.Mesh(headGeometry, material);
    head.position.y = 1.15;
    head.castShadow = true;

    const body = new THREE.Mesh(bodyGeometry, material);
    body.position.y = 0.5;
    body.castShadow = true;

    const leftArm = new THREE.Mesh(limbGeometry, material);
    leftArm.position.set(-0.4, 0.7, 0);
    leftArm.castShadow = true;

    const rightArm = new THREE.Mesh(limbGeometry, material);
    rightArm.position.set(0.4, 0.7, 0);
    rightArm.castShadow = true;

    const leftLeg = new THREE.Mesh(limbGeometry, material);
    leftLeg.position.set(-0.2, 0.2, 0);
    leftLeg.castShadow = true;

    const rightLeg = new THREE.Mesh(limbGeometry, material);
    rightLeg.position.set(0.2, 0.2, 0);
    rightLeg.castShadow = true;

    enemy.add(head);
    enemy.add(body);
    enemy.add(leftArm);
    enemy.add(rightArm);
    enemy.add(leftLeg);
    enemy.add(rightLeg);
    enemy.position.set(Math.random() * 40 - 20, 0, Math.random() * 40 - 20);
    enemy.lastShotTime = 0;
    enemy.animationTime = 0;
    enemies.push(enemy);
    scene.add(enemy);
}

// Strzelanie wrogów
function enemyShoot(enemy) {
    const now = performance.now();
    if (now - enemy.lastShotTime < 2000) return;
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8); // Zmniejszono detale
    const bulletMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(enemy.position);
    bullet.position.y += 1.15;
    const target = Math.random() < 0.5 && enemies.length > 1 ? 
        enemies[Math.floor(Math.random() * enemies.length)] : camera;
    if (target === enemy) return;
    const direction = target.position.clone().sub(enemy.position).normalize();
    bullet.velocity = direction.multiplyScalar(3);
    bullet.castShadow = true;
    bullet.isEnemyBullet = true;
    scene.add(bullet);
    setTimeout(() => scene.remove(bullet), 2000);
    enemy.lastShotTime = now;
}

// Efekt wybuchu
function createExplosion(position) {
    const particleCount = 5; // Zmniejszono dla wydajności
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4); // Zmniejszono detale
        const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        particles.push(particle);
        scene.add(particle);
    }
    setTimeout(() => particles.forEach(p => scene.remove(p)), 500);
}

// Przeszkody (skrzynie)
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
let boxMaterial = new THREE.MeshStandardMaterial({ map: maps[currentMap].box });
const boxes = [];
function spawnBoxes() {
    boxes.forEach(box => scene.remove(box));
    boxes.length = 0;
    for (let i = 0; i < 15; i++) { // Zmniejszono do 15 dla wydajności
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(Math.random() * 48 - 24, 1, Math.random() * 48 - 24);
        box.castShadow = true;
        box.receiveShadow = true;
        boxes.push(box);
        scene.add(box);
    }
}

// Power-upy
const powerUps = [];
function spawnPowerUp() {
    const powerUpGeometry = new THREE.SphereGeometry(0.5, 8, 8); // Zmniejszono detale
    const type = Math.random() < 0.33 ? 'rapidFire' : Math.random() < 0.66 ? 'bigBullets' : 'shield';
    const powerUpMaterial = new THREE.MeshStandardMaterial({ 
        color: type === 'rapidFire' ? 0x00ff00 : type === 'bigBullets' ? 0x0000ff : 0x00ffff 
    });
    const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);
    powerUp.position.set(Math.random() * 48 - 24, 0.5, Math.random() * 48 - 24);
    powerUp.type = type;
    powerUp.castShadow = true;
    powerUps.push(powerUp);
    scene.add(powerUp);
}

// Menu i elementy UI
const menu = document.getElementById('menu');
const mapButtons = document.getElementsByClassName('mapButton');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const countdownDisplay = document.getElementById('countdown');
const legendDisplay = document.getElementById('legend');
const crosshair = document.getElementById('crosshair');
const touchControls = document.getElementById('touchControls');
const joystickLeft = document.getElementById('joystickLeft');
const joystickRight = document.getElementById('joystickRight');
const jumpButton = document.getElementById('jumpButton');
const shootButton = document.getElementById('shootButton');
const weaponButton = document.getElementById('weaponButton');
const viewButton = document.getElementById('viewButton');

let gameStarted = false;
let countdownActive = false;
let timeLeft = 180;
let powerUpTimer = 0;
let shieldActive = false;
let isThirdPerson = false;

// Sterowanie dotykowe
let moveJoystick = { active: false, x: 0, y: 0, startX: 0, startY: 0 };
let lookJoystick = { active: false, x: 0, y: 0, startX: 0, startY: 0 };

joystickLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveJoystick.active = true;
    moveJoystick.startX = e.touches[0].clientX;
    moveJoystick.startY = e.touches[0].clientY;
});
joystickLeft.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (moveJoystick.active) {
        moveJoystick.x = (e.touches[0].clientX - moveJoystick.startX) / 40;
        moveJoystick.y = (e.touches[0].clientY - moveJoystick.startY) / 40;
        moveJoystick.x = Math.max(-1, Math.min(1, moveJoystick.x));
        moveJoystick.y = Math.max(-1, Math.min(1, moveJoystick.y));
    }
});
joystickLeft.addEventListener('touchend', () => {
    moveJoystick.active = false;
    moveJoystick.x = 0;
    moveJoystick.y = 0;
});

joystickRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    lookJoystick.active = true;
    lookJoystick.startX = e.touches[0].clientX;
    lookJoystick.startY = e.touches[0].clientY;
});
joystickRight.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (lookJoystick.active) {
        lookJoystick.x = (e.touches[0].clientX - lookJoystick.startX) * 0.002;
        lookJoystick.y = (e.touches[0].clientY - lookJoystick.startY) * 0.002;
    }
});
joystickRight.addEventListener('touchend', () => {
    lookJoystick.active = false;
    lookJoystick.x = 0;
    lookJoystick.y = 0;
});

jumpButton.addEventListener('touchstart', () => {
    if (!isJumping) {
        isJumping = true;
        jumpVelocity = 0.5;
    }
});

shootButton.addEventListener('touchstart', () => {
    if (!rapidFire) shoot();
});

weaponButton.addEventListener('touchstart', () => {
    bulletColor = bulletColor === 0x00ff00 ? 0x0000ff : 0x00ff00;
});

viewButton.addEventListener('touchstart', () => {
    toggleCameraView();
});

Array.from(mapButtons).forEach(button => {
    button.addEventListener('click', () => {
        currentMap = button.getAttribute('data-map');
        startGame();
    });
});

function startGame() {
    menu.style.display = 'none';
    countdownDisplay.style.display = 'block';
    legendDisplay.style.display = 'block';
    countdownActive = true;
    let countdown = 5;
    camera.position.set(0, 2, 5);

    scene.background = maps[currentMap].skybox;
    groundMaterial.map = maps[currentMap].ground;
    groundMaterial.needsUpdate = true;
    wallMaterial.map = maps[currentMap].wall;
    wallMaterial.needsUpdate = true;
    boxMaterial.map = maps[currentMap].box;
    boxMaterial.needsUpdate = true;

    enemies.forEach(enemy => scene.remove(enemy));
    enemies.length = 0;
    for (let i = 0; i < 5; i++) spawnEnemy();
    spawnBoxes();
    spawnPowerUp();

    const countdownInterval = setInterval(() => {
        countdownDisplay.textContent = countdown;
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            scoreDisplay.style.display = 'block';
            timerDisplay.style.display = 'block';
            crosshair.style.display = 'block';
            if (window.innerWidth > 768) document.body.requestPointerLock();
            gameStarted = true;
            countdownActive = false;
            timeLeft = 180;
            timerDisplay.textContent = `Czas: ${Math.ceil(timeLeft)}`;
        }
    }, 1000);
}

// Ruch gracza
const moveSpeed = 0.1;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let isJumping = false, jumpVelocity = 0, gravity = 0.02, baseHeight = 2;

document.addEventListener('keydown', (event) => {
    if (!gameStarted && !countdownActive) return;
    switch (event.key) {
        case 'w': moveForward = true; break;
        case 's': moveBackward = true; break;
        case 'a': moveLeft = true; break;
        case 'd': moveRight = true; break;
        case ' ': if (!isJumping) { isJumping = true; jumpVelocity = 0.5; } break;
        case 'v': toggleCameraView(); break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w': moveForward = false; break;
        case 's': moveBackward = false; break;
        case 'a': moveLeft = false; break;
        case 'd': moveRight = false; break;
    }
});

// Celowanie myszą
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === document.body) {
        mouseX -= event.movementX * 0.002;
        mouseY -= event.movementY * 0.002;
        mouseY = Math.max(-0.5, Math.min(0.5, mouseY));
    }
});

document.addEventListener('mousedown', () => {
    if (!gameStarted || rapidFire) return;
    shoot();
});

function toggleCameraView() {
    isThirdPerson = !isThirdPerson;
    if (isThirdPerson) {
        camera.position.z += 5;
        camera.position.y += 2;
    } else {
        camera.position.copy(baseCameraPosition);
    }
    if (window.innerWidth > 768) document.body.requestPointerLock();
}

// Strzelanie gracza
const shootSound = document.getElementById('shootSound');
let bulletColor = 0x00ff00;
let rapidFire = false, bigBullets = false, bulletSize = 0.1;
let lastShot = 0;

function shoot() {
    const bulletGeometry = new THREE.SphereGeometry(bulletSize, 8, 8); // Zmniejszono detale
    const bulletMaterial = new THREE.MeshStandardMaterial({ color: bulletColor });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(camera.position);
    bullet.velocity = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).multiplyScalar(5);
    bullet.castShadow = true;
    bullet.isPlayerBullet = true;
    scene.add(bullet);
    setTimeout(() => scene.remove(bullet), 2000);
    shootSound.currentTime = 0;
    shootSound.play();
}

function activatePowerUp(type) {
    console.log(`Aktywowano power-up: ${type}`);
    if (type === 'rapidFire') {
        rapidFire = true;
        setTimeout(() => { rapidFire = false; }, 10000);
    } else if (type === 'bigBullets') {
        bigBullets = true;
        bulletSize = 0.3;
        setTimeout(() => { bigBullets = false; bulletSize = 0.1; }, 10000);
    } else if (type === 'shield') {
        shieldActive = true;
        setTimeout(() => { shieldActive = false; }, 10000);
    }
}

// Licznik punktów
let score = 0;

// Kolizje
function checkCollision(newPosition, height) {
    const playerSize = 0.5;
    for (let box of boxes) {
        const boxPos = box.position;
        if (Math.abs(newPosition.x - boxPos.x) < (2 + playerSize) / 2 &&
            Math.abs(newPosition.z - boxPos.z) < (2 + playerSize) / 2) {
            if (height > 2 && height < 3.5) {
                baseHeight = 3;
                return false;
            }
            return true;
        }
    }
    if (newPosition.x > 24.5 || newPosition.x < -24.5 || newPosition.z > 24.5 || newPosition.z < -24.5) {
        return true;
    }
    baseHeight = 2;
    return false;
}

function checkEnemyCollision(enemy, newPosition) {
    const enemySize = 0.6;
    for (let box of boxes) {
        const boxPos = box.position;
        if (Math.abs(newPosition.x - boxPos.x) < (2 + enemySize) / 2 &&
            Math.abs(newPosition.z - boxPos.z) < (2 + enemySize) / 2) {
            return true;
        }
    }
    return false;
}

// Animacja
let baseCameraPosition = new THREE.Vector3(0, 2, 5);
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    if (countdownActive) return;
    if (!gameStarted) return;

    // Ruch gracza (klawiatura lub joystick)
    const newPosition = camera.position.clone();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

    if (moveForward || moveJoystick.y < -0.2) newPosition.add(forward.clone().multiplyScalar(moveSpeed));
    if (moveBackward || moveJoystick.y > 0.2) newPosition.sub(forward.clone().multiplyScalar(moveSpeed));
    if (moveLeft || moveJoystick.x < -0.2) newPosition.sub(right.clone().multiplyScalar(moveSpeed));
    if (moveRight || moveJoystick.x > 0.2) newPosition.add(right.clone().multiplyScalar(moveSpeed));

    if (!checkCollision(newPosition, camera.position.y)) {
        camera.position.x = newPosition.x;
        camera.position.z = newPosition.z;
        baseCameraPosition.x = newPosition.x;
        baseCameraPosition.z = newPosition.z;
    }

    if (isJumping) {
        camera.position.y += jumpVelocity;
        jumpVelocity -= gravity;
        if (camera.position.y <= baseHeight) {
            camera.position.y = baseHeight;
            baseCameraPosition.y = baseHeight;
            isJumping = false;
        }
    }

    // Celowanie (mysz lub joystick)
    if (lookJoystick.active) {
        mouseX -= lookJoystick.x;
        mouseY -= lookJoystick.y;
        mouseY = Math.max(-0.5, Math.min(0.5, mouseY));
    }
    camera.rotation.order = 'YXZ';
    camera.rotation.y = mouseX;
    camera.rotation.x = mouseY;

    // Wrogowie
    enemies.forEach(enemy => {
        const target = Math.random() < 0.5 && enemies.length > 1 ? 
            enemies[Math.floor(Math.random() * enemies.length)] : camera;
        if (target !== enemy) {
            const direction = target.position.clone().sub(enemy.position).normalize();
            const newEnemyPosition = enemy.position.clone().add(direction.multiplyScalar(0.05));
            if (!checkEnemyCollision(enemy, newEnemyPosition)) {
                enemy.position.copy(newEnemyPosition);
                enemy.position.y = 0;
            }
            const head = enemy.children[0];
            head.lookAt(target.position);
            head.rotation.x = 0;
            head.rotation.z = 0;
        }
        if (enemy.position.x > 24 || enemy.position.x < -24 || enemy.position.z > 24 || enemy.position.z < -24) {
            enemy.position.x = Math.max(-24, Math.min(24, enemy.position.x));
            enemy.position.z = Math.max(-24, Math.min(24, enemy.position.z));
            enemy.position.y = 0;
        }
        enemyShoot(enemy);

        enemy.animationTime += 0.1;
        const leftArm = enemy.children[2];
        const rightArm = enemy.children[3];
        const leftLeg = enemy.children[4];
        const rightLeg = enemy.children[5];
        leftArm.rotation.z = Math.sin(enemy.animationTime) * 0.5;
        rightArm.rotation.z = -Math.sin(enemy.animationTime) * 0.5;
        leftLeg.rotation.z = -Math.sin(enemy.animationTime) * 0.5;
        rightLeg.rotation.z = Math.sin(enemy.animationTime) * 0.5;
    });

    // Szybkie strzelanie
    if (rapidFire && performance.now() - lastShot > 100) {
        shoot();
        lastShot = performance.now();
    }

    // Power-upy
    powerUpTimer += 1 / 60;
    if (powerUpTimer >= 15) {
        spawnPowerUp();
        powerUpTimer = 0;
    }

    powerUps.forEach((powerUp, index) => {
        const distance = camera.position.distanceTo(powerUp.position);
        if (distance < 2) {
            activatePowerUp(powerUp.type);
            scene.remove(powerUp);
            powerUps.splice(index, 1);
        }
    });

    // Kule i trafienia
    scene.children.forEach(child => {
        if (child.velocity) {
            child.position.add(child.velocity.clone().multiplyScalar(0.1));
            if (child.isPlayerBullet) {
                enemies.forEach((enemy, index) => {
                    const distance = child.position.distanceTo(enemy.position);
                    if (distance < (0.6 + (bigBullets ? 0.2 : 0)) && child !== enemy) {
                        createExplosion(enemy.position);
                        scene.remove(enemy);
                        enemies.splice(index, 1);
                        score += 1;
                        scoreDisplay.textContent = `Punkty: ${score}`;
                        setTimeout(spawnEnemy, 1000);
                    }
                });
            } else if (child.isEnemyBullet) {
                const playerDistance = child.position.distanceTo(camera.position);
                if (playerDistance < 0.5 && !shieldActive) {
                    gameStarted = false;
                    menu.style.display = 'flex';
                    scoreDisplay.style.display = 'none';
                    timerDisplay.style.display = 'none';
                    crosshair.style.display = 'none';
                    legendDisplay.style.display = 'none';
                    powerUps.forEach(p => scene.remove(p));
                    powerUps.length = 0;
                }
                enemies.forEach((enemy, index) => {
                    if (enemy !== child) {
                        const distance = child.position.distanceTo(enemy.position);
                        if (distance < 0.6) {
                            createExplosion(enemy.position);
                            scene.remove(enemy);
                            enemies.splice(index, 1);
                            setTimeout(spawnEnemy, 1000);
                        }
                    }
                });
            }
        }
    });

    // Timer
    if (timeLeft > 0) {
        timeLeft -= 1 / 60;
        timerDisplay.textContent = `Czas: ${Math.ceil(timeLeft)}`;
    } else {
        gameStarted = false;
        menu.style.display = 'flex';
        scoreDisplay.style.display = 'none';
        timerDisplay.style.display = 'none';
        crosshair.style.display = 'none';
        legendDisplay.style.display = 'none';
        powerUps.forEach(p => scene.remove(p));
        powerUps.length = 0;
    }
}
animate();

// Responsywność
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});