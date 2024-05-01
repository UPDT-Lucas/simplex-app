let Algebrite = require('algebrite');
let Math = require('mathjs');
type MatrixValue = string | number;
type Matrix = MatrixValue[][];
export default class SimplexBigM {
    private basicVars: string[];
    private currentVars: string[];
    private matrix: Matrix;
    
    private isMin: boolean;

    constructor(matrix: Matrix, basicVars: string[], currentVars: string[], isMin: boolean) {
        this.matrix = matrix;
        this.basicVars = basicVars;
        this.currentVars = currentVars;
        this.isMin = isMin;
    }

    public getMatrix() {
        return this.matrix;
    }

    public verifyArtificalM() {
        for (let i = 0; i < this.currentVars.length; i++) {
            if ((this.currentVars[i].charAt(0) === "a") && this.matrix[0][i] !== 'M') {
                return false;
            }
        }
        return true;
    }

    public balanceArtificalVars() {
        for(let i = 0; i < this.currentVars.length; i++) {
            if(this. currentVars[i].charAt(0) === "a") {
                let column = i;
                let row = -1;
                for(let j = 1; j < this.matrix.length; j++) {
                    if(this.matrix[j][column] === 1) {
                        if(row === -1) {
                            row = j;
                        } else {
                            row = -1;
                            break;
                        }
                    }
                }
                if(row !== -1) {
                    this.basicVars[row] = this.currentVars[column];
                    this.gaussJordan(row, column);
                }
            }
        }
    }

    public makeIteration() {
        for (let i = 0; i < this.matrix[0].length-1; i++) {
            let currentCoeff;
            if(Number.isNaN(Number(this.matrix[0][i]))){
                currentCoeff = Algebrite.coeff(this.matrix[0][i], 'M', 1).toString();
            } else {
                currentCoeff = this.matrix[0][i];
            }
            if(currentCoeff < 0) {
                let min = Number.MAX_VALUE;
                let row = -1;
                for (let j = 1; j < this.matrix.length; j++) {
                    if (Number(this.matrix[j][i]) > 0) {
                        let ratio = Number(this.matrix[j][this.matrix[j].length - 1]) / Number(this.matrix[j][i]);
                        if (ratio < min) {
                            min = ratio;
                            row = j;
                        }
                    }
                }
                if (row === -1) {
                    console.log("No solution");
                    return;
                } 
                this.multiplyRow(row, 1 / Number(this.matrix[row][i]));
                this.gaussJordan(row, i);
                this.basicVars[row] = this.currentVars[i];
            }
        }       
    }

    public multiplyRow(row: number, value: number | string) {
        for (let i = 0; i < this.matrix[row].length; i++) {
            if(typeof this.matrix[row][i] === 'number' && typeof value === 'number') {
                this.matrix[row][i] = Number(this.matrix[row][i]) * value;
            } else {
                this.matrix[row][i] = Algebrite.run(this.matrix[row][i] + "*" + value);
            }
        }
    }

    public gaussJordan(row: number, column: number) {
        for (let i = 0; i < this.matrix.length; i++) {
            if (i === row) {
                continue;
            }
            let factor;
            if(typeof this.matrix[i][column] == "string"){
                factor = Algebrite.run(`-(${this.matrix[i][column]}) / ${this.matrix[row][column]}`).toString();
                for (let j = 0; j < this.matrix[i].length; j++) {
                    this.matrix[i][j] = Algebrite.run(Math.rationalize(`${this.matrix[i][j]} + ${this.matrix[row][j]} * (${factor})`).toString()).toString();
                }
                continue;
            } else{
                factor = - Number(this.matrix[i][column]) / Number(this.matrix[row][column]);
                for (let j = 0; j < this.matrix[i].length; j++) {
                    this.matrix[i][j] = Number(this.matrix[i][j]) + Number(this.matrix[row][j]) * Number(factor);
                }
                continue;
            }
        }
    }

    

    public getInfo() {
        console.log(this.currentVars);
        for (let i = 0; i < this.matrix.length; i++) {
            let row = this.basicVars[i] + "   ";
            for (let j = 0; j < this.matrix[i].length; j++) {
                row += this.matrix[i][j] + "   ";
            }
            console.log(row);
        }
    }

 



}