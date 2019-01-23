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
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
import { LoginCheckService } from '../common/login-check.service';
var LogoutComponent = (function () {
    function LogoutComponent(dashboardService, router, loginCheckService) {
        this.dashboardService = dashboardService;
        this.router = router;
        this.loginCheckService = loginCheckService;
        this.logout();
    }
    LogoutComponent.prototype.logout = function () {
        var _this = this;
        this.dashboardService.logout().subscribe(function (data) {
            if (data != null) {
                if (data == 'SUCCESS') {
                    localStorage.removeItem('currentUser');
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
                    _this.loginCheckService.logout();
                    _this.router.navigate(['/loginpage']);
                }
            }
        });
    };
    LogoutComponent = __decorate([
        Component({
            template: '',
            providers: [DashboardService]
        }),
        __metadata("design:paramtypes", [DashboardService, Router, LoginCheckService])
    ], LogoutComponent);
    return LogoutComponent;
}());
export { LogoutComponent };
//# sourceMappingURL=logout.component.js.map