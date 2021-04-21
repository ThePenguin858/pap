import * as Phaser from 'phaser'
import * as Move from './Move'
import * as CST from './CST'
import {DEPTH_SET, DEPTH_DRAG} from './CST'

export class Board {

    private pieces: number[];
    private colors: number[];

    gameState: CST.GAME_STATES = CST.GAME_STATES.PLAYING;
    private side: number = CST.COLORS.WHITE;
    private xside: number = CST.COLORS.BLACK;
    private fifty: number = 0;
    private moveCount: number = 0;
    private hash: number = 0;
    private ply: number = 0;
    private hply: number = 0;
    private moveList: Move.Move[];
    private possibleMoves: Move.Move[];
    private capturedPieces: number[];
    private capturedColors: number[];

    private FEN: string

    private initialSpriteDrag: [number, number];
    private currentMove: Move.Move;
    private Scene: Phaser.Scene;
    private pieceSprites: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[];

    constructor(Scene: Phaser.Scene, FEN: string = "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R b KQkq - 30 23") {
        this.Scene = Scene;
        this.moveList = [];
        this.possibleMoves = [];
        this.capturedPieces = [];
        this.capturedColors = [];
        this.initialSpriteDrag = [0, 0];
        this.pieces = [];
        this.colors = [];
        this.FEN = FEN;
        this.side = CST.COLORS.WHITE;

        this.possibleMoves.push(new Move.Move(CST.SQUARES.E2, CST.SQUARES.E4));
        this.possibleMoves.push(new Move.Move(CST.SQUARES.C7, CST.SQUARES.C5));
        this.possibleMoves.push(new Move.Move(CST.SQUARES.D2, CST.SQUARES.D4));
        this.possibleMoves.push(new Move.Move(CST.SQUARES.C5, CST.SQUARES.D4));

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
        this.processFEN();
    }

    private mailbox: number[] = [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, -1,
        -1, 8, 9, 10, 11, 12, 13, 14, 15, -1,
        -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
        -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
        -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
        -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
        -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
        -1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
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
        let sections = this.FEN.split(" ");

        // This is the section that handles reading in the piecese
        let square = 0;
        for (let i = 0; i < sections[0].length; i++) {
            let char = sections[0].charAt(i);

            if (char !== '/') {
                if (parseInt(char)) {
                    let space = parseInt(char);
                    for (let j = 0; j < space; j++) {
                        this.pieces[square] = CST.PIECES.EMPTY;
                        this.colors[square] = CST.PIECES.EMPTY;
                        square++;
                    }
                } else {

                    if (char == char.toUpperCase())
                        this.colors[square] = CST.COLORS.WHITE; // Char is Lowercase
                    else
                        this.colors[square] = CST.COLORS.BLACK; // Char is Uppecase

                    char.toLowerCase();
                    switch (char) {
                        case "k":
                            this.pieces[square] = CST.PIECES.KING;
                            break;
                        case "q":
                            this.pieces[square] = CST.PIECES.QUEEN;
                            break;
                        case "n":
                            this.pieces[square] = CST.PIECES.KNIGHT;
                            break;
                        case "p":
                            this.pieces[square] = CST.PIECES.PAWN;
                            break;
                        case "b":
                            this.pieces[square] = CST.PIECES.BISHOP;
                            break;
                        case "r":
                            this.pieces[square] = CST.PIECES.ROOK;
                            break;
                    }
                    square++;
                }
            }
        }

        /*Lida com o lado a jogar*/
        if (sections[1].charAt(0) == "w") {
            this.side == CST.COLORS.WHITE;
            this.xside == CST.COLORS.BLACK;
        } else {
            this.xside == CST.COLORS.WHITE;
            this.side == CST.COLORS.BLACK;

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

        ////////////////////////////////////////////////////////////////////
        /* This is the section that handles the number of moves */
        this.moveCount = parseInt(sections[5]);
    }

    /*Desenha os quadrados que compõem o tabuleiro*/
    private drawSquares() {
        let position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(50, 50);
        let squareWidth = 100;

        for (let rank: number = 0; rank < 8; rank++) {
            for (let file: number = 0; file < 8; file++) {
                let squareColor: number;
                if ((file + rank) % 2)
                    squareColor = 0xC2A987; /*Quadrado é branco*/
                else
                    squareColor = 0xede0d5; /*Quadrado é escuro*/

                this.Scene.add.rectangle(position.x, position.y, squareWidth, squareWidth, squareColor);
                position.x += 100;
            }
            position.x = 50;
            position.y += 100;
        }
    }

    /*Retorna o Url da peça a partir da cor e tipo*/
    getPieceUrlByType(piece: number, color: CST.COLORS) {
        let url: string;
        if (color == CST.COLORS.WHITE)
            url = "white_";
        else
            url = "black_";

        switch (piece) {
            case CST.PIECES.PAWN:
                url += "pawn";
                break;
            case CST.PIECES.KNIGHT:
                url += "knight";
                break;
            case CST.PIECES.BISHOP:
                url += "bishop";
                break;
            case CST.PIECES.ROOK:
                url += "rook";
                break;
            case CST.PIECES.QUEEN:
                url += "queen";
                break;
            case CST.PIECES.KING:
                url += "king";
                break;
        }
        return url;
    }

    /*Draws the squares and pieces of the board*/
    drawGraphicalBoard() {
        console.log(this.pieces);
        console.log(this.colors);
        let position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(50, 50);
        this.drawSquares();
        position.x = 50;
        position.y = 50;
        for (let i = 0; i < 64; i++) {
            if (this.colors[i] != CST.PIECES.EMPTY) {
                let url: string = "";
                url = this.getPieceUrlByType(this.pieces[i], this.colors[i]);
                let piece = this.Scene.physics.add.sprite(position.x, position.y, url);
                piece.setDepth(DEPTH_SET);

                /* Sprite initialization */
                piece.scale = 0.3;
                piece.setBodySize(150, 150);
                piece.setInteractive();
                this.Scene.input.setDraggable(piece);

                const getBoardIndex = () => {
                    let file = Math.floor(piece.x / 100);
                    let rank = Math.floor(piece.y / 100);
                    return 8 * rank + file;
                }

                /* Handle the drag input of the pieces and translate it into 
                the mailbox board representation */
                piece.addListener("dragstart", (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
                    if (dragX < 800 && dragY < 800) {
                        let to = getBoardIndex();
                        piece.setDepth(DEPTH_DRAG);
                        if (this.colors[to] == this.side) {
                            this.currentMove.from = to;
                            /* this.generateMoves(); */
                        }

                        /* Guardar a posição inicial da peça para que possa ser 
                        reiniciada */
                        this.initialSpriteDrag[0] = piece.x;
                        this.initialSpriteDrag[1] = piece.y;

                    }
                });
                piece.addListener("drag", (pointer: any, dragX: number, dragY: number) => {
                    if (dragX < 800 && dragY < 800) {
                        piece.setPosition(pointer.x, pointer.y);
                    }
                });

                /*Drag end event da peça */
                piece.addListener("dragend", (pointer: Phaser.Input.Pointer, obj: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) => {
                    if (piece.x > 0 && piece.x < 800 && piece.y > 0 && piece.y < 800) {
                        if (this.colors[this.currentMove.from] == this.side) {

                            this.currentMove.to = getBoardIndex();;
                            if (this.isMoveValid(this.currentMove)) { // MOVE IS VALID

                                /* This piece of code centralizes the objects in a grid square */
                                piece.setX(Math.floor(piece.x / 100) * 100 + 50);
                                piece.setY(Math.floor(piece.y / 100) * 100 + 50);


                                /* This checks if sprites have collided */
                                this.currentMove.capture = this.checkForCollisions(piece);


                                /* This switches the color to move */
                                this.side = +!this.side;
                                this.xside = +!this.xside;

                                /* Make the move on the board */
                                this.makeMove(this.currentMove);

                                /* Set the depth of the piece to be behind the (to exist) drag piece */
                            } else
                                piece.setPosition(this.initialSpriteDrag[0], this.initialSpriteDrag[1]);
                        } else {
                            piece.setPosition(this.initialSpriteDrag[0], this.initialSpriteDrag[1]);
                            this.currentMove.to = this.currentMove.from;
                        }
                        piece.setDepth(DEPTH_SET);
                    }
                });
                this.pieceSprites.push(piece);

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

    /*Retorna verdadeiro se houver colisão de peças*/
    private checkForCollisions(sprite1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): boolean {
        this.pieceSprites.forEach((sprite2) => {
            if (this.Scene.physics.overlap(sprite1, sprite2)) {
                let index = this.pieceSprites.indexOf(sprite2, 0);
                delete this.pieceSprites[index];
                sprite2.destroy();
                return true;
            } else {
                sprite1.setDepth(0);
            }
        });
        return false;

    };


    private setFlagsForMove(move: Move.Move, start: number, end: number) {
    }
    /*Retorna verdadeiro se o movimento feito se encotrar na list de movimentos 
    possíveis*/
    private isMoveValid(move: Move.Move): boolean {
        let index = this.possibleMoves.findIndex((funcMove) => {
            if (funcMove.from == move.from && funcMove.to == move.to)
                return funcMove;
        })
        if (index > -1) {
            return true;
        } else
            return false;
    }

    /*Apaga todas as sprites do jogo para ser reiniciado*/
    restartBoard() {
        this.pieceSprites.forEach((sprite2) => {
            let index = this.pieceSprites.indexOf(sprite2, 0);
            sprite2.destroy();
            delete this.pieceSprites[index];
        });
        this.drawGraphicalBoard();
    }

    private makeMove(move: Move.Move, draw: boolean = false) {
        /*Decide se o move foi uma captura*/
        if (this.pieces[move.to] != CST.PIECES.EMPTY) {
            /* Captura */
            this.capturedColors.push(this.colors[move.to]);
            this.capturedPieces.push(this.pieces[move.to]);
        } else {
            /* Não capture */
            this.capturedColors.push(CST.PIECES.EMPTY);
            this.capturedPieces.push(CST.PIECES.EMPTY);
        }
        /*Acrescentar o move para a lista*/
        this.moveList.push(new Move.Move(move.from, move.to));

        /* Actualing moving the piece */
        this.colors[move.to] = this.colors[move.from];
        this.pieces[move.to] = this.pieces[move.from];

        this.colors[move.from] = CST.PIECES.EMPTY;
        this.pieces[move.from] = CST.PIECES.EMPTY;

        /* Castling moves */


        /* en passant square */

        /* Reset the moves that can be made */
        /* this.generateMoves(); */

    }

    unmakeMove() {
        let move = this.moveList.pop();
        let piece = this.capturedPieces.pop();
        let color = this.capturedColors.pop();
        if (typeof (move) != 'undefined' && typeof (piece) != 'undefined' && typeof (color) != 'undefined') {

            /*Reverter as cores*/
            this.colors[move.from] = this.colors[move.to];
            this.colors[move.to] = color;

            /*Reverter as peças*/
            this.pieces[move.from] = this.pieces[move.to];
            this.pieces[move.to] = piece;


            /*Reverter o lado a jogar*/
            this.side = +!this.side;
            this.xside = +!this.xside;


            /* Restart the visual board */
        }
        this.restartBoard();
    }

    private generateMoves(piece: number) {



    };

};
