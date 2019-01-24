import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalRoutingModule } from './proposal-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ProposalComponent } from './proposal.component';
import { ProposalEditComponent } from './proposal-edit/proposal-edit.component';
import { ProposalViewComponent } from './proposal-view/proposal-view.component';
import { ProposalHomeComponent } from './proposal-edit/proposal-home/proposal-home.component';
import { ProposalBudgetComponent } from './proposal-edit/proposal-budget/proposal-budget.component';
import { QuestionnaireComponent } from './proposal-edit/questionnaire/questionnaire.component';

import { ProposalService } from './services/proposal.service';
import { ProposalDetailsComponent } from './proposal-edit/proposal-home/proposal-details/proposal-details.component';

@NgModule({
  imports: [
    CommonModule,
    ProposalRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    ProposalComponent,
    ProposalEditComponent,
    ProposalViewComponent,
    ProposalHomeComponent,
    ProposalBudgetComponent,
    QuestionnaireComponent,
    ProposalDetailsComponent,
  ],
  providers: [ProposalService]
})
export class ProposalModule { }
