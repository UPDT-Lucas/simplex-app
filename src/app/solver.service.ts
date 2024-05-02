import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// type matrixValue = string | number
export class SolverService {

  private matrix: any[][] = [];
  private varHeaders: string[] = [];
  private rhs: number[] = [];
  private variablesNumber: number = 0;
  private varCounter: number = 0;
  private BvsHeaders: string[] = ['z'];
  private minW: number[] = [];
  private type: string = ""
  private method: string = ""

  constructor() {}

  getVerticalHeaders(): string []{
    const matrixVerticalHeaders = localStorage.getItem('v-headers');
    return matrixVerticalHeaders ? JSON.parse(matrixVerticalHeaders) : [];
  }

  getHorizontalHeaders(): string []{
    const matrixHorizontalHeaders = localStorage.getItem('h-headers');
    return matrixHorizontalHeaders ? JSON.parse(matrixHorizontalHeaders) : [];
  }

  getMatrix(): number[][]{
    const matrixString = localStorage.getItem('matrix');
    return matrixString ? JSON.parse(matrixString) : [];
  }

  getCurrentVariables(operators: string[]) {
    this.varCounter = this.variablesNumber + 1;
    let pending: number[] = [];

    operators.forEach(
      (op, index) => {
        if (op === "<=") {
          this.addSlackVariable(1, index, operators.length)
          this.varCounter++
        } else if (op === ">=") {
          this.addSlackVariable(-1, index, operators.length)
          this.varCounter++
          if (operators.slice(index + 1).includes("<=") ||
            operators.slice(index + 1).includes(">=") ||
            pending.length != 0) {
            pending.push(index + 1)
          } else {
            this.addArtificialVariable(index+1, operators.length)
            this.varCounter++
          }
        } else if (operators.slice(index + 1).includes("<=") ||
          operators.slice(index + 1).includes(">=") ||
          pending.length != 0) {
          pending.push(index + 1)
        } else {
          this.addArtificialVariable(index+1, operators.length)
          this.varCounter++
        }
      }
    )
    for (let i = 0; i < pending.length; i++) {
      this.addArtificialVariable(pending[i], operators.length)
      this.varCounter++
    }
  }

  addColumn(newColumn: number[]) {
    this.matrix = this.transpose(this.matrix)
    this.matrix.push(newColumn)
    this.matrix = this.transpose(this.matrix)
  }

  getNormalVariables(objective: number[]) {
    for (let i = 0; i < objective.length; i++) {
      this.varHeaders.push('x' + (i + 1))
    }
  }

  solveSimplex(matrix: number[][], operators: string[], rhs: number[], type: string, method: string) {
    this.variablesNumber = matrix[0].length
    this.matrix = matrix;
    this.rhs = rhs
    this.type = type
    this.method = method
    this.checkType()
    this.getNormalVariables(matrix[0])
    this.getCurrentVariables(operators)
    if(this.type == "simplex"){
      this.setMinW()
    }else{
      this.addM()
    }
    this.addRhs()
    this.saveMatrix()
  }

  checkType(){
    console.log("tt")
    console.log(this.type)
    if(this.type=="max"){
      this.matrix[0].forEach(
        (el, index) => {
          this.matrix[0][index] = -this.matrix[0][index]
        }
      )
    }
  }

  saveMatrix(){
    localStorage.setItem('matrix', JSON.stringify(this.matrix))
    localStorage.setItem('v-headers', JSON.stringify(this.BvsHeaders))
    localStorage.setItem('h-headers', JSON.stringify(this.varHeaders))
  }

  addRhs(){
    if(this.minW.length!=0){
      this.rhs.reverse()
      this.rhs.push(0)
      this.rhs.reverse()
    }
    this.addColumn(this.rhs)
  }

  setMinW(){
    const artificials = this.varHeaders.filter((x) => x.includes("a"))
    if(artificials.length!=0){
      this.minW = Array(Number(this.varHeaders.length)).fill(0)
      artificials.forEach(
        art => {
          this.minW[+art.slice(1)-1] = 1
        }
      )
      this.matrix.reverse()
      this.matrix.push(this.minW)
      this.matrix.reverse()

      this.BvsHeaders.reverse()
      this.BvsHeaders.push("w")
      this.BvsHeaders.reverse()
    }
  }

  addM(){
    const artificials = this.varHeaders.filter((x) => x.includes("a"))
    artificials.forEach(
      art => {
        this.matrix[0][+art.slice(1)-1] = "M"
      }
    )
  }

  transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, i) => matrix.map(array => array[i]));
  }

  addSlackVariable(value: number, index: number, length: number){
    this.varHeaders.push("s" + this.varCounter)
    if(value != -1){
      this.BvsHeaders.push("s" + this.varCounter)
    }
    let newColumn: number[] = Array(Number(length + 1)).fill(0)
    newColumn[index + 1] = value
    this.addColumn(newColumn)
  }

  addArtificialVariable(index: number, length: number){
    this.varHeaders.push("a" + this.varCounter)
    this.BvsHeaders.push("a" + this.varCounter)
    let newColumn: number[] = Array(Number(length + 1)).fill(0)
    newColumn[index] = 1
    this.addColumn(newColumn)
  }

  solve(){

  }

}
