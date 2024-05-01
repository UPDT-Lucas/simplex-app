import { Routes } from '@angular/router';
import { DataEntryPageComponent } from './simplex/pages/data-entry-page/data-entry-page.component';
import { ProblemSpecificationPageComponent } from './simplex/pages/problem-specification-page/problem-specification-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DataEntryPageComponent
  },
  {
    path: 'problem/:var/:rest',
    component: ProblemSpecificationPageComponent
  }
];
