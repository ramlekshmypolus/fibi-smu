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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Constants } from '../../constants/constants.service';
import { HttpClient } from "@angular/common/http";
var AwardHierarchyService = (function () {
    function AwardHierarchyService(http, constant) {
        this.http = http;
        this.constant = constant;
        this.currentab = new BehaviorSubject("award_home");
        this.currentvalue = this.currentab.asObservable();
    }
    AwardHierarchyService.prototype.loadAwardHierarchy = function (awardNumber, selectedAwardNumber) {
        var params = {
            awardNumber: awardNumber,
            selectedAwardNumber: selectedAwardNumber
        };
        return this.http.post(this.constant.awardHierarchyUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    AwardHierarchyService.prototype.changeCurrenttab = function (tab) {
        this.currentab.next(tab);
    };
    AwardHierarchyService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants])
    ], AwardHierarchyService);
    return AwardHierarchyService;
}());
export { AwardHierarchyService };
//# sourceMappingURL=award-hierarchy.service.js.map