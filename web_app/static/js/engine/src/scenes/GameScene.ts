import {Board as Board} from '../components/Board';


export class BoardScene extends Phaser.Scene {
    private myBoard = new Board(this)
    constructor(sceneConfig: Phaser.Types.Scenes.SettingsConfig){
        super(sceneConfig);
    };

    init() {
    };
    drawGraphicalBoard(){
        let position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(50,50);
        let squareWidth = 100;
        for(let rank: number = 0; rank < 8; rank++)
        {
            for(let file: number = 0; file < 8; file++)
            {
                let squareColor: number;
                if ((file + rank) % 2)
                {
                    //Square is light
                    squareColor = 0xC2A987;
                } else {
                    //Square is Dark
                    squareColor = 0xede0d5;
                }
                this.add.rectangle(position.x, position.y, squareWidth, squareWidth, squareColor);
                position.x += 100;
            }
            position.x = 50;
            position.y += 100;
        }
    }
    create() {
        //Create Chess board
        this.drawGraphicalBoard();
    }
};
