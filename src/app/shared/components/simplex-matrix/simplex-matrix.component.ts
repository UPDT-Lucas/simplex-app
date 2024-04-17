import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-simplex-matrix',
  standalone: true,
  imports: [],
  templateUrl: './simplex-matrix.component.html',
  styleUrl: './simplex-matrix.component.css'
})
export class SimplexMatrixComponent {
  @Input()
  matrix: number [][] = [];

  @Input()
  headers: string [][] = [];

  @Input()
  incoming: string = ""

  @Input()
  outgoing: string = ""

}
