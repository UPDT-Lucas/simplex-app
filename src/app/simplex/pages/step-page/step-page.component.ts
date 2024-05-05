import { Component } from '@angular/core';
import { SolverService } from '../../../solver.service';
import { SimplexMatrixComponent } from '../../components/simplex-matrix/simplex-matrix.component';
import Simplex from '../../../scripts/simplex';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import SimplexBigM from '../../../scripts/simplex-big-m';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-page',
  standalone: true,
  imports: [SimplexMatrixComponent, HeaderComponent],
  templateUrl: './step-page.component.html',
  styleUrl: './step-page.component.css',
})
export class StepPageComponent {
  matrix: any[][] = [];
  horizontalHeaders: string[] = [];
  verticalHeaders: string[] = [];
  type: string = '';
  method: string = '';
  maxIterations: number = 10;
  noSolution: boolean = false;
  solved: boolean = false;
  solutions: string[] = [];
  actualSolver!: Simplex | SimplexBigM;
  isPhaseOne: boolean = true;
  isBalanced: boolean = false;
  render: boolean = false;

  constructor(private solverService: SolverService, private router: Router) { }

  ngOnInit() {
    this.getMatrix();
    this.getHorizontalHeaders();
    this.getVerticalHeaders();
    this.getType();
    this.getMethod();
    this.render = true;
  }

  getType() {
    this.type = this.solverService.getType();
  }

  getMethod() {
    this.method = this.solverService.getMethod();
  }

  getMatrix() {
    this.matrix = this.solverService.getMatrix();
  }

  getHorizontalHeaders() {
    this.horizontalHeaders = this.solverService.getHorizontalHeaders();
  }

  getVerticalHeaders() {
    this.verticalHeaders = this.solverService.getVerticalHeaders();
  }

  updateData() {
    this.matrix = this.actualSolver.getMatrix();
    this.solverService.clearStorage();
    this.verticalHeaders = this.actualSolver.getBasicVars();
    this.horizontalHeaders = this.actualSolver.getCurrentVars();
    this.solverService.updateSolution(this.actualSolver.getSolution())
    this.solverService.updateHeaders(this.verticalHeaders, this.horizontalHeaders)
    this.solverService.updateMatrix(this.matrix)
    this.solverService.saveMatrix();

  }

  getSolution(): string[]{
    return this.actualSolver.getSolution();
  }

  async solve() {
    //Simple two phases
    if (this.method == 'simplex') {

      this.actualSolver = new Simplex(
        this.matrix,
        this.verticalHeaders,
        this.horizontalHeaders,
        this.type == 'max' ? false : true)

      //Phase One
      if (this.verticalHeaders.includes('w')) {
        if (!this.isBalanced) {
          this.actualSolver.balanceArtificalVars();
        }
        if (!this.actualSolver.checkSolved()) {
          this.render = false;
          const result = await this.actualSolver.makeFaseOneIteration();
          if (result === -1) {
            this.noSolution = true;
          } else {
            this.updateData();
            setTimeout(() => {
              this.render = true;
            }, 0);
          }
        } else {
          this.actualSolver.prepareFaseTwo();
          this.updateData()
          return
        }
        this.updateData()
        this.isBalanced = true;

      //Phase two
      } else {
        if(this.actualSolver.checkSolved()){
          this.solved = true;
          this.solutions = this.getSolution()
        }

        if(!this.solved){
          this.render = false;
          const result = await this.actualSolver.makeFaseTwoIteration();
          if (result === -1) {
            this.noSolution = true;
          } else {
            this.updateData();
            setTimeout(() => {
              this.render = true;
              this.solutions = this.getSolution()
            }, 0);
          }
        }
      }

    //Big M
    } else {
      this.actualSolver = new SimplexBigM(
        this.matrix,
        this.verticalHeaders,
        this.horizontalHeaders,
        this.type == 'max' ? false : true
      );

      if (this.verticalHeaders.filter(x => x.includes("a")).length > 0) {
        console.log("entra")
        this.actualSolver.balanceArtificalVars();
      }

      if (!this.actualSolver.checkSolved()) {
        this.render = false;
        const result = await this.actualSolver.makeIteration();
        if (result === -1) {
          this.noSolution = true;
        } else {
          this.updateData();
          setTimeout(() => {
            this.render = true;
            this.solutions = this.getSolution()
          }, 0);
        }
      }else{
        this.solved = true;
      }

      this.updateData()
      this.actualSolver.getInfo();
    }
  }
}
