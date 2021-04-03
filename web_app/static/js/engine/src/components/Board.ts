import * as Phaser from 'phaser'
import * as Move from './Move'
import { CST, COLORS } from './CST'

function ROW(x: number): number {
    return x >> 3;
}

function COL(x: number): number {
    return x & 7;
}
export class Board {

    private pieces: number[];
    private colors: number[];
    private offset: number[][];

    private side: COLORS = COLORS.WHITE;
    private xside: number = COLORS.BLACK;
    private fifty: number = 0;
    private hash: number = 0;
    private ply: number = 0;
    private hply: number = 0;

    private FEN: string

    private pieceSprites: Phaser.Physics.Arcade.Sprite[];
    private Scene: Phaser.Scene;

    constructor(Scene: Phaser.Scene, FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
        this.Scene = Scene;

        this.pieces = [];
        this.colors = [];
        this.FEN = FEN;
        this.offset = [
            [ 0, 0, 0, 0, 0, 0, 0, 0 ], //Pawn offsets
            [ -21, -19, -12, -8, 8, 12, 19, 21 ], // Knight 
            [ -11, -9, 9, 11, 0, 0, 0, 0 ], //Bishop
            [ -10, -1, 1, 10, 0, 0, 0, 0 ], //Rook
            [ -11, -10, -9, -1, 1, 9, 10, 11 ], //Queen
            [ -11, -10, -9, -1, 1, 9, 10, 11 ] //King
        ];

        this.colors = [
            1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6,
            0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 0, 0, 0, 0, 0, 0
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

    processFEN() {
        // let boardIndexCounter: number = 0;
        // // Accesses the correct valid mailbox index without having to manually increment
        // const accessPieces = (piece: number) => {
        //     this.pieces.push(piece);
        // };

        // for(let i: number = 0; i < this.FEN.length; i++){

        //     const char = this.FEN.charAt(i);

        //     if (parseInt(char)) {
        //         for(let j: number = 0; j < parseInt(char); j++){
        //             accessPieces(pieces.none);
        //         }
        //     } else {
        //         switch(char){
        //             case "/":
        //                 break
        //             case "k":
        //                 accessPieces(pieces.black | pieces.king);
        //                 break;
        //             case "q":
        //                 accessPieces(pieces.black | pieces.queen);
        //                 break;
        //             case "n":
        //                 accessPieces(pieces.black | pieces.knight);
        //                 break;
        //             case "p":
        //                 accessPieces(pieces.black | pieces.pawn);
        //                 break;
        //             case "b":
        //                 accessPieces(pieces.black | pieces.bishop);
        //                 break;
        //             case "r":
        //                 accessPieces(pieces.black | pieces.rook);
        //                 break;
        //             case "K":
        //                 accessPieces(pieces.white | pieces.king);
        //                 break;
        //             case "Q":
        //                 accessPieces(pieces.white | pieces.queen);
        //                 break;
        //             case "N":
        //                 accessPieces(pieces.white | pieces.knight);
        //                 break;
        //             case "P":
        //                 accessPieces(pieces.white | pieces.pawn);
        //                 break;
        //             case "B":
        //                 accessPieces(pieces.white | pieces.bishop);
        //                 break;
        //             case "R":
        //                 accessPieces(pieces.white | pieces.rook);
        //                 break;
        //         }
        //     }
        // }
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
            if(this.colors[i] != CST.EMPTY){
                if(this.colors[i]) { // BLACK Pieces
                    switch(this.pieces[i]){
                        case CST.PAWN:
                            url = "black_pawn";
                            break;
                        case CST.KNIGHT:
                            url = "black_knight";
                            break;
                        case CST.BISHOP:
                            url = "black_bishop";
                            break;
                        case CST.ROOK:
                            url = "black_rook";
                            break;
                        case CST.QUEEN:
                            url = "black_queen";
                            break;
                        case CST.KING:
                            url = "black_king";
                            break;
                    }
                } else { // WHITE Pieces
                    switch(this.pieces[i]){
                        case CST.PAWN:
                            url = "white_pawn";
                            break;
                        case CST.KNIGHT:
                            url = "white_knight";
                            break;
                        case CST.BISHOP:
                            url = "white_bishop";
                            break;
                        case CST.ROOK:
                            url = "white_rook";
                            break;
                        case CST.QUEEN:
                            url = "white_queen";
                            break;
                        case CST.KING:
                            url = "white_king";
                            break;
                    }
                }
                let sprite = this.Scene.physics.add.sprite(position.x, position.y, url);
                let file = Math.floor((sprite.x - 50) / 100);
                let rank = Math.floor((sprite.y - 50) / 100);

                sprite.scale = 0.3;
                sprite.setBodySize(150, 150);

                sprite.setInteractive();
                this.Scene.input.setDraggable(sprite);



                /* This piece of code is to handle the drag input of the pieces and translate
                 * it into the mailbox board representation */
                
                sprite.addListener("dragstart", (pointer: any, dragX: number, dragY: number) => {
                    if(dragX < 800 && dragY < 800){
                        file = Math.floor((sprite.x - 50) / 100);
                        rank = Math.floor((sprite.y - 50) / 100);
                        console.log("File: " + file + " rank: " + rank);
                    }
                });
                sprite.addListener("drag", (pointer: any, dragX: number, dragY: number) => {
                    if(dragX < 800 && dragY < 800){
                        sprite.setPosition(pointer.x, pointer.y);
                    }
                });

                sprite.addListener("dragend", (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) => {
                    if(sprite.x > 0 && sprite.x < 800 && sprite.y > 0 && sprite.y < 800) {
                        sprite.setX(Math.floor(sprite.x / 100) * 100 + 50);
                        sprite.setY(Math.floor(sprite.y / 100) * 100 + 50);
                        file = Math.floor((sprite.x - 50) / 100);
                        rank = Math.floor((sprite.y - 50) / 100);
                        //If collision is true, delete the sprite and set the value on the mailbox to the new piece
                        let indexToDestroy = this.checkForCollisions(sprite);
                        // if(indexToDestroy > -1)
                        //     sprite.destroy();
                    }
                });
                this.pieceSprites.push(sprite);

            } else {
                //PIECE is not present in current square
            }
            position.x += 100;
            if((i+1) % 8) {
            } else {
                position.x = 50;
                position.y += 100;
            }
       }
    }

    checkForCollisions(sprite1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): number {
        this.pieceSprites.forEach((sprite2) => {
                if(this.Scene.physics.overlap(sprite1, sprite2)){
                    let index = this.pieceSprites.indexOf(sprite2, 0);
                    delete this.pieceSprites[index];
                    console.log("sprite 1 two pieces collided");
                    sprite2.destroy();
                    sprite1.setTint(0x00ff00);
                    return 1;
                }else {
                    sprite1.setDepth(0);
                }
        });
        return -1;

    };

    makeMove() {
        
    }

};
