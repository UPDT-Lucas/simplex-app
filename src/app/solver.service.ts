import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SolverService {

  private matrix: any[][] = [];
  private varHeaders: string[] = [];
  private solution: string[] = [];
  private rhs: number[] = [];
  private variablesNumber: number = 0;
  private varCounter: number = 0;
  private BvsHeaders: string[] = ['z'];
  private minW: number[] = [];
  private type: string = ""
  private method: string = ""
  private isPhaseOne: boolean = true;

  constructor() {}

  reset(){
    this.matrix = [];
    this.varHeaders = [];
    this.solution = [];
    this.rhs = [];
    this.variablesNumber = 0;
    this.varCounter = 0;
    this.BvsHeaders = ['z'];
    this.minW = [];
    this.type = ""
    this.method = ""

  }

  updatePhaseOne() {
    this.isPhaseOne = false;
  }

  getPhaseOne(): boolean {
    return this.isPhaseOne;
  }

  getVerticalHeaders(): string []{
    const matrixVerticalHeaders = localStorage.getItem('v-headers');
    this.BvsHeaders = matrixVerticalHeaders ? JSON.parse(matrixVerticalHeaders) : [];
    return this.BvsHeaders
  }

  getHorizontalHeaders(): string []{
    const matrixHorizontalHeaders = localStorage.getItem('h-headers');
    this.varHeaders =  matrixHorizontalHeaders ? JSON.parse(matrixHorizontalHeaders) : [];
    return this.varHeaders
  }

  getType(): string {
    return this.type
  }

  getMethod(): string {
    return this.method
  }

  clearMatrix(){
    localStorage.removeItem('matrix');
  }

  clearStorage(){
    localStorage.clear();
  }

  getVHeaders(): string[] {
    const matrixV = localStorage.getItem('v-headers');
    this.BvsHeaders =  matrixV ? JSON.parse(matrixV) : [];
    return this.BvsHeaders
  }

  getSolution(): string[] {
    const solutionString = localStorage.getItem('solution');
    return solutionString ? JSON.parse(solutionString) : [];
  }

  getHHeaders(): string[] {
    const matrixH = localStorage.getItem('h-headers');
    this.varHeaders =  matrixH ? JSON.parse(matrixH) : [];
    return this.varHeaders
  }

  getMatrix(): number[][]{
    const matrixString = localStorage.getItem('matrix');
    this.matrix =  matrixString ? JSON.parse(matrixString) : [];
    return this.matrix
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
    if(this.method == "simplex"){
      this.setMinW()
    }else{
      this.addM()
    }
    this.addRhs()
    this.saveMatrix()
  }

  checkType(){
    if(this.type=="max"){
      this.matrix[0].forEach(
        (el, index) => {
          this.matrix[0][index] = -this.matrix[0][index]
        }
      )
    }
  }

  updateHeaders(v: string[], h: string[]){
    this.BvsHeaders = v;
    this.varHeaders = h;
  }

  updateSolution(solution: string[]){
    this.solution = solution
  }

  updateMatrix(matrix: number[][]){
    this.matrix = matrix
  }

  saveMatrix(){
    localStorage.setItem('matrix', JSON.stringify(this.matrix))
    localStorage.setItem('v-headers', JSON.stringify(this.BvsHeaders))
    localStorage.setItem('h-headers', JSON.stringify(this.varHeaders))
    localStorage.setItem('solution', JSON.stringify(this.solution))
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

}
