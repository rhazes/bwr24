const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;
document.body.appendChild(canvas);

const player = {
    x: 50,
    y: 200,
    radius: 20,
    speed: 5,
    dy: 0,
    jumpForce: 15,
    grounded: false
};

const platforms = [
    { x: 0, y: 350, width: 800, height: 50 },
    { x: 300, y: 200, width: 200, height: 20 },
    { x: 600, y: 300, width: 150, height: 20 }
];

const keys = {};

const gravity = 0.8;

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function movePlayer() {
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
    
    player.y += player.dy;
    player.dy += gravity;

    // Check for collisions with platforms
    player.grounded = false;
    platforms.forEach(platform => {
        if (player.y + player.radius > platform.y &&
            player.y + player.radius < platform.y + platform.height &&
            player.x > platform.x &&
            player.x < platform.x + platform.width) {
            player.grounded = true;
            player.y = platform.y - player.radius;
            player.dy = 0;
        }
    });

    // Jump
    if ((keys['ArrowUp'] || keys['w']) && player.grounded) {
        player.dy = -player.jumpForce;
    }

    // Keep player within canvas
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.min(canvas.height - player.radius, player.y);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlatforms();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

gameLoop();
