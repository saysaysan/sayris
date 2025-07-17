import { BLOCK_SIZE, FIELD_WIDTH, FIELD_HEIGHT, COLORS, SHAPES, spawnPiece, movePiece, rotatePiece, dropPiece, moveDown, draw, isCollide, fixPiece, clearLines } from '../utils/GameUtils.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        COLORS.forEach(name => this.load.image(name, `assets/${name}.png`));
        this.load.audio('bgm', 'assets/bgm.mp3');
        this.load.audio('rotate', 'assets/se_rotate.wav');
        this.load.audio('drop', 'assets/se_drop.wav');
        this.load.audio('clear', 'assets/se_clear.wav');
    }

    create() {
        this.globalScore = 0;
        this.level = 1;
        this.fallInterval = 500;
        this.fallTimer = 0;
        this.isPaused = false;

        this.sceneRef = this;
        this.field = Array.from({ length: FIELD_HEIGHT }, () => Array(FIELD_WIDTH).fill(null));
        this.currentPiece = spawnPiece();

        this.bgm = this.sound.add('bgm', { loop: true, volume: 0.5 }).play();

        this.scoreText = this.add.text(10, 10, 'SCORE: 0', { fontSize: '16px', color: '#fff' });
        this.levelText = this.add.text(10, 30, 'LEVEL: 1', { fontSize: '16px', color: '#fff' });
        this.pauseText = this.add.text(220, 10, 'PAUSE', { fontSize: '16px', color: '#0f0' })
            .setInteractive().on('pointerdown', () => this.togglePause());

        this.input.keyboard.on('keydown-LEFT', () => { if (!this.isPaused) movePiece(this.currentPiece, -1, this.field); });
        this.input.keyboard.on('keydown-RIGHT', () => { if (!this.isPaused) movePiece(this.currentPiece, 1, this.field); });
        this.input.keyboard.on('keydown-UP', () => { if (!this.isPaused) rotatePiece(this.currentPiece, this.field, this.sound); });
        this.input.keyboard.on('keydown-DOWN', () => { if (!this.isPaused) dropPiece(this.currentPiece, this.field, this.sound, this); });

        this.input.keyboard.on('keydown-P', () => this.togglePause());

        ['left', 'right', 'rotate', 'down'].forEach(id => {
            document.getElementById(id).addEventListener('click', () => {
                if (!this.isPaused) {
                    if (id === 'left') movePiece(this.currentPiece, -1, this.field);
                    if (id === 'right') movePiece(this.currentPiece, 1, this.field);
                    if (id === 'rotate') rotatePiece(this.currentPiece, this.field, this.sound);
                    if (id === 'down') dropPiece(this.currentPiece, this.field, this.sound, this);
                }
            });
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseText.setColor(this.isPaused ? '#f00' : '#0f0');
    }

    update(_, delta) {
        if (this.isPaused) return;

        this.fallTimer += delta;
        if (this.fallTimer >= this.fallInterval) {
            this.fallTimer = 0;
            moveDown(this.currentPiece, this.field, this);
        }

        draw(this.currentPiece, this.field, this);

        this.scoreText.setText('SCORE: ' + this.globalScore);
        this.levelText.setText('LEVEL: ' + this.level);

        if (this.globalScore > 0 && this.globalScore % 500 === 0) {
            this.level = Math.min(10, 1 + Math.floor(this.globalScore / 500));
            this.fallInterval = 500 - this.level * 30;
        }

        if (this.globalScore >= 2000) {
            this.bgm.stop();
            this.scene.start('ClearScene');
        }
    }
}
