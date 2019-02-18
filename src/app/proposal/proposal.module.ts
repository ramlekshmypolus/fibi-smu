import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalRoutingModule } from './proposal-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Ng2CompleterModule } from 'ng2-completer';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ProposalComponent } from './proposal.component';
import { ProposalHomeComponent } from './proposal-home/proposal-home.component';
import { ProposalHomeEditComponent } from './proposal-home/proposal-home-edit/proposal-home-edit.component';
import { ProposalViewComponent } from './proposal-home/proposal-view/proposal-view.component';
import { ProposalBudgetComponent } from './proposal-budget/proposal-budget.component';
import { BudgetOverviewComponent } from './proposal-budget/budget-overview/budget-overview.component';
import { BudgetPeriodsComponent } from './proposal-budget/budget-periods/budget-periods.component';
import { ProposalOverviewComponent } from './proposal-overview/proposal-overview.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ProposalDetailsComponent } from './proposal-home/proposal-home-edit/proposal-details/proposal-details.component';
import { AreaOfResearchDetailsComponent } from './proposal-home/proposal-home-edit/area-of-research/area-of-research.component';
import { ProjectTeamComponent } from './proposal-home/proposal-home-edit/project-team/project-team.component';
import { DeclarationComponent } from './proposal-home/proposal-home-edit/declaration/declaration.component';
import { SpecialReviewDetailsComponent } from './proposal-home/proposal-home-edit/special-review/special-review.component';
import { SupportingDocumentsComponent } from './proposal-home/proposal-home-edit/supporting-documents/supporting-documents.component';

import { ProposalService } from './services/proposal.service';
import { ProposalHomeService } from './proposal-home/proposal-home.service';
import { GrantService } from '../grant/services/grant.service';
import { ProposalBudgetService } from './proposal-budget/proposal-budget.service';
import { QuestionnaireService } from './questionnaire/questionnaire.service';
import { ViewQuestionnaireComponent } from './questionnaire/view-questionnaire/view-questionnaire.component';

@NgModule({
  imports: [
    CommonModule,
    Ng2CompleterModule,
    ProposalRoutingModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule
  ],
  declarations: [
    ProposalComponent,
    ProposalViewComponent,
    ProposalHomeComponent,
    ProposalOverviewComponent,
    ProposalBudgetComponent,
    BudgetOverviewComponent,
    BudgetPeriodsComponent,
    ProposalBudgetComponent,
    QuestionnaireComponent,
    ViewQuestionnaireComponent,
    ProposalDetailsComponent,
    SpecialReviewDetailsComponent,
    ProposalHomeEditComponent,
    AreaOfResearchDetailsComponent,
    SupportingDocumentsComponent,
    ProjectTeamComponent,
    DeclarationComponent
  ],
  providers: [ProposalService, ProposalHomeService, GrantService, ProposalBudgetService, QuestionnaireService]
})
export class ProposalModule { }
