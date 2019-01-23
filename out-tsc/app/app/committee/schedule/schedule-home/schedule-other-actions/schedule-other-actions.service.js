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
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from "../../../../constants/constants.service";
import { HttpClient } from "@angular/common/http";
var ScheduleOtherActionsService = (function () {
    function ScheduleOtherActionsService(http, constant) {
        this.http = http;
        this.constant = constant;
    }
    ScheduleOtherActionsService.prototype.addOtherActions = function (committeeId, scheduleId, committeeScheduleActItems) {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            committeeScheduleActItems: committeeScheduleActItems
        };
        return this.http.post(this.constant.addOtherActions, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ScheduleOtherActionsService.prototype.deleteOtherActions = function (committeeId, scheduleId, commScheduleActItemsId) {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            commScheduleActItemsId: commScheduleActItemsId
        };
        return this.http.post(this.constant.deleteOtherActions, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ScheduleOtherActionsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants])
    ], ScheduleOtherActionsService);
    return ScheduleOtherActionsService;
}());
export { ScheduleOtherActionsService };
//# sourceMappingURL=schedule-other-actions.service.js.map