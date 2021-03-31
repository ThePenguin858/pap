import {Board as Board} from '../components/Board';


export class BoardScene extends Phaser.Scene {
    private myBoard = new Board(this, "3qk2r/pp1p1ppp/2bP4/1B1BPp2/2P1p1b1/1n1nrK2/P1PP2PP/RN1Q2NR")
    constructor(sceneConfig: Phaser.Types.Scenes.SettingsConfig){
        super(sceneConfig);
    };

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
        this.myBoard.drawGraphicalBoard();
    }
};
