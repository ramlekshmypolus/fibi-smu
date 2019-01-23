var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCheckService } from '../common/login-check.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Constants } from '../constants/constants.service';
import { DashboardConfigurationService } from './dashboard-configuration-service';
var HeaderComponent = (function () {
    function HeaderComponent(loginCheckService, dashboardService, router, constant, dashboardConfigurationService) {
        this.loginCheckService = loginCheckService;
        this.dashboardService = dashboardService;
        this.router = router;
        this.constant = constant;
        this.dashboardConfigurationService = dashboardConfigurationService;
        this.result = {};
        this.first3notificationList = [];
        this.showmoreNeeded = true;
        this.showmoreClicked = false;
        this.toggleBox = false;
        this.isAdmin = false;
        this.showConfiguringOption = false;
        this.expenditureVolumWidget = true;
        this.researchSummaryWidget = true;
        this.awardedProposalBySponsorWidget = true;
        this.awardBysponsorTypesWidget = true;
        this.proposalBySponsorTypesWidget = true;
        this.inProgressproposalBySponsorWidget = true;
        document.addEventListener('mouseup', this.offClickHandler.bind(this));
        document.addEventListener('mouseup', this.offClickHandlerDashboardConf.bind(this));
        this.outputPath = this.constant.outputPath;
        this.logo = './assets/images/logo-smu.jpg';
        // this.logo = './assets/images/logo.png';
    }
    HeaderComponent.prototype.offClickHandler = function (event) {
        if (!this.notificationBar.nativeElement.contains(event.target)) {
            this.toggleBox = false;
        }
    };
    HeaderComponent.prototype.offClickHandlerDashboardConf = function (event) {
        if (!this.configurationBar.nativeElement.contains(event.target)) {
            this.showConfiguringOption = false;
        }
    };
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isLoggedIn$ = this.loginCheckService.isLoggedIn;
        this.adminStatus = localStorage.getItem('isAdmin');
        this.userName = localStorage.getItem('currentUser');
        this.fullName = localStorage.getItem('userFullname');
        if (this.adminStatus == 'true') {
            this.isAdmin = true;
        }
        this.dashboardConfigurationService.currentdashboardExpenditureVolumeWidget.subscribe(function (status) {
            _this.expenditureVolumWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardResearchSummaryWidget.subscribe(function (status) {
            _this.researchSummaryWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardawardedProposalBySponsorWidget.subscribe(function (status) {
            _this.awardedProposalBySponsorWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardAwardBysponsorTypesWidget.subscribe(function (status) {
            _this.awardBysponsorTypesWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardproposalBySponsorTypesWidget.subscribe(function (status) {
            _this.proposalBySponsorTypesWidget = status;
        });
        this.dashboardConfigurationService.currentdashboardinProgressproposalBySponsorWidget.subscribe(function (status) {
            _this.inProgressproposalBySponsorWidget = status;
        });
    };
    HeaderComponent.prototype.logout = function () {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        localStorage.removeItem('exapandedDonutViewProposalHeading');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('personId');
        localStorage.removeItem('userFullname');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('exapandedViewProposalHeading');
        localStorage.removeItem('piechartIndex');
        localStorage.removeItem('exapandedDonutViewAwardHeading');
        localStorage.removeItem('donutChartIndex');
        localStorage.removeItem('exapandedViewAwardHeading');
        localStorage.removeItem('sponsorCode');
        localStorage.removeItem('researchSummaryIndex');
        localStorage.removeItem('dashboardproposalBySponsorTypesWidget');
        localStorage.removeItem('dashboardinProgressproposalBySponsorWidget');
        localStorage.removeItem('dashboardAwardBysponsorTypesWidget');
        localStorage.removeItem('dashboardawardedProposalBySponsorWidget');
        localStorage.removeItem('dashboardResearchSummaryWidget');
        localStorage.removeItem('dashboardExpenditureVolumeWidget');
        localStorage.removeItem('provost');
        localStorage.removeItem('grantManager');
        this.loginCheckService.logout();
        this.router.navigate(['/loginpage']);
    };
    HeaderComponent.prototype.userNotification = function (event) {
        var _this = this;
        event.preventDefault();
        this.toggleBox = !this.toggleBox;
        this.showmoreClicked = false;
        this.showmoreNeeded = true;
        this.first3notificationList = [];
        this.personId = localStorage.getItem('personId');
        if (this.toggleBox == true) {
            this.dashboardService.userNotification(this.personId)
                .subscribe(function (data) {
                _this.result = data || [];
                if (_this.result != null) {
                    _this.notificationList = _this.result;
                    _this.docId = _this.result.documentId;
                    if (_this.notificationList.length > 3) {
                        _this.morethanThreeNotification = true;
                        for (var i = 0; i < 3; i++) {
                            _this.first3notificationList.push(_this.notificationList[i]);
                        }
                    }
                }
            });
        }
    };
    HeaderComponent.prototype.showMore = function (event) {
        this.showmoreClicked = true;
        event.preventDefault();
        this.showmoreNeeded = false;
    };
    HeaderComponent.prototype.myDashboard = function (event) {
        event.preventDefault();
        this.router.navigate(['/dashboard']);
    };
    HeaderComponent.prototype.configureDashboard = function (event) {
        event.preventDefault();
        this.showConfiguringOption = !this.showConfiguringOption;
    };
    HeaderComponent.prototype.onChangeOfexpenditureVolumWidget = function (value) {
        localStorage.setItem('dashboardExpenditureVolumeWidget', String(value));
        this.dashboardConfigurationService.changeDashboardExpenditureVolumeWidget(value);
    };
    HeaderComponent.prototype.onChangeOfresearchSummaryWidget = function (value) {
        localStorage.setItem('dashboardResearchSummaryWidget', String(value));
        this.dashboardConfigurationService.changeDashboardResearchSummaryWidgett(value);
    };
    HeaderComponent.prototype.onChangeOfawardedProposalBySponsorWidget = function (value) {
        localStorage.setItem('dashboardawardedProposalBySponsorWidget', String(value));
        this.dashboardConfigurationService.changeDashboardawardedProposalBySponsorWidget(value);
    };
    HeaderComponent.prototype.onChangeOfawardBysponsorTypesWidget = function (value) {
        localStorage.setItem('dashboardAwardBysponsorTypesWidget', String(value));
        this.dashboardConfigurationService.changeDashboardAwardBysponsorTypesWidget(value);
    };
    HeaderComponent.prototype.onChangeOfinProgressproposalBySponsorWidget = function (value) {
        localStorage.setItem('dashboardinProgressproposalBySponsorWidget', String(value));
        this.dashboardConfigurationService.changeDashboardinProgressproposalBySponsorWidget(value);
    };
    HeaderComponent.prototype.onChangeOfproposalBySponsorTypesWidget = function (value) {
        localStorage.setItem('dashboardproposalBySponsorTypesWidget', String(value));
        this.dashboardConfigurationService.changeDashboardproposalBySponsorTypesWidget(value);
    };
    __decorate([
        ViewChild('notificationBar'),
        __metadata("design:type", ElementRef)
    ], HeaderComponent.prototype, "notificationBar", void 0);
    __decorate([
        ViewChild('configurationBar'),
        __metadata("design:type", ElementRef)
    ], HeaderComponent.prototype, "configurationBar", void 0);
    HeaderComponent = __decorate([
        Component({
            selector: 'header-tpl',
            templateUrl: 'header-tpl.component.html',
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [LoginCheckService, DashboardService, Router, Constants, DashboardConfigurationService])
    ], HeaderComponent);
    return HeaderComponent;
}());
export { HeaderComponent };
//# sourceMappingURL=header-tpl.component.js.map