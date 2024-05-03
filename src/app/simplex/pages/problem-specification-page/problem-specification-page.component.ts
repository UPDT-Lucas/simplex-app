import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolverService } from '../../../solver.service';

@Component({
  selector: 'app-problem-specification-page',
  standalone: true,
  imports: [
    HeaderComponent,
    InputComponent,
    FormsModule
  ],
  templateUrl: './problem-specification-page.component.html',
  styleUrl: './problem-specification-page.component.css'
})
export class ProblemSpecificationPageComponent {

  gridColumnsStyle: string = ""
  variables: number = 0
  restrictions: number = 0
  elementsPerRow: number = 0
  iterableR: any[] = []
  iterableV: any[] = []
  matrix: number[][] = []
  rhs: number[] = []
  operators: string[] = []
  holder: string = ""
  var: number = 0;
  objectiveVariables: string[] = [];
  restrictionVariables: string[][] = [];
  rhsValue: string = "";
  type: string = ""
  method: string = ""


  constructor(private route: ActivatedRoute, private solver: SolverService, private router: Router){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.variables = params["var"]
        this.restrictions = params["rest"]
        this.type = params["type"] == 0 ? "max" : "min"
        this.method = params["method"] == 0 ? "simplex" : "M"
      }
    )
    this.rhs = Array(Number(this.restrictions+1)).fill(0)
    this.iterableR = Array(Number(this.restrictions)).fill(0)
    this.iterableV = Array(Number(this.variables)).fill(0)
    this.operators = Array(Number(this.restrictions)).fill('<=')
    this.gridColumnsStyle = `repeat(${Number(this.variables)+2}, auto)`

    for (let i = 0; i < (+this.restrictions)+1 ; i++) {
      this.matrix[i] = Array(2).fill(0);
    }
    this.solver.clearStorage()
  }

  getVariables(value: number, index1?: number, index2?: number) {
    if (index1 !== undefined && index2 !== undefined) {
      this.matrix[index1][index2] = value;
    }
  }

  getRhs(value: number, index: number){
    this.rhs[index] = value
  }

  OnSelectChange(event: any, index: number) {
    if(event !== null){
      this.operators[index] = event.target.value
    }
  }

  solve(){
    const allObj = this.matrix[0].some(value => value !== 0)
    const areRhs = this.rhs.some(value => value !== 0);
    const areValues = this.matrix.some(row => row.some(value => value !== 0));
    if(areRhs && areValues && allObj){
      this.solver.solveSimplex(this.matrix, this.operators, this.rhs, this.type, this.method)
      this.router.navigate(["solve"])
    }
  }
}
