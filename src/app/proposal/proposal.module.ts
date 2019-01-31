import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalRoutingModule } from './proposal-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ProposalComponent } from './proposal.component';
import { ProposalHomeComponent } from './proposal-home/proposal-home.component';
import { ProposalHomeEditComponent } from './proposal-home/proposal-home-edit/proposal-home-edit.component';
import { ProposalViewComponent } from './proposal-home/proposal-view/proposal-view.component';
import { ProposalBudgetComponent } from './proposal-budget/proposal-budget.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ProposalDetailsComponent } from './proposal-home/proposal-home-edit/proposal-details/proposal-details.component';
import { SpecialReviewDetailsComponent } from './proposal-home/proposal-home-edit/special-review-details/special-review-details.component';
import { AreaOfResearchDetailsComponent } from './proposal-home/proposal-home-edit/area-of-research-details/area-of-research-details.component';

import { ProposalService } from './services/proposal.service';
import { ProposalHomeService } from './proposal-home/proposal-home.service';
import { GrantService } from '../grant/services/grant.service';													   

@NgModule({
  imports: [
    CommonModule,
    ProposalRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    ProposalComponent,
    ProposalViewComponent,
    ProposalHomeComponent,
    ProposalBudgetComponent,
    QuestionnaireComponent,
    ProposalDetailsComponent,
    SpecialReviewDetailsComponent,
    ProposalHomeEditComponent,
	AreaOfResearchDetailsComponent,
  ],
  providers: [ProposalService, ProposalHomeService, GrantService]
})
export class ProposalModule { }
