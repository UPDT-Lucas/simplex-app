import * as Algebrite from 'algebrite';
import * as Math from 'mathjs';

// import { Math } from 'mathjs'
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
    for (let i = 0; i < this.currentVars.length; i++) {
      if (this.currentVars[i].includes("a")) {
        console.log("BALANCE SUB I ", i)
        let column = i;
        let row = -1;
        for (let j = 1; j < this.matrix.length; j++) {
          console.log("BALANCE SUB J ", j, " MATRIX ", this.matrix[j][column])
          if (this.matrix[j][column] === 1 || this.matrix[j][column] === '1') {
            if (row === -1) {
              row = j;
            } else {
              row = -1;
              break;
            }
          }
        }
        if (row !== -1) {
          this.basicVars[row] = this.currentVars[column];
          this.gaussJordan(row, column);
        }
      }
    }
    console.log('after balance ++++++++++++++++++++++++++++++++++++++++++++++')
    this.getInfo()
  }

  public getBasicVars() {
    return [...this.basicVars];
  }

  public getCurrentVars() {
    return [...this.currentVars];
  }


  public makeIteration(): Promise<number> {
    console.log('MAKE ITERATION ------------------------------------------')
    return new Promise<number>((resolve, reject) => {
    let minCoeff = Number.MAX_VALUE;
    for (let i = 0; i < this.matrix[0].length - 1; i++) {
      let actualCoeff;
      if (this.matrix[0][i].toString().includes('M')) {
        console.log('BEFORE ERROR ', this.matrix[0][i].toString())
        console.log('VEFORE ERROR ', Math.simplify(this.matrix[0][i].toString()).toString())
        actualCoeff = parseFloat(Algebrite.coeff(this.matrix[0][i], 'M', 1).toString());
        console.log('ACTUAL COEFF ALGEE', actualCoeff)
        console.log('ACTUAL COEFF MInCOEFF', minCoeff)
        if (actualCoeff < minCoeff) {
          minCoeff = actualCoeff;
        }
      } else {
        console.log('BEFORE ERROR2 ', this.matrix[0][i].toString())
        if(typeof this.matrix[0][i] === 'string') {
          actualCoeff = Math.evaluate(this.matrix[0][i].toString());
          if (actualCoeff < minCoeff) {
            minCoeff = actualCoeff;
          }
        } else {
          actualCoeff = this.matrix[0][i];
          if (Number(actualCoeff) < minCoeff) {
            minCoeff = Number(actualCoeff);
          }
        }
      }
    }
    console.log("MINCOEFF ", minCoeff)
    if (minCoeff >= 0) {
      resolve(-1);
    }
    for (let i = 0; i < this.matrix[0].length - 1; i++) {
      let currentCoeff;
      if (this.matrix[0][i].toString().includes('M')) {
        currentCoeff = parseFloat(Algebrite.coeff(this.matrix[0][i], 'M', 1).toString());
      } else {
        currentCoeff = Math.evaluate(this.matrix[0][i].toString())
      }
      console.log('currentCoeff ', currentCoeff, 'minCoeff ', minCoeff, 'compare ', currentCoeff == minCoeff)
      if (currentCoeff < 0 && currentCoeff == minCoeff) {
        let min = Number.MAX_VALUE;
        let row = -1;
        for (let j = 1; j < this.matrix.length; j++) {
          console.log("NUMBER AAAAAA ", Math.evaluate(this.matrix[j][i].toString()) > 0)
          console.log("FLOAT VALUE ", Math.evaluate(this.matrix[j][i].toString()))
          if (parseFloat(this.matrix[j][i].toString()) > 0) {
            console.log('ratio params ', this.matrix[j][this.matrix[j].length - 1], this.matrix[j][i])
            console.log('Fixed params ', Math.evaluate(`(${this.matrix[j][this.matrix[j].length - 1]}) / (${this.matrix[j][i]})`))
            let ratio = Math.evaluate(`(${this.matrix[j][this.matrix[j].length - 1]}) / (${this.matrix[j][i]})`);
            if (ratio < 0) {
              ratio = Number.MAX_VALUE;
            }
            if (ratio < min) {
              min = ratio;
              row = j;
            }
            console.log('ratio ', ratio, 'min ', min, 'row ', row, 'column ', i)
          }
        }
        if (row === -1) {
          resolve(-1);
        }
        console.log("PARAM MULTIPLY ROW ", row, " MATH ", Math.evaluate(`1 / (${this.matrix[row][i].toString()})`).toString())
        this.multiplyRow(row, Math.evaluate(`1 / (${this.matrix[row][i].toString()})`));
        this.gaussJordan(row, i);
        this.basicVars[row] = this.currentVars[i];
        break;
      }
    }
    resolve(1) ;
    });
  }

  public checkSolved() {
    for (let i = 0; i < this.matrix[0].length - 1; i++) {
      let currentCoeff;
      if (this.matrix[0][i].toString().includes('M')) {
        currentCoeff = Algebrite.coeff(Math.rationalize(this.matrix[0][i].toString()).toString(), 'M', 1).toString();
      } else {
        currentCoeff = this.matrix[0][i];
      }
      if (parseFloat(currentCoeff) < 0) {
        return false;
      }
    }
    return true;
  }

  public multiplyRow(row: number, value: number | string) {
    console.log('MULTIPLY ROW ', row, 'VALUE ', value)
    for (let i = 0; i < this.matrix[row].length; i++) {
      if (typeof this.matrix[row][i] === 'number' && typeof value === 'number') {
        this.matrix[row][i] = Number(this.matrix[row][i]) * value;
        console.log('MULTIPLY ROW VALUE ', this.matrix[row][i])
      } else {
        this.matrix[row][i] = Math.simplify(this.matrix[row][i] + "*" + value).toString();
      }
    }
  }

  public gaussJordan(row: number, column: number) {
    for (let i = 0; i < this.matrix.length; i++) {
      if (i === row) {
        continue;
      }
      let factor;
      if (typeof this.matrix[i][column] == "string" || true) {
        let factorToAssign = this.matrix[i][column].toString();
        if(factorToAssign.includes('M')) {
          factor = Math.simplify( Math.rationalize(`-(${this.matrix[i][column].toString()}) / (${this.matrix[row][column]})`).toString()).toString();
          console.log('factor before1 ', this.matrix[i][column].toString())
          console.log('PARam factor1 ', `-(${this.matrix[i][column].toString()}) / (${this.matrix[row][column]})`)
        } else {
          factor =  Math.simplify( Math.rationalize(`-(${this.matrix[i][column].toString()}) / (${this.matrix[row][column]})`).toString()).toString();
          console.log('factor before2 ', this.matrix[i][column].toString())
          console.log('PARam factor2 ', `-(${this.matrix[i][column].toString()}) / (${this.matrix[row][column]})`)
        }
        console.log('FACTOR ', factor)
        for (let j = 0; j < this.matrix[i].length; j++) {
          console.log(this.matrix[i][j].toString().includes('M'))
          console.log("CUR MAT ", this.matrix[i][j])
          if(this.matrix[i][j].toString().includes('M')) {
            console.log(`PAram mat1 ${this.matrix[i][j].toString()} + ${this.matrix[row][j].toString()} * (${factor})`)
            this.matrix[i][j] = Math.simplify(Math.rationalize(`${this.matrix[i][j].toString()} + ${this.matrix[row][j].toString()} * (${factor})`).toString()).toString();
          } else {
            console.log(`PAram mat2 ${this.matrix[i][j].toString()} + ${this.matrix[row][j].toString()} * (${factor})`)
            console.log('ratio ', Math.rationalize(`${this.matrix[i][j].toString()} + ${this.matrix[row][j].toString()} * (${factor})`).toString())
            this.matrix[i][j] = Math.simplify(Math.rationalize(`${this.matrix[i][j].toString()} + ${this.matrix[row][j].toString()} * (${factor})`).toString()).toString();
          }
          console.log("RESULT MAT ", this.matrix[i][j])
          this.getInfo()
        }
        continue;
      } else {
        factor = - Number(this.matrix[i][column]) / Number(this.matrix[row][column]);
        for (let j = 0; j < this.matrix[i].length; j++) {
          this.matrix[i][j] = Number(this.matrix[i][j]) + Number(this.matrix[row][j]) * Number(factor);
        }
        continue;
      }
    }
  }

  getFreeVarSolution(row: number) {
    let freeVarName = this.basicVars[row].replace(/p/g, '');
    let freeVarP = 0;
    let freeVarPP = 0;
    for(let i = 0; i < this.basicVars.length; i++){
        if(this.basicVars[i].startsWith(freeVarName)) {
          if(this.basicVars[i].endsWith("pp")) {
            freeVarPP = Math.evaluate(this.matrix[i][this.matrix[i].length - 1].toString());
          } else {
            freeVarP = Math.evaluate(this.matrix[i][this.matrix[i].length - 1].toString());;
          }
        }
    }
    return (freeVarP - freeVarPP)
  }

  public getSolution(): string[] {
    let solution: { [key: string]: number } = {};
    for (let i = 0; i < this.basicVars.length; i++) {
      if (this.basicVars[i].endsWith("p")) {
        if(!(this.basicVars[i].replace(/p/g, '') in solution)) {
          solution[this.basicVars[i].replace(/p/g, '')] = this.getFreeVarSolution(i);
        }
      }
      solution[this.basicVars[i]] = Math.evaluate(this.matrix[i][this.matrix[i].length - 1].toString());
    }
    for (let i = 0; i < this.currentVars.length; i++) {
        if (this.basicVars.indexOf(this.currentVars[i]) === -1) {
            solution[this.currentVars[i]] = 0;
        }
    }
    let arraySolution = [];
    for (let solutionKey in solution) {
        if(solutionKey.indexOf("z") !== -1 && this.isMin){
            arraySolution.push(`${solutionKey} = ${-solution[solutionKey]}`);
        } else {
            arraySolution.push(`${solutionKey} = ${solution[solutionKey]}`);
        }
    }
     arraySolution.sort((a, b) => b.localeCompare(a));
     return arraySolution;
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
