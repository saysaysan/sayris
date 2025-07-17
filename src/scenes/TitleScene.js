export default class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }

    create() {
        this.cameras.main.setBackgroundColor('#000033');
        this.add.text(160, 150, 'SayRIS', {
            fontSize: '64px', color: '#00ffff', stroke: '#003344', strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(160, 250, '落ちる、積む、消える。', {
            fontSize: '18px', color: '#ffffff'
        }).setOrigin(0.5);

        const start = this.add.text(160, 400, 'PRESS START', {
            fontSize: '28px', color: '#00ff00'
        }).setOrigin(0.5);

        start.setInteractive().on('pointerdown', () => this.scene.start('GameScene'));

        this.tweens.add({
            targets: start, alpha: 0.3, duration: 600, yoyo: true, repeat: -1
        });
    }
}
