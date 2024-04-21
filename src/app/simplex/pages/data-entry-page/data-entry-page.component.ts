import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-data-entry-page',
  standalone: true,
  imports: [
    HeaderComponent,
    InputComponent,
    RouterModule
  ],
  templateUrl: './data-entry-page.component.html',
  styleUrl: './data-entry-page.component.css'
})
export class DataEntryPageComponent {

}
