
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

    public verifyArtificalM() {
        for (let i = 0; i < this.currentVars.length; i++) {
            if ((this.currentVars[i].charAt(0) === "a") && this.matrix[0][i] !== 'M') {
                return false;
            }
        }
        return true;
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