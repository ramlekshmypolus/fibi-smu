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
import { ScheduleConfigurationService } from '../schedule-configuration.service';
import { MinutesService } from "../minutes/minutes.service";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
var MinutesComponent = (function () {
    function MinutesComponent(scheduleConfigurationService, minutesService) {
        this.scheduleConfigurationService = scheduleConfigurationService;
        this.minutesService = minutesService;
        this.isMinuteEntryPoppedUp = false;
        this.isContigencyPoppedUp = false;
        this.isEditMinuteItem = {};
        this.selectedOtherBusItem = {};
        this.entityType = [];
        this.contingencyList = [];
        this.privateCommentFlag = false;
        this.finalFlag = false;
        this.isMandatoryFilled = true;
        this.minuteValidationMessage = "* Please fill the mandatory fields.";
        this.isToDelete = false;
        this.attendances = [];
        this.minuteListItem = {};
        this.onDestroy$ = new Subject();
        this.initialLoad();
    }
    MinutesComponent.prototype.ngOnInit = function () { };
    MinutesComponent.prototype.initialLoad = function () {
        var _this = this;
        this.scheduleConfigurationService.currentScheduleData.takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data || [];
            if (_this.result != null) {
                _this.entityType = _this.result.minuteEntrytypes;
                _this.contingencyList = _this.result.protocolContingencies;
            }
            _this.selectedOptionEntityType = "1";
            _this.setDefaultModalValues();
        });
    };
    MinutesComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    MinutesComponent.prototype.setDefaultModalValues = function () {
        this.entryDescription = "";
        this.selectedProtocolContingencyCode = null;
        this.selectedProtocol = 'Select';
        this.selectedOtherBusItem = 'Select';
        this.privateCommentFlag = false;
        this.finalFlag = false;
        this.isMandatoryFilled = true;
    };
    MinutesComponent.prototype.showAddMinutes = function ($event) {
        this.selectedOptionEntityType = "1";
        if (this.isMinuteEntryPoppedUp == false) {
            this.isMinuteEntryPoppedUp = true;
        }
        this.setDefaultModalValues();
    };
    MinutesComponent.prototype.onEntityTypeChange = function (newValue) {
        this.selectedOptionEntityType = newValue;
        this.setDefaultModalValues();
    };
    MinutesComponent.prototype.onProtocolSelect = function (newValue) {
        this.selectedProtocol = newValue;
    };
    MinutesComponent.prototype.onOtherItemSelect = function (newValue) {
        this.selectedOtherBusItem = newValue;
        this.entryDescription = (this.selectedOtherBusItem == 'Select') ? "" : this.selectedOtherBusItem.itemDescription;
        if (this.selectedOtherBusItem == 'Select') {
            this.selectedOtherBusItem = {};
        }
    };
    MinutesComponent.prototype.searchContigency = function () {
        if (this.isContigencyPoppedUp == false) {
            this.isContigencyPoppedUp = true;
        }
    };
    MinutesComponent.prototype.selectContigencyItem = function (e, contigencyItem) {
        this.selectedProtocolContingencyCode = contigencyItem.protocolContingencyCode;
        if (this.isContigencyPoppedUp == true) {
            this.isContigencyPoppedUp = false;
        }
        this.entryDescription = contigencyItem.description;
    };
    MinutesComponent.prototype.generateAttendance = function () {
        var _this = this;
        if (this.entryDescription != "") {
            this.isMandatoryFilled = false;
            this.minuteValidationMessage = "* Attendance already generated.";
        }
        else {
            this.attendances = this.result.committeeSchedule.committeeScheduleAttendances;
            if (this.attendances.length > 0) {
                this.attendances.forEach(function (value, index) {
                    if (value.memberPresent == true) {
                        if (value.guestFlag == true) {
                            _this.entryDescription = _this.entryDescription + value.personName + " Guest" + "\n";
                        }
                        else if (value.alternateFlag == true) {
                            _this.entryDescription = _this.entryDescription + value.personName + " Alternate for" + value.alternateFor + "\n";
                        }
                        else {
                            _this.entryDescription = _this.entryDescription + value.personName + "\n";
                        }
                    }
                });
            }
            else {
                this.entryDescription = "";
            }
        }
        if (this.entryDescription == "") {
            this.isMandatoryFilled = false;
            this.minuteValidationMessage = "* No one present to generate attendace.";
        }
    };
    MinutesComponent.prototype.saveMinutes = function () {
        var _this = this;
        if (this.result.newCommitteeScheduleMinute == null) {
            this.result.newCommitteeScheduleMinute = {};
        }
        switch (this.selectedOptionEntityType) {
            case '1':
                this.isMandatoryFilled = this.entryDescription == "" ? false : true;
                break;
            case '2':
                this.isMandatoryFilled = this.entryDescription == "" ? false : true;
                break;
            case '3':
                this.contingencyList.forEach(function (value, index) {
                    if (value.protocolContingencyCode == _this.selectedProtocolContingencyCode) {
                        _this.result.newCommitteeScheduleMinute.protocolContingency = value;
                    }
                });
                this.isMandatoryFilled = (this.selectedProtocol == 'Select' || this.selectedProtocol == null || this.entryDescription == "") ? false : true;
                break;
            case '4':
                this.isMandatoryFilled = ((this.selectedOtherBusItem == ('Select' || null)) || this.entryDescription == "") ? false : true;
                break;
            case '5':
                this.isMandatoryFilled = this.entryDescription == "" ? false : true;
                break;
            case '6':
                this.contingencyList.forEach(function (value, index) {
                    if (value.protocolContingencyCode == _this.selectedProtocolContingencyCode) {
                        _this.result.newCommitteeScheduleMinute.protocolContingency = value;
                    }
                });
                this.isMandatoryFilled = (this.selectedProtocol == 'Select' || this.selectedProtocol == null || this.entryDescription == "") ? false : true;
                break;
        }
        this.entityType.forEach(function (value, index) {
            if (value.minuteEntryTypecode == _this.selectedOptionEntityType) {
                _this.result.newCommitteeScheduleMinute.minuteEntrytype = value;
            }
        });
        this.result.scheduleId = this.result.committeeSchedule.scheduleId;
        this.result.newCommitteeScheduleMinute.minuteEntryTypeCode = parseInt(this.selectedOptionEntityType);
        this.result.newCommitteeScheduleMinute.protocolContingencyCode = this.selectedProtocolContingencyCode;
        if (this.selectedProtocol == 'Select') {
            this.selectedProtocol = null;
        }
        this.result.committeeId = this.result.committeeSchedule.committeeId;
        this.result.newCommitteeScheduleMinute.protocolNumber = this.selectedProtocol;
        this.result.newCommitteeScheduleMinute.commScheduleActItemsId = this.selectedOtherBusItem.commScheduleActItemsId;
        this.result.newCommitteeScheduleMinute.privateCommentFlag = this.privateCommentFlag;
        this.result.newCommitteeScheduleMinute.finalFlag = this.finalFlag;
        this.result.newCommitteeScheduleMinute.minuteEntry = this.entryDescription;
        this.result.newCommitteeScheduleMinute.createUser = localStorage.getItem('currentUser');
        this.result.newCommitteeScheduleMinute.updateUser = localStorage.getItem('currentUser');
        this.result.newCommitteeScheduleMinute.createTimestamp = new Date();
        this.result.newCommitteeScheduleMinute.updateTimestamp = new Date();
        if (this.isMandatoryFilled == true) {
            this.minutesService.saveMinuteData(this.result).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
            });
            this.scheduleConfigurationService.changeMinutesEditFlag(false);
            this.initialLoad();
        }
    };
    MinutesComponent.prototype.saveAndNew = function () {
        this.saveMinutes();
    };
    MinutesComponent.prototype.saveAndClose = function () {
        this.saveMinutes();
        if (this.isMinuteEntryPoppedUp == true && this.isMandatoryFilled == true) {
            this.isMinuteEntryPoppedUp = false;
        }
    };
    MinutesComponent.prototype.editMinuteItem = function (e, i, minuteItem) {
        e.preventDefault();
        this.isEditMinuteItem[i] = !this.isEditMinuteItem[i];
        this.entryDescriptionOnEdit = minuteItem.minuteEntry;
        this.scheduleConfigurationService.changeMinutesEditFlag(true);
    };
    MinutesComponent.prototype.showDeleteModal = function (e, i, minuteItem, committeeId, scheduleId) {
        e.preventDefault();
        this.isToDelete = true;
        this.minuteListItem = minuteItem;
        this.committeeId = committeeId;
        this.scheduleId = scheduleId;
    };
    MinutesComponent.prototype.deleteMinuteItem = function (e) {
        var _this = this;
        e.preventDefault();
        var deleteRequestData = {};
        deleteRequestData.committeeId = this.committeeId;
        deleteRequestData.scheduleId = this.scheduleId;
        deleteRequestData.commScheduleMinuteId = this.minuteListItem.commScheduleMinutesId;
        if (this.isToDelete == true) {
            this.isToDelete = false;
        }
        this.minutesService.deleteMinuteData(deleteRequestData).takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data || [];
        });
        this.initialLoad();
    };
    MinutesComponent.prototype.updateMinuteItem = function (i, minuteItem) {
        var _this = this;
        this.isEditMinuteItem[i] = !this.isEditMinuteItem[i];
        this.minuteItem = minuteItem;
        this.scheduleConfigurationService.changeMinutesEditFlag(false);
        if (minuteItem.minuteEntry != "") {
            this.result.newCommitteeScheduleMinute = minuteItem;
            this.result.committeeId = this.result.committeeSchedule.committeeId;
            this.result.scheduleId = this.result.committeeSchedule.scheduleId;
            this.result.newCommitteeScheduleMinute.updateTimestamp = new Date();
            this.result.newCommitteeScheduleMinute.updateUser = localStorage.getItem('currentUser');
            this.minutesService.updateMinuteData(this.result).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
            });
            this.initialLoad();
        }
    };
    MinutesComponent.prototype.cancelEditMinuteItem = function (e, i, minuteItem) {
        e.preventDefault();
        this.isEditMinuteItem[i] = !this.isEditMinuteItem[i];
        minuteItem.minuteEntry = this.entryDescriptionOnEdit;
        this.scheduleConfigurationService.changeMinutesEditFlag(false);
    };
    MinutesComponent = __decorate([
        Component({
            selector: 'app-minutes',
            templateUrl: './minutes.component.html',
            styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [ScheduleConfigurationService, MinutesService])
    ], MinutesComponent);
    return MinutesComponent;
}());
export { MinutesComponent };
//# sourceMappingURL=minutes.component.js.map