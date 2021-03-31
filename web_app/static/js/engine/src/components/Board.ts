import * as Phaser from 'phaser'

enum pieces {
    none,
    king,
    queen,
    rook,
    bishop,
    knight,
    pawn,

    //Bit 7, represents if the color of the piece
    black = 8,
    white = 16
};

export class Board {

    private Scene: Phaser.Scene;
    private pieces: number[];
    private colorToMove: pieces;
    private FEN: string

    constructor(Scene: Phaser.Scene, FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
        this.Scene = Scene;
        this.pieces = [];
        this.colorToMove = pieces.white;
        this.FEN = FEN;
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

    processFEN() {
        let boardIndexCounter: number = 0;
        // Accesses the correct valid mailbox index without having to manually increment
        const accessPieces = (piece: number) => {
            this.pieces[boardIndexCounter] = piece;
            boardIndexCounter++;
        };

        for(let i: number = 0; i < this.FEN.length; i++){

            const char = this.FEN.charAt(i);

            if (parseInt(char)) {
                for(let j: number = 0; j < parseInt(char); j++){
                    accessPieces(pieces.none);
                }
            } else {
                switch(char){
                    case "/":
                        break
                    case "k":
                        accessPieces(pieces.black | pieces.king);
                        break;
                    case "q":
                        accessPieces(pieces.black | pieces.queen);
                        break;
                    case "n":
                        accessPieces(pieces.black | pieces.knight);
                        break;
                    case "p":
                        accessPieces(pieces.black | pieces.pawn);
                        break;
                    case "b":
                        accessPieces(pieces.black | pieces.bishop);
                        break;
                    case "r":
                        accessPieces(pieces.black | pieces.rook);
                        break;
                    case "K":
                        accessPieces(pieces.white | pieces.king);
                        break;
                    case "Q":
                        accessPieces(pieces.white | pieces.queen);
                        break;
                    case "N":
                        accessPieces(pieces.white | pieces.knight);
                        break;
                    case "P":
                        accessPieces(pieces.white | pieces.pawn);
                        break;
                    case "B":
                        accessPieces(pieces.white | pieces.bishop);
                        break;
                    case "R":
                        accessPieces(pieces.white | pieces.rook);
                        break;
                }
            }
        }
    }


    drawGraphicalBoard() {
        this.processFEN();
        console.log(this.pieces);
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
        for (let rank: number = 0; rank < 8; rank++) {
            for (let file: number = 0; file < 8; file++) {
                let pieceType: number = this.pieces[8 * rank + file];
                let url: string = "";
                switch (pieceType) {
                    case pieces.white | pieces.king:
                        url = "white_king";
                        break;
                    case pieces.white | pieces.queen:
                        url = "white_queen";
                        break;
                    case pieces.white | pieces.rook:
                        url = "white_rook";
                        break;
                    case pieces.white | pieces.bishop:
                        url = "white_bishop";
                        break;
                    case pieces.white | pieces.knight:
                        url = "white_knight";
                        break;
                    case pieces.white | pieces.pawn:
                        url = "white_pawn";
                        break;

                    case pieces.black | pieces.king:
                        url = "black_king";
                        break;
                    case pieces.black | pieces.queen:
                        url = "black_queen";
                        break;
                    case pieces.black | pieces.rook:
                        url = "black_rook";
                        break;
                    case pieces.black | pieces.bishop:
                        url = "black_bishop";
                        break;
                    case pieces.black | pieces.knight:
                        url = "black_knight";
                        break;
                    case pieces.black | pieces.pawn:
                        url = "black_pawn";
                        break;
                }
                if(pieceType > 0){
                    let sprite = this.Scene.add.sprite(position.x, position.y, url);
                    sprite.scale = 0.3;
                    sprite.setInteractive();
                    this.Scene.input.setDraggable(sprite);
                    sprite.addListener("drag", (pointer: any, dragX: number, dragY: number) => {
                        sprite.setPosition(pointer.x, pointer.y);
                        // sprite.setDepth(1);
                    });
                    sprite.addListener("dragend", (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) => {

                        // sprite.setDepth(0);
                    });
                }
                position.x += 100;
            }
            position.x = 50;
            position.y += 100;
        }
    }

};
