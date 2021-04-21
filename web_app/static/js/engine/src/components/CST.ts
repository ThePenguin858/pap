export const enum PIECES {
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING,
    EMPTY = 6,
};
export const enum CASTLING {
    NONE = -1,
    SHORT = 0,
    LONG = 1
}
export const enum COLORS {
    WHITE = 0,
    BLACK = 1,
}

export const enum GAME_STATES {
    PLAYING,
    DRAW,
    WHITE_WON,
    BLACK_WON,
}
export enum SQUARES {
  A8, B8, C8, D8, E8, F8, G8, H8,
  A7, B7, C7, D7, E7, F7, G7, H7,
  A6, B6, C6, D6, E6, F6, G6, H6,
  A5, B5, C5, D5, E5, F5, G5, H5,
  A4, B4, C4, D4, E4, F4, G4, H4,
  A3, B3, C3, D3, E3, F3, G3, H3,
  A2, B2, C2, D2, E2, F2, G2, H2,
  A1, B1, C1, D1, E1, F1, G1, H1,
};

export const DEPTH_DRAG = 1;
export const DEPTH_SET = 0;

export let OFFSET: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0], //Pawn offsets
    [-21, -19, -12, -8, 8, 12, 19, 21], // Knight 
    [-11, -9, 9, 11, 0, 0, 0, 0], //Bishop
    [-10, -1, 1, 10, 0, 0, 0, 0], //Rook
    [-11, -10, -9, -1, 1, 9, 10, 11], //Queen
    [-11, -10, -9, -1, 1, 9, 10, 11] //King
];
