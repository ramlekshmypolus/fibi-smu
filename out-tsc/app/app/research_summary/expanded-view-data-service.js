var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var ExpandedViewDataService = (function () {
    function ExpandedViewDataService() {
        this.changedSponsorCode = new BehaviorSubject("");
        this.sponsorCode = this.changedSponsorCode.asObservable();
        this.changedPersonId = new BehaviorSubject("");
        this.personId = this.changedPersonId.asObservable();
        this.changedPiechartIndex = new BehaviorSubject("");
        this.piechartIndex = this.changedPiechartIndex.asObservable();
        this.changedResearchSummaryIndex = new BehaviorSubject("");
        this.researchSummaryIndex = this.changedResearchSummaryIndex.asObservable();
        this.changedExpandedViewHeading = new BehaviorSubject("");
        this.expandedViewHeading = this.changedExpandedViewHeading.asObservable();
        this.changedExapandedViewAwardHeading = new BehaviorSubject("");
        this.expandedViewAwardHeading = this.changedExapandedViewAwardHeading.asObservable();
        this.changedExapandedDonutViewProposalHeading = new BehaviorSubject("");
        this.expandedDonutViewProposalHeading = this.changedExapandedDonutViewProposalHeading.asObservable();
        this.changedExapandedViewProposalHeading = new BehaviorSubject("");
        this.expandedViewProposalHeading = this.changedExapandedViewProposalHeading.asObservable();
        this.changedExapandedDonutViewAwardHeading = new BehaviorSubject("");
        this.exapandedDonutViewAwardHeading = this.changedExapandedDonutViewAwardHeading.asObservable();
        this.changedDonutChartIndex = new BehaviorSubject("");
        this.donutChartIndex = this.changedDonutChartIndex.asObservable();
    }
    ExpandedViewDataService.prototype.setSponsorCode = function (sponsorCode) {
        this.changedSponsorCode.next(sponsorCode);
    };
    ExpandedViewDataService.prototype.setPersonId = function (personId) {
        this.changedPersonId.next(personId);
    };
    ExpandedViewDataService.prototype.setPiechartIndex = function (piechartIndex) {
        this.changedPiechartIndex.next(piechartIndex);
    };
    ExpandedViewDataService.prototype.setResearchSummaryIndex = function (researchSummaryIndex) {
        this.changedResearchSummaryIndex.next(researchSummaryIndex);
    };
    ExpandedViewDataService.prototype.setExpandedViewHeading = function (expandedViewHeading) {
        this.changedExpandedViewHeading.next(expandedViewHeading);
    };
    ExpandedViewDataService.prototype.setExpandedViewAwardHeading = function (expandedViewAwardHeading) {
        this.changedExapandedViewAwardHeading.next(expandedViewAwardHeading);
    };
    ExpandedViewDataService.prototype.setExpandedDonutViewAwardHeading = function (expandedDonutViewAwardHeading) {
        this.changedExapandedDonutViewAwardHeading.next(expandedDonutViewAwardHeading);
    };
    ExpandedViewDataService.prototype.setExpandedDonutViewProposalHeading = function (expandedDonutViewProposalHeading) {
        this.changedExapandedDonutViewProposalHeading.next(expandedDonutViewProposalHeading);
    };
    ExpandedViewDataService.prototype.setExpandedViewProposalHeading = function (expandedViewProposalHeading) {
        this.changedExapandedViewProposalHeading.next(expandedViewProposalHeading);
    };
    ExpandedViewDataService.prototype.setDonutChartIndex = function (donutChartIndex) {
        this.changedDonutChartIndex.next(donutChartIndex);
    };
    ExpandedViewDataService = __decorate([
        Injectable()
    ], ExpandedViewDataService);
    return ExpandedViewDataService;
}());
export { ExpandedViewDataService };
//# sourceMappingURL=expanded-view-data-service.js.map