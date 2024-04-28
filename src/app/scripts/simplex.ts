export default class Simplex {
    private basicVars: string[];
    private currentVars: string[];
    private matrix: number[][];

    constructor(matrix: number[][], basicVars: string[], currentVars: string[]) {
        this.matrix = matrix;
        this.basicVars = basicVars;
        this.currentVars = currentVars;
    }

    public balanceArtificalVars() {
        for(let i = 0; i < this.currentVars.length; i++) {
            if(this. currentVars[i].charAt(0) === "a") {
                let column = i;
                let row = -1;
                for(let j = 2; j < this.matrix.length; j++) {
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

    public makeFaseOneIteration() {
        for(let i = 0; i < this.matrix[0].length; i++) {
            if(this.matrix[0][i] < 0) {
                let min = Number.MAX_VALUE;
                let row = -1;
                for(let j = 2; j < this.matrix.length; j++) {
                    if(this.matrix[j][i] > 0) {
                        let ratio = this.matrix[j][this.matrix[j].length - 1] / this.matrix[j][i];
                        if(ratio < min) {
                            min = ratio;
                            row = j;
                        }
                    }
                }
                if(row === -1) {
                    console.log("No solution");
                    return;
                }
                this.multiplyRow(row, 1 / this.matrix[row][i]);
                this.gaussJordan(row, i);
                this.basicVars[row] = this.currentVars[i];
            }
        }
    }

    public prepareFaseTwo() {
        this.basicVars.splice(0, 1);
        this.matrix.splice(0, 1);
        for(let i = 0; i < this.matrix.length; i++) {
            for(let j = 0; j < this.matrix[i].length; j++) {
                if(this.currentVars[j].charAt(0) === "a") {
                    this.matrix[i].splice(j-1, 1);
                }
            }
        }
        this.currentVars = this.currentVars.filter((value) => value.charAt(0) !== "a");

    }

    public makeFaseTwoIteration() {
        for(let i = 0; i < this.matrix[0].length; i++) {
            if(this.matrix[0][i] < 0) {
                let min = Number.MAX_VALUE;
                let row = -1;
                for(let j = 1; j < this.matrix.length; j++) {
                    if(this.matrix[j][i] > 0) {
                        let ratio = this.matrix[j][this.matrix[j].length - 1] / this.matrix[j][i];
                        if(ratio < min) {
                            min = ratio;
                            row = j;
                        }
                    }
                }
                if(row === -1) {
                    console.log("No solution");
                    return;
                }
                this.multiplyRow(row, 1 / this.matrix[row][i]);
                this.gaussJordan(row, i);
                this.basicVars[row] = this.currentVars[i];
            }
        }
    }


    public getMatrix() {
        return this.matrix;
    }

    public multiplyRow(row: number, factor: number) {
        for (let i = 0; i < this.matrix[row].length; i++) {
            this.matrix[row][i] *= factor;
        }
    }

    public gaussJordan(row: number, column: number) {
        for (let i = 0; i < this.matrix.length; i++) {
            if (i === row) {
                continue;
            }
            let factor = -this.matrix[i][column] / this.matrix[row][column];
            for (let j = 0; j < this.matrix[i].length; j++) {
                this.matrix[i][j] += this.matrix[row][j] * factor;
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