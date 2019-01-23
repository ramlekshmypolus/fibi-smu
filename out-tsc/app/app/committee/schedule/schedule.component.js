var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleService } from '../schedule/schedule.service';
import { ScheduleConfigurationService } from './schedule-configuration.service';
import { SessionManagementService } from "../../session/session-management.service";
import { ContentChild } from '@angular/core';
import { ScheduleHomeComponent } from './schedule-home/schedule-home.component';
import { MinutesComponent } from './minutes/minutes.component';
var ScheduleComponent = (function () {
    function ScheduleComponent(changeRef, scheduleService, router, sessionService, route, scheduleConfigurationService) {
        this.changeRef = changeRef;
        this.scheduleService = scheduleService;
        this.router = router;
        this.sessionService = sessionService;
        this.route = route;
        this.scheduleConfigurationService = scheduleConfigurationService;
        this.currentTab = 'schedule_home';
        this.result = {};
        this.isOnEditScheduleHome = false;
        this.showEditWarning = false;
        this.homeDetailFlag = false;
        this.attachmentFlag = false;
        this.attendanceFlag = false;
        this.minuteEditFlag = false;
        if (!sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
    }
    ScheduleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scheduleId = this.route.snapshot.queryParams['scheduleId'];
        this.currentTab = "schedule_home";
        this.loadScheduleDataSub = this.scheduleService.loadScheduleData(this.scheduleId).
            subscribe(function (data) {
            _this.result = data;
            if (_this.result !== null) {
                _this.scheduleConfigurationService.changeScheduleData(_this.result);
            }
        });
    };
    ScheduleComponent.prototype.ngOnDestroy = function () {
        this.loadScheduleDataSub.unsubscribe();
    };
    ScheduleComponent.prototype.show_current_tab = function (e, current_tab) {
        var _this = this;
        e.preventDefault();
        this.scheduleConfigurationService.currentScheduleHomeDetailEditFlag.subscribe(function (val) { _this.homeDetailFlag = val; });
        this.scheduleConfigurationService.currentScheduleHomeAttachmentsEditFlag.subscribe(function (val) { _this.attachmentFlag = val; });
        this.scheduleConfigurationService.currentScheduleHomeAttendanceEditFlag.subscribe(function (val) { _this.attendanceFlag = val; });
        this.scheduleConfigurationService.currentMinutesEditFlag.subscribe(function (val) { _this.minuteEditFlag = val; });
        this.currentTab = current_tab;
        if (this.currentTab == 'minutes') {
            if (this.homeDetailFlag == true || this.attachmentFlag == true || this.attendanceFlag == true) {
                this.showEditWarning = true;
            }
            else {
                this.showEditWarning = false;
                this.router.navigate(['committee/schedule/minutes'], { queryParams: { "scheduleId": this.scheduleId } });
            }
        }
        else if (this.currentTab == 'schedule_home') {
            if (this.minuteEditFlag == true) {
                this.showEditWarning = true;
            }
            else {
                this.showEditWarning = false;
                this.router.navigate(['committee/schedule/scheduleHome'], { queryParams: { "scheduleId": this.scheduleId } });
            }
        }
        else {
        }
    };
    ScheduleComponent.prototype.onActivate = function (componentRef) {
        this.activatedRoute = componentRef;
    };
    ScheduleComponent.prototype.saveAndContinue = function (e) {
        e.preventDefault();
        if (this.currentTab == 'minutes') {
            this.activatedRoute.updateDetails();
            this.scheduleConfigurationService.currentTab.next('minutes');
            this.router.navigate(['committee/schedule/minutes'], { queryParams: { "scheduleId": this.scheduleId } });
        }
        else {
            for (var index in this.activatedRoute.isEditMinuteItem) {
                this.activatedRoute.updateMinuteItem(index, this.activatedRoute.result.committeeSchedule.committeeScheduleMinutes[index]);
            }
            this.scheduleConfigurationService.currentTab.next('schedule_home');
            this.router.navigate(['committee/schedule/scheduleHome'], { queryParams: { "scheduleId": this.scheduleId } });
        }
    };
    ScheduleComponent.prototype.stayOnPage = function () {
        this.showEditWarning = false;
        if (this.currentTab == 'schedule_home') {
            this.currentTab = 'minutes';
        }
        else {
            this.currentTab = 'schedule_home';
        }
    };
    __decorate([
        ContentChild(ScheduleHomeComponent),
        ContentChild(MinutesComponent),
        __metadata("design:type", String)
    ], ScheduleComponent.prototype, "currentTab", void 0);
    ScheduleComponent = __decorate([
        Component({
            selector: 'app-schedule-component',
            templateUrl: './schedule.component.html',
            styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
            providers: [SessionManagementService, ScheduleHomeComponent, MinutesComponent]
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ScheduleService, Router, SessionManagementService, ActivatedRoute, ScheduleConfigurationService])
    ], ScheduleComponent);
    return ScheduleComponent;
}());
export { ScheduleComponent };
//# sourceMappingURL=schedule.component.js.map