import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ResearchSummaryComponent } from './research-summary/research-summary.component';
import { AwardListComponent } from './award/award.component';
import { ProposalListComponent } from './proposal/proposal.component';
import { IrbComponent } from './irb/irb.component';
import { IacucComponent } from './iacuc/iacuc.component';
import { DisclosureComponent } from './disclosure/disclosure.component';
import { GrantCallListComponent } from './grant-call/grant-call.component';
import { ReportsComponent } from './reports/reports.component';
import { CommitteeComponent } from './committee/committee.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ExpandedViewComponent } from './research-summary/expanded-view/expanded-view.component';

const routes: Routes = [{ path: '', component: DashboardComponent,
                          children: [
                            {path: '', redirectTo: 'researchSummary', pathMatch: 'full'},
                            {path: 'researchSummary', component: ResearchSummaryComponent},
                            {path: 'awardList', component: AwardListComponent},
                            {path: 'proposalList', component: ProposalListComponent},
                            {path: 'grantCall', component: GrantCallListComponent},
                            {path: 'irb', component: IrbComponent},
                            {path: 'iacuc', component: IacucComponent},
                            {path: 'disclosure', component: DisclosureComponent},
                            {path: 'committee', component: CommitteeComponent},
                            {path: 'schedule', component: ScheduleComponent},
                            {path: 'reports', component: ReportsComponent}]
                        },
                          { path: 'expandedView', component: ExpandedViewComponent}

                      ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
