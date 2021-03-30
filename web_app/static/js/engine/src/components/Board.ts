import * as chessUtils from '../utils/chess'
import { game as Game } from '../app'
import * as PieceComponent from '../components/Piece'
import * as Phaser from 'phaser'

export class Board {

    private Scene: Phaser.Scene;
    private pieces: number[];

    constructor(Scene: Phaser.Scene, FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",) {
        this.Scene = Scene;
        this.pieces = [];
        this.pieces[0] = PieceComponent.pieces.white | PieceComponent.pieces.bishop;
        this.pieces[1] = PieceComponent.pieces.white | PieceComponent.pieces.pawn;
        this.pieces[63] = PieceComponent.pieces.black | PieceComponent.pieces.queen;
    }
    // Starts at the 22 index, ends in the 86 index
    private mailbox: number[] = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1,  1,  1,  2,  3,  4,  5,  6,  7, -1, // starts at 21
            -1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
            -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
            -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
            -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
            -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
            -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
            -1, 56, 57, 58, 59, 60, 61, 62, 63, -1, // ends at 98
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    ];

    private processFEN(FEN: string){

    }

    public drawGraphicalBoard(){
        let position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(50,50);
        let squareWidth = 100;

        for(let rank: number = 0; rank < 8; rank++)
        {
            for(let file: number = 0; file < 8; file++)
            {
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
        for(let rank: number = 0; rank < 8; rank++)
        {
            for(let file: number = 0; file < 8; file++)
            {
                if(this.pieces[8 * rank + file ] > 0 )
                {
                    let pieceType: number =  this.pieces[8 * rank + file];
                    let url: string = "";
                    switch (pieceType) {
                        case 0:
                        case PieceComponent.pieces.white |PieceComponent.pieces.king:
                            url = "white_king";
                            break;
                        case PieceComponent.pieces.white |PieceComponent.pieces.queen:
                            url = "white_queen";
                            break;
                        case PieceComponent.pieces.white |PieceComponent.pieces.rook:
                            url = "white_rook";
                            break;
                        case PieceComponent.pieces.white |PieceComponent.pieces.bishop:
                            url = "white_bishop";
                            break;
                        case PieceComponent.pieces.white |PieceComponent.pieces.knight:
                            url = "white_knight";
                            break;
                        case PieceComponent.pieces.white |PieceComponent.pieces.pawn:
                            url = "white_pawn";
                            break;

                        case PieceComponent.pieces.black |PieceComponent.pieces.king:
                            url = "black_king";
                            break;
                        case PieceComponent.pieces.black |PieceComponent.pieces.queen:
                            url = "black_queen";
                            break;
                        case PieceComponent.pieces.black |PieceComponent.pieces.rook:
                            url = "black_rook";
                            break;
                        case PieceComponent.pieces.black |PieceComponent.pieces.bishop:
                            url = "black_bishop";
                            break;
                        case PieceComponent.pieces.black |PieceComponent.pieces.knight:
                            url = "black_knight";
                            break;
                        case PieceComponent.pieces.black |PieceComponent.pieces.pawn:
                            url = "black_pawn";
                            break;
                    }

                    let sprite = this.Scene.add.sprite(position.x, position.y, url);
                    sprite.scale = 0.3;
                    sprite.setInteractive();
                    this.Scene.input.setDraggable(sprite);
                    sprite.addListener("drag", (pointer: any, dragX: number, dragY: number) => {
                        sprite.setPosition(pointer.x, pointer.y);
                        sprite.setDepth(1);
                    });
                    sprite.addListener("dragend", (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) => {

                        sprite.setDepth(0);
                    })
                }
                position.x += 100;
            }
            position.x = 50;
            position.y += 100;
        }
    }

};
