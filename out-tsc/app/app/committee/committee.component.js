var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ContentChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteeHomeComponent } from './committee-home/committee-home.component';
import { CommitteCreateEditService } from './committee-create-edit.service';
import { CommitteeSaveService } from './committee-save.service';
import { CompleterService } from 'ng2-completer';
import { CommitteeConfigurationService } from '../common/committee-configuration.service';
import { SessionManagementService } from "../session/session-management.service";
import { CommitteeMembersComponent } from "./committee-members/committee-members.component";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
var CommitteeComponent = (function () {
    function CommitteeComponent(route, router, sessionService, committeCreateService, completerService, committeeSaveService, committeeConfigurationService) {
        this.route = route;
        this.router = router;
        this.sessionService = sessionService;
        this.committeCreateService = committeCreateService;
        this.completerService = completerService;
        this.committeeSaveService = committeeSaveService;
        this.committeeConfigurationService = committeeConfigurationService;
        this.currentTab = 'committee_home';
        this.schedule = false;
        this.homeUnits = [];
        this.reviewTypes = [];
        this.scheduleStatus = [];
        this.result = {};
        this.homeUnitInput = [];
        this.editDetails = false;
        this.editFlag = false;
        this.areaList = [];
        this.showPopup = false;
        this.middleOfEdit = false;
        this.middleOfSave = false;
        this.alertMsgNotSaved = '';
        this.alertMsgMiddleOfEdit = '';
        this.isOnEditMembers = false;
        this.memberData = [];
        this.onDestroy$ = new Subject();
        if (!sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
        this.result.committee = {};
        this.result.committee.committeeType = {};
        this.mode = this.route.snapshot.queryParamMap.get('mode');
        this.id = this.route.snapshot.queryParamMap.get('id');
    }
    CommitteeComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    CommitteeComponent.prototype.ngOnInit = function () {
        this.initLoadParent();
    };
    CommitteeComponent.prototype.onActivate = function (componentRef) {
        this.activatedRoute = componentRef;
    };
    CommitteeComponent.prototype.initLoadParent = function () {
        var _this = this;
        if (this.mode == 'create') {
            this.editFlag = true;
            this.committeCreateService.getCommitteeData('1')
                .takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
                if (_this.result != null) {
                    _this.homeUnits = _this.result.homeUnits;
                    _this.committeeConfigurationService.changeCommmitteeData(_this.result);
                    _this.homeUnitInput.unitName = _this.result.committee.homeUnitName;
                    _this.reviewTypes = _this.result.reviewTypes;
                    _this.scheduleStatus = _this.result.scheduleStatus;
                    _this.areaList = _this.completerService.local(_this.result.researchAreas, 'description', 'description');
                    _this.committeeConfigurationService.changeAreaOfResearch(_this.areaList);
                    _this.dataServiceHomeUnit = _this.completerService.local(_this.homeUnits, 'unitName', 'unitName');
                }
            });
            this.committeeConfigurationService.changeMode(this.mode);
            this.editDetails = true;
            this.class = 'scheduleBoxes';
            this.constantClass = 'scheduleBoxes';
            this.homeUnitInput.unitName = '';
        }
        else if (this.mode == 'view') {
            this.committeCreateService.loadCommittee(this.id)
                .takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.result = data || [];
                ;
                if (_this.result != null) {
                    _this.committeeConfigurationService.changeCommmitteeData(_this.result);
                    var ts = new Date(_this.result.committee.updateTimestamp);
                    var month = String(ts.getMonth() + 1);
                    var day = String(ts.getDate());
                    var year = String(ts.getFullYear());
                    if (month.length < 2)
                        month = '0' + month;
                    if (day.length < 2)
                        day = '0' + day;
                    _this.lastUpdated = day + "/" + month + "/" + year + " by " + _this.result.committee.updateUser;
                    _this.homeUnits = _this.result.homeUnits;
                    _this.committeeConfigurationService.changeCommmitteeData(_this.result);
                    _this.homeUnitInput.unitName = _this.result.committee.homeUnitName;
                    _this.reviewTypes = _this.result.reviewTypes;
                    _this.scheduleStatus = _this.result.scheduleStatus;
                    _this.areaList = _this.completerService.local(_this.result.researchAreas, 'description', 'description');
                    _this.committeeConfigurationService.changeAreaOfResearch(_this.areaList);
                    _this.dataServiceHomeUnit = _this.completerService.local(_this.homeUnits, 'unitName', 'unitName');
                }
            });
            this.committeeConfigurationService.changeMode(this.mode);
            this.editDetails = false;
            this.class = 'committeeBoxNotEditable';
            this.constantClass = 'committeeBoxNotEditable';
            this.committeeConfigurationService.currentEditFlag.takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.editFlag = data;
                if (_this.editFlag) {
                    _this.class = 'scheduleBoxes';
                }
                else {
                    _this.class = 'committeeBoxNotEditable';
                }
            });
        }
    };
    CommitteeComponent.prototype.show_current_tab = function (e, current_tab) {
        var _this = this;
        e.preventDefault();
        this.committeeConfigurationService.changeActivatedtab(current_tab);
        this.clear();
        if (current_tab == 'committee_members') {
            this.committeeConfigurationService.currentEditFlag.subscribe(function (data) {
                _this.editFlag = data;
            });
            if (this.editFlag) {
                this.showPopup = true;
                if (this.mode == 'view') {
                    this.middleOfEdit = true;
                    this.alertMsgMiddleOfEdit = 'You are in the middle of editing Committee Details, Do you want to stay on the page..?';
                }
                else if (this.mode == 'create') {
                    this.middleOfSave = true;
                    this.alertMsgNotSaved = 'You have to save the committee to proceed!';
                }
            }
            else {
                this.currentTab = current_tab;
                this.router.navigate(['/committee/committeeMembers'], { queryParams: { 'mode': this.mode, 'id': this.id } });
            }
        }
        else if (current_tab == 'committee_home') {
            this.committeeConfigurationService.currentMemberEditFlag.takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.isOnEditMembers = data;
            });
            if (this.isOnEditMembers) {
                this.showPopup = true;
                this.committeeConfigurationService.currentMemberData.takeUntil(this.onDestroy$).subscribe(function (data) {
                    _this.memberData = data;
                });
                this.alertMsgMemberMiddleOfEdit = 'You are in the middle of editing a Member Details, Do you want to stay on the page..?';
            }
            else {
                this.currentTab = current_tab;
                this.router.navigate(['/committee/committeeHome'], { queryParams: { 'mode': this.mode, 'id': this.id } });
            }
        }
    };
    CommitteeComponent.prototype.saveAndContinue = function (data) {
        this.editFlag = !this.editFlag;
        this.class = "committeeBoxNotEditable";
        this.currentTab = 'committee_members';
        this.clear();
        this.activatedRoute.saveDetails(data);
    };
    CommitteeComponent.prototype.clear = function () {
        this.showPopup = false;
        this.middleOfEdit = false;
        this.alertMsgMiddleOfEdit = '';
        this.middleOfSave = false;
        this.alertMsgNotSaved = '';
    };
    CommitteeComponent.prototype.homeChangeFunction = function (unitName) {
        var _this = this;
        this.homeUnits.forEach(function (value, index) {
            if (value.unitName == unitName) {
                _this.result.committee.homeUnitNumber = value.unitNumber;
            }
        });
    };
    CommitteeComponent.prototype.onHomeSelect = function () {
        var _this = this;
        this.homeUnits.forEach(function (value, index) {
            if (value.unitName == _this.result.committee.homeUnitName) {
                _this.result.committee.homeUnitNumber = value.unitNumber;
            }
        });
    };
    CommitteeComponent.prototype.recieveFlag = function ($event) {
        this.editFlag = $event;
        if (this.editFlag) {
            this.class = 'scheduleBoxes';
        }
        else {
            this.class = 'committeeBoxNotEditable';
        }
    };
    CommitteeComponent.prototype.recievemode = function ($event) {
        var _this = this;
        this.mode = $event;
        this.committeeConfigurationService.currentCommitteeData.takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
            _this.id = _this.result.committee.committeeId;
        });
        if (this.mode == 'view') {
            this.initLoadParent();
            this.editDetails = false;
            this.class = 'committeeBoxNotEditable';
            this.constantClass = 'committeeBoxNotEditable';
        }
    };
    CommitteeComponent.prototype.recieveEditmembersFlag = function ($event) {
        this.isOnEditMembers = $event;
    };
    CommitteeComponent.prototype.saveMemberAndContinue = function (Object) {
        this.isOnEditMembers = false;
        this.committeeConfigurationService.changeEditMemberFlag(this.isOnEditMembers);
        this.showPopup = false;
        this.class = "committeeBoxNotEditable";
        this.currentTab = 'committee_home';
        this.clear();
        this.activatedRoute.saveDetails(Object);
        this.router.navigate(['/committee/committeeHome'], { queryParams: { 'mode': this.mode, 'id': this.id } });
    };
    CommitteeComponent.prototype.stayOnPage = function () {
    };
    CommitteeComponent.prototype.stayOnCommittee = function () {
    };
    __decorate([
        ContentChild(CommitteeMembersComponent),
        ContentChild(CommitteeHomeComponent),
        __metadata("design:type", CommitteeHomeComponent)
    ], CommitteeComponent.prototype, "committeeHomeObj", void 0);
    CommitteeComponent = __decorate([
        Component({
            selector: 'app-committee',
            templateUrl: './committee.component.html',
            providers: [CommitteCreateEditService, CommitteeSaveService, SessionManagementService, CommitteeHomeComponent, CommitteeMembersComponent],
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [ActivatedRoute, Router, SessionManagementService, CommitteCreateEditService, CompleterService, CommitteeSaveService, CommitteeConfigurationService])
    ], CommitteeComponent);
    return CommitteeComponent;
}());
export { CommitteeComponent };
//# sourceMappingURL=committee.component.js.map