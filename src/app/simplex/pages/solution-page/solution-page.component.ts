import { Component } from '@angular/core';
import { SolverService } from '../../../solver.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SimplexMatrixComponent } from '../../components/simplex-matrix/simplex-matrix.component';

@Component({
  selector: 'app-solution-page',
  standalone: true,
  imports: [
    HeaderComponent,
    SimplexMatrixComponent
  ],
  templateUrl: './solution-page.component.html',
  styleUrl: './solution-page.component.css'
})
export class SolutionPageComponent {

  matrix: any[][] = []
  vHeaders: string[] = []
  hHeaders: string[] = []

  constructor(private solverService: SolverService){}

  ngOnInit(){
    this.matrix = this.solverService.getMatrix()
    this.vHeaders = this.solverService.getVHeaders()
    this.hHeaders = this.solverService.getHHeaders()
  }
}
