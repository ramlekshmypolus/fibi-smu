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
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var CommitteeConfigurationService = (function () {
    function CommitteeConfigurationService() {
        this.committeeMode = new BehaviorSubject("");
        this.currentMode = this.committeeMode.asObservable();
        this.committeeAreaOfResearch = new BehaviorSubject([]);
        this.currentAreaOfResearch = this.committeeAreaOfResearch.asObservable();
        this.committeeData = new BehaviorSubject([]);
        this.currentCommitteeData = this.committeeData.asObservable();
        this.currentMember = new BehaviorSubject([]);
        this.currentMemberData = this.currentMember.asObservable();
        this.committeeEditFlag = new BehaviorSubject(false);
        this.currentEditFlag = this.committeeEditFlag.asObservable();
        this.committeeMemberEditFlag = new BehaviorSubject(false);
        this.currentMemberEditFlag = this.committeeMemberEditFlag.asObservable();
        this.currentTab = new BehaviorSubject("");
        this.currentactivatedTab = this.currentTab.asObservable();
        this.scheduleHomeDetailEditFlag = new BehaviorSubject(false);
        this.scheduleHomeAttachmentsEditFlag = new BehaviorSubject(false);
        this.scheduleHomeAttendanceEditFlag = new BehaviorSubject(false);
    }
    CommitteeConfigurationService.prototype.changeMode = function (mode) {
        this.committeeMode.next(mode);
    };
    CommitteeConfigurationService.prototype.changeAreaOfResearch = function (areaOfResearch) {
        this.committeeAreaOfResearch.next(areaOfResearch);
    };
    CommitteeConfigurationService.prototype.changeCommmitteeData = function (data) {
        this.committeeData.next(data);
    };
    CommitteeConfigurationService.prototype.changeMemberData = function (data) {
        this.currentMember.next(data);
    };
    CommitteeConfigurationService.prototype.changeEditFlag = function (flag) {
        this.committeeEditFlag.next(flag);
    };
    CommitteeConfigurationService.prototype.changeEditMemberFlag = function (flag) {
        this.committeeMemberEditFlag.next(flag);
    };
    CommitteeConfigurationService.prototype.changeActivatedtab = function (tab) {
        this.currentTab.next(tab);
    };
    CommitteeConfigurationService.prototype.changeScheduleHomeDetailEditFlag = function (flag) {
        this.scheduleHomeDetailEditFlag.next(flag);
    };
    CommitteeConfigurationService.prototype.changeScheduleHomeAttachmentsEditFlag = function (flag) {
        this.scheduleHomeAttachmentsEditFlag.next(flag);
    };
    CommitteeConfigurationService.prototype.changeScheduleHomeAttendanceEditFlag = function (flag) {
        this.scheduleHomeAttendanceEditFlag.next(flag);
    };
    CommitteeConfigurationService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], CommitteeConfigurationService);
    return CommitteeConfigurationService;
}());
export { CommitteeConfigurationService };
//# sourceMappingURL=committee-configuration.service.js.map