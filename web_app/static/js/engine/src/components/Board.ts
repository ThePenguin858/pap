import * as Phaser from 'phaser'
import * as Move from './Move'
import * as CST from './CST'

export class Board {

    private pieces: number[];
    private colors: number[];
    private offset: number[][];

    private side: number = CST.COLORS.WHITE;
    private xside: number = CST.COLORS.BLACK;
    private fifty: number = 0;
    private moveCount: number = 0;
    private hash: number = 0;
    private ply: number = 0;
    private hply: number = 0;
    private moveList: Move.Move[];
    private possibleMoves: Move.Move[];
    private capturedPieces: number[];
    private capturedColors: number[];

    private FEN: string

    private pieceSprites: Phaser.Physics.Arcade.Sprite[];
    private Scene: Phaser.Scene;
    private initialSpriteDrag: [number, number];
    private currentMove: Move.Move;

    constructor(Scene: Phaser.Scene, FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 30 23") {
        this.Scene = Scene;
        this.moveList = [];
        this.possibleMoves =[];
        this.capturedPieces =[];
        this.capturedColors =[];
        this.initialSpriteDrag = [0, 0];
        this.pieces = [];
        this.colors = [];
        this.FEN = FEN;
        this.side = CST.COLORS.WHITE;
        this.offset = [
            [0, 0, 0, 0, 0, 0, 0, 0], //Pawn offsets
            [-21, -19, -12, -8, 8, 12, 19, 21], // Knight 
            [-11, -9, 9, 11, 0, 0, 0, 0], //Bishop
            [-10, -1, 1, 10, 0, 0, 0, 0], //Rook
            [-11, -10, -9, -1, 1, 9, 10, 11], //Queen
            [-11, -10, -9, -1, 1, 9, 10, 11] //King
        ];

        this.possibleMoves.push(new Move.Move(CST.SQUARES.E2,CST.SQUARES.E4));
        this.possibleMoves.push(new Move.Move(CST.SQUARES.C7,CST.SQUARES.C5));
        this.possibleMoves.push(new Move.Move(CST.SQUARES.D2,CST.SQUARES.D4));
        this.possibleMoves.push(new Move.Move(CST.SQUARES.C5,CST.SQUARES.D4));

        this.colors = [
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0
        ];

        this.pieces = [
            3, 1, 2, 4, 5, 2, 1, 3,
            0, 0, 0, 0, 0, 0, 0, 0,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            0, 0, 0, 0, 0, 0, 0, 0,
            3, 1, 2, 4, 5, 2, 1, 3
        ];
        this.pieceSprites = [];

        this.currentMove = new Move.Move(0, 0);
        this.processFEN();
    }
    // Starts at the 22 index, ends in the 86 index
    private mailbox: number[] = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, -1, // starts at 21
        -1, 8, 9, 10, 11, 12, 13, 14, 15, -1,
        -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
        -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
        -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
        -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
        -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
        -1, 56, 57, 58, 59, 60, 61, 62, 63, -1, // ends at 98
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    ];
    private mailbox64: number[] = [
        21, 22, 23, 24, 25, 26, 27, 28,
        31, 32, 33, 34, 35, 36, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48,
        51, 52, 53, 54, 55, 56, 57, 58,
        61, 62, 63, 64, 65, 66, 67, 68,
        71, 72, 73, 74, 75, 76, 77, 78,
        81, 82, 83, 84, 85, 86, 87, 88,
        91, 92, 93, 94, 95, 96, 97, 98
    ];

    screenPosToBoardPos = (ScreenPos: number): number => {
        return Math.floor((ScreenPos - 50) / 100);
    }
    boardPosToScreenPos = (boardPos: number): number => {
        return boardPos * 100 + 50;
    }
    processFEN() {
        let sections = this.FEN.split(" ");

        // This is the section that handles reading in the piecese
        let square = 0;
        for (let i = 0; i < sections[0].length; i++) {
            let char = sections[0].charAt(i);

            if (char !== '/') {
                if (parseInt(char)) {
                    let space = parseInt(char);
                    for (let j = 0; j < space; j++) {
                        this.pieces[square] = CST.PIECES.EMPTY;
                        this.colors[square] = CST.PIECES.EMPTY;
                        square++;
                    }
                } else {

                    if (char == char.toUpperCase())
                        this.colors[square] = CST.COLORS.WHITE; // Char is Lowercase
                    else
                        this.colors[square] = CST.COLORS.BLACK; // Char is Uppecase

                    char.toLowerCase();
                    switch (char) {
                        case "k":
                            this.pieces[square] = CST.PIECES.KING;
                            break;
                        case "q":
                            this.pieces[square] = CST.PIECES.QUEEN;

                        case "n":
                            this.pieces[square] = CST.PIECES.KNIGHT;
                            break;
                        case "p":
                            this.pieces[square] = CST.PIECES.PAWN;
                            break;
                        case "b":
                            this.pieces[square] = CST.PIECES.BISHOP;
                            break;
                        case "r":
                            this.pieces[square] = CST.PIECES.ROOK;
                            break;
                    }
                    square++;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////
        // This is the section that handles the side to play
        if (sections[1].charAt(0) == "w") {
            this.side == CST.COLORS.WHITE;
            this.xside == CST.COLORS.BLACK;
        } else {
            this.xside == CST.COLORS.WHITE;
            this.side == CST.COLORS.BLACK;

        }
        ////////////////////////////////////////////////////////////////////
        // This is the section that handles the castling availability
        // TODO: This shit my guy
        ////////////////////////////////////////////////////////////////////
        // This is the section that handles the en passant square
        // TODO: This shit my guy
        ////////////////////////////////////////////////////////////////////
        /* This is the section that handles the number of halfmoves */
        this.fifty = parseInt(sections[4]);

        ////////////////////////////////////////////////////////////////////
        /* This is the section that handles the number of moves */
        this.moveCount = parseInt(sections[5]);
    }

    drawGraphicalBoard() {
        let position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(50, 50);
        let squareWidth = 100;

        for (let rank: number = 0; rank < 8; rank++) {
            for (let file: number = 0; file < 8; file++) {
                let squareColor: number;
                if ((file + rank) % 2)
                    squareColor = 0xC2A987;//Square is light
                else
                    squareColor = 0xede0d5; //Square is Dark

                this.Scene.add.rectangle(position.x, position.y, squareWidth, squareWidth, squareColor);
                position.x += 100;
            }
            position.x = 50;
            position.y += 100;
        }

        position.x = 50;
        position.y = 50;
        for (let i = 0; i < 64; i++) {
            let url: string = "";
            if (this.colors[i] != CST.PIECES.EMPTY) {
                if (this.colors[i]) { // BLACK Pieces
                    switch (this.pieces[i]) {
                        case CST.PIECES.PAWN:
                            url = "black_pawn";
                            break;
                        case CST.PIECES.KNIGHT:
                            url = "black_knight";
                            break;
                        case CST.PIECES.BISHOP:
                            url = "black_bishop";
                            break;
                        case CST.PIECES.ROOK:
                            url = "black_rook";
                            break;
                        case CST.PIECES.QUEEN:
                            url = "black_queen";
                            break;
                        case CST.PIECES.KING:
                            url = "black_king";
                            break;
                    }
                } else { // WHITE Pieces
                    switch (this.pieces[i]) {
                        case CST.PIECES.PAWN:
                            url = "white_pawn";
                            break;
                        case CST.PIECES.KNIGHT:
                            url = "white_knight";
                            break;
                        case CST.PIECES.BISHOP:
                            url = "white_bishop";
                            break;
                        case CST.PIECES.ROOK:
                            url = "white_rook";
                            break;
                        case CST.PIECES.QUEEN:
                            url = "white_queen";
                            break;
                        case CST.PIECES.KING:
                            url = "white_king";
                            break;
                    }
                }
                let sprite = this.Scene.physics.add.sprite(position.x, position.y, url);
                let file = this.screenPosToBoardPos(sprite.x);
                let rank = this.screenPosToBoardPos(sprite.y);

                sprite.scale = 0.3;
                sprite.setBodySize(150, 150);

                sprite.setInteractive();
                this.Scene.input.setDraggable(sprite);



                /* This piece of code is to handle the drag input of the pieces and translate
                 * it into the mailbox board representation */
                sprite.addListener("dragstart", (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                    if (dragX < 800 && dragY < 800) {

                        /* Generate all possible moves at this stage */

                        /* Save the initial position of the piece so that a move
                           can be saved */
                        file = this.screenPosToBoardPos(sprite.x);
                        rank = this.screenPosToBoardPos(sprite.y);
                        let to = 8 * rank + file;
                        if(this.colors[to] == this.side){

                            this.currentMove.from = to;
                        }

                        /* This saves the initial position of the sprite so it
                           can be resetted */
                        this.initialSpriteDrag[0] = this.boardPosToScreenPos(file);
                        this.initialSpriteDrag[1] = this.boardPosToScreenPos(rank);

                    }
                });
                sprite.addListener("drag", (pointer: any, dragX: number, dragY: number) => {
                    if (dragX < 800 && dragY < 800) {
                        sprite.setPosition(pointer.x, pointer.y);
                    }
                });
                let counter = 0;
                sprite.addListener("dragend", (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) => {
                    if (sprite.x > 0 && sprite.x < 800 && sprite.y > 0 && sprite.y < 800) {

                        file = Math.floor(sprite.x / 100);
                        rank = Math.floor(sprite.y / 100);
                        let to = 8 * rank + file;

                        if (this.colors[this.currentMove.from] == this.side) {
                            this.currentMove.to = to;
                            if (this.isMoveValid(this.currentMove)) { // MOVE IS VALID

                                /* This piece of code centralizes the objects in a grid square */
                                sprite.setX(Math.floor(sprite.x / 100) * 100 + 50);
                                sprite.setY(Math.floor(sprite.y / 100) * 100 + 50);


                                /* This checks if sprites have collided */
                                this.checkForCollisions(sprite);


                                /* This switches the color to move */
                                this.side = +!this.side;
                                this.xside = +!this.xside;

                                counter++;

                                /* Make the move on the board */
                                this.makeMove(this.currentMove);
                            } else
                                sprite.setPosition(this.initialSpriteDrag[0], this.initialSpriteDrag[1]);
                        } else{
                            sprite.setPosition(this.initialSpriteDrag[0], this.initialSpriteDrag[1]);
                            this.currentMove.to = this.currentMove.from;
                        }

                    }
                });
                this.pieceSprites.push(sprite);

            } else {
                //PIECE is not present in current square
            }
            position.x += 100;
            if (!((i + 1) % 8)) {
                position.x = 50;
                position.y += 100;
            }
        }
    };

    /* This function will return the mailbox64 index of the square where the piece was put.
       If a collision was not detected, it will return a -1.
     */
    private checkForCollisions(sprite1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): number {
        this.pieceSprites.forEach((sprite2) => {
            if (this.Scene.physics.overlap(sprite1, sprite2)) {
                let index = this.pieceSprites.indexOf(sprite2, 0);
                delete this.pieceSprites[index];
                sprite2.destroy();
                return 1;
            } else {
                sprite1.setDepth(0);
            }
        });
        return -1;

    };


    private setFlagsForMove(move: Move.Move, start: number, end: number){
    }
    private isMoveValid(move: Move.Move): boolean {
        let index = this.possibleMoves.findIndex((funcMove) => {
            if(funcMove.from == move.from && funcMove.to == move.to)
                return funcMove;
        })
        if (index > -1) {
            return true;
        } else
            return false;
    }

    restartBoard(){
        this.pieceSprites.forEach((sprite2) => {
            let index = this.pieceSprites.indexOf(sprite2, 0);
            sprite2.destroy();
            delete this.pieceSprites[index];
        });
        this.drawGraphicalBoard();
    }

    private makeMove(move: Move.Move, draw: boolean = false) {
        if(this.pieces[move.to] != CST.PIECES.EMPTY){
            this.capturedColors.push(this.colors[move.to]);
            this.capturedPieces.push(this.pieces[move.to]);
        }else{

            this.capturedColors.push(CST.PIECES.EMPTY);
            this.capturedPieces.push(CST.PIECES.EMPTY);
        }
        let yy = new Move.Move(move.from, move.to);
        this.moveList.push(yy);
        this.colors[move.to] = this.colors[move.from];
        this.pieces[move.to] = this.pieces[move.from];

        this.colors[move.from] = CST.PIECES.EMPTY;
        this.pieces[move.from] = CST.PIECES.EMPTY;

        console.log(this.moveList);
        console.log(this.capturedColors);
        console.log(this.capturedPieces);

        /* Reset the moves that can be made */
        this.generateMoves();

    }

    unmakeMove() {
        let move = this.moveList.pop();
        let piece = this.capturedPieces.pop();
        let color = this.capturedColors.pop();
        /* Set the colors of the board */
        if(typeof(move) != 'undefined' && typeof(piece) != 'undefined' && typeof(color) != 'undefined'){

            /* Revert the pieces on the board */
            console.log(this.moveList);
            console.log(this.capturedColors);
            console.log(this.capturedPieces);
            this.colors[move.from] = this.colors[move.to];
            this.colors[move.to] = color;

            /* Revert the pieces on the board */
            this.pieces[move.from] = this.pieces[move.to];
            this.pieces[move.to] = piece;


            /* Revert the side to play */
            this.side = +!this.side;
            this.xside = +!this.xside;


            /* Restart the visual board */
        }
            this.restartBoard();
    }

    private generateMoves() {



    };

};
