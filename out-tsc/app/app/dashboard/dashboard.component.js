var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Router } from '@angular/router';
import { Subject } from "rxjs/Subject";
import { CompleterService } from 'ng2-completer';
import 'rxjs/add/operator/takeUntil';
import { SessionManagementService } from '../session/session-management.service';
import { Constants } from '../constants/constants.service';
import { ExpandedViewDataService } from '../research_summary/expanded-view-data-service';
import { DashboardData } from '../dashboard/dashboard-data.service';
import { DashboardConfigurationService } from '../common/dashboard-configuration-service';
import { ProposalCreateEditService } from "../proposal/proposal-create-view.service";
var DashboardComponent = (function () {
    function DashboardComponent(changeRef, completerService, dashboardService, router, sessionService, constant, expandedViewDataservice, dashboardData, dashboardConfigurationService, proposalCreateService) {
        this.changeRef = changeRef;
        this.completerService = completerService;
        this.dashboardService = dashboardService;
        this.router = router;
        this.sessionService = sessionService;
        this.constant = constant;
        this.expandedViewDataservice = expandedViewDataservice;
        this.dashboardData = dashboardData;
        this.dashboardConfigurationService = dashboardConfigurationService;
        this.proposalCreateService = proposalCreateService;
        this.isFilterDatePrevious = false;
        this.isMandatoryFilterFilled = true;
        this.nullScheduleData = false;
        this.nullCommitteeData = false;
        this.advanceSearchCriteria = {
            property1: '',
            property2: '',
            property3: '',
            property4: ''
        };
        this.currentPosition = 'SUMMARY';
        this.sortBy = 'updateTimeStamp';
        this.sortOrder = "DESC";
        this.result = {};
        this.reverse = true;
        this.displayToggle = false;
        this.currentPage = 1;
        this.adminAdvanceSearch = false;
        this.isAdmin = false;
        this.resultAward = false;
        this.toggleBox = false;
        this.totalPage = 0;
        this.adminClear = true;
        this.resultPie = {};
        this.awardStateList = [];
        this.proposalStateList = [];
        this.statuscode = [];
        this.proposalstatuscode = [];
        this.isLoginPage = true;
        this.nullAwardData = false;
        this.nullProposalData = false;
        this.nullIrbData = false;
        this.nullIacucData = false;
        this.nullDisclosureData = false;
        this.dashboardExpenditureVolumeWidget = true;
        this.dashboardResearchSummaryWidget = true;
        this.dashboardawardedProposalBySponsorWidget = true;
        this.dashboardAwardBysponsorTypesWidget = true;
        this.dashboardproposalBySponsorTypesWidget = true;
        this.dashboardinProgressproposalBySponsorWidget = true;
        this.onDestroy$ = new Subject();
        this.openGrantList = [];
        this.selectedGrantId = null;
        this.reportObject = null;
        this.proposals = [];
        this.select = '--Select--';
        this.finalStatus = null;
        this.proposal = {};
        this.showConfirmModal = false;
        this.isForward = false;
        this.isEndorse = false;
        this.showSuccessMessage = false;
        this.outputPath = this.constant.outputPath;
        if (!sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
        this.grantManager = localStorage.getItem('grantManager');
        this.provost = localStorage.getItem('provost');
        this.getResearchSummaryData();
    }
    DashboardComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dashboardConfigurationService.currentdashboardExpenditureVolumeWidget.takeUntil(this.onDestroy$).subscribe(function (status) {
            _this.dashboardExpenditureVolumeWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardResearchSummaryWidget.takeUntil(this.onDestroy$).subscribe(function (status) {
            _this.dashboardResearchSummaryWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardawardedProposalBySponsorWidget.takeUntil(this.onDestroy$).subscribe(function (status) {
            _this.dashboardawardedProposalBySponsorWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardAwardBysponsorTypesWidget.takeUntil(this.onDestroy$).subscribe(function (status) {
            _this.dashboardAwardBysponsorTypesWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardproposalBySponsorTypesWidget.takeUntil(this.onDestroy$).subscribe(function (status) {
            _this.dashboardproposalBySponsorTypesWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardinProgressproposalBySponsorWidget.takeUntil(this.onDestroy$).subscribe(function (status) {
            _this.dashboardinProgressproposalBySponsorWidget = status;
        });
        // localStorage.setItem( 'researchSummaryIndex', null );
        this.adminStatus = localStorage.getItem('isAdmin');
        this.userName = localStorage.getItem('currentUser');
        this.fullName = localStorage.getItem('userFullname');
        if (this.adminStatus == 'true') {
            this.isAdmin = true;
        }
    };
    DashboardComponent.prototype.initialLoad = function (currentPage) {
        var _this = this;
        this.constval = this.constant.index_url;
        this.dashboardService.loadDashBoard(this.advanceSearchCriteria.property1, this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition, currentPage, this.filterStartDate, this.filterEndDate)
            .takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data || [];
            if (_this.result !== null) {
                _this.totalPage = _this.result.totalServiceRequest;
                if (_this.currentPosition == "AWARD") {
                    _this.serviceRequestList = _this.result.awardViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullAwardData = true;
                    }
                }
                if (_this.currentPosition == "PROPOSAL") {
                    _this.serviceRequestList = _this.result.proposalViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullProposalData = true;
                    }
                }
                if (_this.currentPosition == "IRB") {
                    _this.serviceRequestList = _this.result.protocolViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullIrbData = true;
                    }
                }
                if (_this.currentPosition == "IACUC") {
                    _this.serviceRequestList = _this.result.iacucViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullIacucData = true;
                    }
                }
                if (_this.currentPosition == "DISCLOSURE") {
                    _this.serviceRequestList = _this.result.disclosureViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullDisclosureData = true;
                    }
                }
                if (_this.currentPosition == "COMMITTEE") {
                    _this.serviceRequestList = _this.result.committees;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullCommitteeData = true;
                    }
                }
                if (_this.currentPosition == "SCHEDULE") {
                    _this.serviceRequestList = _this.result.committeeSchedules;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullScheduleData = true;
                    }
                }
                if (_this.currentPosition == "GRANT") {
                    _this.serviceRequestList = _this.result.grantCalls;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullScheduleData = true;
                    }
                }
                if (_this.currentPosition == "SMU_PROPOSAL") {
                    _this.serviceRequestList = _this.result.proposal;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullScheduleData = true;
                    }
                }
                _this.userName = localStorage.getItem('currentUser');
                _this.fullName = localStorage.getItem('userFullname');
                _this.firstName = localStorage.getItem('firstName');
                _this.lastName = localStorage.getItem('lastName');
            }
        });
    };
    DashboardComponent.prototype.showTab = function (currentTabPosition) {
        this.personId = localStorage.getItem('personId');
        this.result = null;
        this.resultAward = false;
        this.serviceRequestList = [];
        this.currentPage = 1;
        this.displayToggle = false;
        this.adminAdvanceSearch = false;
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        this.pageNumber = 20;
        this.propertyName = '';
        this.currentPosition = currentTabPosition;
        this.pagedItems = null;
        if (currentTabPosition === 'COMMITTEE' || currentTabPosition === 'SCHEDULE') {
            this.sortBy = 'updateTimestamp';
        }
        else {
            this.sortBy = 'updateTimeStamp';
        }
        this.adminStatus = localStorage.getItem('isAdmin');
        this.accountNo = ' ';
        this.awardNo = ' ';
        this.title = ' ';
        this.sponsor = ' ';
        this.piName = ' ';
        this.departmentName = ' ';
        this.proposalNo = ' ';
        this.status = ' ';
        this.protocolNo = ' ';
        this.type = ' ';
        this.leadUnit = ' ';
        this.disclosureNo = ' ';
        this.disFullName = ' ';
        this.disposition = ' ';
        this.awardId = ' ';
        this.documentNo = ' ';
        if (currentTabPosition === 'SUMMARY') {
            this.getResearchSummaryData();
        }
        else if (currentTabPosition == 'SCHEDULE') {
            this.filterStartDate = null;
            this.filterEndDate = null;
            this.filterValidationMessage = "";
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
        }
        else if (currentTabPosition == 'GRANTREPORT') {
            this.fetchReportData();
        }
        else {
            this.initialLoad(this.currentPage);
            this.adminClear = false;
        }
    };
    DashboardComponent.prototype.sortResult = function (sortFieldBy, current_Position) {
        this.reverse = (this.sortBy === sortFieldBy) ? !this.reverse : false;
        if (this.reverse) {
            this.sortOrder = "DESC";
        }
        else {
            this.sortOrder = "ASC";
        }
        this.sortBy = sortFieldBy;
        if (current_Position == 'GRANTREPORT') {
        }
        else {
            this.initialLoad(this.currentPage);
        }
    };
    DashboardComponent.prototype.getResearchSummaryData = function () {
        var _this = this;
        this.dashboardData.setDashboardAreaChartData1([]);
        this.dashboardData.setDashboardPieChartData1({});
        this.dashboardService.getResearchSummaryData()
            .takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data || [];
            if (_this.result != null) {
                _this.dashboardData.setdashboardAreaChartData(_this.result.expenditureVolumes);
                _this.dashboardData.setDashboardAreaChartData1(_this.result.expenditureVolumes);
                _this.dashboardData.setDashboardPieChartData(_this.result);
                _this.dashboardData.setDashboardPieChartData1(_this.result);
                _this.summaryViews = _this.result.summaryViews;
            }
        });
    };
    DashboardComponent.prototype.searchUsingAdvanceOptions = function (currentPage) {
        var _this = this;
        this.adminClear = false;
        if (this.resultAward === true) {
            this.resultAward = false;
        }
        if (localStorage.getItem('isAdmin')) {
            this.adminAdvanceSearch = true;
        }
        this.dashboardService.loadDashBoard(this.advanceSearchCriteria.property1, this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition, currentPage, this.filterStartDate, this.filterEndDate)
            .takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data || [];
            if (_this.result != null) {
                _this.totalPage = _this.result.totalServiceRequest;
                if (_this.currentPosition == "AWARD") {
                    _this.serviceRequestList = _this.result.awardViews;
                }
                if (_this.currentPosition == "PROPOSAL") {
                    _this.serviceRequestList = _this.result.proposalViews;
                }
                if (_this.currentPosition == "IRB") {
                    _this.serviceRequestList = _this.result.protocolViews;
                }
                if (_this.currentPosition == "IACUC") {
                    _this.serviceRequestList = _this.result.iacucViews;
                }
                if (_this.currentPosition == "DISCLOSURE") {
                    _this.serviceRequestList = _this.result.disclosureViews;
                }
            }
        });
    };
    //clear all advanced search fields
    DashboardComponent.prototype.clear = function () {
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        this.adminClear = true;
        if (localStorage.getItem('isAdmin')) {
            this.adminAdvanceSearch = true;
        }
        if (this.adminStatus != 'true') {
            this.adminClear = false;
            this.initialLoad(this.currentPage);
        }
    };
    DashboardComponent.prototype.advanceSearch = function (event) {
        event.preventDefault();
        this.displayToggle = !this.displayToggle;
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        if (this.currentPosition === 'AWARD') {
            this.placeholder1 = 'Account';
            this.placeholder2 = 'Lead Unit';
            this.placeholder3 = 'Sponsor';
            this.placeholder4 = 'PI';
        }
        if (this.currentPosition === 'PROPOSAL') {
            this.placeholder1 = 'Proposal Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Sponsor';
        }
        if (this.currentPosition === 'IRB') {
            this.placeholder1 = 'Protocol Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Protocol type';
        }
        if (this.currentPosition === 'DISCLOSURE') {
            this.placeholder1 = 'Disclosure Number';
            this.placeholder2 = 'Name';
            this.placeholder3 = 'Disclosure Disposition';
            this.placeholder4 = 'Module item key';
        }
        if (this.currentPosition === 'IACUC') {
            this.placeholder1 = 'Protocol Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Protocol type';
        }
    };
    DashboardComponent.prototype.pageChange = function (currentPage) {
        this.initialLoad(currentPage);
    };
    DashboardComponent.prototype.autocompleteAwardChanged = function (value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.awardNo = value.obj.award_number;
        this.accountNo = value.obj.account_number;
        this.title = value.obj.title;
        this.piName = value.obj.pi_name;
        this.departmentName = value.obj.lead_unit_name;
        this.awardId = value.obj.award_id;
        this.documentNo = value.obj.document_number;
        this.sponsor = value.obj.sponsor;
    };
    DashboardComponent.prototype.autocompleteProposalChanged = function (value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.proposalNo = value.obj.proposal_number;
        this.piName = value.obj.person_name;
        this.title = value.obj.title;
        this.departmentName = value.obj.lead_unit_name;
        this.sponsor = value.obj.sponsor;
        this.documentNo = value.obj.document_number;
        this.status = value.obj.status;
    };
    DashboardComponent.prototype.autocompleteIrbChanged = function (value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.protocolNo = value.obj.protocol_number;
        this.title = value.obj.title;
        this.piName = value.obj.person_name;
        this.departmentName = value.obj.lead_unit;
        this.status = value.obj.status;
        this.type = value.obj.protocol_type;
        this.leadUnit = value.obj.lead_unit_name;
        this.documentNo = value.obj.document_number;
    };
    DashboardComponent.prototype.autocompleteIacucChanged = function (value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.protocolNo = value.obj.protocol_number;
        this.title = value.obj.title;
        this.status = value.obj.status;
        this.type = value.obj.protocol_type;
        this.piName = value.obj.person_name;
        this.leadUnit = value.obj.lead_unit_name;
        this.documentNo = value.obj.document_number;
    };
    DashboardComponent.prototype.autocompleteDisclosureChanged = function (value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.disclosureNo = value.obj.coi_disclosure_number;
        this.disFullName = value.obj.full_name;
        this.disposition = value.obj.disclosure_disposition;
        this.status = value.obj.disclosure_status;
        this.documentNo = value.obj.document_number;
    };
    DashboardComponent.prototype.foundItemsChanged = function (items) { };
    DashboardComponent.prototype.closeResultTab = function () {
        if (this.resultAward === true) {
            this.resultAward = false;
        }
    };
    DashboardComponent.prototype.receiveResultCard = function ($event) {
        this.resultAward = $event;
    };
    DashboardComponent.prototype.expandedView = function (summaryView) {
        if (summaryView == 'Submitted Proposal') {
            //localStorage.setItem( 'researchSummaryIndex', "PROPOSALSSUBMITTED" );
            this.expandedViewDataservice.setResearchSummaryIndex("PROPOSALSSUBMITTED");
            //localStorage.setItem( 'expandedViewHeading', summaryView );
            this.expandedViewDataservice.setExpandedViewHeading(summaryView);
            this.router.navigate(['/expandedview'], { queryParams: { "summaryIndex": "PROPOSALSSUBMITTED", "summaryheading": summaryView } });
        }
        if (summaryView == 'In Progress Proposal') {
            // localStorage.setItem( 'researchSummaryIndex', "PROPOSALSINPROGRESS" );
            this.expandedViewDataservice.setResearchSummaryIndex("PROPOSALSINPROGRESS");
            //localStorage.setItem( 'expandedViewHeading', summaryView );
            this.expandedViewDataservice.setExpandedViewHeading(summaryView);
            this.router.navigate(['/expandedview'], { queryParams: { "summaryIndex": "PROPOSALSINPROGRESS", "summaryheading": summaryView } });
        }
        if (summaryView == 'Active Award') {
            this.expandedViewDataservice.setResearchSummaryIndex("AWARDSACTIVE");
            this.expandedViewDataservice.setExpandedViewHeading(summaryView);
            this.router.navigate(['/expandedview'], { queryParams: { "summaryIndex": "AWARDSACTIVE", "summaryheading": summaryView } });
        }
    };
    DashboardComponent.prototype.filterSchedule = function () {
        if (this.filterStartDate > this.filterEndDate) {
            this.isFilterDatePrevious = true;
            this.filterValidationMessage = "* Please ensure that the To : Date is greater than or equal to the From : Date.";
        }
        else {
            this.isFilterDatePrevious = false;
        }
        if (this.filterStartDate == null || this.filterEndDate == null) {
            this.isMandatoryFilterFilled = false;
            this.filterValidationMessage = "* Please enter the necessary dates to apply filter.";
        }
        else {
            this.isMandatoryFilterFilled = true;
        }
        if (this.isMandatoryFilterFilled == true && this.isFilterDatePrevious == false) {
            this.initialLoad(this.currentPage);
        }
    };
    DashboardComponent.prototype.resetFilterSchedule = function () {
        if (this.isFilterDatePrevious == true || this.isMandatoryFilterFilled == false) {
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
            this.filterStartDate = null;
            this.filterEndDate = null;
        }
        else if (this.filterStartDate == null || this.filterEndDate == null) {
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
        }
        else {
            this.filterStartDate = null;
            this.filterEndDate = null;
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
            this.initialLoad(this.currentPage);
        }
    };
    DashboardComponent.prototype.loadSchedules = function (event, scheduleId) {
        event.preventDefault();
        this.router.navigate(['committee/schedule'], { queryParams: { 'scheduleId': scheduleId } });
    };
    DashboardComponent.prototype.loadGrants = function (event, mode) {
        event.preventDefault();
        this.currentPosition = 'GRANT';
        this.router.navigate(['/grant'], { queryParams: { 'mode': mode } });
    };
    DashboardComponent.prototype.viewGrantById = function (event, grantId) {
        event.preventDefault();
        this.currentPosition = 'GRANT';
        this.router.navigate(['/grant'], { queryParams: { 'grantId': grantId } });
    };
    DashboardComponent.prototype.viewProposalById = function (event, proposalId, grantCallId) {
        event.preventDefault();
        this.currentPosition = 'SMU_PROPOSAL';
        this.router.navigate(['/proposal/createProposal'], { queryParams: { 'proposalId': proposalId, 'grantId': grantCallId } });
    };
    DashboardComponent.prototype.grantIdChange = function () {
        var _this = this;
        this.dashboardService.applicationReport(this.selectedGrantId, this.selectedReportName).subscribe(function (data) {
            var temp = data;
            _this.reportObject = temp;
            _this.proposals = _this.reportObject.proposals;
        });
    };
    DashboardComponent.prototype.fetchReportData = function () {
        var _this = this;
        this.reportObject = null;
        this.selectedGrantId = null;
        this.proposals = null;
        this.selectedReportName = this.select;
        this.dashboardService.fetchAllReportData().takeUntil(this.onDestroy$).subscribe(function (data) {
            var temp = {};
            temp = data || [];
            if (temp != null) {
                _this.proposals = temp.proposals;
                _this.openGrantList = _this.completerService.local(temp.grantIds, 'grantCallId', 'grantCallId');
                _this.dashboardData.setReportData(temp);
            }
        });
    };
    DashboardComponent.prototype.openConfirm = function (actionType, proposalId, proposal) {
        this.selectedProposalId = proposalId;
        this.proposal = proposal;
        this.showConfirmModal = true;
        if (actionType == 'submit') {
            this.isForward = true;
            this.confirmHeading = "Submit to Provost";
            this.confirmMessage = 'Are you sure you want to forward this proposal for endorsement ?';
        }
        else {
            this.isEndorse = true;
            this.confirmHeading = "Endorse";
            this.confirmMessage = 'Are you sure you want to endorse this proposal ?';
        }
    };
    DashboardComponent.prototype.submitToProvost = function () {
        var _this = this;
        if (this.selectedProposalId != null && this.proposal != null) {
            this.proposalCreateService.submitForEndorsement(this.selectedProposalId, this.proposal).subscribe(function (data) {
                var temp = {};
                temp = data;
                _this.initialLoad(1);
                _this.showSuccessMessage = true;
                _this.successMessage = 'Proposal forwarded successfully for endorsement';
                setTimeout(function () {
                    _this.showSuccessMessage = false;
                }, 8000);
                window.scrollTo(0, 0);
            });
            this.showConfirmModal = false;
        }
    };
    DashboardComponent.prototype.approveEndorse = function () {
        var _this = this;
        this.proposalCreateService.approveByProvost(this.selectedProposalId, this.proposal, this.userName).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.initialLoad(1);
            _this.showSuccessMessage = true;
            _this.successMessage = 'Proposal awarded successfully. Institute Proposal #' + temp.ipNumber;
            setTimeout(function () {
                _this.showSuccessMessage = false;
            }, 8000);
            window.scrollTo(0, 0);
        });
        this.showConfirmModal = false;
    };
    DashboardComponent = __decorate([
        Component({
            templateUrl: 'dashboard.component.html',
            providers: [SessionManagementService, Constants, DashboardData, ProposalCreateEditService],
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, CompleterService, DashboardService, Router, SessionManagementService, Constants, ExpandedViewDataService, DashboardData, DashboardConfigurationService, ProposalCreateEditService])
    ], DashboardComponent);
    return DashboardComponent;
}());
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map