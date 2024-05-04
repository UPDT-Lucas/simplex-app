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

  constructor(private solverService: SolverService, private router: Router) { }

  ngOnInit() {
    this.getMatrix();
    this.getHorizontalHeaders();
    this.getVerticalHeaders();
    this.getType();
    this.getMethod();
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

  updateMatrix() {
    this.solverService.clearStorage();
    this.solverService.saveMatrix();
  }

  solve() {
    if (this.method == 'simplex') {
      const Solver = new Simplex(
        this.matrix,
        this.verticalHeaders,
        this.horizontalHeaders,
        this.type == 'max' ? false : true
      );

      if (this.verticalHeaders.includes('w')) {
        Solver.balanceArtificalVars();
        // console.log('AAAAAAAAAAAAAAAAAA ', this.horizontalHeaders);
        // console.log('BBBBBBBBBBBB ', this.verticalHeaders);
        Solver.getInfo();
        while (!Solver.checkSolved()) {
          if (Solver.makeFaseOneIteration() == -1) {
            this.noSolution = true;
            return;
          }
          // console.log('AAAAAAAAAAAAAAAAAA ', this.horizontalHeaders);
          // console.log('BBBBBBBBBBBB ', this.verticalHeaders);
        }
        Solver.prepareFaseTwo();
      }
      while (!Solver.checkSolved()) {
        if (Solver.makeFaseTwoIteration() == -1) {
          this.noSolution = true;
          return;
        }
        Solver.getInfo()
      }
      this.solved = true;
      this.matrix = Solver.getMatrix();
      this.verticalHeaders = Solver.getBasicVars();
      this.horizontalHeaders = Solver.getCurrentVars();
      this.solverService.updateHeaders(this.verticalHeaders, this.horizontalHeaders)
      this.solverService.updateSolution(Solver.getSolution())
      this.updateMatrix();
      Solver.getInfo();
      this.router.navigate(['solution'])
    } else {
      const Solver = new SimplexBigM(
        [...this.matrix],
        [...this.verticalHeaders],
        [...this.horizontalHeaders],
        this.type == 'max' ? false : true
      );
      Solver.balanceArtificalVars();
      Solver.getInfo();
      while (!Solver.checkSolved()) {
        Solver.getInfo();
        if (Solver.makeIteration() == -1) {
          this.noSolution = true;
          return;
        }
        console.log(Solver.checkSolved());
      }
      Solver.getInfo();
      this.solved = true;
      this.matrix = Solver.getMatrix();
      this.verticalHeaders = Solver.getBasicVars();
      this.horizontalHeaders = Solver.getCurrentVars();
      this.solverService.updateHeaders(this.verticalHeaders, this.horizontalHeaders)
      this.solverService.updateSolution(Solver.getSolution())
      this.updateMatrix();
      Solver.getInfo();
      this.router.navigate(['solution'])
    }
  }
}
