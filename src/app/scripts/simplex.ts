export default class Simplex {
  private basicVars: string[];
  private currentVars: string[];
  private matrix: number[][];
  private isMin: boolean;
  private solutions: string[] = [];

  constructor(
    matrix: number[][],
    basicVars: string[],
    currentVars: string[],
    isMin: boolean
  ) {
    this.matrix = matrix;
    this.basicVars = basicVars;
    this.currentVars = currentVars;
    this.isMin = isMin;
  }

  public balanceArtificalVars() {
    for (let i = 0; i < this.currentVars.length; i++) {
      if (this.currentVars[i].charAt(0) === 'a') {
        let column = i;
        let row = -1;
        for (let j = 2; j < this.matrix.length; j++) {
          if (this.matrix[j][column] === 1) {
            if (row === -1) {
              row = j;
            } else {
              row = -1;
              continue;
            }
          }
        }
        if (row !== -1) {
          this.basicVars[row] = this.currentVars[column];
          this.gaussJordan(row, column);
        }
      }
    }
  }

  public makeFaseOneIteration() {
    for (let i = 0; i < this.matrix[0].length - 1; i++) {
      if (this.matrix[0][i] < 0) {
        let min = Number.MAX_VALUE;
        let row = -1;
        for (let j = 2; j < this.matrix.length; j++) {
          if (this.matrix[j][i] > 0) {
            let ratio =
              this.matrix[j][this.matrix[j].length - 1] / this.matrix[j][i];
            if (ratio < min) {
              min = ratio;
              row = j;
            }
          }
        }
        //this.currentVars[row] = this.basicVars[i];
        if (row === -1) {
          return -1;
        }
        this.multiplyRow(row, 1 / this.matrix[row][i]);
        this.gaussJordan(row, i);
        this.basicVars[row] = this.currentVars[i];
        // this.currentVars[row] = this.basicVars[i]
      }
    }
    return 1;
  }

  public checkSolved() {
    for (let i = 0; i < this.matrix[0].length - 2; i++) {
      if (this.matrix[0][i] < 0) {
        return false;
      }
    }
    return true;
  }

  public checkRow0NegativeRHS() {
    if (this.matrix[0][this.matrix[0].length - 1] < 0) {
      return true;
    }
    return false;
  }

  public prepareFaseTwo() {
    console.log('prepareFaseTwo');
    this.getInfo();
    this.basicVars.splice(0, 1);
    this.matrix.splice(0, 1);
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        console.log(this.currentVars);
        console.log(this.basicVars);
        console.log(this.currentVars[j] + ' ' + this.currentVars[j].charAt(0));
        console.log('J: ' + j);
        if (this.currentVars[j].charAt(0) == 'a') {
          this.matrix[i].splice(j - 1, 1);
        }
      }
    }
    this.currentVars = this.currentVars.filter(
      (value) => value.charAt(0) != 'a'
    );
    this.getInfo();
  }

  public makeFaseTwoIteration(): number {
    for (let i = 0; i < this.matrix[0].length - 1; i++) {
      if (this.matrix[0][i] < 0) {
        let min = Number.MAX_VALUE;
        let row = -1;
        for (let j = 1; j < this.matrix.length; j++) {
          if (this.matrix[j][i] > 0) {
            let ratio =
              this.matrix[j][this.matrix[j].length - 1] / this.matrix[j][i];
            if (ratio < min) {
              min = ratio;
              row = j;
            }
          }
        }
        //this.currentVars[row] = this.basicVars[i];
        if (row === -1) {
          return -1;
        }
        this.multiplyRow(row, 1 / this.matrix[row][i]);
        this.gaussJordan(row, i);
        console.log('row ' + row + 'i ' + i);
        this.basicVars[row] = this.currentVars[i];
        // this.currentVars[row] = this.basicVars[i]
      }
    }
    return 1;
  }

  public getMatrix() {
    return [... this.matrix];
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

  public getBasicVars() {
    return [...this.basicVars];
  }

  public getCurrentVars() {
    return [...this.currentVars];
  }

  public getInfo() {
    console.log(this.currentVars);
    for (let i = 0; i < this.matrix.length; i++) {
      let row = this.basicVars[i] + '   ';
      for (let j = 0; j < this.matrix[i].length; j++) {
        row += this.matrix[i][j] + '   ';
      }
      console.log(row);
    }
  }

  public getSolution(): string[] {
    let solution: { [key: string]: number } = {};
    console.log("basic")
    console.log(this.basicVars)
    for (let i = 0; i < this.basicVars.length; i++) {
      console.log(this.basicVars[i])
      solution[this.basicVars[i]] = this.matrix[i][this.matrix[i].length - 1];
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
    // this.matrix = this.transpose(this.matrix);
    // const rhs = this.matrix[this.matrix.length - 1];
    // for (let i = 0; i < this.currentVars.length; i++) {
    //   this.solutions.push(`${this.currentVars[i]} = ${rhs[i]}`);
    // }
    // this.matrix = this.transpose(this.matrix);
    // return this.solutions;
  }

  transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, i) => matrix.map((array) => array[i]));
  }
}
