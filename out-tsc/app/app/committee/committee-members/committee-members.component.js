var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommitteCreateEditService } from '../committee-create-edit.service';
import { CompleterService } from 'ng2-completer';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteeConfigurationService } from '../../common/committee-configuration.service';
import { CommitteeMemberEmployeeElasticService } from '../../elastic-search/committee-members-employees-elastic-search.service';
import { CommitteeMemberNonEmployeeElasticService } from '../../elastic-search/committee-members-nonEmployee-elastic-search.service';
import 'rxjs/add/operator/takeUntil';
var CommitteeMembersComponent = (function () {
    function CommitteeMembersComponent(committeeMemberNonEmployeeElasticService, _ngZone, committeeMemberEmployeeElasticService, committeeConfigurationService, route, completerService, committeCreateEditService, router) {
        this.committeeMemberNonEmployeeElasticService = committeeMemberNonEmployeeElasticService;
        this._ngZone = _ngZone;
        this.committeeMemberEmployeeElasticService = committeeMemberEmployeeElasticService;
        this.committeeConfigurationService = committeeConfigurationService;
        this.route = route;
        this.completerService = completerService;
        this.committeCreateEditService = committeCreateEditService;
        this.router = router;
        this.modalMessage = '';
        this.modalTitle = '';
        this.showPopup = false;
        this.memberAdded = false;
        this.temptermStartDate = '';
        this.addRole = false;
        this.editRole = false;
        this.addExpertise = false;
        this.editExpertise = false;
        this.showMembers = false;
        this.showNonEmployeeMembers = false;
        this.showAddMember = false;
        this.roleAdded = 0;
        this.editDetails = false;
        this.editClass = "committeeBoxNotEditable";
        this.memberSearchInput = {};
        this.roleSearchInput = {};
        this.expertiseSearchInput = {};
        this.memberList = {};
        this.memberListtoView = {};
        this.membershipRoleList = {};
        this.membershipRoleListtoView = {};
        this.memberListLoaded = {};
        this.dataServiceMemberList = {};
        this.dataServiceRoleList = {};
        this.dataServiceExpertiseList = {};
        this.employees = {};
        this.non_employees = {};
        this.membershipRoles = {};
        this.membershipExpertise = {};
        this.result = {};
        this.resultLoadedById = {};
        this.memberExist = false;
        this.saveResult = {};
        this.memberRoleObject = {};
        this.memberExpertiseObject = {};
        this.nonEmployeeFlag = false;
        this.elasticSearchresults = [];
        this.changePersonDetails = false;
        this.searchActive = false;
        this.selectedMember = {};
        this._results = new Subject();
        this.iconClass = 'fa fa-search';
        this.editClassRole = "committeeBoxNotEditable";
        this.activeMembers = true;
        this.currentUser = localStorage.getItem('currentUser');
        this.searchText = new FormControl('');
        this.placeHolderText = 'Search an employee';
        this.roleFieldsFilled = true;
        this.IsToDeleteRole = false;
        this.IsToDeleteExpertise = false;
        this.isTermDateFilled = true;
        this.onDestroy$ = new Subject();
        this.dateFilter = function (d, member) {
            member.termStartDate = d.getDay();
            return;
        };
        this.mode = this.route.snapshot.queryParamMap.get('mode');
        this.committeeId = this.route.snapshot.queryParamMap.get('id');
    }
    ;
    CommitteeMembersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.committeeConfigurationService.currentCommitteeData.subscribe(function (data) {
            _this.resultLoadedById = data;
            if (_this.resultLoadedById != null) {
                _this.membershipRoles = _this.resultLoadedById.membershipRoles;
                _this.membershipExpertise = _this.resultLoadedById.researchAreas;
                _this.dataServiceRoleList = _this.completerService.local(_this.membershipRoles, 'description', 'description');
                _this.dataServiceExpertiseList = _this.completerService.local(_this.membershipExpertise, 'description', 'description');
                _this.memberList.committeeMembershipTypes = _this.resultLoadedById.committeeMembershipTypes;
                _this.memberExist = true;
                _this.expandMemberToSave();
            }
            if (_this.resultLoadedById.committee.committeeMemberships.length == 0) {
                _this.memberExist = false;
            }
            else {
                _this.memberExist = true;
            }
        });
        this.initialLoad();
    };
    CommitteeMembersComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    CommitteeMembersComponent.prototype.ngAfterViewInit = function () {
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
                                _this.hits_source.forEach(function (elmnt, j) {
                                    _this.prncpl_id = _this.hits_source[j].prncpl_id;
                                    _this.full_name = _this.hits_source[j].full_name;
                                    _this.elasticSearchresults.push({
                                        label: _this.full_name,
                                        id: _this.prncpl_id
                                    });
                                });
                                if (_this.elasticSearchresults.length > 0) {
                                    _this.message = '';
                                }
                                else if (_this.searchTextModel && _this.searchTextModel.trim()) {
                                    _this.message = '';
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
                                _this.hits_source.forEach(function (elmnt, j) {
                                    _this.rolodexId = _this.hits_source[j].rolodex_id;
                                    _this.first_name = _this.hits_source[j].first_name;
                                    _this.middle_name = _this.hits_source[j].middle_name;
                                    _this.last_name = _this.hits_source[j].last_name;
                                    _this.elasticSearchresults.push({
                                        label: _this.first_name + '  ' + _this.middle_name
                                            + '  ' + _this.last_name,
                                        id: _this.rolodexId
                                    });
                                });
                                if (_this.elasticSearchresults.length > 0) {
                                    _this.message = '';
                                }
                                else if (_this.searchTextModel && _this.searchTextModel.trim()) {
                                    _this.message = '';
                                }
                                resolve(_this.elasticSearchresults);
                            });
                        })
                            .catch(function (error) {
                        });
                    });
                }
            });
        })
            .catch(this.handleError)
            .takeUntil(this.onDestroy$).subscribe(this._results);
    };
    CommitteeMembersComponent.prototype.handleError = function () {
        this.message = 'something went wrong';
    };
    CommitteeMembersComponent.prototype.initialLoad = function () {
        if (this.mode == 'view') { }
        else {
            this.editDetails = false;
            this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
        }
    };
    // on selecting name from elastic search result list
    CommitteeMembersComponent.prototype.selected = function (value) {
        this.searchTextModel = value.label;
        this.selectedMember = value;
        this.message = '';
    };
    //elastic search value change
    CommitteeMembersComponent.prototype.onSearchValueChange = function () {
        this.iconClass = this.searchTextModel ? 'fa fa-times' : 'fa fa-search';
        this.elasticSearchresults = [];
    };
    CommitteeMembersComponent.prototype.employeeRadioChecked = function () {
        this.nonEmployeeFlag = false;
        this.searchTextModel = '';
        this.placeHolderText = 'Search an employee';
    };
    CommitteeMembersComponent.prototype.nonEmployeeRadioChecked = function () {
        this.nonEmployeeFlag = true;
        this.searchTextModel = '';
        this.placeHolderText = 'Search a non-employee';
    };
    CommitteeMembersComponent.prototype.showEditDetails = function () {
        this.editDetails = true;
        this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
        if (this.editDetails) {
            this.editClass = 'committeeBox';
        }
        this.addRole = false;
        this.addExpertise = false;
    };
    CommitteeMembersComponent.prototype.memberTypeChange = function (member, types) {
        for (var _i = 0, _a = this.memberList.committeeMembershipTypes; _i < _a.length; _i++) {
            var membertype = _a[_i];
            if (membertype.description == types) {
                var d = new Date();
                var timestamp = d.getTime();
                membertype.updateTimestamp = timestamp;
                membertype.updateUser = this.currentUser;
                member.committeeMembershipType = membertype;
                member.membershipTypeCode = membertype.membershipTypeCode;
            }
        }
    };
    CommitteeMembersComponent.prototype.saveDetails = function (member) {
        var _this = this;
        if (member.termStartDate == null || member.termEndDate == null) {
            this.isTermDateFilled = false;
            this.roleWarningMessage = '* Term start date and term end date are mandatory';
            this.editDetails = true;
            this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
        }
        else if (member.termStartDate > member.termEndDate) {
            this.isTermDateFilled = false;
            this.roleWarningMessage = '* Term start date must be after term start date.';
        }
        else {
            this.isTermDateFilled = true;
            if (member.committeeMemberRoles.length == 0) {
                this.showPopup = true;
                this.modalMessage = "Please add atleast one role";
                this.modalTitle = "No Roles added!";
            }
            else if (member.committeeMemberExpertises.length == 0) {
                this.showPopup = true;
                this.modalMessage = "Please add atleast one expertise";
                this.modalTitle = "No Expertise added!";
            }
            else {
                this.showPopup = false;
                this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
            }
            this.editDetails = false;
            this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
            this.memberAdded = false;
            this.editClass = 'committeeBoxNotEditable';
            var currentDate = new Date();
            var currentTime = currentDate.getTime();
            for (var _i = 0, _a = this.resultLoadedById.committee.committeeMemberships; _i < _a.length; _i++) {
                var member_1 = _a[_i];
                member_1.updateUser = this.currentUser;
                member_1.updateTimestamp = currentTime;
            }
            this.sendMemberObject = {};
            this.sendMemberObject.committee = this.resultLoadedById.committee;
            this.committeCreateEditService.saveCommitteeMembers(this.sendMemberObject).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.saveResult = data;
                _this.resultLoadedById.committee = _this.saveResult.committee;
            });
        }
    };
    CommitteeMembersComponent.prototype.cancelEditDetails = function () {
        this.editDetails = false;
        if (!this.editDetails) {
            this.editClass = 'committeeBoxNotEditable';
        }
        this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
        this.isTermDateFilled = true;
    };
    CommitteeMembersComponent.prototype.addRoles = function (event, member) {
        event.preventDefault();
        if (this.editDetails == true) {
            this.showPopup = true;
            this.modalMessage = "You are in the middle of editing Person Details, please save the data once to proceed";
            this.modalTitle = "Warning!!!";
        }
        else {
            this.addRole = !this.addRole;
            this.addExpertise = false;
            this.editClassRole = 'committeeBox';
            if (this.roleFieldsFilled == false) {
                this.roleFieldsFilled = true;
            }
            this.membershipRoles.description = '';
            this.memberRoleObject.startDate = null;
            this.memberRoleObject.endDate = null;
        }
    };
    CommitteeMembersComponent.prototype.saveRole = function (event, role, member) {
        var _this = this;
        event.preventDefault();
        this.addRole = false;
        this.memberAdded = false;
        this.memberRoleCode = '';
        this.editRole = false;
        this.editClassRole = 'committeeBoxNotEditable';
        this.committeCreateEditService.updateMemberRoles(role.commMemberRolesId, this.committeeId, member.commMembershipId, role).takeUntil(this.onDestroy$).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.resultLoadedById.committee = temp.committee;
            if (member.committeeMemberExpertises.length == 0) {
            }
        });
    };
    CommitteeMembersComponent.prototype.cancelEditRoles = function (event, role) {
        event.preventDefault();
        role.startDate = this.temp_startDate;
        role.endDate = this.temp_endDate;
        this.memberRoleCode = '';
        this.addRole = false;
        this.editRole = false;
        this.editClassRole = 'committeeBoxNotEditable';
    };
    CommitteeMembersComponent.prototype.addExpertises = function (event, member) {
        event.preventDefault();
        if (this.editDetails == true) {
            this.showPopup = true;
            this.modalMessage = "You are in the middle of editing Person Details, please save the data once to proceed";
            this.modalTitle = "Warning!!!";
        }
        else {
            this.addExpertise = !this.addExpertise;
            this.addRole = false;
        }
    };
    CommitteeMembersComponent.prototype.cancelExpertise = function () {
        this.addExpertise = false;
        this.editExpertise = false;
    };
    CommitteeMembersComponent.prototype.editRoles = function (event, role) {
        event.preventDefault();
        this.memberRoleCode = role.membershipRoleCode;
        this.temp_startDate = role.startDate;
        this.temp_endDate = role.endDate;
        this.editRole = true;
        this.editClassRole = 'committeeBox';
    };
    CommitteeMembersComponent.prototype.editExpertises = function () {
        if (this.editDetails == true) {
            this.showPopup = true;
            this.modalMessage = "You are in the middle of editing Person Details, please save the data once to proceed";
            this.modalTitle = "Warning!!!";
        }
        else {
            this.editExpertise = true;
            this.editClass = 'committeeBox';
        }
    };
    CommitteeMembersComponent.prototype.roleAddtoTable = function (member) {
        var _this = this;
        var termStartDate = new Date(member.termStartDate);
        var termEndDate = new Date(member.termEndDate);
        if (this.membershipRoles.description == null || this.membershipRoles.description == undefined || this.memberRoleObject.startDate == null || this.memberRoleObject.endDate == null) {
            this.roleFieldsFilled = false;
            this.roleWarningMessage = '* Please fill the mandatory fileds.';
        }
        else if (this.memberRoleObject.startDate > this.memberRoleObject.endDate) {
            this.roleFieldsFilled = false;
            this.roleWarningMessage = '* Role end date must be after role start date.';
        }
        else if (this.memberRoleObject.startDate < termStartDate || this.memberRoleObject.startDate > termEndDate || this.memberRoleObject.endDate < termStartDate || this.memberRoleObject.endDate > termEndDate) {
            this.roleFieldsFilled = false;
            this.roleWarningMessage = '* Role start date and role end date must be between term start date and term end date.';
        }
        else {
            this.roleFieldsFilled = true;
            this.roleWarningMessage = '';
            var flag = false;
            this.memberAdded = false;
            this.committeCreateEditService.saveCommMemberRole(member.commMembershipId, this.committeeId, this.memberRoleObject).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.memberRoleObject.startDate = null;
                _this.memberRoleObject.endDate = null;
                _this.membershipRoles.description = null;
                var temp = {};
                temp = data;
                _this.resultLoadedById.committee = temp.committee;
            });
            if (member.committeeMemberExpertises.length == 0) {
                this.showPopup = true;
                this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
                this.modalMessage = "Please add atleast one expertise";
                this.modalTitle = "No Expertise added!";
            }
        }
    };
    CommitteeMembersComponent.prototype.expertiseAddtoTable = function (member) {
        var _this = this;
        var flag = false;
        this.addExpertise = false;
        this.memberAdded = false;
        this.editExpertise = false;
        this.editClass = 'committeeBoxNotEditable';
        this.committeCreateEditService.saveCommMemberExpertise(member.commMembershipId, this.committeeId, this.memberExpertiseObject).takeUntil(this.onDestroy$).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.resultLoadedById.committee = temp.committee;
        });
    };
    //clear elastic search box
    CommitteeMembersComponent.prototype.clearsearchBox = function (e) {
        e.preventDefault();
        this.searchTextModel = '';
    };
    CommitteeMembersComponent.prototype.showWarning = function (event, commMemberRolesId, commMembershipId) {
        event.preventDefault();
        this.commMemberRolesId = commMemberRolesId;
        this.commMembershipId = commMembershipId;
        this.showPopup = true;
        this.modalTitle = 'Delete Role ?';
        this.modalMessage = 'Do you want to remove the current role ?';
        this.IsToDeleteRole = true;
    };
    CommitteeMembersComponent.prototype.deleteRole = function () {
        var _this = this;
        this.committeCreateEditService.deleteRoles(this.commMemberRolesId, this.commMembershipId, this.committeeId).takeUntil(this.onDestroy$).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.resultLoadedById.committee = temp.committee;
        });
        this.showPopup = false;
        this.IsToDeleteRole = false;
    };
    CommitteeMembersComponent.prototype.showExpertiseDeleteWarning = function (event, commMemberExpertiseId, commMembershipId) {
        event.preventDefault();
        this.commMemberExpertiseId = commMemberExpertiseId;
        this.commMembershipId = commMembershipId;
        this.showPopup = true;
        this.modalTitle = 'Delete Expertise ?';
        this.modalMessage = 'Do you want to remove the current expertise ?';
        this.IsToDeleteExpertise = true;
    };
    CommitteeMembersComponent.prototype.deleteExpertise = function () {
        var _this = this;
        this.committeCreateEditService.deleteExpertises(this.commMemberExpertiseId, this.commMembershipId, this.committeeId).takeUntil(this.onDestroy$).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.resultLoadedById.committee = temp.committee;
        });
        this.showPopup = false;
        this.IsToDeleteExpertise = false;
    };
    CommitteeMembersComponent.prototype.deleteMember = function (event, commMembershipId) {
        var _this = this;
        event.preventDefault();
        this.committeCreateEditService.deleteMember(commMembershipId, this.committeeId).takeUntil(this.onDestroy$).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.resultLoadedById.committee = temp.committee;
        });
    };
    CommitteeMembersComponent.prototype.showMembersNonEmployeesTab = function (event, rolodexIdFromService, member) {
        event.preventDefault();
        this.isTermDateFilled = true;
        this.personId = null;
        this.showMembers = false;
        if (member.updateTimestamp == null) {
            this.memberAdded = true;
            this.showEditDetails();
        }
        this.committeeConfigurationService.changeMemberData(member);
        this.showNonEmployeeMembers = !this.showNonEmployeeMembers;
        if (this.showNonEmployeeMembers) {
            this.editDetails = false;
            this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
            this.editClass = "committeeBoxNotEditable";
        }
        this.rolodexId = rolodexIdFromService;
    };
    CommitteeMembersComponent.prototype.showMembersTab = function (event, personIdFromService, member) {
        event.preventDefault();
        this.isTermDateFilled = true;
        this.rolodexId = null;
        this.showNonEmployeeMembers = false;
        if (member.updateTimestamp == null) {
            this.memberAdded = true;
            this.showEditDetails();
        }
        this.showMembers = !this.showMembers;
        this.committeeConfigurationService.changeMemberData(member);
        if (this.showMembers) {
            this.editDetails = false;
            this.committeeConfigurationService.changeEditMemberFlag(this.editDetails);
            this.editClass = "committeeBoxNotEditable";
        }
        this.personId = personIdFromService;
    };
    CommitteeMembersComponent.prototype.addMemberDiv = function (event) {
        event.preventDefault();
        this.showAddMember = !this.showAddMember;
    };
    CommitteeMembersComponent.prototype.addMember = function () {
        var _this = this;
        if (this.memberAdded == true) {
            this.showPopup = true;
            this.modalMessage = "You are yet to save the details of an already added member. Please add details and save to proceed";
            this.modalTitle = "Warning!!!";
        }
        else {
            this.committeCreateEditService.addMember(this.selectedMember.id, this.committeeId, this.nonEmployeeFlag, this.resultLoadedById.committee).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.memberList = data;
                var length = _this.memberList.committee.committeeMemberships.length;
                for (var _i = 0, _a = _this.memberList.committeeMembershipTypes; _i < _a.length; _i++) {
                    var membertype = _a[_i];
                    if (membertype.description == 'Non-voting member') {
                        var d = new Date();
                        var timestamp = d.getTime();
                        membertype.updateTimestamp = timestamp;
                        membertype.updateUser = _this.currentUser;
                        _this.memberList.committee.committeeMemberships[length - 1].committeeMembershipType = membertype;
                        _this.memberList.committee.committeeMemberships[length - 1].membershipTypeCode = membertype.membershipTypeCode;
                    }
                }
                _this.memberAdded = true;
                _this.resultLoadedById.committee.committeeMemberships = _this.memberList.committee.committeeMemberships;
                _this.memberExist = true;
                _this.expandMemberToSave();
            });
            this.searchTextModel = '';
        }
    };
    CommitteeMembersComponent.prototype.onSelectRole = function () {
        var _this = this;
        var tempObj = {};
        this.membershipRoles.forEach(function (value, index) {
            if (value.description == _this.membershipRoles.description) {
                _this.selectedRole = _this.membershipRoles.description;
                for (var _i = 0, _a = _this.resultLoadedById.committee.committeeMemberships; _i < _a.length; _i++) {
                    var member = _a[_i];
                    if (member.personId == _this.personId) {
                        var d = new Date();
                        var timestamp = d.getTime();
                        tempObj.membershipRoleCode = _this.membershipRoles[index].membershipRoleCode;
                        tempObj.membershipRoleDescription = _this.membershipRoles[index].description;
                        tempObj.startDate = _this.membershipRoles[index].startDate;
                        tempObj.endDate = _this.membershipRoles[index].endDate;
                        tempObj.updateTimestamp = timestamp;
                        tempObj.updateUser = _this.currentUser;
                        _this.memberRoleObject = tempObj;
                    }
                }
            }
        });
    };
    CommitteeMembersComponent.prototype.onSelectExpertise = function () {
        var _this = this;
        var tempObj = {};
        var d = new Date();
        var timestamp = d.getTime();
        this.membershipExpertise.forEach(function (value, index) {
            if (value.description == _this.membershipExpertise.description) {
                _this.selectedExpertise = _this.membershipExpertise.description;
                for (var _i = 0, _a = _this.resultLoadedById.committee.committeeMemberships; _i < _a.length; _i++) {
                    var member = _a[_i];
                    if (member.personId == _this.personId) {
                        tempObj.researchAreaCode = _this.membershipExpertise[index].researchAreaCode;
                        tempObj.researchAreaDescription = _this.membershipExpertise[index].description;
                        tempObj.updateTimestamp = timestamp;
                        tempObj.updateUser = _this.currentUser;
                        _this.memberExpertiseObject = tempObj;
                    }
                }
            }
        });
    };
    CommitteeMembersComponent.prototype.expandMemberToSave = function () {
        var _this = this;
        this.showPopup = false;
        this.resultLoadedById.committee.committeeMemberships.forEach(function (value, index) {
            if (value.updateTimestamp == null || value.committeeMemberRoles.length == 0 || value.committeeMemberExpertises.length == 0) {
                _this.memberAdded = true;
                _this.showEditDetails();
                if (value.personId == null) {
                    _this.rolodexId = value.rolodexId;
                    _this.showNonEmployeeMembers = true;
                }
                else if (value.rolodexId == null) {
                    _this.personId = value.personId;
                    _this.showMembers = true;
                }
            }
        });
    };
    CommitteeMembersComponent.prototype.modalFooterClear = function () {
        this.IsToDeleteRole = false;
        this.IsToDeleteExpertise = false;
        this.showPopup = false;
    };
    CommitteeMembersComponent = __decorate([
        Component({
            selector: 'app-committee-members',
            templateUrl: './committee-members.component.html',
            styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
            providers: [CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService],
            changeDetection: ChangeDetectionStrategy.Default
        }),
        __metadata("design:paramtypes", [CommitteeMemberNonEmployeeElasticService, NgZone, CommitteeMemberEmployeeElasticService, CommitteeConfigurationService, ActivatedRoute, CompleterService, CommitteCreateEditService, Router])
    ], CommitteeMembersComponent);
    return CommitteeMembersComponent;
}());
export { CommitteeMembersComponent };
//# sourceMappingURL=committee-members.component.js.map