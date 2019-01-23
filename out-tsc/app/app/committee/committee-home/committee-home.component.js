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
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommitteeSaveService } from '../committee-save.service';
import { CompleterService } from 'ng2-completer';
import { CommitteeConfigurationService } from '../../common/committee-configuration.service';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
var CommitteeHomeComponent = (function () {
    function CommitteeHomeComponent(route, datePipe, router, completerService, committeeSaveService, committeeConfigurationService) {
        var _this = this;
        this.route = route;
        this.datePipe = datePipe;
        this.router = router;
        this.completerService = completerService;
        this.committeeSaveService = committeeSaveService;
        this.committeeConfigurationService = committeeConfigurationService;
        this.addResearch = false;
        this.editDetails = false;
        this.editResearch = false;
        this.deleteResearch = false;
        this.showSaveAreaOfResearch = false;
        this.error = '';
        this.addArea = '';
        this.areaOfReasearch = [];
        this.areaInput = {};
        this.slNo = 0;
        this.researchArea = {};
        this.dataServiceArea = [];
        this.areaList = [];
        this.result = {};
        this.resultTemp = {};
        this.showPopup = false;
        this.deleteConfirmation = false;
        this.areaOfResearchToDelete = {};
        this.duplicateIdFlag = false;
        this.emptyAreaOfResearch = false;
        this.duplicateAreaOfResearch = false;
        this.deleteMsg = '';
        this.alertMsg = '';
        this.showGenerateSchedule = false;
        this.committeeData = {};
        this.scheduleData = {};
        this.optionDay = 'XDAY';
        this.currentScheduleTab = 'DAILY';
        this.editSchedule = {};
        this.editScheduleClass = 'committeeBoxNotEditable';
        this.showConflictDates = false;
        this.dayOptions = [
            { name: 'Sunday', value: 'Sunday', checked: false },
            { name: 'Monday', value: 'Monday', checked: false },
            { name: 'Tuesday', value: 'Tuesday', checked: false },
            { name: 'Wednesday', value: 'Wednesday', checked: false },
            { name: 'Thursday', value: 'Thursday', checked: false },
            { name: 'Friday', value: 'Friday', checked: false },
            { name: 'Saturday', value: 'Saturday', checked: false }
        ];
        this.selectedMonthWeek = [
            { name: 'First', value: 'first' },
            { name: 'Second', value: 'second' },
            { name: 'Third', value: 'third' },
            { name: 'Fourth', value: 'fourth' },
            { name: 'Last', value: 'last' }
        ];
        this.yearMonthOptions = [
            { name: 'January', value: 'JANUARY' },
            { name: 'February', value: 'FEBRUARY' },
            { name: 'March', value: 'MARCH' },
            { name: 'April', value: 'APRIL' },
            { name: 'May', value: 'MAY' },
            { name: 'June', value: 'JUNE' },
            { name: 'July', value: 'JULY' },
            { name: 'August', value: 'AUGUST' },
            { name: 'September', value: 'SEPTEMBER' },
            { name: 'October', value: 'OCTOBER' },
            { name: 'November', value: 'NOVEMBER' },
            { name: 'December', value: 'DECEMBER' }
        ];
        this.monthOptionDay = 'XDAYANDXMONTH';
        this.day = 1;
        this.option1Month = 1;
        this.yearOption = 'XDAY';
        this.isTodelete = false;
        this.isConflictDates = false;
        this.isMandatoryFilled = true;
        this.conflictDates = [];
        this.isDatePrevious = true;
        this.isStartDateBeforeToday = false;
        this.displayTime = {};
        this.isMandatoryFilterFilled = true;
        this.isFilterDatePrevious = true;
        this.isScheduleListItemEditMode = false;
        this.saveCommitteeFlag = false;
        this.isAreaOfResearchEditMode = false;
        this.isEditDetailsModalOpen = false;
        this.isScheduleEditWarningModalOpen = false;
        this.onDestroy$ = new Subject();
        this.committeeConfigurationService.currentMode.takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.mode = data;
        }, function (error) { }, function () {
        });
        this.resultTemp = {};
        this.resultTemp.committee = {};
        this.loadTempData();
        this.initialLoadChild();
    }
    CommitteeHomeComponent.prototype.loadTempData = function () {
        var _this = this;
        this.committeeConfigurationService.currentCommitteeData.takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.resultTemp = data;
            if (_this.resultTemp.committee !== undefined) {
                _this.name = _this.resultTemp.committee.committeeName;
                _this.unit = _this.resultTemp.committee.homeUnitNumber;
                _this.unitname = _this.resultTemp.committee.homeUnitName;
                _this.Id = _this.resultTemp.committee.committeeId;
                _this.Name = _this.resultTemp.committee.committeeName;
                _this.Type = _this.resultTemp.committee.committeeType.description;
                _this.Unit = _this.resultTemp.committee.homeUnitNumber;
                _this.unitName = _this.resultTemp.committee.homeUnitName;
                _this.reviewTypes = _this.resultTemp.reviewTypes;
                _this.committeeConfigurationService.currentAreaOfResearch.subscribe(function (data) {
                    _this.areaList = data;
                });
                _this.scheduleStatus = _this.resultTemp.scheduleStatus;
            }
        });
    };
    CommitteeHomeComponent.prototype.ngOnInit = function () {
    };
    CommitteeHomeComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    CommitteeHomeComponent.prototype.initialLoadChild = function () {
        var _this = this;
        this.committeeConfigurationService.currentCommitteeData.takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
            if (_this.result.committee !== undefined) {
                if (_this.result.committee == null || _this.result.committee == undefined) {
                    _this.result.committee = {};
                }
                if (_this.result.committee.committeeSchedules == null || _this.result.committee.committeeSchedules == undefined) {
                    _this.result.committee.committeeSchedules = [];
                }
                if (_this.result.scheduleData == null || _this.result.scheduleData == undefined) {
                    _this.result.scheduleData = {};
                    _this.result.scheduleData.time = {};
                    _this.result.scheduleData.dailySchedule = {};
                    _this.result.scheduleData.datesInConflict = [];
                    _this.result.scheduleData.weeklySchedule = {};
                    _this.result.scheduleData.monthlySchedule = {};
                    _this.result.scheduleData.yearlySchedule = {};
                    _this.result.committee.committeeSchedules.scheduleStatus = {};
                    _this.result.scheduleData.recurrenceType = 'DAILY';
                    if (_this.optionDay == 'XDAY') {
                        _this.result.scheduleData.dailySchedule.day = 1;
                    }
                }
                if (_this.mode == 'view') {
                    _this.errorFlag = false;
                    _this.editDetails = false;
                    _this.committeeConfigurationService.changeEditFlag(_this.editDetails);
                    _this.Id = _this.result.committee.committeeId;
                    _this.Name = _this.result.committee.committeeName;
                    _this.unitName = _this.result.committee.homeUnitName;
                    _this.Unit = _this.result.committee.homeUnitNumber;
                    _this.editClass = 'committeeBoxNotEditable';
                    _this.editAreaClass = 'committeeBoxNotEditable';
                    _this.reviewType = _this.result.committee.reviewTypeDescription;
                    _this.description = _this.result.committee.description;
                    _this.minMembers = _this.result.committee.minimumMembersRequired;
                    _this.advSubDays = _this.result.committee.advSubmissionDaysReq;
                    _this.maxProtocols = _this.result.committee.maxProtocols;
                    _this.saveCommitteeFlag = true;
                }
                else {
                    _this.editClass = 'scheduleBoxes';
                    _this.editAreaClass = 'scheduleBoxes';
                    _this.editDetails = true;
                    _this.Id = _this.result.committee.committeeId;
                }
            }
        });
    };
    CommitteeHomeComponent.prototype.showaddAreaOfResearch = function () {
        if (this.editDetails == true) {
            this.isEditDetailsModalOpen = true;
        }
        if (this.saveCommitteeFlag) {
            this.addResearch = !this.addResearch;
            this.editResearch = !this.editResearch;
            if (this.editResearch) {
                this.editAreaClass = 'scheduleBoxes';
            }
        }
    };
    CommitteeHomeComponent.prototype.closeEditDetailsModalOpen = function () {
        this.isEditDetailsModalOpen = false;
        this.showGenerateSchedule = false;
        this.deleteConfirmation = false;
    };
    CommitteeHomeComponent.prototype.showEditDetails = function () {
        this.editDetails = !this.editDetails;
        this.saveCommitteeFlag = false;
        if (this.editDetails) {
            this.editClass = 'scheduleBoxes';
        }
        this.committeeConfigurationService.changeEditFlag(this.editDetails);
    };
    CommitteeHomeComponent.prototype.saveDetails = function (dataObject) {
        var _this = this;
        if (dataObject !== undefined) {
            this.result = dataObject.result;
            this.committeeConfigurationService.changeCommmitteeData(this.result);
        }
        if ((this.result.committee.minimumMembersRequired == undefined || this.result.committee.advSubmissionDaysReq == undefined || this.result.committee.maxProtocols == undefined || this.Type == undefined || this.Name == undefined || this.unitName == undefined || this.unitName == '') || (this.result.committee.reviewTypeDescription == 'Select' || this.result.committee.reviewTypeDescription == '')) {
            this.errorFlag = true;
            this.error = '*Please fill all the mandatory fields marked';
        }
        else {
            this.isEditDetailsModalOpen = false;
            this.showGenerateSchedule = false;
            this.deleteConfirmation = false;
            this.error = '';
            this.errorFlag = false;
            this.committeeConfigurationService.changeCommmitteeData(this.result);
            this.committeeConfigurationService.currentCommitteeData.takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data;
            });
            if (this.mode == 'create') {
                this.result.updateType = 'SAVE';
                this.result.committee.committeeType.committeeTypeCode = '1';
                this.result.committee.createUser = localStorage.getItem("currentUser");
                this.result.committee.createTimestamp = new Date().getTime();
                this.result.committee.updateUser = localStorage.getItem("currentUser");
                this.result.committee.updateTimestamp = new Date().getTime();
            }
            else if (this.mode == 'view') {
                this.result.updateType = 'UPDATE';
                this.result.committee.updateUser = localStorage.getItem("currentUser");
                this.result.committee.updateTimestamp = new Date().getTime();
            }
            this.result.currentUser = localStorage.getItem("currentUser");
            if (this.editDetails == false) {
                this.editClass = 'committeeBoxNotEditable';
            }
            this.reviewTypes.forEach(function (value, index) {
                if (value.description == _this.result.committee.reviewTypeDescription) {
                    _this.result.committee.applicableReviewTypecode = value.reviewTypeCode;
                    _this.result.committee.reviewTypeDescription = value.description;
                }
            });
            this.committeeSaveService.saveCommitteeData(this.result).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
                if (_this.result != null) {
                    _this.committeeConfigurationService.changeCommmitteeData(_this.result);
                    _this.saveCommitteeFlag = true;
                    if (_this.mode == 'view') {
                        _this.initialLoadChild();
                    }
                    else {
                        _this.editDetails = !_this.editDetails;
                        _this.committeeConfigurationService.changeEditFlag(_this.editDetails);
                        _this.mode = 'view';
                        _this.initialLoadChild();
                        _this.committeeConfigurationService.changeMode(_this.mode);
                    }
                }
                _this.committeeConfigurationService.currentactivatedTab.subscribe(function (data) {
                    if (data === 'committee_members') {
                        _this.router.navigate(['/committee/committeeMembers'], { queryParams: { 'mode': _this.mode, 'id': _this.Id } });
                    }
                });
            });
        }
    };
    CommitteeHomeComponent.prototype.duplicateId = function () {
        this.clear();
    };
    CommitteeHomeComponent.prototype.cancelEditDetails = function () {
        this.errorFlag = false;
        this.isEditDetailsModalOpen = false;
        this.showGenerateSchedule = false;
        if (this.mode == 'view') {
            this.editDetails = !this.editDetails;
            this.committeeConfigurationService.changeEditFlag(this.editDetails);
            if (!this.editDetails) {
                this.editClass = 'committeeBoxNotEditable';
            }
            this.saveCommitteeFlag = true;
            this.result.committee.committeeId = this.Id;
            this.result.committee.committeeType.description = 'IRB';
            this.result.committee.committeeName = this.name;
            this.result.committee.homeUnitName = this.unitname;
            this.result.committee.homeUnitNumber = this.unit;
            this.result.committee.reviewTypeDescription = this.reviewType;
            this.result.committee.description = this.description;
            this.result.committee.minimumMembersRequired = this.minMembers;
            this.result.committee.advSubmissionDaysReq = this.advSubDays;
            this.result.committee.maxProtocols = this.maxProtocols;
        }
        else {
            this.result.committee.committeeType.description = '';
            this.result.committee.committeeName = '';
            this.result.committee.homeUnitName = '';
            this.result.committee.reviewTypeDescription = '';
            this.result.committee.description = '';
            this.result.committee.minimumMembersRequired = '';
            this.result.committee.advSubmissionDaysReq = '';
            this.result.committee.maxProtocols = '';
            this.router.navigate(['/committee'], { queryParams: { mode: 'create' } });
        }
    };
    CommitteeHomeComponent.prototype.addAreaOfResearch = function (Object) {
        var _this = this;
        this.showSaveAreaOfResearch = true;
        this.addResearchArea = '0';
        this.editAreaClass = 'committeeBoxNotEditable';
        for (var i = 0; i < this.result.committee.researchAreas.length; i++) {
            if (Object.researchAreaCode == this.result.committee.researchAreas[i].researchAreaCode) {
                this.addResearchArea = '1';
            }
        }
        if (this.addResearchArea == '1') {
            this.showPopup = true;
            this.duplicateAreaOfResearch = true;
            this.alertMsg = 'Cannot add  Research area since it is already there in the committee!';
        }
        else if (Object.researchAreaDescription == '' || Object.researchAreaDescription == undefined) {
            this.showPopup = true;
            this.emptyAreaOfResearch = true;
            this.alertMsg = 'Please select an Area of research to add!';
        }
        else {
            this.committeeSaveService.saveResearchAreaCommitteeData(this.result.committee.committeeId, Object).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
                _this.committeeConfigurationService.changeCommmitteeData(_this.result);
            });
            this.initialLoadChild();
            this.deleteResearch = false;
        }
        this.areaInput = {};
    };
    CommitteeHomeComponent.prototype.showEditResearch = function () {
        this.editResearch = !this.editResearch;
        if (this.editResearch) {
            this.editAreaClass = 'scheduleBoxes';
        }
    };
    CommitteeHomeComponent.prototype.areaChangeFunction = function (researchAreaDescription) {
    };
    CommitteeHomeComponent.prototype.onAreaSelect = function () {
        var _this = this;
        this.areaList._data.forEach(function (value, index) {
            if (value.description == _this.areaInput.researchAreaDescription) {
                _this.areaInput.researchAreaCode = value.researchAreaCode;
                _this.areaInput.researchAreaDescription = value.description;
                _this.areaInput.updateUser = localStorage.getItem("currentUser");
                _this.areaInput.updateTimestamp = new Date().getTime();
            }
        });
    };
    CommitteeHomeComponent.prototype.deleteAreaOfResearchConfirmation = function ($event, Object) {
        event.preventDefault();
        if (this.editDetails == true) {
            this.isEditDetailsModalOpen = true;
        }
        else {
            this.showPopup = true;
            this.deleteConfirmation = true;
            this.areaOfResearchToDelete = Object;
            this.deleteMsg = 'Are you sure you want to delete this area of research ..?';
        }
    };
    CommitteeHomeComponent.prototype.clear = function () {
        this.showPopup = false;
        this.deleteConfirmation = false;
        this.duplicateIdFlag = false;
        this.deleteMsg = '';
        this.alertMsg = '';
        this.duplicateAreaOfResearch = false;
        this.emptyAreaOfResearch = false;
    };
    CommitteeHomeComponent.prototype.deleteAreaOfResearch = function (Object) {
        var _this = this;
        if (this.result.committee.researchAreas.length != null && Object.commResearchAreasId != undefined) {
            this.committeeSaveService.deleteAreaOfResearch(Object.commResearchAreasId, this.result.committee.committeeId).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
                _this.committeeConfigurationService.changeCommmitteeData(_this.result);
            });
        }
        else if (Object.commResearchAreasId == undefined || Object.commResearchAreasId == null) {
            this.result.committee.researchAreas.forEach(function (value, index) {
                if (value.researchAreaCode == Object.researchAreaCode) {
                    _this.result.committee.researchAreas.splice(index, 1);
                }
            });
        }
        this.clear();
        this.initialLoadChild();
        this.deleteResearch = true;
    };
    CommitteeHomeComponent.prototype.showSchedulePopUp = function () {
        if (this.editDetails == true) {
            this.isEditDetailsModalOpen = true;
        }
        else {
            if (this.showGenerateSchedule == false) {
                this.showGenerateSchedule = true;
            }
            var q = new Date();
            var m = q.getMonth();
            var d = q.getDate();
            var y = q.getFullYear();
            this.today = new Date(y, m, d);
            this.result.scheduleData = {};
            this.result.scheduleData.time = {};
            this.result.scheduleData.dailySchedule = {};
            this.result.scheduleData.weeklySchedule = {};
            this.result.scheduleData.monthlySchedule = {};
            this.result.scheduleData.yearlySchedule = {};
            this.result.scheduleData.scheduleStartDate = this.today;
            this.result.scheduleData.dailySchedule.scheduleEndDate = this.today;
            this.result.scheduleData.weeklySchedule.scheduleEndDate = this.today;
            this.result.scheduleData.monthlySchedule.scheduleEndDate = this.today;
            this.result.scheduleData.yearlySchedule.scheduleEndDate = this.today;
            this.result.scheduleData.recurrenceType = 'DAILY';
            this.result.scheduleData.dailySchedule.day = 1;
            this.displayTime = null;
            this.isDatePrevious = false;
            this.isMandatoryFilled = true;
            this.isStartDateBeforeToday = false;
            this.optionDay = 'XDAY';
        }
    };
    CommitteeHomeComponent.prototype.showTab = function (recurrenceType) {
        this.result.scheduleData.recurrenceType = recurrenceType;
        switch (this.result.scheduleData.recurrenceType) {
            case 'WEEKLY':
                this.result.scheduleData.weeklySchedule.week = 1;
                break;
            case 'MONTHLY':
                this.monthOptionDay = 'XDAYANDXMONTH';
                this.result.scheduleData.monthlySchedule.day = 1;
                this.result.scheduleData.monthlySchedule.option1Month = 1;
                this.result.scheduleData.monthlySchedule.selectedMonthsWeek = "";
                this.result.scheduleData.monthlySchedule.selectedDayOfWeek = "";
                this.result.scheduleData.monthlySchedule.option2Month = null;
                break;
            case 'YEARLY':
                this.yearOption = 'XDAY';
                this.result.scheduleData.yearlySchedule.day = 1;
                this.result.scheduleData.yearlySchedule.option1Year = 1;
                this.result.scheduleData.yearlySchedule.option2Year = null;
                break;
        }
    };
    CommitteeHomeComponent.prototype.sentDayOption = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.optionDay == 'XDAY') {
                _this.result.scheduleData.dailySchedule.day = 1;
            }
            else {
                _this.result.scheduleData.dailySchedule.day = "";
            }
        }, 100);
    };
    CommitteeHomeComponent.prototype.sentMonthOption = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.monthOptionDay == 'XDAYANDXMONTH') {
                _this.result.scheduleData.monthlySchedule.day = 1;
                _this.result.scheduleData.monthlySchedule.option1Month = 1;
                _this.result.scheduleData.monthlySchedule.selectedMonthsWeek = "";
                _this.result.scheduleData.monthlySchedule.selectedDayOfWeek = "";
                _this.result.scheduleData.monthlySchedule.option2Month = null;
            }
            else {
                _this.result.scheduleData.monthlySchedule.day = null;
                _this.result.scheduleData.monthlySchedule.option1Month = null;
                _this.result.scheduleData.monthlySchedule.option2Month = 1;
            }
        }, 100);
    };
    CommitteeHomeComponent.prototype.sentYearOption = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.yearOption == 'XDAY') {
                _this.result.scheduleData.yearlySchedule.day = 1;
                _this.result.scheduleData.yearlySchedule.option1Year = 1;
                _this.result.scheduleData.yearlySchedule.option2Year = null;
            }
            else {
                _this.result.scheduleData.yearlySchedule.day = null;
                _this.result.scheduleData.yearlySchedule.option1Year = null;
                _this.result.scheduleData.yearlySchedule.option2Year = 1;
            }
        }, 100);
    };
    CommitteeHomeComponent.prototype.generateSchedule = function (e) {
        var _this = this;
        e.preventDefault();
        this.result.scheduleData.time.time = this.datePipe.transform(this.displayTime, 'hh:mm');
        this.result.scheduleData.time.meridiem = this.datePipe.transform(this.displayTime, 'aa');
        this.sendScheduleRequestData = {};
        this.sendScheduleRequestData.scheduleData = {};
        this.sendScheduleRequestData.scheduleData.weeklySchedule = {};
        this.sendScheduleRequestData.scheduleData.monthlySchedule = {};
        this.sendScheduleRequestData.scheduleData.yearlySchedule = {};
        this.sendScheduleRequestData.currentUser = localStorage.getItem("currentUser");
        this.sendScheduleRequestData.committee = this.result.committee;
        if (this.result.scheduleData.scheduleStartDate < this.today) {
            this.isStartDateBeforeToday = true;
            this.scheduleValidationMessage = "* Please ensure start date is today or upcomming days";
        }
        else {
            this.isStartDateBeforeToday = false;
        }
        switch (this.result.scheduleData.recurrenceType) {
            case 'DAILY':
                this.result.scheduleData.dailySchedule.dayOption = this.optionDay;
                this.sendScheduleRequestData.scheduleData = this.result.scheduleData;
                if (this.result.scheduleData.scheduleStartDate > this.result.scheduleData.dailySchedule.scheduleEndDate) {
                    this.isDatePrevious = true;
                    this.scheduleValidationMessage = "* Please ensure the end date is after the start date";
                }
                else {
                    this.isDatePrevious = false;
                }
                if (this.result.scheduleData.scheduleStartDate == null || this.result.scheduleData.dailySchedule.scheduleEndDate == null || this.displayTime == null || this.result.scheduleData.place == null || this.result.scheduleData.place == "" || this.result.scheduleData.place == undefined) {
                    this.isMandatoryFilled = false;
                    this.scheduleValidationMessage = "* Please fill the mandatory fields.";
                }
                else {
                    this.isMandatoryFilled = true;
                }
                break;
            case 'WEEKLY':
                this.sendScheduleRequestData.scheduleData = this.result.scheduleData;
                this.sendScheduleRequestData.scheduleData.weeklySchedule.daysOfWeek = this.selectedOptions;
                if (this.result.scheduleData.scheduleStartDate > this.result.scheduleData.weeklySchedule.scheduleEndDate) {
                    this.isDatePrevious = true;
                    this.scheduleValidationMessage = "* Please ensure the end date is after the start date";
                }
                else {
                    this.isDatePrevious = false;
                }
                if (this.result.scheduleData.scheduleStartDate == null || this.result.scheduleData.weeklySchedule.scheduleEndDate == null || this.displayTime == null || this.result.scheduleData.place == null) {
                    this.isMandatoryFilled = false;
                    this.scheduleValidationMessage = "* Please fill the mandatory fields.";
                }
                else {
                    this.isMandatoryFilled = true;
                }
                break;
            case 'MONTHLY':
                this.sendScheduleRequestData.scheduleData = this.result.scheduleData;
                this.sendScheduleRequestData.scheduleData.monthlySchedule.monthOption = this.monthOptionDay;
                if (this.result.scheduleData.scheduleStartDate > this.result.scheduleData.monthlySchedule.scheduleEndDate) {
                    this.isDatePrevious = true;
                    this.scheduleValidationMessage = "* Please ensure the end date is after the start date";
                }
                else {
                    this.isDatePrevious = false;
                }
                if (this.result.scheduleData.scheduleStartDate == null || this.result.scheduleData.monthlySchedule.scheduleEndDate == null || this.displayTime == null || this.result.scheduleData.place == null) {
                    this.isMandatoryFilled = false;
                    this.scheduleValidationMessage = "* Please fill the mandatory fields.";
                }
                else {
                    this.isMandatoryFilled = true;
                }
                break;
            case 'YEARLY':
                this.sendScheduleRequestData.scheduleData = this.result.scheduleData;
                this.sendScheduleRequestData.scheduleData.yearlySchedule.yearOption = this.yearOption;
                if (this.result.scheduleData.scheduleStartDate > this.result.scheduleData.yearlySchedule.scheduleEndDate) {
                    this.isDatePrevious = true;
                    this.scheduleValidationMessage = "* Please ensure the end date is after the start date";
                }
                else {
                    this.isDatePrevious = false;
                }
                if (this.result.scheduleData.scheduleStartDate == null || this.result.scheduleData.yearlySchedule.scheduleEndDate == null || this.displayTime == null || this.result.scheduleData.place == null) {
                    this.isMandatoryFilled = false;
                    this.scheduleValidationMessage = "* Please fill the mandatory fields.";
                }
                else {
                    this.isMandatoryFilled = true;
                }
                break;
            case 'NEVER':
                this.sendScheduleRequestData.scheduleData = this.result.scheduleData;
                if (this.result.scheduleData.scheduleStartDate == null || this.displayTime == null || this.result.scheduleData.place == null) {
                    this.isMandatoryFilled = false;
                    this.scheduleValidationMessage = "* Please fill the mandatory fields.";
                }
                else {
                    this.isMandatoryFilled = true;
                }
                break;
        }
        if (this.isDatePrevious == false && this.isStartDateBeforeToday == false && this.isMandatoryFilled == true) {
            this.committeeSaveService.saveScheduleData(this.sendScheduleRequestData).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
                _this.filterStartDate = _this.result.scheduleData.filterStartDate;
                _this.conflictDates = _this.result.scheduleData.datesInConflict;
                _this.filerEndDate = _this.result.scheduleData.filerEndDate;
                _this.result.scheduleData = {};
                _this.result.scheduleData.time = {};
                _this.result.scheduleData.dailySchedule = {};
                _this.result.scheduleData.weeklySchedule = {};
                _this.result.scheduleData.monthlySchedule = {};
                _this.result.scheduleData.yearlySchedule = {};
                _this.result.scheduleData.filterStartDate = _this.filterStartDate;
                _this.result.scheduleData.filerEndDate = _this.filerEndDate;
                _this.showGenerateSchedule = false;
            });
        }
    };
    CommitteeHomeComponent.prototype.editScheduleData = function (e, date, status, place, time, i, scheduleId) {
        e.preventDefault();
        if (this.isScheduleListItemEditMode == true) {
            this.alertMsg = "You are editing a schedule data with serial number : " + (scheduleId);
            this.isScheduleEditWarningModalOpen = true;
        }
        else {
            this.alertMsg = "";
            this.isScheduleEditWarningModalOpen = false;
            this.isScheduleListItemEditMode = true;
            this.scheduleTime = new Date(time);
            this.editSchedule[i] = !this.editSchedule[i];
            this.listDate = date;
            this.listStatus = status;
            this.listPlace = place;
            this.listTime = time;
        }
    };
    CommitteeHomeComponent.prototype.showDeleteModal = function (e, scheduleId, committeeId, scheduledDate) {
        e.preventDefault();
        if (this.isScheduleListItemEditMode == true) {
            this.alertMsg = "You are editing a schedule data with serial number : " + (scheduleId);
            this.isScheduleEditWarningModalOpen = true;
        }
        else {
            this.alertMsg = "";
            this.isScheduleEditWarningModalOpen = false;
            this.scheduledDate = scheduledDate;
            this.scheduleId = scheduleId;
            this.committeeId = committeeId;
            if (this.isTodelete == false) {
                this.isTodelete = true;
            }
        }
    };
    CommitteeHomeComponent.prototype.closeConflictDateModal = function () {
        if (this.isConflictDates == true) {
            this.isConflictDates = false;
        }
    };
    CommitteeHomeComponent.prototype.deleteScheduleData = function () {
        var _this = this;
        this.sendScheduleRequestData = {};
        this.sendScheduleRequestData.scheduleId = this.scheduleId;
        this.sendScheduleRequestData.committeeId = this.committeeId;
        if (this.isTodelete == true) {
            this.isTodelete = false;
        }
        this.committeeSaveService.deleteScheduleData(this.sendScheduleRequestData).takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data || [];
            _this.committeeConfigurationService.changeCommmitteeData(_this.result);
        });
        this.initialLoadChild();
    };
    CommitteeHomeComponent.prototype.cancelDelete = function () {
        this.clear();
    };
    CommitteeHomeComponent.prototype.updateScheduleData = function (e, i, scheduleObject) {
        var _this = this;
        e.preventDefault();
        this.editSchedule[i] = !this.editSchedule[i];
        this.sendScheduleRequestData = {};
        scheduleObject.viewTime = {};
        scheduleObject.viewTime.time = this.datePipe.transform(this.scheduleTime, 'hh:mm');
        scheduleObject.viewTime.meridiem = this.datePipe.transform(this.scheduleTime, 'aa');
        scheduleObject.scheduleStatus.updateTimestamp = new Date();
        scheduleObject.scheduleStatus.updateUser = localStorage.getItem("currentUser");
        this.scheduleStatus.forEach(function (value, index) {
            if (value.description == scheduleObject.scheduleStatus.description) {
                value.updateTimestamp = new Date();
                value.updateUser = localStorage.getItem('currentUser');
                scheduleObject.scheduleStatusCode = value.scheduleStatusCode;
                scheduleObject.scheduleStatus = value;
                _this.result.committee.committeeSchedules[i].scheduleStatus.description = value.description;
            }
        });
        this.sendScheduleRequestData.committeeSchedule = scheduleObject;
        this.sendScheduleRequestData.committeeId = this.result.committee.committeeId;
        this.committeeSaveService.updateScheduleData(this.sendScheduleRequestData).takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data || [];
            _this.committeeConfigurationService.changeCommmitteeData(_this.result);
        });
        this.initialLoadChild();
        this.isScheduleListItemEditMode = false;
    };
    CommitteeHomeComponent.prototype.cancelEditSchedule = function (e, i) {
        e.preventDefault();
        this.editSchedule[i] = !this.editSchedule[i];
        this.isScheduleListItemEditMode = false;
        this.result.committee.committeeSchedules[i].scheduledDate = this.listDate;
        this.result.committee.committeeSchedules[i].scheduleStatus.description = this.listStatus;
        this.result.committee.committeeSchedules[i].time = this.listTime;
        this.result.committee.committeeSchedules[i].place = this.listPlace;
    };
    Object.defineProperty(CommitteeHomeComponent.prototype, "selectedOptions", {
        get: function () {
            return this.dayOptions
                .filter(function (option) { return option.checked; })
                .map(function (option) { return option.value; });
        },
        enumerable: true,
        configurable: true
    });
    CommitteeHomeComponent.prototype.filterSchedule = function () {
        var _this = this;
        if (this.result.scheduleData.filterStartDate > this.result.scheduleData.filerEndDate) {
            this.isFilterDatePrevious = true;
            this.filterValidationMessage = "* Please ensure that the To : Date is greater than or equal to the From : Date.";
        }
        else {
            this.isFilterDatePrevious = false;
        }
        if (this.result.scheduleData.filterStartDate == null || this.result.scheduleData.filerEndDate == null) {
            this.isMandatoryFilterFilled = false;
            this.filterValidationMessage = "* Please enter the necessary dates to apply filter.";
        }
        else {
            this.isMandatoryFilterFilled = true;
        }
        if (this.isMandatoryFilterFilled == true && this.isFilterDatePrevious == false) {
            this.sendScheduleRequestData = {};
            if (this.result.scheduleData == null || this.result.scheduleData == undefined) {
                this.sendScheduleRequestData.scheduleData = {};
            }
            else {
                this.sendScheduleRequestData.scheduleData = this.result.scheduleData;
            }
            this.sendScheduleRequestData.committee = this.result.committee;
            this.committeeSaveService.filterScheduleData(this.sendScheduleRequestData).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
                _this.committeeConfigurationService.changeCommmitteeData(_this.result);
            });
            this.initialLoadChild();
        }
    };
    CommitteeHomeComponent.prototype.resetFilterSchedule = function () {
        var _this = this;
        if (this.isFilterDatePrevious == true || this.isMandatoryFilterFilled == false) {
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
            this.result.scheduleData.filterStartDate = null;
            this.result.scheduleData.filerEndDate = null;
        }
        else if (this.result.scheduleData.filterStartDate == null || this.result.scheduleData.filerEndDate == null) {
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
        }
        else {
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
            this.sendScheduleRequestData = {};
            this.sendScheduleRequestData.scheduleData = {};
            this.sendScheduleRequestData.committee = this.result.committee;
            this.committeeSaveService.resetFilterSchedule(this.sendScheduleRequestData).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
                _this.committeeConfigurationService.changeCommmitteeData(_this.result);
                _this.result.scheduleData.filterStartDate = null;
                _this.result.scheduleData.filerEndDate = null;
            });
            this.initialLoadChild();
        }
    };
    CommitteeHomeComponent.prototype.cancelEditScheduleItem = function () {
        this.isScheduleEditWarningModalOpen = !this.isScheduleEditWarningModalOpen;
        this.isTodelete = false;
    };
    CommitteeHomeComponent.prototype.loadSchedules = function (event, scheduleId) {
        event.preventDefault();
        this.router.navigate(['committee/schedule'], { queryParams: { 'scheduleId': scheduleId } });
    };
    CommitteeHomeComponent = __decorate([
        Component({
            selector: 'app-committee-home',
            templateUrl: './committee-home.component.html',
            providers: [CommitteeSaveService],
            styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
        }),
        __metadata("design:paramtypes", [ActivatedRoute, DatePipe, Router, CompleterService, CommitteeSaveService, CommitteeConfigurationService])
    ], CommitteeHomeComponent);
    return CommitteeHomeComponent;
}());
export { CommitteeHomeComponent };
//# sourceMappingURL=committee-home.component.js.map