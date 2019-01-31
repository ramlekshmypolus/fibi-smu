import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainRouterComponent } from './main-router/main-router.component';
import { QuestionnaireListComponent } from './questionnaire-list/questionnaire-list.component';
import { CreateMainComponent } from './create-main/create-main.component';
import { QuestionnaireDataResolverService } from './services/questionnairedata-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'questionnaire', pathMatch: 'full'},
  { path: 'questionnaire', component: MainRouterComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full'},
      { path: 'list', component: QuestionnaireListComponent},
      { path: 'create', component: CreateMainComponent,
                        resolve: { Questionnaire: QuestionnaireDataResolverService }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoutingModule { }
