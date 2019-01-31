import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuestionnaireDataResolverService } from './services/questionnairedata-resolver.service';
import { CreateRoutingModule } from './create-routing.module';
import { CreateQuestionnaireComponent } from './create-main/create-questionnaire/create-questionnaire.component';
import { QuestionnaireTreeComponent } from './create-main/create-questionnaire/questionnaire-tree/questionnaire-tree.component';
import { PreviewQuestionnaireComponent } from './create-main/preview-questionnaire/preview-questionnaire.component';
import { MainRouterComponent } from './main-router/main-router.component';
import { QuestionnaireListComponent } from './questionnaire-list/questionnaire-list.component';
import { CreateMainComponent } from './create-main/create-main.component';
import { CreateQuestionnaireService } from './services/create.service';


import { TreeModule } from 'angular-tree-component';
import { NgxEditorModule } from 'ngx-editor';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    CreateRoutingModule,
    TreeModule.forRoot(),
    FormsModule,
    NgxEditorModule,
    NgxSpinnerModule
  ],
  declarations: [ CreateQuestionnaireComponent,
                  QuestionnaireTreeComponent,
                  PreviewQuestionnaireComponent,
                  MainRouterComponent,
                  QuestionnaireListComponent,
                  CreateMainComponent],
  providers: [QuestionnaireDataResolverService,
              CreateQuestionnaireService]
})
export class CreateModule { }
