var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var DashboardConfigurationService = (function () {
    function DashboardConfigurationService() {
        this.expenditureVolumeStatus = ((localStorage.getItem('dashboardExpenditureVolumeWidget') == 'true') || (localStorage.getItem('dashboardExpenditureVolumeWidget') == null));
        this.researchSummaryStatus = ((localStorage.getItem('dashboardResearchSummaryWidget') == 'true') || (localStorage.getItem('dashboardResearchSummaryWidget') == null));
        this.awardedProposalBySponsorStatus = ((localStorage.getItem('dashboardawardedProposalBySponsorWidget') == 'true') || (localStorage.getItem('dashboardawardedProposalBySponsorWidget') == null));
        this.AwardBysponsorTypesStatus = ((localStorage.getItem('dashboardAwardBysponsorTypesWidget') == 'true') || (localStorage.getItem('dashboardAwardBysponsorTypesWidget') == null));
        this.proposalBySponsorTypesStatus = ((localStorage.getItem('dashboardproposalBySponsorTypesWidget') == 'true') || (localStorage.getItem('dashboardproposalBySponsorTypesWidget') == null));
        this.inProgressproposalBySponsorStatus = ((localStorage.getItem('dashboardinProgressproposalBySponsorWidget') == 'true') || (localStorage.getItem('dashboardinProgressproposalBySponsorWidget') == null));
        this.dashboardExpenditureVolumeWidget = new BehaviorSubject(this.expenditureVolumeStatus);
        this.currentdashboardExpenditureVolumeWidget = this.dashboardExpenditureVolumeWidget.asObservable();
        this.dashboardResearchSummaryWidget = new BehaviorSubject(this.researchSummaryStatus);
        this.currentdashboardResearchSummaryWidget = this.dashboardResearchSummaryWidget.asObservable();
        this.dashboardawardedProposalBySponsorWidget = new BehaviorSubject(this.awardedProposalBySponsorStatus);
        this.currentdashboardawardedProposalBySponsorWidget = this.dashboardawardedProposalBySponsorWidget.asObservable();
        this.dashboardAwardBysponsorTypesWidget = new BehaviorSubject(this.AwardBysponsorTypesStatus);
        this.currentdashboardAwardBysponsorTypesWidget = this.dashboardAwardBysponsorTypesWidget.asObservable();
        this.dashboardproposalBySponsorTypesWidget = new BehaviorSubject(this.proposalBySponsorTypesStatus);
        this.currentdashboardproposalBySponsorTypesWidget = this.dashboardproposalBySponsorTypesWidget.asObservable();
        this.dashboardinProgressproposalBySponsorWidget = new BehaviorSubject(this.inProgressproposalBySponsorStatus);
        this.currentdashboardinProgressproposalBySponsorWidget = this.dashboardinProgressproposalBySponsorWidget.asObservable();
        this.messageSource = new BehaviorSubject("default message");
        this.currentMessage = this.messageSource.asObservable();
    }
    DashboardConfigurationService.prototype.changeMessage = function (message) {
        this.messageSource.next(message);
    };
    DashboardConfigurationService.prototype.changeDashboardExpenditureVolumeWidget = function (status) {
        this.dashboardExpenditureVolumeWidget.next(status);
    };
    DashboardConfigurationService.prototype.changeDashboardResearchSummaryWidgett = function (status) {
        this.dashboardResearchSummaryWidget.next(status);
    };
    DashboardConfigurationService.prototype.changeDashboardawardedProposalBySponsorWidget = function (status) {
        this.dashboardawardedProposalBySponsorWidget.next(status);
    };
    DashboardConfigurationService.prototype.changeDashboardAwardBysponsorTypesWidget = function (status) {
        this.dashboardAwardBysponsorTypesWidget.next(status);
    };
    DashboardConfigurationService.prototype.changeDashboardproposalBySponsorTypesWidget = function (status) {
        this.dashboardproposalBySponsorTypesWidget.next(status);
    };
    DashboardConfigurationService.prototype.changeDashboardinProgressproposalBySponsorWidget = function (status) {
        this.dashboardinProgressproposalBySponsorWidget.next(status);
    };
    DashboardConfigurationService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], DashboardConfigurationService);
    return DashboardConfigurationService;
}());
export { DashboardConfigurationService };
//# sourceMappingURL=dashboard-configuration-service.js.map