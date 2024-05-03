import { Component } from '@angular/core';
import { SolverService } from '../../../solver.service';
import { SimplexMatrixComponent } from '../../components/simplex-matrix/simplex-matrix.component';
import Simplex from '../../../scripts/simplex';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import SimplexBigM from '../../../scripts/simplex-big-m';

@Component({
  selector: 'app-step-page',
  standalone: true,
  imports: [
    SimplexMatrixComponent,
    HeaderComponent
  ],
  templateUrl: './step-page.component.html',
  styleUrl: './step-page.component.css'
})
export class StepPageComponent {
  matrix: number[][] = [];
  horizontalHeaders: string[] = []
  verticalHeaders: string[] = []
  type: string = "";
  method: string = "";
  maxIterations: number = 10;
  noSolution: boolean = false;
  solved: boolean = false;
  solutions: string [] = []

  constructor(private solverService: SolverService) { }

  ngOnInit() {
    this.getMatrix();
    this.getHorizontalHeaders();
    this.getVerticalHeaders();
    this.getType();
    this.getMethod();
  }

  getType() {
    this.type = this.solverService.getType()
  }

  getMethod() {
    this.method = this.solverService.getMethod()
  }

  getMatrix() {
    this.matrix = this.solverService.getMatrix();
  }

  getHorizontalHeaders() {
    this.horizontalHeaders = this.solverService.getHorizontalHeaders()
  }

  getVerticalHeaders() {
    this.verticalHeaders = this.solverService.getVerticalHeaders()
  }

  solve() {
    if (this.method == "simplex") {
      const Solver = new Simplex([... this.matrix], [... this.horizontalHeaders], [... this.verticalHeaders], this.type == "max" ? false : true)

      if(this.verticalHeaders.includes("w")){
        Solver.balanceArtificalVars()
        while (!Solver.checkSolved()) {
          if (Solver.makeFaseOneIteration() == -1) {
            this.noSolution = true;
            return
          }
        }
        Solver.prepareFaseTwo()
      }

      while (!Solver.checkSolved()) {
        if (Solver.makeFaseTwoIteration() == -1) {
          this.noSolution = true;
          return
        }
        Solver.getInfo()
      }
      this.solved = true;
      this.verticalHeaders = Solver.getCurrentVars();
      this.solutions = Solver.getSolution()
      console.log(this.solutions)
    } else {
      const Solver = new SimplexBigM([... this.matrix], [... this.horizontalHeaders], [... this.verticalHeaders], this.type == "max" ? false : true)
      Solver.balanceArtificalVars()
      while (!Solver.checkSolved()) {
        if(Solver.makeIteration() == -1){
          this.noSolution = true;
          return
        }
      }
      this.solved = true;
    }

  }
}
