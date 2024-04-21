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
  iterableC: any[] = []

  constructor(private route: ActivatedRoute){}

  ngOnInit(){
    this.route.params.subscribe(
      params => {
        this.variables = params["var"]
        this.restrictions = params["rest"]
      }
    )
    this.iterableR = Array(Number(this.restrictions)).fill(0)
    this.iterableC = Array(Number(this.variables)).fill(0)
    console.log(this.iterableR)
    console.log(this.iterableC)
    this.gridColumnsStyle = `repeat(${Number(this.variables)+2}, auto)`
  }
}
