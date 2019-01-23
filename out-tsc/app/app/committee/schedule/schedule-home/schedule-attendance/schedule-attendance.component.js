var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ScheduleConfigurationService } from "../../schedule-configuration.service";
import { CommitteeMemberNonEmployeeElasticService } from "../../../../elastic-search/committee-members-nonEmployee-elastic-search.service";
import { CommitteeMemberEmployeeElasticService } from "../../../../elastic-search/committee-members-employees-elastic-search.service";
import { ScheduleAttendanceService } from "./schedule-attendance.service";
import 'rxjs/add/operator/takeUntil';
var ScheduleAttendanceComponent = (function () {
    function ScheduleAttendanceComponent(scheduleConfigurationService, committeeMemberNonEmployeeElasticService, _ngZone, committeeMemberEmployeeElasticService, scheduleAttendanceService, activatedRoute) {
        this.scheduleConfigurationService = scheduleConfigurationService;
        this.committeeMemberNonEmployeeElasticService = committeeMemberNonEmployeeElasticService;
        this._ngZone = _ngZone;
        this.committeeMemberEmployeeElasticService = committeeMemberEmployeeElasticService;
        this.scheduleAttendanceService = scheduleAttendanceService;
        this.activatedRoute = activatedRoute;
        this.result = {};
        this.showCommentFlag = false;
        this.presentFlag = false;
        this.searchText = new FormControl('');
        this.nonEmployeeFlag = false;
        this.showAddMember = false;
        this.onDestroy$ = new Subject();
        this.elasticSearchresults = [];
        this._results = new Subject();
        this.activeMembers = true;
        this.searchActive = false;
        this.iconClass = 'fa fa-search';
        this.selectedMember = {};
        this.guestMemberObj = {};
        this.updatingMemberObj = {};
        this.attendanceShowFlag = false;
        this.editFlagEnabled = {};
        this.commentFlgEnabled = {};
        this.placeHolderText = 'Search an employee';
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.currentUser = localStorage.getItem('currentUser');
    }
    ScheduleAttendanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scheduleConfigurationService.currentScheduleData.subscribe(function (data) {
            _this.result = data;
        });
    };
    ScheduleAttendanceComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    ScheduleAttendanceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.searchText
            .valueChanges
            .map(function (text) { return text ? text.trim() : ''; })
            .do(function (searchString) { return searchString ? _this.message = 'searching...' : _this.message = ''; })
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap(function (searchString) {
            return new Promise(function (resolve, reject) {
                if (_this.nonEmployeeFlag == false) {
                    _this._ngZone.runOutsideAngular(function () {
                        _this.committeeMemberEmployeeElasticService.search(searchString)
                            .then(function (searchResult) {
                            _this.elasticSearchresults = [];
                            _this._ngZone.run(function () {
                                _this.hits_source = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit._source; });
                                _this.hits_highlight = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit.highlight; });
                                _this.hits_source.forEach(function (elmnt, j) {
                                    _this.prncpl_id = _this.hits_source[j].prncpl_id;
                                    _this.full_name = _this.hits_source[j].full_name;
                                    _this.prncpl_nm = _this.hits_source[j].prncpl_nm;
                                    _this.email_addr = _this.hits_source[j].email_addr;
                                    _this.unit_number = _this.hits_source[j].unit_number;
                                    _this.unit_name = _this.hits_source[j].unit_name;
                                    _this.addr_line_1 = _this.hits_source[j].addr_line_1;
                                    _this.phone_nbr = _this.hits_source[j].phone_nbr;
                                    _this.elasticSearchresults.push({
                                        label: _this.full_name,
                                        id: _this.prncpl_id
                                    });
                                });
                                if (_this.elasticSearchresults.length > 0) {
                                }
                                else {
                                    if (_this.searchTextModel && _this.searchTextModel.trim()) {
                                        _this.message = '';
                                    }
                                }
                                resolve(_this.elasticSearchresults);
                            });
                        })
                            .catch(function (error) {
                            alert("catch error");
                        });
                    });
                }
                if (_this.nonEmployeeFlag == true) {
                    _this._ngZone.runOutsideAngular(function () {
                        _this.committeeMemberNonEmployeeElasticService.search(searchString)
                            .then(function (searchResult) {
                            _this._ngZone.run(function () {
                                _this.hits_source = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit._source; });
                                _this.hits_highlight = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit.highlight; });
                                _this.hits_source.forEach(function (elmnt, j) {
                                    _this.rolodexId = _this.hits_source[j].rolodex_id;
                                    _this.first_name = _this.hits_source[j].first_name;
                                    _this.middle_name = _this.hits_source[j].middle_name;
                                    _this.last_name = _this.hits_source[j].last_name;
                                    _this.organization = _this.hits_source[j].organization;
                                    _this.elasticSearchresults.push({
                                        label: _this.first_name + '  ' + _this.middle_name
                                            + '  ' + _this.last_name,
                                        id: _this.rolodexId
                                    });
                                });
                                if (_this.elasticSearchresults.length > 0) {
                                    _this.message = '';
                                }
                                else {
                                    if (_this.searchTextModel && _this.searchTextModel.trim()) {
                                        _this.message = '';
                                    }
                                }
                                resolve(_this.elasticSearchresults);
                            });
                        })
                            .catch(function (error) { });
                    });
                }
            });
        }).catch(this.handleError)
            .takeUntil(this.onDestroy$).subscribe(this._results);
    };
    ScheduleAttendanceComponent.prototype.handleError = function () {
        this.message = 'something went wrong';
    };
    ScheduleAttendanceComponent.prototype.employeeRadioChecked = function () {
        this.nonEmployeeFlag = false;
        this.searchTextModel = '';
        this.placeHolderText = 'Search an employee';
    };
    ScheduleAttendanceComponent.prototype.nonEmployeeRadioChecked = function () {
        this.nonEmployeeFlag = true;
        this.searchTextModel = '';
        this.placeHolderText = 'Search a non-employee';
    };
    ScheduleAttendanceComponent.prototype.clearsearchBox = function (e) {
        e.preventDefault();
        this.searchTextModel = '';
    };
    ScheduleAttendanceComponent.prototype.addMember = function () {
        var _this = this;
        this.searchTextModel = '';
        this.guestMemberObj.alternateFlag = false;
        this.guestMemberObj.alternateFor = '';
        this.guestMemberObj.comments = null;
        this.guestMemberObj.guestFlag = true;
        this.guestMemberObj.guestMemberActive = true;
        this.guestMemberObj.memberPresent = false;
        this.guestMemberObj.nonEmployeeFlag = this.nonEmployeeFlag;
        this.guestMemberObj.personId = this.selectedMember.id;
        this.guestMemberObj.personName = this.selectedMember.label;
        this.guestMemberObj.roleName = '';
        this.guestMemberObj.updateTimestamp = new Date().getTime();
        this.guestMemberObj.updateUser = this.currentUser;
        this.scheduleAttendanceService.addGuestMember(this.guestMemberObj, this.scheduleId).takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
        });
    };
    ScheduleAttendanceComponent.prototype.selected = function (value) {
        this.searchTextModel = value.label;
        this.selectedMember = value;
    };
    ScheduleAttendanceComponent.prototype.addMemberDiv = function (event) {
        event.preventDefault();
    };
    ScheduleAttendanceComponent.prototype.showComment = function (event, commentIndex) {
        event.preventDefault();
        this.attendanceShowFlag = !this.attendanceShowFlag;
        this.showCommentFlag = !this.showCommentFlag;
        this.commentsIndex = commentIndex;
        if ((!this.commentFlgEnabled[commentIndex]) == true) {
            this.commentFlgEnabled[commentIndex] = true;
            this.scheduleConfigurationService.changeScheduleHomeAttendanceEditFlag(true);
        }
        else {
            this.scheduleConfigurationService.changeScheduleHomeAttendanceEditFlag(false);
        }
    };
    ScheduleAttendanceComponent.prototype.editAttendanceData = function (event, index, memberObj) {
        event.preventDefault();
        if ((!this.editFlagEnabled[index]) == true) {
            this.editFlagEnabled[index] = true;
            this.scheduleConfigurationService.changeScheduleHomeAttendanceEditFlag(true);
        }
        else {
            this.scheduleConfigurationService.changeScheduleHomeAttendanceEditFlag(false);
        }
        this.tempAlternateFor = memberObj.alternateFor;
        this.tempComment = memberObj.comments;
        this.tempMemberPresent = memberObj.memberPresent;
    };
    ScheduleAttendanceComponent.prototype.saveAttendanceEditedData = function (event, index, memberObj) {
        var _this = this;
        event.preventDefault();
        this.showCommentFlag = false;
        this.attendanceShowFlag = false;
        if ((!this.editFlagEnabled[index]) == false) {
            this.editFlagEnabled[index] = false;
            this.scheduleConfigurationService.changeScheduleHomeAttendanceEditFlag(false);
        }
        if ((!this.commentFlgEnabled[index]) == false) {
            this.commentFlgEnabled[index] = false;
            this.scheduleConfigurationService.changeScheduleHomeAttendanceEditFlag(false);
        }
        this.committeeId = this.result.committeeSchedule.committeeId;
        this.updatingMemberObj.alternateFor = memberObj.alternateFor;
        this.updatingMemberObj.committeeScheduleAttendanceId = memberObj.committeeScheduleAttendanceId;
        this.updatingMemberObj.memberPresent = memberObj.memberPresent;
        this.updatingMemberObj.comments = memberObj.comments;
        this.updatingMemberObj.updateUser = this.currentUser;
        this.updatingMemberObj.updateTimestamp = new Date().getTime();
        this.scheduleAttendanceService.updateMemberattendanceDate(this.committeeId, this.scheduleId, this.updatingMemberObj)
            .takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
        });
    };
    ScheduleAttendanceComponent.prototype.cancelEditAttenfance = function (event, index, memberObj) {
        event.preventDefault();
        this.editFlagEnabled[index] = !this.editFlagEnabled[index];
        memberObj.alternateFor = this.tempAlternateFor;
        memberObj.comments = this.tempComment;
        memberObj.memberPresent = this.tempMemberPresent;
    };
    ScheduleAttendanceComponent.prototype.hideComment = function (event, commentIndex) {
        this.showCommentFlag = false;
        this.commentsIndex = commentIndex;
    };
    ScheduleAttendanceComponent.prototype.markAttendance = function (event, memberObj, index) {
        var _this = this;
        event.preventDefault();
        if (memberObj.memberPresent == true) {
            memberObj.memberPresent = false;
        }
        else {
            memberObj.memberPresent = true;
        }
        this.tempAlternateFor = memberObj.alternateFor;
        this.tempComment = memberObj.comments;
        this.tempMemberPresent = memberObj.memberPresent;
        this.committeeId = this.result.committeeSchedule.committeeId;
        this.updatingMemberObj.alternateFor = memberObj.alternateFor;
        this.updatingMemberObj.committeeScheduleAttendanceId = memberObj.committeeScheduleAttendanceId;
        this.updatingMemberObj.memberPresent = memberObj.memberPresent;
        this.updatingMemberObj.comments = memberObj.comments;
        this.updatingMemberObj.updateUser = this.currentUser;
        this.updatingMemberObj.updateTimestamp = new Date().getTime();
        this.scheduleAttendanceService.updateMemberattendanceDate(this.committeeId, this.scheduleId, this.updatingMemberObj)
            .takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
        });
    };
    ScheduleAttendanceComponent.prototype.showDeleteModal = function (event, memberObj) {
        event.preventDefault();
        this.showPopup = true;
        this.deletingMeberObj = memberObj;
    };
    ScheduleAttendanceComponent.prototype.deleteAttendance = function (event) {
        var _this = this;
        this.showPopup = false;
        this.committeeId = this.result.committeeSchedule.committeeId;
        this.scheduleAttendanceService.deleteScheduleMemberAttendance(this.committeeId, this.scheduleId, this.deletingMeberObj.committeeScheduleAttendanceId)
            .takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
        });
    };
    ScheduleAttendanceComponent.prototype.onSearchValueChange = function () {
        this.iconClass = this.searchTextModel ? 'fa fa-times' : 'fa fa-search';
        this.elasticSearchresults = [];
    };
    ScheduleAttendanceComponent = __decorate([
        Component({
            selector: 'app-schedule-attendance',
            templateUrl: './schedule-attendance.component.html',
            styleUrls: ['../../../../../assets/css/bootstrap.min.css', '../../../../../assets/css/font-awesome.min.css', '../../../../../assets/css/style.css', '../../../../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [ScheduleConfigurationService, CommitteeMemberNonEmployeeElasticService, NgZone, CommitteeMemberEmployeeElasticService, ScheduleAttendanceService, ActivatedRoute])
    ], ScheduleAttendanceComponent);
    return ScheduleAttendanceComponent;
}());
export { ScheduleAttendanceComponent };
//# sourceMappingURL=schedule-attendance.component.js.map