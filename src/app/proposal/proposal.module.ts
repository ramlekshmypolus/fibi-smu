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
import { AreaOfResearchDetailsComponent } from './proposal-home/proposal-home-edit/area-of-research/area-of-research.component';
import { ProjectTeamComponent } from './proposal-home/proposal-home-edit/project-team/project-team.component';
import { SpecialReviewDetailsComponent } from './proposal-home/proposal-home-edit/special-review/special-review.component';
import { SupportingDocumentsComponent } from './proposal-home/proposal-home-edit/supporting-documents/supporting-documents.component';

import { ProposalService } from './services/proposal.service';
import { ProposalHomeService } from './proposal-home/proposal-home.service';
import { GrantService } from '../grant/services/grant.service';
import { DeclarationComponent } from './proposal-home/proposal-home-edit/declaration/declaration.component';

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
    SupportingDocumentsComponent,
    ProjectTeamComponent,
    DeclarationComponent,
  ],
  providers: [ProposalService, ProposalHomeService, GrantService]
})
export class ProposalModule { }
