import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SolverService } from '../../../solver.service';

@Component({
  selector: 'app-data-entry-page',
  standalone: true,
  imports: [
    HeaderComponent,
    InputComponent,
    FormsModule
    ],
  templateUrl: './data-entry-page.component.html',
  styleUrl: './data-entry-page.component.css'
})
export class DataEntryPageComponent {

  varNumber: string = "";
  restNumber: string = "";
  method: number = 0;
  type: number = 0;


  constructor(private router: Router, private solverService: SolverService) {}

  ngOnInit(){
    this.solverService.reset()
  }

  goToSpecification(){
    if( ((+this.varNumber) > 0) && ((+this.restNumber) > 0)){
      this.router.navigate(["problem", this.method, this.type, this.varNumber, this.restNumber])
    }
  }

  OnTypeChange(event: any) {
    if(event !== null){
      this.type = event.target.value
    }
  }

  OnMethodChange(event: any) {
    if(event !== null){
      this.method = event.target.value
    }
  }
}
