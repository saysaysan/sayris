export default class RankScene extends Phaser.Scene {
    constructor() {
        super('RankScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000022');

        this.add.text(this.sys.game.config.width / 2, 50, 'RANKING', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#00ffff'
        }).setOrigin(0.5);

        const data = JSON.parse(localStorage.getItem('tetrisRank')) || [];

        data.forEach((r, i) => {
            this.add.text(this.sys.game.config.width / 2, 150 + i * 50, `${i + 1}: ${r.name}  ${r.score} (${r.date})`, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#00ffcc'
            }).setOrigin(0.5);
        });

        const retry = this.add.text(this.sys.game.config.width / 2, 500, 'RETRY', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#00ff00'
        }).setOrigin(0.5);

        retry.setInteractive().on('pointerdown', () => {
            this.scene.start('TitleScene');
        });

        this.tweens.add({
            targets: retry,
            alpha: 0.3,
            duration: 600,
            yoyo: true,
            repeat: -1
        });
    }
}
