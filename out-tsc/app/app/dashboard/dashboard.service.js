var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionManagementService } from '../session/session-management.service';
import { Constants } from '../constants/constants.service';
var DashboardService = (function () {
    function DashboardService(http, sessionService, constant) {
        this.http = http;
        this.sessionService = sessionService;
        this.constant = constant;
        this.username = localStorage.getItem('currentUser');
        this.personId = localStorage.getItem('personId');
    }
    DashboardService.prototype.loadDashBoard = function (property1, property2, property3, property4, pageNumber, sortBy, reverse, tabIndex, currentPage, filterStartDate, filterEndDate) {
        this.personId = localStorage.getItem('personId');
        var params = {
            property1: property1,
            property2: property2,
            property3: property3,
            property4: property4,
            pageNumber: pageNumber,
            sortBy: sortBy,
            reverse: reverse,
            tabIndex: tabIndex,
            userName: this.username,
            personId: this.personId,
            currentPage: currentPage,
            isUnitAdmin: localStorage.getItem('isAdmin'),
            unitNumber: localStorage.getItem('unitNumber')
        };
        return this.http.post(this.constant.dashboardUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    DashboardService.prototype.getResearchSummaryData = function () {
        this.personId = localStorage.getItem('personId');
        var params = {
            personId: this.personId
        };
        return this.http.post(this.constant.summaryUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    DashboardService.prototype.userNotification = function (personId) {
        var params = {
            personId: personId
        };
        return this.http.post(this.constant.notificationUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    DashboardService.prototype.logout = function () {
        return this.http.get(this.constant.logoutUrl)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    DashboardService.prototype.applicationReport = function (grantCallId, reportName) {
        var params = {
            grantCallId: grantCallId,
            reportName: reportName
        };
        return this.http.post(this.constant.applicationReport, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    DashboardService.prototype.fetchAllReportData = function () {
        return this.http.post(this.constant.fetchOpenGrantIds, {})
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    DashboardService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, SessionManagementService, Constants])
    ], DashboardService);
    return DashboardService;
}());
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map