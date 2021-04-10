import { SQUARES as enumSquare, PIECES, CASTLING} from './CST';


export type moveFlags = {
    check?: boolean;
    en_passant?: boolean;
    castling?: CASTLING;
    promotion?: PIECES;
}

export class Move {
    from: number;
    to: number;
    flags: moveFlags | undefined;

    constructor(start: number, end: number, flags: moveFlags = {
        check:false,
        en_passant:false,
        castling:CASTLING.NONE,
        promotion:PIECES.EMPTY
    }) {
        this.from = start;
        this.to = end;
        this.flags = flags;
    }

    toString(): string{
        let start = enumSquare[this.from].toString();
        let end = enumSquare[this.to].toString();
        return start + end;
    }
}
