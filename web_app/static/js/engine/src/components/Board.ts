import * as Phaser from 'phaser'
import * as Move from './Move'
import {PIECES, COLORS} from './CST'

export class Board {

    private pieces: number[];
    private colors: number[];
    private offset: number[][];

    private side: number = COLORS.WHITE;
    private xside: number = COLORS.BLACK;
    private fifty: number = 0;
    private moveCount: number = 0;
    private hash: number = 0;
    private ply: number = 0;
    private hply: number = 0;
    private moves: Move.Move[];

    private FEN: string

    private pieceSprites: Phaser.Physics.Arcade.Sprite[];
    private Scene: Phaser.Scene;
    private initialSpriteDrag: [number, number];
    private currentMove: Move.Move;

    constructor(Scene: Phaser.Scene, FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 30 23") {
        this.Scene = Scene;
        this.moves = [];
        this.initialSpriteDrag = [0, 0];
        this.pieces = [];
        this.colors = [];
        this.FEN = FEN;
        this.side = COLORS.WHITE;
        this.offset = [
            [0, 0, 0, 0, 0, 0, 0, 0], //Pawn offsets
            [-21, -19, -12, -8, 8, 12, 19, 21], // Knight 
            [-11, -9, 9, 11, 0, 0, 0, 0], //Bishop
            [-10, -1, 1, 10, 0, 0, 0, 0], //Rook
            [-11, -10, -9, -1, 1, 9, 10, 11], //Queen
            [-11, -10, -9, -1, 1, 9, 10, 11] //King
        ];

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
                        this.pieces[square] = PIECES.EMPTY;
                        this.colors[square] = PIECES.EMPTY;
                        square++;
                    }
                } else {

                    if (char == char.toUpperCase()) {
                        this.colors[square] = COLORS.BLACK; // Char is Uppecase
                    } else {
                        this.colors[square] = COLORS.WHITE; // Char is Lowercase
                    }
                    char.toLowerCase();
                    switch (char) {
                        case "k":
                            this.pieces[square] = PIECES.KING;
                            break;
                        case "q":
                            this.pieces[square] = PIECES.QUEEN;
                            break;
                        case "n":
                            this.pieces[square] = PIECES.KNIGHT;
                            break;
                        case "p":
                            this.pieces[square] = PIECES.PAWN;
                            break;
                        case "b":
                            this.pieces[square] = PIECES.BISHOP;
                            break;
                        case "r":
                            this.pieces[square] = PIECES.ROOK;
                            break;
                    }
                    console.log(square);
                    square++;
                }
            }
        }



        /* for (let square = 0; square < 64; square++) { */
        /*     if(sections[0].length < 70){ */
        /*     let char = sections[0].charAt(square).toLowerCase(); */
        /*     let code = sections[0].charCodeAt(square); */
        /*     if (parseInt(char)) { */
        /*         let space = parseInt(char); */
        /*         console.log(space); */

        /*         for (let i = 0; i < space - 1; i++) { */
        /*             this.pieces[square] = PIECES.EMPTY; */
        /*             this.colors[square] = PIECES.EMPTY; */
        /*             square++; */
        /*             console.log(square); */
        /*         } */
        /*         square--; */
        /*             console.log(square); */
                
        /*     } else { */
        /*         if (code <= 97) { */
        /*             this.colors[square] = COLORS.BLACK; // Char is Uppecase */
        /*         } else { */
        /*             this.colors[square] = COLORS.WHITE; // Char is Lowercase */
        /*         } */
        /*         switch (char) { */
        /*             case "/": */
        /*                 break */
        /*             case "k": */
        /*                 this.pieces[square] = PIECES.KNIGHT; */
        /*                 break; */
        /*             case "q": */
        /*                 this.pieces[square] = PIECES.QUEEN; */
        /*                 break; */
        /*             case "n": */
        /*                 this.pieces[square] = PIECES.KNIGHT; */
        /*                 break; */
        /*             case "p": */
        /*                 this.pieces[square] = PIECES.PAWN; */
        /*                 break; */
        /*             case "b": */
        /*                 this.pieces[square] = PIECES.BISHOP; */
        /*                 break; */
        /*             case "r": */
        /*                 this.pieces[square] = PIECES.ROOK; */
        /*                 break; */
        /*         } */
        /*     } */
        /*     console.log(square); */
        /*     } */
        /* } */

        ////////////////////////////////////////////////////////////////////
        // This is the section that handles the side to play
        if (sections[1].charAt(0) == "w") {
            this.side == COLORS.WHITE;
            this.xside == COLORS.BLACK;
        } else {
            this.xside == COLORS.WHITE;
            this.side == COLORS.BLACK;

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
        console.log("Fifty" + this.fifty);

        ////////////////////////////////////////////////////////////////////
        /* This is the section that handles the number of moves */
        this.moveCount = parseInt(sections[5]);
        console.log("Moves" + this.moveCount);


        console.log(this.pieces);
        console.log(this.colors);
    }

    drawGraphicalBoard() {
        this.processFEN();
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
            if (this.colors[i] != PIECES.EMPTY) {
                if (this.colors[i]) { // BLACK Pieces
                    switch (this.pieces[i]) {
                        case PIECES.PAWN:
                            url = "black_pawn";
                            break;
                        case PIECES.KNIGHT:
                            url = "black_knight";
                            break;
                        case PIECES.BISHOP:
                            url = "black_bishop";
                            break;
                        case PIECES.ROOK:
                            url = "black_rook";
                            break;
                        case PIECES.QUEEN:
                            url = "black_queen";
                            break;
                        case PIECES.KING:
                            url = "black_king";
                            break;
                    }
                } else { // WHITE Pieces
                    switch (this.pieces[i]) {
                        case PIECES.PAWN:
                            url = "white_pawn";
                            break;
                        case PIECES.KNIGHT:
                            url = "white_knight";
                            break;
                        case PIECES.BISHOP:
                            url = "white_bishop";
                            break;
                        case PIECES.ROOK:
                            url = "white_rook";
                            break;
                        case PIECES.QUEEN:
                            url = "white_queen";
                            break;
                        case PIECES.KING:
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
                        file = this.screenPosToBoardPos(sprite.x);
                        rank = this.screenPosToBoardPos(sprite.y);
                        console.log("File: " + file + " rank: " + rank);
                        this.initialSpriteDrag[0] = this.boardPosToScreenPos(file);
                        this.initialSpriteDrag[1] = this.boardPosToScreenPos(rank);
                    }
                });
                sprite.addListener("drag", (pointer: any, dragX: number, dragY: number) => {
                    if (dragX < 800 && dragY < 800) {
                        sprite.setPosition(pointer.x, pointer.y);
                    }
                });

                sprite.addListener("dragend", (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) => {
                    if (sprite.x > 0 && sprite.x < 800 && sprite.y > 0 && sprite.y < 800) {
                        if (this.colors[i] == this.side) {
                            /* This piece of code centralizes the objects in a grid square */
                            sprite.setX(Math.floor(sprite.x / 100) * 100 + 50);
                            sprite.setY(Math.floor(sprite.y / 100) * 100 + 50);

                            let indexOfSquareCapture = this.checkForCollisions(sprite);
                            if (indexOfSquareCapture > -1) {
                                file = Math.floor((sprite.x - 50) / 100);
                                rank = Math.floor((sprite.y - 50) / 100);
                                //If collision is true, delete the sprite and set the value on the mailbox to the new piece
                            }
                            this.side = +!this.side;
                            this.xside = +!this.xside;
                            console.log(this.side);
                        } else {
                            sprite.setPosition(this.initialSpriteDrag[0], this.initialSpriteDrag[1]);
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
    checkForCollisions(sprite1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): number {
        this.pieceSprites.forEach((sprite2) => {
            if (this.Scene.physics.overlap(sprite1, sprite2)) {
                let index = this.pieceSprites.indexOf(sprite2, 0);
                delete this.pieceSprites[index];
                sprite2.destroy();
                //Discover the index of the mailbox that its going to land

                return 1;
            } else {
                sprite1.setDepth(0);
            }
        });
        return -1;

    };

    makeMove() {

    }

};
