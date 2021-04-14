import { SQUARES as enumSquare, PIECES, CASTLING} from './CST';

export class Move {
    from: number;
    to: number;

    capture: boolean = false;
    check: boolean = false;
    en_passant: number = -1;
    castling: CASTLING = CASTLING.NONE;
    promotion: PIECES = PIECES.EMPTY;

    constructor(start: number, end: number) {
        this.from = start;
        this.to = end;
    }

    toString(): string{
        let start = enumSquare[this.from].toString();
        let end = enumSquare[this.to].toString();
        return start + end;
    }
}
