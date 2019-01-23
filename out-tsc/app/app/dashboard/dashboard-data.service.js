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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
var DashboardData = (function () {
    function DashboardData() {
        this.dashboardPieChartData = {};
        this.dashboardPieChartData1 = new BehaviorSubject({});
        this.dashboardPieChartData1Variable = this.dashboardPieChartData1.asObservable();
        this.dashboardAreaChartData1 = new BehaviorSubject([[]]);
        this.dashboardAreaChartData1Variable = this.dashboardAreaChartData1.asObservable();
        this.reportData = new BehaviorSubject({});
        this.reportDataVariable = this.reportData.asObservable();
    }
    DashboardData.prototype.getDashboardPieChartData = function () {
        return this.dashboardPieChartData;
    };
    DashboardData.prototype.setDashboardPieChartData = function (dashboardPieChartData) {
        this.dashboardPieChartData = dashboardPieChartData;
    };
    DashboardData.prototype.getdashboardAreaChartData = function () {
        return this.dashboardAreaChartData;
    };
    DashboardData.prototype.setdashboardAreaChartData = function (dashboardAreaChartData) {
        this.dashboardAreaChartData = dashboardAreaChartData;
    };
    DashboardData.prototype.getDashboardPieChartData1 = function () {
        return this.dashboardPieChartData1;
    };
    DashboardData.prototype.setDashboardPieChartData1 = function (dashboardPieChartData1) {
        this.dashboardPieChartData1.next(dashboardPieChartData1);
    };
    DashboardData.prototype.getDashboardAreaChartData1 = function () {
        return this.dashboardPieChartData1;
    };
    DashboardData.prototype.setDashboardAreaChartData1 = function (dashboardAreaChartData1) {
        this.dashboardAreaChartData1.next(dashboardAreaChartData1);
    };
    DashboardData.prototype.getReportData = function () {
        return this.reportData;
    };
    DashboardData.prototype.setReportData = function (reportData) {
        this.reportData.next(reportData);
    };
    DashboardData = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], DashboardData);
    return DashboardData;
}());
export { DashboardData };
//# sourceMappingURL=dashboard-data.service.js.map