var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionManagementService } from "../session/session-management.service";
import { Subject } from "rxjs";
import { CompleterService } from "ng2-completer";
import { CommitteeMemberEmployeeElasticService } from '../elastic-search/committee-members-employees-elastic-search.service';
import { CommitteeMemberNonEmployeeElasticService } from '../elastic-search/committee-members-nonEmployee-elastic-search.service';
import { FormControl } from '@angular/forms';
import * as _ from "lodash";
import { ProposalCreateEditService } from "./proposal-create-view.service";
import { GrantService } from "../grant/grant.service";
import 'rxjs/Rx';
var ProposalComponent = (function () {
    function ProposalComponent(grantService, committeeMemberNonEmployeeElasticService, committeeMemberEmployeeElasticService, _ngZone, changeRef, route, router, sessionService, proposalCreateService, completerService) {
        this.grantService = grantService;
        this.committeeMemberNonEmployeeElasticService = committeeMemberNonEmployeeElasticService;
        this.committeeMemberEmployeeElasticService = committeeMemberEmployeeElasticService;
        this._ngZone = _ngZone;
        this.changeRef = changeRef;
        this.route = route;
        this.router = router;
        this.sessionService = sessionService;
        this.proposalCreateService = proposalCreateService;
        this.completerService = completerService;
        this.selectedAttachmentStopOne = [];
        this.selectedAttachmentStopTwo = [];
        this.selectedAttachmentStopThree = [];
        this.selectedAttachmentStopFour = [];
        this.selectedAttachmentReviewer = [];
        this.mode = 'view';
        this.showGrantSearch = true;
        this.isAOREnabled = true;
        this.editClass = "committeeBox";
        this.editAreaClass = 'scheduleBoxes';
        this.sendObject = {};
        this.result = {};
        this.keywordsList = [];
        this.keywordObject = {};
        this.currentUser = localStorage.getItem('currentUser');
        this.addedList = [];
        this.isDateWarningText = false;
        this.grantCallList = [];
        this.personRolesList = [];
        this.personWarningFlag = false;
        this.personWarningMsg = '';
        this.budgetWarningFlag = false;
        this.showDeleteBudget = false;
        this.isMandatory = false;
        this.mandatoryText = '';
        this.showApproveDisapproveModal = false;
        this.workflowStopOne = [];
        this.workflowStopTwo = [];
        this.isRevExpanded = {};
        this.showReviewerModal = false;
        this.reviewerList = [];
        this.availableReviewers = [];
        this.tempLoggedWorkflowDetail = {};
        this.showConfirmModal = false;
        this.isForward = false;
        this.isEndorse = false;
        this.showSuccessMessage = false;
        this.showAddAttachment = false;
        this.uploadedFile = [];
        this.files = [];
        this.tempSaveAttachment = {};
        this.attachmentObject = {};
        this.areaList = [];
        this.tempAreaObject = {};
        this.showDeleteResearchArea = false;
        this.showDeleteIRB = false;
        this.tempSaveIRBObject = {};
        this.protocolsList = [];
        this.sponsorAmount = 0;
        this.tempSaveSponsorObject = {};
        this.showDeleteSponsor = false;
        this.isKeywordWarning = false;
        this.isAreaWarning = false;
        this.isFundingWarning = false;
        this.isIRBWarning = false;
        this.showAddedModal = false;
        this.showSubmittedModal = false;
        this.isRoutelogOpened = false;
        this.select = '--Select--';
        //for setting validation of start Date
        this.currentDate = new Date();
        this.memberTypes = [
            { name: 'Employee', value: 'Employee' },
            { name: 'Non-Employee', value: 'Non-Employee' }
        ];
        this.memberTypeSelected = 'Employee';
        this.tempSavePersonObject = {};
        this.tempBudgetObject = {};
        this.showDeleteMember = false;
        this.isProposalSaved = false;
        this.isProposalSubmitted = false;
        //for elastic search
        this.searchActive = false;
        this.searchText = new FormControl('');
        this.nonEmployeeFlag = false;
        this.employeeFlag = true;
        this.elasticSearchresults = [];
        this.placeHolderText = 'Search an employee';
        this.grantId = null;
        this.workflow = {};
        this.finalStatus = null;
        this.onDestroy$ = new Subject();
        if (!sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
        this.grantManager = localStorage.getItem('grantManager');
        this.provost = localStorage.getItem('provost');
        this.sendObject = {};
        this.result.proposal = {};
    }
    ProposalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userName = localStorage.getItem('currentUser');
        this.keywordsList = [];
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.mode = this.route.snapshot.queryParamMap.get('mode');
        this.grantId = this.route.snapshot.queryParamMap.get('grantId');
        this.proposalId = this.route.snapshot.queryParamMap.get('proposalId');
        if (this.proposalId == null) {
            this.mode = 'create';
            this.editClass = "committeeBox";
            this.editAreaClass = "scheduleBoxes";
            this.createProposalCall();
        }
        else {
            this.proposalCreateService.loadProposalById(this.proposalId, localStorage.getItem('personId'), localStorage.getItem('currentUser')).subscribe(function (success) {
                _this.result = success;
                _this.initialiseProposalFormElements();
            });
        }
    };
    ProposalComponent.prototype.initialiseProposalFormElements = function () {
        if (this.result.proposal.proposalStatus.statusCode == 1 || this.result.proposal.proposalStatus.statusCode == 9) {
            this.mode = 'edit';
            this.editClass = "committeeBox";
            this.editAreaClass = "scheduleBoxes";
            this.selectedAreaType = this.result.proposalResearchTypes[0].description;
            this.researchTypeSelected = this.result.proposalResearchTypes[0].description;
            this.selectedAttachmentType = this.select;
            //this.router.navigate( ['/proposal/editProposal'], { queryParams: { 'mode': this.mode, 'proposalId': this.result.proposal.proposalId } } );
        }
        else {
            this.mode = 'view';
            this.editClass = "committeeBoxNotEditable";
            this.editAreaClass = "scheduleBoxes";
            //this.router.navigate( ['/proposal/viewSubmittedProposal'], { queryParams: { 'mode': this.mode, 'proposalId': this.result.proposal.proposalId } } );
        }
        this.updateWorkflowStops();
        this.updateRouteLogHeader();
        // set default grantCallType to Others if no grant call is associated with the proposal
        if (this.result.proposal.grantCall == null) {
            this.result.proposal.grantCallType = this.result.defaultGrantCallType;
            this.result.proposal.grantTypeCode = this.result.defaultGrantCallType.grantTypeCode;
        }
        else {
            this.result.proposal.grantCallType = this.result.proposal.grantCall.grantCallType;
            this.result.proposal.grantTypeCode = this.result.proposal.grantCall.grantCallType.grantTypeCode;
        }
        this.personRolesList = this.result.proposalPersonRoles;
        this.proposalTypeSelected = (this.result.proposal.proposalType != null) ? this.result.proposal.proposalType.description : this.select;
        this.proposalCategorySelected = (this.result.proposal.proposalCategory != null) ? this.result.proposal.proposalCategory.description : this.select;
        this.selectedICLLab = (this.result.proposal.proposalInstituteCentreLab != null) ? this.result.proposal.proposalInstituteCentreLab.description : this.select;
        this.personRoleSelected = this.select;
        this.budgetCategorySelected = this.select;
        this.differenceBetweenDates(this.result.proposal.startDate, this.result.proposal.endDate);
        this.keywordsList = this.completerService.local(this.result.scienceKeywords, 'description', 'description');
        this.grantCallList = this.completerService.local(this.result.grantCalls, 'grantCallName', 'grantCallName');
        this.selectedSponsorType = this.select;
        this.differenceBetweenDates(this.result.proposal.startDate, this.result.proposal.endDate);
        this.keywordsList = this.completerService.local(this.result.scienceKeywords, 'description', 'description');
        this.areaList = this.completerService.local(this.result.proposalExcellenceAreas, 'description', 'description');
        this.protocolsList = this.completerService.local(this.result.protocols, 'title', 'title');
        this.selectedSponsorName = this.select;
        this.fundingStartDate = null;
        this.fundingEndDate = null;
        this.sponsorAmount = 0;
        this.budgetCost = 0;
        this.budgetDescription = "";
        this.costElementSelected = this.select;
    };
    ProposalComponent.prototype.updateWorkflowStops = function () {
        var _this = this;
        this.workflowStopOne = [];
        this.workflowStopTwo = [];
        if (this.result.workflow != null && this.result.workflow.workflowDetails.length > 0) {
            this.result.workflow.workflowDetails.forEach(function (value, index) {
                switch (value.roleTypeCode) {
                    case 1:
                        _this.workflowStopOne.push(value);
                        break;
                    case 2:
                        _this.workflowStopTwo.push(value);
                        break;
                }
            });
            this.workflowStopOne.forEach(function (value, index) {
                if (value.workflowAttachments != null && value.workflowAttachments.length > 0) {
                    _this.selectedAttachmentStopOne[index] = value.workflowAttachments[0].fileName;
                }
            });
            this.workflowStopTwo.forEach(function (value, index) {
                if (value.workflowAttachments != null && value.workflowAttachments.length > 0) {
                    _this.selectedAttachmentStopTwo[index] = value.workflowAttachments[0].fileName;
                }
                if (value.workflowReviewerDetails != null && value.workflowReviewerDetails.length > 0) {
                    _this.isRevExpanded[index] = true;
                    value.workflowReviewerDetails.forEach(function (valueR, indexR) {
                        if (valueR.workflowAttachments != null && valueR.workflowAttachments.length > 0) {
                            _this.selectedAttachmentReviewer[indexR] = valueR.workflowAttachments[0].fileName;
                        }
                    });
                }
            });
        }
    };
    ProposalComponent.prototype.updateRouteLogHeader = function () {
        var _this = this;
        if (this.result.proposal != null && this.result.proposal.proposalPersons.length > 0) {
            this.result.proposal.proposalPersons.forEach(function (value, index) {
                if (value.proposalPersonRole.code == "PI") {
                    _this.proposalPIName = value.fullName;
                    _this.proposalLeadUnit = value.leadUnitName;
                }
            });
            if (this.result.proposal.proposalStatus.statusCode == 4) {
                this.finalStatus = 'The proposal is submitted to Grant Manager and is waiting for forwading to endorsement';
            }
            else if (this.result.proposal.proposalStatus.statusCode == 10) {
                this.finalStatus = 'The proposal is waiting for endorsement by provost';
            }
            else if (this.result.proposal.proposalStatus.statusCode == 11) {
                this.finalStatus = 'The proposal is endorsed and now awarded';
            }
            else {
                this.finalStatus = null;
            }
        }
    };
    ProposalComponent.prototype.updateFlags = function (response) {
        this.result.isApproved = response.isApproved;
        this.result.isApprover = response.isApprover;
        this.result.isGrantAdmin = response.isGrantAdmin;
        this.result.isGrantManager = response.isGrantManager;
        this.result.isProvost = response.isProvost;
        this.result.isReviewed = response.isReviewed;
        this.result.isReviewer = response.isReviewer;
    };
    ProposalComponent.prototype.createProposalCall = function () {
        var _this = this;
        if (this.grantId != null) {
            this.sendObject.grantCallId = this.grantId;
        }
        else {
            this.sendObject.grantCallId = null;
        }
        this.proposalCreateService.loadCreateProposalData(this.sendObject).takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data || [];
            _this.personRolesList = _this.result.proposalPersonRoles;
            _this.proposalTypeSelected = (_this.result.proposal.proposalType != null) ? _this.result.proposal.proposalType.description : _this.select;
            _this.proposalCategorySelected = (_this.result.proposal.proposalCategory != null) ? _this.result.proposal.proposalCategory.description : _this.select;
            _this.selectedICLLab = (_this.result.proposal.proposalInstituteCentreLab != null) ? _this.result.proposal.proposalInstituteCentreLab.description : _this.select;
            _this.personRoleSelected = _this.select;
            _this.budgetCategorySelected = _this.select;
            _this.selectedAreaType = _this.result.proposalResearchTypes[0].description;
            _this.researchTypeSelected = _this.result.proposalResearchTypes[0].description;
            _this.selectedAttachmentType = _this.select;
            _this.differenceBetweenDates(_this.result.proposal.startDate, _this.result.proposal.endDate);
            _this.keywordsList = _this.completerService.local(_this.result.scienceKeywords, 'description', 'description');
            _this.grantCallList = _this.completerService.local(_this.result.grantCalls, 'grantCallName', 'grantCallName');
            _this.selectedSponsorType = _this.select;
            // set default grantCallType to Others if no grant call is associated with the proposal
            if (_this.result.proposal.grantCall == null) {
                _this.result.proposal.grantCallType = _this.result.defaultGrantCallType;
                _this.result.proposal.grantTypeCode = _this.result.defaultGrantCallType.grantTypeCode;
            }
            else {
                _this.result.proposal.grantCallType = _this.result.proposal.grantCall.grantCallType;
                _this.result.proposal.grantTypeCode = _this.result.proposal.grantCall.grantCallType.grantTypeCode;
            }
            _this.differenceBetweenDates(_this.result.proposal.startDate, _this.result.proposal.endDate);
            _this.keywordsList = _this.completerService.local(_this.result.scienceKeywords, 'description', 'description');
            _this.areaList = _this.completerService.local(_this.result.proposalExcellenceAreas, 'description', 'description');
            _this.protocolsList = _this.completerService.local(_this.result.protocols, 'title', 'title');
            _this.selectedSponsorName = _this.select;
            _this.fundingStartDate = null;
            _this.fundingEndDate = null;
            _this.sponsorAmount = 0;
            _this.budgetCost = 0;
            _this.budgetDescription = "";
            _this.costElementSelected = _this.select;
        });
    };
    ProposalComponent.prototype.ngAfterViewInit = function () {
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
                                        id: _this.prncpl_id,
                                        data: _this.hits_source[j]
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
                                        id: _this.rolodexId,
                                        data: _this.hits_source[j]
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
                            console.log("catch error", error);
                        });
                    });
                }
            });
        })
            .catch(this.handleError)
            .takeUntil(this.onDestroy$).subscribe(this._results);
    };
    ProposalComponent.prototype.handleError = function () {
        this.message = 'something went wrong';
    };
    ProposalComponent.prototype.selected = function (value) {
        this.searchTextModel = value.label;
        this.selectedMember = value.data;
        this.message = '';
    };
    //elastic search value change
    ProposalComponent.prototype.onSearchValueChange = function () {
        this.iconClass = this.searchTextModel ? 'fa fa-times fa-med' : '';
        this.elasticSearchresults = [];
    };
    ProposalComponent.prototype.clearSearchBox = function (e) {
        e.preventDefault();
        this.searchTextModel = '';
        this.selectedMember = null;
    };
    ProposalComponent.prototype.memberTypeChanged = function () {
        if (this.memberTypeSelected == 'Employee') {
            this.nonEmployeeFlag = false;
            this.searchTextModel = '';
            this.placeHolderText = 'Search an employee';
        }
        else {
            this.nonEmployeeFlag = true;
            this.searchTextModel = '';
            this.placeHolderText = 'Search a non-employee';
        }
    };
    ProposalComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    ProposalComponent.prototype.toggleICL = function (flag) {
        this.result.proposal.isSmu = flag;
        this.selectedICLLab = (this.result.proposal.proposalInstituteCentreLab != null) ? this.result.proposal.proposalInstituteCentreLab.description : this.select;
    };
    ProposalComponent.prototype.changeArea = function (areaType) {
        this.selectedArea = "";
        this.selectedAreaType = areaType;
        if (this.selectedAreaType == 'Area of Excellence') {
            this.areaList = this.completerService.local(this.result.proposalExcellenceAreas, 'description', 'description');
        }
        else {
            this.areaList = this.completerService.local(this.result.researchAreas, 'description', 'description');
        }
    };
    ProposalComponent.prototype.differenceBetweenDates = function (startDate, endDate) {
        var diffInMs = Math.round(Date.parse(endDate) - Date.parse(startDate));
        // diffInMs = Math.round(1523507183000); static data for testing
        var difference = Math.floor(diffInMs / 1000 / 60 / 60 / 24 | 0);
        this.durInYears = Math.floor(difference / 365 | 0);
        difference = Math.floor(difference % 365 | 0);
        this.durInMonths = Math.floor(difference / 31 | 0);
        this.durInDays = Math.floor(difference % 31 | 0);
    };
    ProposalComponent.prototype.dateValidation = function () {
        if (this.result.proposal.startDate == null) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a start date';
        }
        else if (this.result.proposal.startDate < this.currentDate) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a start date from today';
        }
        else if (this.result.proposal.startDate != null && this.result.proposal.endDate != null && this.result.proposal.startDate <= this.result.proposal.endDate) {
            this.isDateWarningText = false;
            this.differenceBetweenDates(this.result.proposal.startDate, this.result.proposal.endDate);
            if (this.result.proposal.submissionDate != null && (this.result.proposal.startDate > this.result.proposal.submissionDate || this.result.proposal.submissionDate > this.result.proposal.endDate)) {
                this.isDateWarningText = true;
                this.dateWarningText = 'Please choose a submission date between proposal start date and proposal end date';
            }
        }
        else if (this.result.proposal.endDate == null) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select an end date';
        }
        else if (this.result.proposal.startDate > this.result.proposal.endDate) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select an end date after start date';
        }
        else if (this.result.proposal.startDate != null && this.result.proposal.endDate != null && this.result.proposal.startDate <= this.result.proposal.endDate) {
            this.isDateWarningText = false;
            this.differenceBetweenDates(this.result.proposal.startDate, this.result.proposal.endDate);
            if (this.result.proposal.submissionDate != null && (this.result.proposal.startDate > this.result.proposal.submissionDate || this.result.proposal.submissionDate > this.result.proposal.endDate)) {
                this.isDateWarningText = true;
                this.dateWarningText = 'Please choose a submission date between proposal start date and proposal end date';
            }
        }
        else {
            this.isDateWarningText = false;
        }
    };
    ProposalComponent.prototype.deleteKeyword = function (keyword, k) {
        var _this = this;
        var length = this.result.proposal.proposalKeywords.length;
        for (var i = 0; i < length; ++i) {
            if (this.result.proposal.proposalKeywords[i].scienceKeywordCode == keyword.scienceKeywordCode) {
                if (this.result.proposal.proposalKeywords[i].keywordId != null) {
                    this.proposalCreateService.deleteProposalKeyword(this.result.proposal.proposalId, keyword.keywordId).subscribe(function (success) {
                        var temp = {};
                        temp = success;
                        _this.result.proposal.proposalKeywords.splice(k, 1);
                    });
                }
                else {
                    this.result.proposal.proposalKeywords.splice(k, 1);
                }
            }
        }
        this.selectedKeyword = '';
    };
    ProposalComponent.prototype.keywordChangeFunction = function () {
        var d = new Date();
        var timeStamp = d.getTime();
        var keywordFlag = false;
        this.keywordObject = {};
        if (this.result.proposal.proposalKeywords.length != 0) {
            for (var _i = 0, _a = this.result.proposal.proposalKeywords; _i < _a.length; _i++) {
                var word = _a[_i];
                if (word.scienceKeyword.description == this.selectedKeyword) {
                    keywordFlag = true;
                    this.isKeywordWarning = true;
                    this.keywordWarningText = "Keyword already added";
                    break;
                }
            }
        }
        if (keywordFlag == false) {
            for (var _b = 0, _c = this.result.scienceKeywords; _b < _c.length; _b++) {
                var keyword = _c[_b];
                if (keyword.description == this.selectedKeyword) {
                    this.keywordObject.scienceKeyword = keyword;
                    this.keywordObject.scienceKeywordCode = keyword.code;
                    this.keywordObject.updateTimeStamp = timeStamp;
                    this.keywordObject.updateUser = this.currentUser;
                    this.result.proposal.proposalKeywords.push(this.keywordObject);
                    this.isKeywordWarning = false;
                    this.keywordWarningText = null;
                    break;
                }
            }
        }
        else {
            this.isKeywordWarning = true;
            this.keywordWarningText = "Keyword already added";
        }
        this.selectedKeyword = null;
    };
    ProposalComponent.prototype.grantCallChangeFunction = function () {
        var d = new Date();
        var timeStamp = d.getTime();
        for (var _i = 0, _a = this.result.grantCalls; _i < _a.length; _i++) {
            var grant = _a[_i];
            if (grant.grantCallName == this.selectedGrantCall) {
                this.result.proposal.grantCall = grant;
                this.result.proposal.grantCallId = grant.grantCallId;
                this.result.proposal.grantCallType = grant.grantCallType;
                this.result.proposal.grantCall.updateTimeStamp = timeStamp;
                this.result.proposal.grantCall.updateUser = this.currentUser;
            }
        }
        this.changeRef.detectChanges();
        this.selectedGrantCall = null;
    };
    ProposalComponent.prototype.removeSelectedGrant = function (e) {
        e.preventDefault();
        this.result.proposal.grantCall = null;
        this.result.proposal.grantCallType = this.result.defaultGrantCallType;
        this.selectedGrantCall = null;
    };
    ProposalComponent.prototype.addProposalTeamMember = function () {
        var _this = this;
        var personFlag = false;
        if (this.selectedMember != null && this.personRoleSelected != this.select) {
            var tempObj = {};
            if (!this.nonEmployeeFlag) {
                tempObj.personId = this.selectedMember.prncpl_id;
                tempObj.fullName = this.selectedMember.full_name;
                tempObj.leadUnitNumber = this.selectedMember.unit_number;
                tempObj.leadUnitName = this.selectedMember.unit_name;
            }
            else {
                tempObj.rolodexId = this.selectedMember.rolodex_id;
                tempObj.fullName = this.selectedMember.last_name + ' , ' + this.selectedMember.middle_name + ' ' + this.selectedMember.first_name;
                tempObj.leadUnitNumber = null;
                tempObj.leadUnitName = this.selectedMember.organization;
            }
            this.personRolesList.forEach(function (value, index) {
                if (value.description == _this.personRoleSelected) {
                    tempObj.proposalPersonRole = value;
                    tempObj.personRoleId = value.id;
                }
            });
            if (this.result.proposal.proposalPersons.length != 0) {
                for (var _i = 0, _a = this.result.proposal.proposalPersons; _i < _a.length; _i++) {
                    var person = _a[_i];
                    if (person.fullName == tempObj.fullName) {
                        personFlag = true;
                        this.personWarningFlag = true;
                        this.personWarningMsg = 'You have already added ' + tempObj.fullName;
                        this.selectedMember = null;
                        break;
                    }
                }
            }
            if (personFlag == false) {
                tempObj.updateTimeStamp = (new Date()).getTime();
                tempObj.updateUser = this.currentUser;
                if (this.result.proposal.proposalPersons == null) {
                    this.result.proposal.proposalPersons = [];
                }
                this.result.proposal.proposalPersons.push(tempObj);
                this.selectedMember = null;
                this.memberTypeSelected = 'Employee';
                this.memberTypeChanged();
                this.personRoleSelected = this.select;
                this.personWarningFlag = false;
                this.personWarningMsg = null;
            }
            else {
                this.personWarningFlag = true;
                this.personWarningMsg = 'You have already added ' + tempObj.fullName;
                this.selectedMember = null;
            }
        }
        else if (this.personRoleSelected == this.select) {
            this.personWarningFlag = true;
            this.personWarningMsg = '* Please choose a role';
        }
        else {
            this.personWarningFlag = true;
            this.personWarningMsg = 'Please choose name of a member';
        }
    };
    ProposalComponent.prototype.tempSavePerson = function ($event, person, i) {
        $event.preventDefault();
        this.showDeleteMember = true;
        this.tempSavePersonObject = person;
        this.index = i;
    };
    ProposalComponent.prototype.deletePerson = function () {
        var _this = this;
        this.showDeleteMember = false;
        if (this.tempSavePersonObject.proposalPersonId == null) {
            this.result.proposal.proposalPersons.splice(this.index, 1);
        }
        else {
            this.proposalCreateService.deleteProposalPerson(this.result.proposal.proposalId, this.tempSavePersonObject.proposalPersonId).subscribe(function (success) {
                var temp = success;
                _this.result.proposal.proposalPersons.splice(_this.index, 1);
                _this.changeRef.detectChanges();
            });
        }
        this.memberTypeSelected = 'Employee';
        this.memberTypeChanged();
    };
    ProposalComponent.prototype.budgetCategoryChanged = function () {
        var _this = this;
        var budgetCategoryCode = '';
        this.result.proposalBudgetCategories.forEach(function (value, index) {
            if (value.description == _this.budgetCategorySelected) {
                budgetCategoryCode = value.budgetCategoryCode;
            }
        });
        this.proposalCreateService.fetchCostElementData(budgetCategoryCode).subscribe(function (success) {
            var temp = {};
            temp = success;
            _this.result.proposalCostElements = temp.proposalCostElements;
            _this.costElementSelected = _this.select;
            _this.changeRef.detectChanges();
        });
    };
    ProposalComponent.prototype.addBudget = function () {
        var _this = this;
        if (this.budgetCost != null && this.budgetCategorySelected != this.select && this.costElementSelected != this.select) {
            this.budgetWarningFlag = false;
            var tempObj = {};
            this.result.proposalBudgetCategories.forEach(function (value, index) {
                if (value.description == _this.budgetCategorySelected) {
                    tempObj.budgetCategoryCode = value.budgetCategoryCode;
                    tempObj.budgetCategory = value;
                }
            });
            this.result.proposalCostElements.forEach(function (value, index) {
                if (value.description == _this.costElementSelected) {
                    tempObj.costElement = value.costElement;
                    tempObj.proposalCostElement = value;
                }
            });
            tempObj.cost = this.budgetCost;
            tempObj.description = this.budgetDescription;
            tempObj.updateTimeStamp = (new Date()).getTime();
            tempObj.updateUser = this.currentUser;
            this.result.proposal.proposalBudgets.push(tempObj);
            this.budgetDescription = "";
            this.budgetCost = null;
            this.costElementSelected = this.select;
            this.budgetCategorySelected = this.select;
        }
        else if (this.budgetCategorySelected == this.select) {
            this.budgetWarningFlag = true;
            this.budgetWarningMsg = '* Please choose budget category';
        }
        else if (this.costElementSelected == this.select) {
            this.budgetWarningFlag = true;
            this.budgetWarningMsg = '* Please choose a cost element';
        }
        else {
            this.budgetWarningFlag = true;
            this.budgetWarningMsg = 'Please enter budget cost';
        }
    };
    ProposalComponent.prototype.deleteBudgetConfirmation = function (e, budget, i) {
        e.preventDefault();
        this.index = i;
        this.tempBudgetObject = budget;
        this.showDeleteBudget = true;
    };
    ProposalComponent.prototype.deleteBudget = function () {
        var _this = this;
        this.showDeleteBudget = false;
        if (this.tempBudgetObject.budgetId == null) {
            this.result.proposal.proposalBudgets.splice(this.index, 1);
        }
        else {
            this.proposalCreateService.deleteBudget(this.result.proposal.proposalId, this.tempBudgetObject.budgetId).subscribe(function (success) {
                var temp = success;
                _this.result.proposal.proposalBudgets.splice(_this.index, 1);
                _this.changeRef.detectChanges();
            });
        }
    };
    ////// Methods by Ashik Varma
    ProposalComponent.prototype.addAttachments = function () {
        var _this = this;
        debugger;
        var d = new Date();
        var timestamp = d.getTime();
        if (this.selectedAttachmentType == this.select) {
        }
        else {
            for (var _i = 0, _a = this.result.proposalAttachmentTypes; _i < _a.length; _i++) {
                var attachmentType = _a[_i];
                if (attachmentType.description == this.selectedAttachmentType) {
                    this.attachmentObject = attachmentType;
                }
            }
            var tempObjectForAdd = {};
            tempObjectForAdd.attachmentType = this.attachmentObject;
            tempObjectForAdd.attachmentTypeCode = this.attachmentObject.attachmentTypeCode;
            tempObjectForAdd.description = this.attachmentDescription;
            tempObjectForAdd.updateTimeStamp = timestamp;
            tempObjectForAdd.updateUser = this.currentUser;
            this.result.newAttachment = tempObjectForAdd;
            this.proposalCreateService.addProposalAttachment(this.result.proposal, this.result.newAttachment, this.uploadedFile).subscribe(function (success) {
                var temporaryObject = {};
                temporaryObject = success;
                _this.result.proposal = temporaryObject.proposal;
            }, function (error) { console.log(error); }, function () {
                _this.closeAttachments();
            });
        }
    };
    ProposalComponent.prototype.showAddAttachmentPopUp = function (e) {
        e.preventDefault();
        this.showAddAttachment = true;
        this.uploadedFile = [];
        this.attachmentDescription = '';
    };
    ProposalComponent.prototype.tempSaveAttachments = function (e, attachments, i) {
        this.tempSaveAttachment = attachments;
        this.index = i;
        this.showDeleteAttachment = true;
    };
    ProposalComponent.prototype.onChange = function (files) {
        this.file = files;
        this.ismandatoryFilled = true;
        for (var i = 0; i < this.file.length; i++) {
            this.uploadedFile.push(this.file[i]);
        }
    };
    ProposalComponent.prototype.dropped = function (event) {
        var _this = this;
        this.files = event.files;
        this.ismandatoryFilled = true;
        for (var _i = 0, _a = event.files; _i < _a.length; _i++) {
            var file = _a[_i];
            file.fileEntry.file(function (info) {
                _this.uploadedFile.push(info);
                _this.changeRef.detectChanges();
            });
        }
    };
    //delete file function
    ProposalComponent.prototype.deleteFromUploadedFileList = function (item) {
        for (var i = 0; i < this.uploadedFile.length; i++) {
            if (this.uploadedFile[i].name == item.name) {
                this.uploadedFile.splice(i, 1);
                this.changeRef.detectChanges();
            }
        }
    };
    ProposalComponent.prototype.closeAttachments = function () {
        this.showAddAttachment = false;
        this.uploadedFile = [];
    };
    ////// Methods by Ashik Varma ends for Attachments
    ProposalComponent.prototype.deleteAttachments = function (e) {
        var _this = this;
        e.preventDefault();
        this.showDeleteAttachment = false;
        if (this.tempSaveAttachment.attachmentId == null) {
            this.result.proposal.proposalAttachments.splice(this.index, 1);
        }
        else {
            this.proposalCreateService.deleteProposalAttachment(this.result.proposal.proposalId, this.tempSaveAttachment.attachmentId).subscribe(function (success) {
                var temp = {};
                temp = success;
                _this.result.proposal.proposalAttachments.splice(_this.index, 1);
                _this.changeRef.detectChanges();
            });
        }
    };
    ProposalComponent.prototype.downloadAttachments = function (event, attachment) {
        event.preventDefault();
        if (attachment.attachmentId != null) {
            this.proposalCreateService.downloadProposalAttachment(attachment.attachmentId).takeUntil(this.onDestroy$).subscribe(function (data) {
                var a = document.createElement("a");
                a.href = URL.createObjectURL(data);
                a.download = attachment.fileName;
                a.click();
            });
        }
        else {
            var url = "data:" + attachment.mimeType + ";base64," + attachment.attachment;
            var a = document.createElement("a");
            a.href = url;
            a.download = attachment.fileName;
            a.click();
        }
    };
    ProposalComponent.prototype.addArea = function () {
        var d = new Date();
        var timeStamp = d.getTime();
        var list = [];
        var areaFlag = false;
        if (this.selectedArea == null || this.selectedArea == "") {
            this.isAreaWarning = true;
            this.areaWarningText = '* Select an area of research/excellence';
        }
        else {
            this.areaWarningText = null;
            this.isAreaWarning = false;
            if (this.result.proposal.proposalResearchAreas.length != 0 && this.selectedAreaType == 'Area of Excellence') {
                for (var _i = 0, _a = this.result.proposal.proposalResearchAreas; _i < _a.length; _i++) {
                    var area = _a[_i];
                    if (area.proposalExcellenceArea != undefined && area.proposalExcellenceArea.description == this.selectedArea) {
                        areaFlag = true;
                        this.isAreaWarning = true;
                        this.areaWarningText = 'Area already added';
                        break;
                    }
                }
            }
            else if (this.result.proposal.proposalResearchAreas.length != 0 && this.selectedAreaType == 'Area of Research') {
                for (var _b = 0, _c = this.result.proposal.proposalResearchAreas; _b < _c.length; _b++) {
                    var area = _c[_b];
                    if (area.researchArea != undefined && area.researchArea.description == this.selectedArea) {
                        areaFlag = true;
                        this.isAreaWarning = true;
                        this.areaWarningText = 'Area already added';
                        break;
                    }
                }
            }
            if (areaFlag == false) {
                if (this.selectedAreaType == 'Area of Excellence') {
                    for (var _d = 0, _e = this.result.proposalExcellenceAreas; _d < _e.length; _d++) {
                        var excellence = _e[_d];
                        if (excellence.description == this.selectedArea) {
                            var tempObj = {};
                            tempObj.researchTypeCode = this.result.proposalResearchTypes[0].researchTypeCode;
                            tempObj.proposalResearchType = this.result.proposalResearchTypes[0];
                            tempObj.excellenceAreaCode = excellence.excellenceAreaCode;
                            tempObj.proposalExcellenceArea = excellence;
                            tempObj.updateTimeStamp = timeStamp;
                            tempObj.updateUser = this.currentUser;
                            this.result.proposal.proposalResearchAreas.push(tempObj);
                            this.isAreaWarning = false;
                            this.areaWarningText = null;
                        }
                    }
                }
                else {
                    for (var _f = 0, _g = this.result.researchAreas; _f < _g.length; _f++) {
                        var researchArea = _g[_f];
                        if (researchArea.description == this.selectedArea) {
                            var tempObj = {};
                            tempObj.researchTypeCode = this.result.proposalResearchTypes[1].researchTypeCode;
                            tempObj.proposalResearchType = this.result.proposalResearchTypes[1];
                            tempObj.researchAreaCode = researchArea.researchAreaCode;
                            tempObj.researchArea = researchArea;
                            tempObj.updateTimeStamp = timeStamp;
                            tempObj.updateUser = this.currentUser;
                            this.result.proposal.proposalResearchAreas.push(tempObj);
                            this.isAreaWarning = false;
                            this.areaWarningText = null;
                        }
                    }
                }
            }
            else {
                this.isAreaWarning = true;
                this.areaWarningText = 'Area already added';
            }
        }
        this.selectedArea = "";
    };
    ProposalComponent.prototype.saveProposal = function () {
        var _this = this;
        var type = (this.result.proposal.proposalId != null) ? "UPDATE" : "SAVE";
        // proposal details validation
        if (this.result.proposal.title == "" || this.result.proposal.title == null) {
            this.isMandatory = true;
            this.mandatoryText = '* Please enter a title';
        }
        else if (this.proposalCategorySelected == this.select) {
            this.isMandatory = true;
            this.mandatoryText = '* Please choose a category';
        }
        else if (this.proposalTypeSelected == this.select) {
            this.isMandatory = true;
            this.mandatoryText = '* Please choose proposal type';
        }
        else {
            this.isMandatory = false;
            this.dateValidation();
        }
        // AOR validation
        if (this.result.proposal.proposalResearchAreas.length > 0) {
            this.areaWarningText = null;
            this.isAreaWarning = false;
        }
        else {
            this.isAreaWarning = true;
            this.areaWarningText = '* Select an area of research/excellence';
        }
        var flag = false;
        if (this.result.proposal.proposalPersons.length > 0) {
            this.result.proposal.proposalPersons.forEach(function (value, index) {
                if (value.proposalPersonRole.description == 'Principal Investigator') {
                    flag = true;
                }
            });
            if (flag == false) {
                this.personWarningMsg = '* Select a member as PI';
                this.personWarningFlag = true;
            }
            else {
                this.personWarningMsg = null;
                this.personWarningFlag = false;
            }
        }
        else {
            this.personWarningFlag = true;
            this.personWarningMsg = '* Select atleast one team member';
        }
        //this.showAddedModal = true;
        if (!this.isMandatory && !this.isDateWarningText && !this.isAreaWarning && !this.personWarningFlag && this.result.proposal.proposalPersons.length > 0 && this.result.proposal.proposalResearchAreas.length > 0) {
            this.proposalCreateService.saveProposal(this.result.proposal, type).subscribe(function (data) {
                var temp = data;
                _this.result.proposal = temp.proposal;
                //this.isProposalSaved = true;
                _this.showSuccessMessage = true;
                _this.successMessage = 'Proposal has been saved successfully.';
                setTimeout(function () {
                    _this.showSuccessMessage = false;
                }, 8000);
                window.scrollTo(0, 0);
            });
        }
        else {
            //this.isProposalSaved = false;
            this.showSuccessMessage = true;
            this.successMessage = 'Error in saving proposal, please review whether mandatory fields are filled';
            setTimeout(function () {
                _this.showSuccessMessage = false;
            }, 8000);
            window.scrollTo(0, 0);
        }
    };
    ProposalComponent.prototype.submitProposal = function () {
        var _this = this;
        if (this.result.proposal.title == "" || this.result.proposal.title == null) {
            this.isMandatory = true;
            this.mandatoryText = '* Please enter a title';
        }
        else if (this.proposalCategorySelected == this.select) {
            this.isMandatory = true;
            this.mandatoryText = '* Please choose a category';
        }
        else if (this.proposalTypeSelected == this.select) {
            this.isMandatory = true;
            this.mandatoryText = '* Please choose proposal type';
        }
        else {
            this.isMandatory = false;
            this.dateValidation();
        }
        // AOR validation
        if (this.result.proposal.proposalResearchAreas.length > 0) {
            this.areaWarningText = null;
            this.isAreaWarning = false;
        }
        else {
            this.isAreaWarning = true;
            this.areaWarningText = '* Select an area of research/excellence';
        }
        // Project members validation
        var flag = false;
        if (this.result.proposal.proposalPersons.length > 0) {
            this.result.proposal.proposalPersons.forEach(function (value, index) {
                if (value.proposalPersonRole.description == 'Principal Investigator') {
                    flag = true;
                }
            });
            if (flag == false) {
                this.personWarningMsg = '* Select a member as PI';
                this.personWarningFlag = true;
            }
            else {
                this.personWarningMsg = null;
                this.personWarningFlag = false;
            }
        }
        else {
            this.personWarningFlag = true;
            this.personWarningMsg = '* Select atleast one team member';
        }
        //this.showSubmittedModal = true;
        if (!this.isMandatory && !this.isDateWarningText && !this.isAreaWarning && !this.personWarningFlag && !this.isFundingWarning && !this.isIRBWarning && !this.budgetWarningFlag && this.result.proposal.proposalPersons.length > 0 && this.result.proposal.proposalResearchAreas.length > 0) {
            this.mode = 'view';
            if (this.result.proposal.statusCode == 9) {
                this.result.proposalStatusCode = 9;
            }
            else {
                this.result.proposalStatusCode = 2; // proposal status is set to Approval In Progress
            }
            //this.showAddedModal = false;
            this.proposalCreateService.submitProposal(this.result.proposal, localStorage.getItem('currentUser'), this.result.proposalStatusCode).subscribe(function (data) {
                var temp = data;
                _this.result.proposal = temp.proposal;
                _this.result.workflow = temp.workflow;
                _this.updateWorkflowStops();
                _this.updateRouteLogHeader();
                _this.showSuccessMessage = true;
                _this.successMessage = 'Proposal submitted successfully';
                setTimeout(function () {
                    _this.showSuccessMessage = false;
                }, 8000);
                window.scrollTo(0, 0);
                //this.isProposalSubmitted = true;
                _this.router.navigate(['/proposal/viewSubmittedProposal'], { queryParams: { 'mode': _this.mode, 'proposalId': _this.result.proposal.proposalId } });
            });
        }
        else {
            this.showSuccessMessage = true;
            this.successMessage = 'Error in saving proposal, please review whether mandatory fields are filled';
            setTimeout(function () {
                _this.showSuccessMessage = false;
            }, 8000);
            window.scrollTo(0, 0);
            //this.isProposalSubmitted = false;
        }
    };
    ProposalComponent.prototype.deleteArea = function () {
        if (this.tempAreaObject.researchAreaId != null) {
            //serviceCall
            this.proposalCreateService.deleteProposalResearchArea(this.result.proposal.proposalId, this.tempAreaObject.researchAreaId).subscribe();
            this.result.proposal.proposalResearchAreas.splice(this.index, 1);
        }
        else {
            this.result.proposal.proposalResearchAreas.splice(this.index, 1);
        }
    };
    ProposalComponent.prototype.tempSaveArea = function (e, area, i) {
        this.showDeleteResearchArea = true;
        e.preventDefault();
        this.tempAreaObject = area;
        this.index = i;
    };
    ProposalComponent.prototype.addIRB = function () {
        var tempObj = {};
        var irbFlag = false;
        if (this.selectedProtocol == null || this.selectedProtocol == '') {
            this.isIRBWarning = true;
            this.irbWarningText = "Please choose a protocol";
        }
        else {
            if (this.result.proposal.proposalIrbProtocols.length != 0) {
                for (var _i = 0, _a = this.result.proposal.proposalIrbProtocols; _i < _a.length; _i++) {
                    var protocol = _a[_i];
                    if (protocol.protocol.title == this.selectedProtocol) {
                        irbFlag = true;
                        this.isIRBWarning = true;
                        this.irbWarningText = "Protocol already added";
                        break;
                    }
                }
            }
            if (irbFlag == false) {
                for (var _b = 0, _c = this.result.protocols; _b < _c.length; _b++) {
                    var protocol = _c[_b];
                    if (protocol.title == this.selectedProtocol) {
                        tempObj.protocolId = protocol.protocolId;
                        tempObj.protocol = protocol;
                        tempObj.updateTimeStamp = (new Date()).getTime();
                        tempObj.updateUser = localStorage.getItem('currentUser');
                        this.result.proposal.proposalIrbProtocols.push(tempObj);
                        break;
                    }
                }
                this.isIRBWarning = false;
                this.irbWarningText = null;
            }
            else {
                this.isIRBWarning = true;
                this.irbWarningText = "Protocol already added";
            }
            this.selectedProtocol = null;
        }
    };
    ProposalComponent.prototype.tempSaveIRB = function (e, irb) {
        e.preventDefault();
        this.showDeleteIRB = true;
        this.tempSaveIRBObject = irb;
    };
    ProposalComponent.prototype.deleteIRB = function () {
        if (this.tempSaveIRBObject.irbProtocolId != null) {
            this.proposalCreateService.deleteIrbProtocol(this.result.proposal.proposalId, this.tempSaveIRBObject.irbProtocolId).subscribe(function (data) { });
            this.result.proposal.proposalIrbProtocols.splice(this.index, 1);
        }
        else {
            this.result.proposal.proposalIrbProtocols.splice(this.index, 1);
        }
    };
    ProposalComponent.prototype.sponsorTypeChange = function () {
        var _this = this;
        if (this.selectedSponsorType != this.select) {
            for (var _i = 0, _a = this.result.sponsorTypes; _i < _a.length; _i++) {
                var type = _a[_i];
                if (type.description == this.selectedSponsorType) {
                    this.grantService.fetchSponsorsBySponsorType(type.code).subscribe(function (data) {
                        var temp = {};
                        temp = data;
                        _this.result.sponsors = temp.sponsors;
                        _this.selectedSponsorName = _this.select;
                    });
                    break;
                }
            }
        }
    };
    ProposalComponent.prototype.sponsorDateValidation = function () {
        if (this.fundingStartDate == null) {
            this.isFundingWarning = true;
            this.fundingWarningText = '* Please select start date';
        }
        else if (this.fundingEndDate == null) {
            this.isFundingWarning = true;
            this.fundingWarningText = '* Please select end date';
        }
        else if (this.fundingStartDate > this.fundingEndDate) {
            this.isFundingWarning = true;
            this.fundingWarningText = '* Please select an end date after start date';
        }
        else {
            this.isFundingWarning = false;
            this.fundingWarningText = null;
        }
    };
    ProposalComponent.prototype.addSponsor = function () {
        this.sponsorDateValidation();
        var tempSponsorObject = {};
        if (this.fundingStartDate != null && this.fundingEndDate != null && this.fundingStartDate <= this.fundingEndDate) {
            if (this.selectedSponsorName != this.select && this.selectedSponsorType != this.select) {
                for (var _i = 0, _a = this.result.sponsors; _i < _a.length; _i++) {
                    var sponsor = _a[_i];
                    if (sponsor.sponsorName == this.selectedSponsorName) {
                        tempSponsorObject.sponsor = sponsor;
                        tempSponsorObject.sponsorCode = sponsor.sponsorCode;
                        tempSponsorObject.updateTimeStamp = (new Date()).getTime();
                        tempSponsorObject.updateUser = localStorage.getItem('currentUser');
                    }
                }
                tempSponsorObject.startDate = this.fundingStartDate;
                tempSponsorObject.endDate = this.fundingEndDate;
                tempSponsorObject.amount = this.sponsorAmount;
                this.isFundingWarning = false;
                this.fundingWarningText = null;
                this.result.proposal.proposalSponsors.push(tempSponsorObject);
                this.selectedSponsorType = this.select;
                this.selectedSponsorName = this.select;
                this.fundingStartDate = null;
                this.fundingEndDate = null;
                this.sponsorAmount = 0;
            }
            else if (this.selectedSponsorType == this.select) {
                this.isFundingWarning = true;
                this.fundingWarningText = '* Please select funding agency type';
            }
            else {
                this.isFundingWarning = true;
                this.fundingWarningText = '* Please select funding agency name';
            }
        }
    };
    ProposalComponent.prototype.tempSaveSponsor = function (sponsor, i) {
        this.tempSaveSponsorObject = sponsor;
        this.showDeleteSponsor = true;
        this.index = i;
    };
    ProposalComponent.prototype.deleteSponsor = function () {
        if (this.tempSaveSponsorObject.sponsorId != null) {
            this.proposalCreateService.deleteProposalSponsor(this.result.proposal.proposalId, this.tempSaveSponsorObject.sponsorId).subscribe(function (data) { });
            this.result.proposal.proposalSponsors.splice(this.index, 1);
        }
        else {
            this.result.proposal.proposalSponsors.splice(this.index, 1);
        }
    };
    ProposalComponent.prototype.proposalCategoryChange = function () {
        if (this.proposalCategorySelected != this.select) {
            for (var _i = 0, _a = this.result.proposalCategories; _i < _a.length; _i++) {
                var category = _a[_i];
                if (category.description == this.proposalCategorySelected) {
                    this.result.proposal.categoryCode = category.categoryCode;
                    this.result.proposal.proposalCategory = category;
                    this.proposalCategorySelected = category.description;
                }
            }
        }
    };
    ProposalComponent.prototype.proposalTypeChange = function () {
        if (this.proposalTypeSelected != this.select) {
            for (var _i = 0, _a = this.result.proposalTypes; _i < _a.length; _i++) {
                var proposalType = _a[_i];
                if (proposalType.description == this.proposalTypeSelected) {
                    this.result.proposal.proposalType = proposalType;
                    this.result.proposal.typeCode = proposalType.typeCode;
                    this.proposalTypeSelected = proposalType.description;
                }
            }
        }
    };
    ProposalComponent.prototype.labICLChange = function () {
        if (this.selectedICLLab != this.select) {
            for (var _i = 0, _a = this.result.proposalInstituteCentreLabs; _i < _a.length; _i++) {
                var icl = _a[_i];
                if (icl.description == this.selectedICLLab) {
                    this.result.proposal.iclCode = icl.iclCode;
                    this.result.proposal.proposalInstituteCentreLab = icl;
                    this.selectedICLLab = icl.description;
                }
            }
        }
    };
    ProposalComponent.prototype.openRouteLog = function () {
        this.isRoutelogOpened = true;
    };
    ProposalComponent.prototype.disapproveProposal = function () {
        this.sendObject = {};
        this.approveDisapprovePlaceHolder = 'Comments on disapproving the proposal';
        this.modalAproveHeading = 'Disapprove';
        this.sendObject.actionType = 'R';
        this.showApproveDisapproveModal = true;
    };
    ProposalComponent.prototype.approveProposal = function () {
        this.sendObject = {};
        this.approveDisapprovePlaceHolder = 'Comments on approving the proposal';
        this.modalAproveHeading = 'Approve';
        this.sendObject.actionType = 'A';
        this.showApproveDisapproveModal = true;
    };
    ProposalComponent.prototype.approveDisapproveProposal = function () {
        var _this = this;
        this.sendObject.personId = localStorage.getItem('personId');
        this.sendObject.proposal = this.result.proposal;
        this.sendObject.approverStopNumber = this.result.approverStopNumber;
        this.sendObject.approveComment = this.approveComments;
        this.proposalCreateService.approveDisapproveProposal(this.sendObject, this.uploadedFile).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.result = temp;
            _this.initialiseProposalFormElements();
            _this.changeRef.detectChanges();
        });
        this.showApproveDisapproveModal = false;
    };
    ProposalComponent.prototype.getAllReviewer = function () {
        var _this = this;
        this.showReviewerModal = true;
        this.proposalCreateService.fetchAvailableReviewers(this.result.proposal, this.result.personId).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.availableReviewers = temp.availableReviewers;
            _this.tempLoggedWorkflowDetail = temp.loggedInWorkflowDetail;
            _this.result.loggedInWorkflowDetail = _.cloneDeep(temp.loggedInWorkflowDetail);
            _this.reviewerList = _this.completerService.local(_this.availableReviewers, 'approverPersonName', 'approverPersonName');
            _this.changeRef.detectChanges();
        });
    };
    ProposalComponent.prototype.removeSelectedReviewer = function ($event, reviewer, i) {
        var _this = this;
        $event.preventDefault();
        if (this.result.loggedInWorkflowDetail.workflowReviewerDetails.length > 0) {
            if (reviewer.reviewerPersonId != null) {
                this.proposalCreateService.deleteAssignedReviewer(this.result.proposal.proposalId, reviewer.reviewerPersonId).subscribe(function (data) {
                    var temp;
                    temp = data;
                    _this.updateFlags(temp);
                    _this.result.workflow = temp.workflow;
                    _this.updateWorkflowStops();
                });
                this.result.loggedInWorkflowDetail.workflowReviewerDetails.splice(i, 1);
            }
            else {
                this.result.loggedInWorkflowDetail.workflowReviewerDetails.splice(i, 1);
            }
        }
    };
    ProposalComponent.prototype.reviewerChangeFunction = function () {
        var d = new Date();
        var timeStamp = d.getTime();
        if (this.result.loggedInWorkflowDetail == null) {
            this.result.loggedInWorkflowDetail = {};
        }
        if (this.result.loggedInWorkflowDetail.workflowReviewerDetails == null) {
            this.result.loggedInWorkflowDetail.workflowReviewerDetails = [];
        }
        for (var _i = 0, _a = this.availableReviewers; _i < _a.length; _i++) {
            var reviewer = _a[_i];
            if (reviewer.approverPersonName == this.selectedReviewer) {
                var assignedReviewer = {};
                assignedReviewer.reviewerPersonId = reviewer.approverPersonId;
                assignedReviewer.reviewerPersonName = reviewer.approverPersonName;
                assignedReviewer.approvalStatusCode = "W";
                assignedReviewer.workflowDetail = _.cloneDeep(this.tempLoggedWorkflowDetail);
                assignedReviewer.workflowStatus = this.tempLoggedWorkflowDetail.workflowStatus;
                assignedReviewer.updateTimeStamp = (new Date()).getTime();
                assignedReviewer.updateUser = localStorage.getItem('currentUser');
                this.result.loggedInWorkflowDetail.workflowReviewerDetails.push(assignedReviewer);
            }
        }
        this.changeRef.detectChanges();
        this.selectedReviewer = null;
    };
    ProposalComponent.prototype.addReviewer = function () {
        var _this = this;
        this.proposalCreateService.assignReviewer(this.result.proposal, this.result.loggedInWorkflowDetail, this.result.proposal.proposalId).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.result.proposal = temp.proposal;
            _this.result.workflow = temp.workflow;
            _this.result.loggedInWorkflowDetail = temp.loggedInWorkflowDetail;
            _this.updateFlags(temp);
            _this.updateWorkflowStops();
            _this.updateRouteLogHeader();
            _this.changeRef.detectChanges();
        });
        this.showReviewerModal = false;
    };
    ProposalComponent.prototype.completeReview = function () {
        var _this = this;
        this.sendObject.proposal = this.result.proposal;
        this.sendObject.proposalId = this.result.proposal.proposalId;
        this.sendObject.userName = this.currentUser;
        this.sendObject.approveComment = this.approveComments;
        this.sendObject.personId = this.result.personId;
        this.proposalCreateService.completeReviewAction(this.sendObject, this.uploadedFile).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.result.workflow = temp.workflow;
            _this.updateFlags(temp);
            _this.updateWorkflowStops();
            _this.updateRouteLogHeader();
            _this.changeRef.detectChanges();
        });
        this.showApproveDisapproveModal = false;
    };
    ProposalComponent.prototype.downloadRouteAttachment = function (event, selectedFileName, selectedAttachArray) {
        event.preventDefault();
        var _loop_1 = function (attachment) {
            if (attachment.fileName == selectedFileName) {
                if (attachment.attachmentId != null) {
                    this_1.proposalCreateService.downloadRoutelogAttachment(attachment.attachmentId).takeUntil(this_1.onDestroy$).subscribe(function (data) {
                        var a = document.createElement("a");
                        a.href = URL.createObjectURL(data);
                        a.download = attachment.fileName;
                        a.click();
                    });
                }
                else {
                    url = "data:" + attachment.mimeType + ";base64," + attachment.attachment;
                    a = document.createElement("a");
                    a.href = url;
                    a.download = attachment.fileName;
                    a.click();
                }
            }
        };
        var this_1 = this, url, a;
        for (var _i = 0, selectedAttachArray_1 = selectedAttachArray; _i < selectedAttachArray_1.length; _i++) {
            var attachment = selectedAttachArray_1[_i];
            _loop_1(attachment);
        }
    };
    ProposalComponent.prototype.toggleReviewers = function ($event, i) {
        $event.preventDefault();
        this.isRevExpanded[i] = !this.isRevExpanded[i];
    };
    ProposalComponent.prototype.openConfirm = function (actionType) {
        this.showConfirmModal = true;
        if (actionType == 'submit') {
            this.isForward = true;
            this.confirmHeading = "Submit to Provost";
            this.confirmMessage = 'Are you sure you want to forward this proposal for endorsement ?';
        }
        else {
            this.isEndorse = true;
            this.confirmHeading = "Endorse";
            this.confirmMessage = 'Are you sure you want to endorse this proposal ?';
        }
    };
    ProposalComponent.prototype.submitToProvost = function () {
        var _this = this;
        this.proposalCreateService.submitForEndorsement(this.result.proposal.proposalId, this.result.proposal).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.result.proposal = temp.proposal;
            _this.updateRouteLogHeader();
            _this.showSuccessMessage = true;
            _this.successMessage = 'Proposal forwarded successfully for endorsement';
            setTimeout(function () {
                _this.showSuccessMessage = false;
            }, 8000);
            window.scrollTo(0, 0);
        });
        this.showConfirmModal = false;
    };
    ProposalComponent.prototype.approveEndorse = function () {
        var _this = this;
        this.proposalCreateService.approveByProvost(this.result.proposal.proposalId, this.result.proposal, this.userName).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.result.proposal = temp.proposal;
            _this.updateRouteLogHeader();
            _this.showSuccessMessage = true;
            _this.successMessage = 'Proposal awarded successfully. Institute Proposal #' + temp.ipNumber;
            setTimeout(function () {
                _this.showSuccessMessage = false;
            }, 8000);
            window.scrollTo(0, 0);
        });
        this.showConfirmModal = false;
    };
    ProposalComponent = __decorate([
        Component({
            selector: 'proposal',
            templateUrl: './proposal.component.html',
            providers: [SessionManagementService, ProposalCreateEditService, CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService],
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css'],
        }),
        __metadata("design:paramtypes", [GrantService, CommitteeMemberNonEmployeeElasticService, CommitteeMemberEmployeeElasticService, NgZone, ChangeDetectorRef, ActivatedRoute, Router, SessionManagementService, ProposalCreateEditService, CompleterService])
    ], ProposalComponent);
    return ProposalComponent;
}());
export { ProposalComponent };
//# sourceMappingURL=proposal.component.js.map