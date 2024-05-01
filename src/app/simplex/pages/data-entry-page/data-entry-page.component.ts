import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  goToSpecification(){
    if( ((+this.varNumber) > 0) && ((+this.restNumber) > 0)){
      this.router.navigate(["problem", this.varNumber, this.restNumber])
    }
  }
}
