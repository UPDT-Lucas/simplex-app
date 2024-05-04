import { Routes } from '@angular/router';
import { DataEntryPageComponent } from './simplex/pages/data-entry-page/data-entry-page.component';
import { ProblemSpecificationPageComponent } from './simplex/pages/problem-specification-page/problem-specification-page.component';
import { StepPageComponent } from './simplex/pages/step-page/step-page.component';
import { SolutionPageComponent } from './simplex/pages/solution-page/solution-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DataEntryPageComponent
  },
  {
    path: 'problem/:method/:type/:var/:rest',
    component: ProblemSpecificationPageComponent
  },
  {
    path: 'solve',
    component: StepPageComponent
  },
  {
    path: 'solution',
    component: SolutionPageComponent
  }
];
