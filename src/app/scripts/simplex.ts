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
    console.log("balanceArtificalVars ------------------------")
    for (let i = 0; i < this.currentVars.length; i++) {
      if (this.currentVars[i].includes('a')) {
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
    console.log("after balanceArtificalVars ------------------------")
    this.getInfo();
  }


  public async makeFaseOneIteration(): Promise<number> {
    console.log("makeFaseOneIteration ------------------------")
    console.log(this.matrix)
    return new Promise<number>((resolve, reject) => {
    let minCoeff = Number.MAX_VALUE;
    for (let i = 0; i < this.matrix[0].length - 1; i++) {
      if(this.matrix[0][i] < minCoeff){
        minCoeff = this.matrix[0][i];
      }
    }
    if (minCoeff >= 0) {
      resolve(-1);
    }
    for (let i = 0; i < this.matrix[0].length - 1; i++) {
      if (this.matrix[0][i] < 0 && this.matrix[0][i] == minCoeff) {
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
          resolve(-1);
        }
        console.log("PIVOT ", this.matrix[row][i], " ROW ", row, " COLUMN ", i)
        this.multiplyRow(row, 1 / this.matrix[row][i]);
        this.gaussJordan(row, i);
        this.basicVars[row] = this.currentVars[i];
        // this.currentVars[row] = this.basicVars[i]
      }
    }
    resolve(1) ;
    });
  }

  public checkSolved() {
    for (let i = 0; i < this.matrix[0].length - 1; i++) {
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
    console.log("prepareFaseTwo ------------------------")
    this.getInfo();
    this.basicVars.splice(0, 1);
    this.matrix.splice(0, 1);
    for (let i = 0; i < this.matrix.length; i++) {
      let spliceCounter = 0;
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.currentVars[j].includes('a')) {
          this.matrix[i].splice(j - spliceCounter, 1);
          spliceCounter++;
          console.log("splice ", j - 1, " j ", j)
          this.getInfo();
        }
      }
      this.currentVars 
    }
    this.currentVars = this.currentVars.filter(
      (value) => value.charAt(0) != 'a'
    );
    console.log("after prepareFaseTwo ------------------------")
    this.getInfo();
  }

  public async makeFaseTwoIteration(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let minCoeff = Number.MAX_VALUE;
      for (let i = 0; i < this.matrix[0].length - 1; i++) {
        if (this.matrix[0][i] < minCoeff) {
          minCoeff = this.matrix[0][i];
        }
      }
      if (minCoeff >= 0) {
        resolve(-1);
      }
      for (let i = 0; i < this.matrix[0].length - 1; i++) {
        if (this.matrix[0][i] < 0 && this.matrix[0][i] == minCoeff) {
          let min = Number.MAX_VALUE;
          let row = -1;
          for (let j = 1; j < this.matrix.length; j++) {
            if (this.matrix[j][i] > 0) {
              let ratio = this.matrix[j][this.matrix[j].length - 1] / this.matrix[j][i];
              if (ratio < min) {
                min = ratio;
                row = j;
              }
            }
          }
          if (row === -1 || minCoeff >= 0) {
            resolve(-1);
          }
          this.multiplyRow(row, 1 / this.matrix[row][i]);
          this.gaussJordan(row, i);
          this.basicVars[row] = this.currentVars[i];
        }
      }
      resolve(1);
    });
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

  getFreeVarSolution(row: number) {
    let freeVarName = this.basicVars[row].replace(/p/g, '');
    let freeVarP = 0;
    let freeVarPP = 0;
    for(let i = 0; i < this.basicVars.length; i++){
        if(this.basicVars[i].startsWith(freeVarName)) {
          if(this.basicVars[i].endsWith("pp")) {
            freeVarPP = this.matrix[i][this.matrix[i].length - 1];
          } else {
            freeVarP = this.matrix[i][this.matrix[i].length - 1];
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
  }

  transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, i) => matrix.map((array) => array[i]));
  }
}
