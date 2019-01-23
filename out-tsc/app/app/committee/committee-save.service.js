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
var CommitteeSaveService = (function () {
    function CommitteeSaveService(http, constant) {
        this.http = http;
        this.constant = constant;
    }
    CommitteeSaveService.prototype.saveCommitteeData = function (committeeObj) {
        return this.http.post(this.constant.committeeSaveUrl, committeeObj)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteeSaveService.prototype.saveResearchAreaCommitteeData = function (committeeId, committeeObj) {
        var params = {
            committeeId: committeeId,
            committeeResearchArea: committeeObj
        };
        return this.http.post(this.constant.researchAreaSaveUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteeSaveService.prototype.deleteAreaOfResearch = function (commResearchAreasId, committeeId) {
        var params = {
            commResearchAreasId: commResearchAreasId,
            committeeId: committeeId
        };
        return this.http.post(this.constant.deleteResearchAreaUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteeSaveService.prototype.saveScheduleData = function (scheduleData) {
        return this.http.post(this.constant.generateScheduleUrl, scheduleData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteeSaveService.prototype.updateScheduleData = function (scheduleData) {
        return this.http.post(this.constant.updateScheduleUrl, scheduleData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteeSaveService.prototype.deleteScheduleData = function (sendScheduleRequestData) {
        return this.http.post(this.constant.deleteScheduleUrl, sendScheduleRequestData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteeSaveService.prototype.filterScheduleData = function (scheduleData) {
        return this.http.post(this.constant.filterScheduleUrl, scheduleData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteeSaveService.prototype.resetFilterSchedule = function (scheduleData) {
        return this.http.post(this.constant.resetFilterScheduleUrl, scheduleData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteeSaveService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants])
    ], CommitteeSaveService);
    return CommitteeSaveService;
}());
export { CommitteeSaveService };
//# sourceMappingURL=committee-save.service.js.map