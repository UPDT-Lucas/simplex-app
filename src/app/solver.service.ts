import { Injectable } from '@angular/core';
import Simplex from './scripts/simplex';

@Injectable({
  providedIn: 'root'
})
export class SolverService {

  private matrix: number[][] = [];
  private varHeaders: string[] = [];
  private rhs: number[] = [];
  private variablesNumber: number = 0;

  constructor() { }

  setMatrix(objective: number[], restrictions: number[][]) {
    this.matrix[0] = objective;
  }

  getCurrentVariables(operators: string[]) {
    console.log(operators)
    let varCounter = this.variablesNumber + 1;
    let counter = this.variablesNumber + 1;
    let pending: number[] = [];

    operators.forEach(
      (op, index) => {
        if (op === "<=") {
          this.varHeaders.push("s" + varCounter)
          let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
          newColumn[index+1] = 1
          this.addColumn(newColumn)
          varCounter++
        } else if (op === ">=") {
          this.varHeaders.push("s" + varCounter)
          let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
          newColumn[index+1] = -1
          pending.push(index+1)
          this.addColumn(newColumn)
          varCounter++
        } else {
          const remaining = operators.slice(index + 1);
          if (!(remaining.includes("<=")) && !(remaining.includes(">="))) {
            this.varHeaders.push("a" + varCounter)
            let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
            newColumn[index+1] = 1
            this.addColumn(newColumn)
            varCounter++
          } else {
            pending.push(index+1)
          }
        }
      }
    )

    console.log(pending)
    // console.log(pending)
    for(let i = 0; i < pending.length; i++ ){
        this.varHeaders.push("a"+varCounter)
        let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
        const index = pending.pop();
        newColumn[index!] = 1
        this.addColumn(newColumn)
        varCounter++
    }

    // pending.forEach(
    //   pend => {
    //     this.varHeaders.push("a"+varCounter)
    //     let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //     const index = pending.pop();
    //     console.log("XD")
    //     console.log(index)
    //     newColumn[index!] = 1
    //     this.addColumn(newColumn)
    //     varCounter++
    //   }
    // )

    // console.log(pending)

    // saved.reverse()
    // operators.forEach(
    //   (op) => {
    //     if(op === ">="){
    //       this.varHeaders.push("a"+varCounter)
    //       let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //       const index = saved!.pop();
    //       console.log(saved)
    //       newColumn[index!] = 1
    //       this.addColumn(newColumn)
    //     }else if(op === "="){
    //       console.log(varCounter)
    //       this.varHeaders.push("a"+varCounter)
    //       let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //       newColumn[varCounter-2] = 1
    //       this.addColumn(newColumn)
    //       varCounter++
    //     }
    //   }
    // )

    // const lessEq = operators.filter( operator => {
    //   return operator === "<="
    // })
    // const greatEq = operators.filter( operator => {
    //   return operator === ">="
    // })
    // const eq = operators.filter( operator => {
    //   return operator === "="
    // })

    // lessEq.forEach( op => {
    //   this.varHeaders.push("s"+varCounter)
    //   let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //   newColumn[varCounter-2] = 1
    //   this.addColumn(newColumn)
    //   varCounter++
    // })

    // greatEq.forEach( op => {
    //   this.varHeaders.push("s"+varCounter)
    //   let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //   newColumn[varCounter-2] = -1
    //   this.addColumn(newColumn)
    // })

    // greatEq.forEach( op => {
    //   this.varHeaders.push("a"+(varCounter+1))
    //   let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //   newColumn[varCounter-1] = 1
    //   this.addColumn(newColumn)
    //   varCounter++
    // })

    // eq.forEach( op => {
    //   this.varHeaders.push("a"+varCounter)
    //   let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //   newColumn[varCounter-2] = 1
    //   this.addColumn(newColumn)
    //   varCounter++
    // })

    console.log(this.varHeaders)
    console.log(this.matrix)


    // operators.forEach(
    //   operator => {
    //     if(operator == "<="){
    //       this.varHeaders.push("s"+counter)
    //       let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //       newColumn[counter-1] = 1
    //       this.addColumn(newColumn)
    //       counter++
    //       console.log(this.matrix)
    //     }else if(operator == ">="){
    //       this.varHeaders.push("s"+counter)
    //       let newColumn: number[] = Array(Number(operators.length + 1)).fill(0)
    //       newColumn[counter-1] = -1
    //       this.addColumn(newColumn)
    //       counter++

    //       this.varHeaders.push("a"+counter)
    //       counter++
    //     }else{
    //       this.varHeaders.push("a"+counter)
    //     }
    //   }
    // )
    this.addColumn(this.rhs)
    console.log(this.matrix)
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

  solveSimplex(matrix: number[][], operators: string[], rhs: number[]) {
    this.variablesNumber = matrix[0].length
    this.matrix = matrix;
    this.rhs = rhs
    this.getNormalVariables(matrix[0]);
    this.getCurrentVariables(operators)
  }

  transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, i) => matrix.map(array => array[i]));
  }

}
