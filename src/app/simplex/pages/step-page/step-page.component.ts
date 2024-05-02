import { Component } from '@angular/core';
import { SolverService } from '../../../solver.service';
import { SimplexMatrixComponent } from '../../components/simplex-matrix/simplex-matrix.component';
import Simplex from '../../../scripts/simplex';
import { HeaderComponent } from '../../../shared/components/header/header.component';

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

  constructor(private solverService: SolverService) {}

  ngOnInit(){
    this.getMatrix();
    this.getHorizontalHeaders();
    this.getVerticalHeaders();
  }

  getMatrix(){
    this.matrix = this.solverService.getMatrix();
  }

  getHorizontalHeaders(){
    this.horizontalHeaders = this.solverService.getHorizontalHeaders()
  }

  getVerticalHeaders(){
    this.verticalHeaders = this.solverService.getVerticalHeaders()
  }

  solve(){
    console.log(this.matrix)
    console.log(this.horizontalHeaders)
    console.log(this.verticalHeaders)
    const Solver = new Simplex(this.matrix, this.horizontalHeaders, this.verticalHeaders, false)
    Solver.getInfo()
    Solver.makeFaseTwoIteration()
    Solver.getInfo()
  }
}
