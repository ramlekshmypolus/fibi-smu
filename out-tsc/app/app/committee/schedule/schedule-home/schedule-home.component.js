var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleHomeService } from "./schedule-home.service";
import { DatePipe } from '@angular/common';
import { ScheduleConfigurationService } from "../schedule-configuration.service";
var ScheduleHomeComponent = (function () {
    function ScheduleHomeComponent(scheduleConfigurationService, datePipe, router, scheduleHomeService) {
        this.scheduleConfigurationService = scheduleConfigurationService;
        this.datePipe = datePipe;
        this.router = router;
        this.scheduleHomeService = scheduleHomeService;
        this.showProtocol = false;
        this.showAttendance = false;
        this.showOtherActions = false;
        this.showAttachment = false;
        this.result = {};
        this.committeeSchedule = {};
        this.editDetails = false;
        this.isCommitteeDetailsEditMode = false;
        this.isToDisplayHomeData = true;
        this.scheduleStatus = [];
        this.result.committeeSchedule = {};
    }
    ScheduleHomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scheduleConfigurationService.currentScheduleData.subscribe(function (data) {
            _this.result = data;
            if (_this.result !== undefined && _this.result.committeeSchedule !== undefined) {
                _this.scheduleTime = new Date(_this.result.committeeSchedule.time);
                _this.scheduleStartTime = new Date(_this.result.committeeSchedule.startTime);
                _this.scheduleEndTime = new Date(_this.result.committeeSchedule.endTime);
                _this.scheduleStatus = _this.result.scheduleStatus;
                _this.scheduleStatusSelected = _this.result.committeeSchedule.scheduleStatus.description;
            }
        });
    };
    ScheduleHomeComponent.prototype.showProtocolsTab = function (event) {
        event.preventDefault();
        this.showProtocol = !this.showProtocol;
    };
    ScheduleHomeComponent.prototype.showAttendanceTab = function (event) {
        event.preventDefault();
        this.showAttendance = !this.showAttendance;
    };
    ScheduleHomeComponent.prototype.showOtherActionsTab = function (event) {
        event.preventDefault();
        this.showOtherActions = !this.showOtherActions;
    };
    ScheduleHomeComponent.prototype.showAttachmentTab = function (event) {
        event.preventDefault();
        this.showAttachment = !this.showAttachment;
    };
    ScheduleHomeComponent.prototype.showEditDetails = function (committeeSchedule) {
        this.editDetails = !this.editDetails;
        this.isCommitteeDetailsEditMode = false;
        this.meetingDate = committeeSchedule.meetingDate;
        this.description = committeeSchedule.scheduleStatus.description;
        this.place = committeeSchedule.place;
        this.timeTemp = this.scheduleTime;
        this.subDeadline = committeeSchedule.protocolSubDeadline;
        this.maxProtocols = committeeSchedule.maxProtocols;
        this.startTimeTemp = this.scheduleStartTime;
        this.endTimeTemp = this.scheduleEndTime;
        this.availableToReviewers = committeeSchedule.availableToReviewers;
        this.comments = committeeSchedule.comments;
        if (this.editDetails) {
            this.editClass = 'scheduleBoxes';
            this.scheduleConfigurationService.changeScheduleHomeDetailEditFlag(true);
        }
        else {
            this.scheduleConfigurationService.changeScheduleHomeDetailEditFlag(false);
        }
    };
    ScheduleHomeComponent.prototype.updateDetails = function () {
        var _this = this;
        this.editDetails = false;
        this.scheduleConfigurationService.changeScheduleHomeDetailEditFlag(false);
        this.result.committeeId = this.result.committeeSchedule.committeeId;
        this.result.committeeSchedule.viewTime.time = this.datePipe.transform(this.scheduleTime, 'hh:mm');
        this.result.committeeSchedule.viewTime.meridiem = this.datePipe.transform(this.scheduleTime, 'aa');
        this.result.committeeSchedule.viewStartTime.time = this.datePipe.transform(this.scheduleStartTime, 'hh:mm');
        this.result.committeeSchedule.viewStartTime.meridiem = this.datePipe.transform(this.scheduleStartTime, 'aa');
        this.result.committeeSchedule.viewEndTime.time = this.datePipe.transform(this.scheduleEndTime, 'hh:mm');
        this.result.committeeSchedule.viewEndTime.meridiem = this.datePipe.transform(this.scheduleEndTime, 'aa');
        this.scheduleStatus.forEach(function (value, index) {
            if (value.description == _this.scheduleStatusSelected) {
                value.updateTimestamp = new Date();
                value.updateUser = localStorage.getItem('currentUser');
                _this.result.committeeSchedule.scheduleStatus = value;
                _this.result.committeeSchedule.scheduleStatusCode = value.scheduleStatusCode;
                _this.scheduleStatusSelected = value.description;
            }
        });
        this.scheduleHomeService.saveScheduleData(this.result).subscribe(function (data) {
            _this.result = data;
        });
    };
    ScheduleHomeComponent.prototype.cancelEditDetails = function () {
        this.errorFlag = false;
        this.scheduleConfigurationService.changeScheduleHomeDetailEditFlag(false);
        this.editDetails = !this.editDetails;
        if (!this.editDetails) {
            this.editClass = 'committeeBoxNotEditable';
        }
        this.result.committeeSchedule.meetingDate = this.meetingDate;
        this.result.committeeSchedule.scheduleStatus.description = this.description;
        this.result.committeeSchedule.place = this.place;
        this.scheduleTime = this.timeTemp;
        this.result.committeeSchedule.protocolSubDeadline = this.subDeadline;
        this.result.committeeSchedule.maxProtocols = this.maxProtocols;
        this.scheduleStartTime = this.startTimeTemp;
        this.scheduleEndTime = this.endTimeTemp;
        this.result.committeeSchedule.availableToReviewers = this.availableToReviewers;
        this.result.committeeSchedule.comments = this.comments;
    };
    ScheduleHomeComponent = __decorate([
        Component({
            selector: 'app-schedule-home',
            templateUrl: './schedule-home.component.html',
            styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css'],
            changeDetection: ChangeDetectionStrategy.Default
        }),
        __metadata("design:paramtypes", [ScheduleConfigurationService, DatePipe, Router, ScheduleHomeService])
    ], ScheduleHomeComponent);
    return ScheduleHomeComponent;
}());
export { ScheduleHomeComponent };
//# sourceMappingURL=schedule-home.component.js.map