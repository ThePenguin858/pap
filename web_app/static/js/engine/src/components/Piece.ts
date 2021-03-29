import * as Phaser from 'phaser';
export enum pieces {
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
