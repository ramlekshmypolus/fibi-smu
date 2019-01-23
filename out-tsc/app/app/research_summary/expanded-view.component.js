var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionManagementService } from "../session/session-management.service";
import { Constants } from '../constants/constants.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { ExpandedviewService } from "./expanded-view.service";
import { ExpandedViewDataService } from './expanded-view-data-service';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
var ExpandedviewComponent = (function () {
    function ExpandedviewComponent(router, sessionService, constant, dashboardService, route, expandedViewService, expandedViewDataService) {
        this.router = router;
        this.sessionService = sessionService;
        this.constant = constant;
        this.dashboardService = dashboardService;
        this.route = route;
        this.expandedViewService = expandedViewService;
        this.expandedViewDataService = expandedViewDataService;
        this.summaryResult = {};
        this.piechartResult = {};
        this.morethanThreeNotification = false;
        this.isAdmin = false;
        this.first3notificationList = [];
        this.showmoreClicked = false;
        this.showmoreNeeded = true;
        this.toggleBox = false;
        this.result = {};
        this.polusWebsite = 'http://polussolutions.com/';
        this.sortBy = 'updateTimeStamp';
        this.sortOrder = "DESC";
        this.reverse = true;
        this.nullPiechartAwardData = false;
        this.nullPiechartProposalData = false;
        this.nullDonutchartAwardData = false;
        this.nullDonutchartInprogressData = false;
        this.nullResearchSummaryAwardData = false;
        this.nullResearchSummaryProposalSubmittedData = false;
        this.nullResearchSummaryProposalInprogressData = false;
        this.onDestroy$ = new Subject();
        this.logo = './assets/images/logo.png';
        this.footerLogo = './assets/images/footerLogo.png';
        this.outputPath = this.constant.outputPath;
        if (!sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
    }
    ExpandedviewComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    ExpandedviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.adminStatus = localStorage.getItem('isAdmin');
        this.userName = localStorage.getItem('currentUser');
        this.fullName = localStorage.getItem('userFullname');
        this.sponsorCode = this.route.snapshot.queryParamMap.get('sponsorCode');
        this.awardsheading = this.route.snapshot.queryParamMap.get('expandedViewAwardHeading');
        this.donutProposalHeading = this.route.snapshot.queryParamMap.get('donutProposalHeading');
        this.piechartIndex = this.route.snapshot.queryParamMap.get('pieChartIndex');
        this.donutAwardHeading = this.route.snapshot.queryParamMap.get('donutAwardHeading');
        this.proposalheading = this.route.snapshot.queryParamMap.get('proposalheading');
        this.summaryIndex = this.route.snapshot.queryParamMap.get('summaryIndex');
        this.summaryheading = this.route.snapshot.queryParamMap.get('summaryheading');
        this.donutchartIndex = this.route.snapshot.queryParamMap.get('donutchartIndex');
        if (this.adminStatus == 'true') {
            this.isAdmin = true;
        }
        if (this.piechartIndex != "null") {
            this.expandedViewService.loadExpandedView(this.sponsorCode, localStorage.getItem('personId'), this.piechartIndex).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.piechartResult = data || [];
                if (_this.piechartIndex == "AWARD") {
                    _this.serviceRequestList = _this.piechartResult.awardViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullPiechartAwardData = true;
                    }
                }
                if (_this.piechartIndex == "PROPOSAL") {
                    _this.serviceRequestList = _this.piechartResult.proposalViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullPiechartProposalData = true;
                    }
                }
            });
        }
        if (this.summaryIndex != "null") {
            this.expandedViewService.loadExpandedSummaryView(localStorage.getItem('personId'), this.summaryIndex).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.summaryResult = data || [];
                if (_this.summaryIndex == "PROPOSALSSUBMITTED") {
                    _this.serviceRequestList = _this.summaryResult.proposalViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullResearchSummaryProposalSubmittedData = true;
                    }
                }
                if (_this.summaryIndex == "PROPOSALSINPROGRESS") {
                    _this.serviceRequestList = _this.summaryResult.proposalViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullResearchSummaryProposalInprogressData = true;
                    }
                }
                if (_this.summaryIndex == "AWARDSACTIVE") {
                    _this.serviceRequestList = _this.summaryResult.awardViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullResearchSummaryAwardData = true;
                    }
                }
            });
        }
        if (this.donutchartIndex != "null") {
            this.expandedViewService.loadDonutExpandedView(this.sponsorCode, localStorage.getItem('personId'), this.donutchartIndex).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.piechartResult = data || [];
                if (_this.donutchartIndex == "AWARDED") {
                    _this.serviceRequestList = _this.piechartResult.proposalViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullDonutchartAwardData = true;
                    }
                }
                if (_this.donutchartIndex == "INPROGRESS") {
                    _this.serviceRequestList = _this.piechartResult.proposalViews;
                    if (_this.serviceRequestList == null || _this.serviceRequestList.length == 0) {
                        _this.nullDonutchartInprogressData = true;
                    }
                }
            });
        }
    };
    ExpandedviewComponent.prototype.sortResult = function (sortFieldBy, current_Position) {
        this.reverse = (this.sortBy === sortFieldBy) ? !this.reverse : false;
        if (this.reverse) {
            this.sortOrder = "DESC";
        }
        else {
            this.sortOrder = "ASC";
        }
        this.sortBy = sortFieldBy;
    };
    ExpandedviewComponent = __decorate([
        Component({
            selector: 'expanded-view',
            templateUrl: 'expanded-view.component.html',
            providers: [SessionManagementService, Constants, DashboardService, ExpandedviewService],
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css']
        }),
        __metadata("design:paramtypes", [Router, SessionManagementService, Constants, DashboardService, ActivatedRoute, ExpandedviewService, ExpandedViewDataService])
    ], ExpandedviewComponent);
    return ExpandedviewComponent;
}());
export { ExpandedviewComponent };
//# sourceMappingURL=expanded-view.component.js.map