import {Board as Board} from '../components/Board';

export let myBoard: Board;
export class BoardScene extends Phaser.Scene {
    constructor(sceneConfig: Phaser.Types.Scenes.SettingsConfig){
        super(sceneConfig);
        myBoard = new Board(this);
    };

    init(){
        myBoard = new Board(this);
    }

    preload() {
        this.load.image("white_pawn", "/static/images/pieces/white_pawn.png");
        this.load.image("white_bishop", "/static/images/pieces/white_bishop.png");
        this.load.image("white_king", "/static/images/pieces/white_king.png");
        this.load.image("white_rook", "/static/images/pieces/white_rook.png");
        this.load.image("white_knight", "/static/images/pieces/white_knight.png");
        this.load.image("white_queen", "/static/images/pieces/white_queen.png");

        this.load.image("black_pawn",  "/static/images/pieces/black_pawn.png");
        this.load.image("black_bishop", "/static/images/pieces/black_bishop.png");
        this.load.image("black_king",  "/static/images/pieces/black_king.png");
        this.load.image("black_rook",  "/static/images/pieces/black_rook.png");
        this.load.image("black_knight", "/static/images/pieces/black_knight.png");
        this.load.image("black_queen", "/static/images/pieces/black_queen.png");
    };
    create() {
        //Create Chess board
        myBoard.drawGraphicalBoard();
        let key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        let keyd = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);

        key.on("down", (key: any, event: any) => {
            myBoard.unmakeMove();
        });

        keyd.on("down", (key: any, event: any) => {
            this.scene.start("game_end", {endType: myBoard.gameState});
        });
    }

    update() {
    }

};
