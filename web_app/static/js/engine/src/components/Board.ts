import * as chessUtils from '../utils/chess'
import * as Phaser from 'phaser'

export class Board {
    private Scene: Phaser.Scene;
    constructor(Scene: Phaser.Scene, FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",) {
        this.Scene = Scene;
    }
    // Starts at the 22 index, ends in the 86 index
    private mailbox: number[] = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
            -1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
            -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
            -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
            -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
            -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
            -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
            -1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    ];

    drawGraphicalBoard(){
        let position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(100,100);
        let squareWidth = 100;
        for(let rank: number = 0; rank < 8; rank++)
        {
            for(let file: number = 0; file < 8; file++)
            {
                let squareColor: number;
                if (file + rank % 2)
                {
                    //Square is light
                    squareColor = 0xede0d5;
                } else {
                    //Square is light
                    squareColor = 0xC2A987;
                }
                this.Scene.add.rectangle(position.x, position.y, squareWidth, squareWidth, 0xff0000);
                position.x += squareWidth;
                position.y += squareWidth;
            }
        }
    }

};
