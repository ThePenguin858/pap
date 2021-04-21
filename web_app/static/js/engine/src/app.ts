import * as Phaser from 'phaser';
import { BoardScene } from './scenes/BoardScene';
import { GameEndScene } from './scenes/GameEndScene';

let localBoardScene = new BoardScene({
    key: "active_board",
    active: true,
    visible: true,
})

let localGameEnd = new GameEndScene({
    key: "game_end",
    active: false,
    visible: false,
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
    audio: {
        disableWebAudio: true
    },
    scene: [localBoardScene, localGameEnd],
}
export let game = new Phaser.Game(config);
export let TextureManager = new Phaser.Textures.TextureManager(game);
