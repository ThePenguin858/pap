import {myBoard} from './BoardScene';
import { Board } from '../components/Board';
import {GAME_STATES} from '../components/CST';

export let localBoard: Board = myBoard;
export class GameEndScene extends Phaser.Scene {
    constructor(sceneConfig: Phaser.Types.Scenes.SettingsConfig){
        super(sceneConfig);
    };

    init(data: any){
        console.log(data);
        console.log(data.endType);
        if(data.endType == GAME_STATES.PLAYING)
            this.add.text(0,0, "Playing");
    };
    preload() {
    };

    create() {
    }

    update() {
    }

};
