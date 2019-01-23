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
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants.service';
import { HttpClient } from "@angular/common/http";
var ExpandedviewService = (function () {
    function ExpandedviewService(http, constant) {
        this.http = http;
        this.constant = constant;
    }
    ExpandedviewService.prototype.loadExpandedView = function (statusCode, personId, piechartIndex) {
        var params = {
            sponsorCode: statusCode,
            personId: personId,
            pieChartIndex: piechartIndex
        };
        var expandedViewUrl = this.constant.expandedViewUrl;
        return this.http.post(expandedViewUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ExpandedviewService.prototype.loadExpandedSummaryView = function (personId, researchSummaryIndex) {
        var params = {
            personId: personId,
            researchSummaryIndex: researchSummaryIndex
        };
        var expandedSummaryViewUrl = this.constant.expandedSummaryViewUrl;
        return this.http.post(expandedSummaryViewUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ExpandedviewService.prototype.loadDonutExpandedView = function (statusCode, personId, donutChartIndex) {
        var params = {
            sponsorCode: statusCode,
            personId: personId,
            donutChartIndex: donutChartIndex
        };
        var expandedDonutViewUrl = this.constant.expandedDonutViewUrl;
        return this.http.post(expandedDonutViewUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ExpandedviewService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants])
    ], ExpandedviewService);
    return ExpandedviewService;
}());
export { ExpandedviewService };
//# sourceMappingURL=expanded-view.service.js.map