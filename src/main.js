// Scene 各種読み込み
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import OverScene from './scenes/OverScene.js';
import ClearScene from './scenes/ClearScene.js';
import RankScene from './scenes/RankScene.js';

// Phaser ゲーム本体構成
const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 640,
    backgroundColor: '#000',
    scene: [
        TitleScene,
        GameScene,
        OverScene,
        ClearScene,
        RankScene
    ]
};

// Phaser 起動
new Phaser.Game(config);
