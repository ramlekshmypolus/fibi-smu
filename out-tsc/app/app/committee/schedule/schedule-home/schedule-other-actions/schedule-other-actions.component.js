var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleConfigurationService } from '../../schedule-configuration.service';
import { ScheduleService } from '../../schedule.service';
import { ScheduleOtherActionsService } from './schedule-other-actions.service';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
var ScheduleOtherActionsComponent = (function () {
    function ScheduleOtherActionsComponent(scheduleOtherActionsService, activatedRoute, scheduleService, scheduleConfigurationService) {
        this.scheduleOtherActionsService = scheduleOtherActionsService;
        this.activatedRoute = activatedRoute;
        this.scheduleService = scheduleService;
        this.scheduleConfigurationService = scheduleConfigurationService;
        this.result = {};
        this.committeeScheduleActItemsObject = {};
        this.otherActionsDescription = '';
        this.tempOtherAction = {};
        this.showPopup = false;
        this.currentUser = localStorage.getItem("currentUser");
        this.isMandatoryFilled = true;
        this.onDestroy$ = new Subject();
    }
    ScheduleOtherActionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.scheduleConfigurationService.currentScheduleData.takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
        });
    };
    ScheduleOtherActionsComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    ScheduleOtherActionsComponent.prototype.OtherActionsTypeChange = function (type) {
        var d = new Date();
        var time = d.getTime();
        for (var _i = 0, _a = this.result.scheduleActItemTypes; _i < _a.length; _i++) {
            var actionType = _a[_i];
            if (actionType.description == type) {
                this.committeeScheduleActItemsObject.scheduleActItemTypecode = actionType.scheduleActItemTypecode;
                this.committeeScheduleActItemsObject.scheduleActItemTypeDescription = actionType.description;
                this.committeeScheduleActItemsObject.updateUser = this.currentUser;
                this.committeeScheduleActItemsObject.updateTimestamp = time;
                this.result.committeeScheduleActItems = this.committeeScheduleActItemsObject;
            }
        }
    };
    ScheduleOtherActionsComponent.prototype.addOtherActions = function () {
        var _this = this;
        if (this.committeeScheduleActItemsObject.scheduleActItemTypeDescription == null) {
            var d = new Date();
            var time = d.getTime();
            for (var _i = 0, _a = this.result.scheduleActItemTypes; _i < _a.length; _i++) {
                var actionType = _a[_i];
                if (actionType.description == 'Adverse Event') {
                    this.committeeScheduleActItemsObject.scheduleActItemTypecode = actionType.scheduleActItemTypecode;
                    this.committeeScheduleActItemsObject.scheduleActItemTypeDescription = actionType.description;
                    this.committeeScheduleActItemsObject.updateUser = this.currentUser;
                    this.committeeScheduleActItemsObject.updateTimestamp = time;
                    this.result.committeeScheduleActItems = this.committeeScheduleActItemsObject;
                }
            }
        }
        if (this.otherActionsDescription.trim().length != 0 && this.otherActionsDescription != '' && this.otherActionsDescription != null) {
            this.isMandatoryFilled = true;
            this.mandatoryMessage = '';
            this.committeeScheduleActItemsObject.itemDescription = this.otherActionsDescription;
            this.result.committeeScheduleActItems = this.committeeScheduleActItemsObject;
            this.scheduleOtherActionsService.addOtherActions(this.result.committee.committeeId, this.scheduleId, this.result.committeeScheduleActItems).takeUntil(this.onDestroy$).subscribe(function (data) {
                var temp = {};
                temp = data;
                _this.result.committeeSchedule.committeeScheduleActItems = temp.committeeSchedule.committeeScheduleActItems;
            });
        }
        else {
            this.isMandatoryFilled = false;
            this.mandatoryMessage = '* Please fill mandatory fields';
        }
        this.committeeScheduleActItemsObject = {};
        this.otherActionsDescription = ' ';
    };
    ScheduleOtherActionsComponent.prototype.deleteOtherActions = function () {
        var _this = this;
        this.scheduleOtherActionsService.deleteOtherActions(this.result.committee.committeeId, this.scheduleId, this.tempOtherAction.commScheduleActItemsId).takeUntil(this.onDestroy$).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.result.committeeSchedule.committeeScheduleActItems = temp.committeeSchedule.committeeScheduleActItems;
        });
    };
    //save temporarily during modal pop up
    ScheduleOtherActionsComponent.prototype.tempSave = function (event, otherAction) {
        event.preventDefault();
        this.showPopup = true;
        this.tempOtherAction = otherAction;
    };
    ScheduleOtherActionsComponent = __decorate([
        Component({
            selector: 'app-schedule-other-actions',
            templateUrl: './schedule-other-actions.component.html',
            styleUrls: ['../../../../../assets/css/bootstrap.min.css', '../../../../../assets/css/font-awesome.min.css', '../../../../../assets/css/style.css', '../../../../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [ScheduleOtherActionsService, ActivatedRoute, ScheduleService, ScheduleConfigurationService])
    ], ScheduleOtherActionsComponent);
    return ScheduleOtherActionsComponent;
}());
export { ScheduleOtherActionsComponent };
//# sourceMappingURL=schedule-other-actions.component.js.map