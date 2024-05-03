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
  horizontalHeaders: string[] = [];

  @Input()
  verticalHeaders: string[] = [];

  @Input()
  incoming: string = ""

  @Input()
  outgoing: string = ""

  @Input()
  error: boolean = false;

  get borderColor(): string {
    return this.error ? "1px solid #630202" : "1px solid #023463";
  }

  get indexesBackgroundColor(): string {
    return this.error ? "#630202" : "#023463";
  }

  get backgroundColor(): string {
    return this.error ? "#b30000" : "#005cb3";
  }
}
