export class Move {
    startSquare: number;
    endSquare: number;

    constructor(start: number, end: number) {
        this.startSquare = start;
        this.endSquare = end;
    }
}
