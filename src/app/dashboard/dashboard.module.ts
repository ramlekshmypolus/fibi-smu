import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardService } from '../dashboard/dashboard.service';
import { DashboardConfigurationService } from '../common/dashboard-configuration-service';
import { ExpandedViewService } from './research-summary/expanded-view/expanded-view.service';

import { DashboardComponent } from './dashboard.component';
import { Ng2CompleterModule } from 'ng2-completer';
import { ResearchSummaryComponent } from './research-summary/research-summary.component';
import { ExpandedViewComponent } from './research-summary/expanded-view/expanded-view.component';
import { ResearchSummaryCountComponent } from './research-summary/charts/research-summary-count/research-summary-count.component';
import { ExpenditureVolumeChartComponent } from './research-summary/charts/expenditure-volume-chart/expenditure-volume-chart.component';
import { AwardedProposalsDonutChartComponent } from './research-summary/charts/awarded-proposals-donut-chart/awarded-proposals-donut-chart.component';
import { AwardBySponsorPiechartComponent } from './research-summary/charts/award-by-sponsor-piechart/award-by-sponsor-piechart.component';
import { InprogressProposalsDonutChartComponent } from './research-summary/charts/inprogress-proposals-donut-chart/inprogress-proposals-donut-chart.component';
import { ProposalBySponsorPiechartComponent } from './research-summary/charts/proposal-by-sponsor-piechart/proposal-by-sponsor-piechart.component';
import { GrantCallListComponent } from './grant-call/grant-call.component';
import { AwardListComponent } from './award/award.component';
import { ProposalListComponent } from './proposal/proposal.component';
import { IrbComponent } from './irb/irb.component';
import { IacucComponent } from './iacuc/iacuc.component';
import { DisclosureComponent } from './disclosure/disclosure.component';
import { ReportsComponent } from './reports/reports.component';
import { ProposalsByGrantcallComponent } from './reports/charts/proposals-by-grantcall/proposals-by-grantcall.component';
import { ProtocolsByGrantcallComponent } from './reports/charts/protocols-by-grantcall/protocols-by-grantcall.component';
import { AwardsByGrantcallComponent } from './reports/charts/awards-by-grantcall/awards-by-grantcall.component';
import { CommitteeComponent } from './committee/committee.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    Ng2CompleterModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    ResearchSummaryComponent,
    ExpandedViewComponent,
    ResearchSummaryCountComponent,
    ExpenditureVolumeChartComponent,
    AwardedProposalsDonutChartComponent,
    AwardBySponsorPiechartComponent,
    InprogressProposalsDonutChartComponent,
    ProposalBySponsorPiechartComponent,
    GrantCallListComponent,
    AwardListComponent,
    ProposalListComponent,
    IrbComponent,
    IacucComponent,
    DisclosureComponent,
    ReportsComponent,
    ProposalsByGrantcallComponent,
    ProtocolsByGrantcallComponent,
    AwardsByGrantcallComponent,
    CommitteeComponent,
    ScheduleComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DashboardService,
    DashboardConfigurationService,
    ExpandedViewService
  ]
})
export class DashboardModule { }
