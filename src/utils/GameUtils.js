export const BLOCK_SIZE = 32;
export const FIELD_WIDTH = 10;
export const FIELD_HEIGHT = 20;
export const COLORS = ['block_I', 'block_O', 'block_T', 'block_S', 'block_Z', 'block_J', 'block_L'];

export const SHAPES = [
    [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]],
    [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]],
    [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]]
];

export function spawnPiece() {
    const index = Phaser.Math.Between(0, 6);
    return { x: 3, y: 0, shape: SHAPES[index], sprite: COLORS[index] };
}

export function movePiece(currentPiece, dir, field) {
    currentPiece.x += dir;
    if (isCollide(currentPiece, field)) currentPiece.x -= dir;
}

export function rotatePiece(currentPiece, field, sound) {
    sound.play('rotate');
    const shape = currentPiece.shape;
    const rotated = shape[0].map((_, i) => shape.map(row => row[i])).reverse();
    currentPiece.shape = rotated;
    if (isCollide(currentPiece, field)) currentPiece.shape = shape;
}

export function dropPiece(currentPiece, field, sound, scene) {
    sound.play('drop');
    while (!isCollide(currentPiece, field)) currentPiece.y++;
    currentPiece.y--;
    fixPiece(currentPiece, field, scene);
}

export function moveDown(currentPiece, field, scene) {
    currentPiece.y++;
    if (isCollide(currentPiece, field)) {
        currentPiece.y--;
        fixPiece(currentPiece, field, scene);
    }
}

export function fixPiece(currentPiece, field, scene) {
    const { shape, sprite } = currentPiece;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const px = currentPiece.x + x;
                const py = currentPiece.y + y;
                if (px >= 0 && px < FIELD_WIDTH && py >= 0 && py < FIELD_HEIGHT) {
                    field[py][px] = sprite;
                }
            }
        }
    }
    clearLines(field, scene);
    if (field[0].some(cell => cell)) scene.scene.start('OverScene');
    scene.currentPiece = spawnPiece();
}

export function clearLines(field, scene) {
    let linesCleared = 0;
    for (let y = FIELD_HEIGHT - 1; y >= 0; y--) {
        if (field[y].every(cell => cell)) {
            field.splice(y, 1);
            field.unshift(Array(FIELD_WIDTH).fill(null));
            linesCleared++;
            y++;
        }
    }
    if (linesCleared > 0) {
        scene.sound.play('clear');
        scene.globalScore += linesCleared * 100;
    }
}

export function isCollide(currentPiece, field) {
    const shape = currentPiece.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const px = currentPiece.x + x;
                const py = currentPiece.y + y;
                if (px < 0 || px >= FIELD_WIDTH || py >= FIELD_HEIGHT || (py >= 0 && field[py][px])) return true;
            }
        }
    }
    return false;
}

export function draw(currentPiece, field, scene) {
    scene.children.removeAll();
    for (let y = 0; y < FIELD_HEIGHT; y++) {
        for (let x = 0; x < FIELD_WIDTH; x++) {
            const sprite = field[y][x];
            if (sprite) scene.add.image(x * BLOCK_SIZE + 16, y * BLOCK_SIZE + 16, sprite);
        }
    }
    const { shape, sprite } = currentPiece;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) scene.add.image((currentPiece.x + x) * BLOCK_SIZE + 16, (currentPiece.y + y) * BLOCK_SIZE + 16, sprite);
        }
    }
}
