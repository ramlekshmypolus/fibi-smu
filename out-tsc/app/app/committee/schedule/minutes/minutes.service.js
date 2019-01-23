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
import { HttpClient } from "@angular/common/http";
import { Constants } from "../../../constants/constants.service";
var MinutesService = (function () {
    function MinutesService(http, constant) {
        this.http = http;
        this.constant = constant;
    }
    MinutesService.prototype.saveMinuteData = function (minuteData) {
        return this.http.post(this.constant.addScheduleMinuteUrl, minuteData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    MinutesService.prototype.deleteMinuteData = function (minuteData) {
        return this.http.post(this.constant.deleteScheduleMinuteUrl, minuteData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    MinutesService.prototype.updateMinuteData = function (updatedata) {
        return this.http.post(this.constant.updateScheduleMinuteUrl, updatedata)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    MinutesService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants])
    ], MinutesService);
    return MinutesService;
}());
export { MinutesService };
//# sourceMappingURL=minutes.service.js.map