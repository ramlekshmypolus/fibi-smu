var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ExpenditureVolumeChartComponent } from './research_summary/expenditure-volume-chart.component';
import { ProposalBySponsorPieChartComponent } from './research_summary/proposal-by-sponsor-piechart.component';
import { AwardedProposalDonutChartComponent } from './research_summary/awarded-proposal-donut-chart.component';
import { ApplicationByGrantcallTypePieChartComponent } from './research_summary/application-by-grantcall-type-piechart.component';
import { ProtocolByGrantcallTypePieChartComponent } from './research_summary/protocol-by-grantcall-type-piechart.component';
import { WarningModalComponent } from './session/warning-modal.component';
import { TimeoutModalComponent } from './session/timeout-modal.component';
import { SessionTimeoutComponent } from './session/session-timeout.component';
import { ExpandedviewComponent } from './research_summary/expanded-view.component';
import { ElasticSearchComponent } from './elastic-search/elastic-search.component';
import { FooterComponent } from './common/footer-tpl.component';
import { HeaderComponent } from './common/header-tpl.component';
import { LogoutComponent } from './login/logout.component';
import { AwardBySponsorPieChartComponent } from './research_summary/award-by-sponsor-piechart.component';
import { InProgressProposalDonutChartComponent } from './research_summary/in-progress-proposal-donut-chart.component';
import { Ng2CompleterModule } from 'ng2-completer';
import { LoginService } from './login/login.service';
import { GoogleChartService } from './research_summary/google-chart.service';
import { SessionManagementService } from './session/session-management.service';
import { DashboardService } from './dashboard/dashboard.service';
import { AwardElasticsearchService } from './elastic-search/award-elastic-search.service';
import { DisclosureElasticsearchService } from './elastic-search/disclosure-elastic-search.service';
import { IacucElasticsearchService } from './elastic-search/iacuc-elastic-search.service';
import { IrbElasticsearchService } from './elastic-search/irb-elastic-search.service';
import { ProposalElasticsearchService } from './elastic-search/proposal-elastic-search.service';
import { Constants } from './constants/constants.service';
import { ExpandedViewDataService } from './research_summary/expanded-view-data-service';
import { ExpandedviewService } from './research_summary/expanded-view.service';
import { LoginCheckService } from './common/login-check.service';
import { AuthGuard } from './common/auth-guard.service';
import { DashboardConfigurationService } from './common/dashboard-configuration-service';
import { AppHttpInterceptor } from "./common/http-interceptor";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
var appRoutes = [{ path: '', redirectTo: 'loginpage', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'loginpage', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'award', loadChildren: './award/award.module#AwardModule' },
    { path: 'expandedview', component: ExpandedviewComponent, canActivate: [AuthGuard] },
    { path: 'committee', loadChildren: './committee/committee.module#CommitteeModule' },
    { path: 'grant', loadChildren: './grant/grant.module#GrantModule', canActivate: [AuthGuard] },
    { path: 'proposal', loadChildren: './proposal/proposal.module#ProposalModule', canActivate: [AuthGuard] }
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                DashboardComponent,
                LoginComponent,
                ExpenditureVolumeChartComponent,
                ProposalBySponsorPieChartComponent,
                AwardedProposalDonutChartComponent,
                WarningModalComponent,
                TimeoutModalComponent,
                SessionTimeoutComponent,
                ExpandedviewComponent,
                ElasticSearchComponent,
                FooterComponent,
                HeaderComponent,
                AwardBySponsorPieChartComponent,
                InProgressProposalDonutChartComponent,
                LogoutComponent,
                ApplicationByGrantcallTypePieChartComponent,
                ProtocolByGrantcallTypePieChartComponent
            ],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                FormsModule,
                HttpModule,
                ChartsModule,
                ReactiveFormsModule,
                RouterModule.forRoot(appRoutes),
                NgIdleKeepaliveModule.forRoot(),
                NgbModule.forRoot(),
                Ng2PageScrollModule,
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                HttpClientModule,
                Ng2CompleterModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{
                    provide: HTTP_INTERCEPTORS,
                    useClass: AppHttpInterceptor,
                    multi: true
                },
                DashboardService, LoginService, GoogleChartService, SessionManagementService,
                { provide: LocationStrategy, useClass: HashLocationStrategy },
                AwardElasticsearchService, DisclosureElasticsearchService, IacucElasticsearchService,
                IrbElasticsearchService, ProposalElasticsearchService, Constants, ExpandedViewDataService, ExpandedviewService, LoginCheckService, AuthGuard, DashboardConfigurationService],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map