import * as Phaser from 'phaser';
import * as GameScenes from './scenes/GameScene';

let BoardScene = new GameScenes.BoardScene({
    key: "begin",
    active: true,
    visible: true
})

var config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-area',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 800
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        },
    },
    scene: [BoardScene],
}
let game = new Phaser.Game(config);
