export default class ClearScene extends Phaser.Scene {
    constructor() {
        super('ClearScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#003300');

        this.add.text(this.sys.game.config.width / 2, 250, '★ CLEAR!! ★', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#00ff00',
            stroke: '#003300',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => this.showInput());
    }

    showInput() {
        const inputName = document.getElementById('inputName');
        inputName.style.display = 'block';
        inputName.focus();
        inputName.onkeydown = (e) => {
            if (e.key === 'Enter' && inputName.value !== '') {
                const data = JSON.parse(localStorage.getItem('tetrisRank')) || [];
                data.push({
                    name: inputName.value,
                    score: this.registry.get('score') || 0,
                    date: new Date().toLocaleDateString()
                });
                data.sort((a, b) => b.score - a.score);
                data.splice(3);
                localStorage.setItem('tetrisRank', JSON.stringify(data));

                inputName.style.display = 'none';
                this.scene.start('RankScene');
            }
        };
    }
}
