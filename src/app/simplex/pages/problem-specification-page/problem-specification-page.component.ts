import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-problem-specification-page',
  standalone: true,
  imports: [
    HeaderComponent,
    InputComponent
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

  constructor(private route: ActivatedRoute){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.variables = params["var"]
        this.restrictions = params["rest"]
        console.log(this.variables)
        console.log(this.restrictions)
      }
    )
    this.iterableR = Array(Number(this.restrictions)).fill(0)
    this.iterableV = Array(Number(this.variables)).fill(0)
    this.gridColumnsStyle = `repeat(${Number(this.variables)+2}, auto)`
  }
}
