import * as Phaser from 'phaser';
import * as GameScenes from './scenes/BoardScene';

let BoardScene = new GameScenes.BoardScene({
    key: "begin",
    active: true,
    visible: true,

})
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-area',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
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

export let game = new Phaser.Game(config);

export let TextureManager = new Phaser.Textures.TextureManager(game);
