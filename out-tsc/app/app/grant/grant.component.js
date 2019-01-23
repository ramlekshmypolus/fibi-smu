var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompleterService } from 'ng2-completer';
import { Subject } from 'rxjs';
import { GrantService } from "./grant.service";
import { SessionManagementService } from '../session/session-management.service';
var GrantComponent = (function () {
    function GrantComponent(changeRef, completerService, router, route, grantService, sessionService) {
        this.changeRef = changeRef;
        this.completerService = completerService;
        this.router = router;
        this.route = route;
        this.grantService = grantService;
        this.sessionService = sessionService;
        this.mode = "create";
        this.grantId = "";
        this.editClass = "committeeBox";
        this.addResearch = false;
        this.showAddAttachment = false;
        this.isEligibleAddopen = false;
        this.showAddPointOfContact = false;
        this.editScheduleattachment = true;
        this.result = {};
        this.status = "hello";
        this.keywordsList = [];
        this.keywordDisplayList = [];
        this.keywordObject = {};
        this.grantCallTypeSelected = "Select";
        this.currentUser = localStorage.getItem('currentUser');
        this.uploadedFile = [];
        this.ismandatoryFilled = true;
        this.attachmentObject = {};
        this.files = [];
        this.pointOfContactObject = {};
        this.pointOfContactList = [];
        this.validationError = " ";
        this.valid = true;
        this.sponsorList = [];
        this.areaList = [];
        this.researchAreaList = [];
        this.saveType = "SAVE";
        this.selectedCriteria = "Select";
        this.selectedEligibilityType = "Select";
        this.eligibilityList = [];
        this.onDestroy$ = new Subject();
        this.temp2 = {};
        this.tempSaveAttachment = {};
        this.tempSavePOC = {};
        this.tempSaveResearchArea = {};
        this.tempSaveEligibility = {};
        this.showDeleteAttachment = false;
        this.showDeleteEligibility = false;
        this.selectedFundingType = "Select";
        this.selectedActivityType = "Select";
        this.showDeleteResearchArea = false;
        this.tempSavePointOfContactObject = {};
        this.showDeletePOC = false;
        this.showWarning = false;
        this.scrollToTop = "";
        this.showPublishWarning = false;
        this.currentDate = new Date();
        this.saveSuccessfulMessage = null;
        this.pocDuplicationMessage = false;
        this.eligibilityWarning = false;
        this.areaWarning = false;
        this.attachmentWarning = false;
        this.attachmentTypeWarning = false;
        this.isDateWarningText = false;
        this.dateWarningText = null;
        this.showSavedSuccessfully = false;
        this.homeUnits = [];
        if (!sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
        this.result.grantCall = {};
    }
    GrantComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.grantId = this.route.snapshot.queryParamMap.get('grantId');
        if (this.grantId == null) {
            this.mode = 'create';
            this.editClass = "committeeBox";
            this.loadGrantInitData();
        }
        else {
            this.grantService.loadGrantById(this.grantId).takeUntil(this.onDestroy$).subscribe(function (response) {
                _this.result = response;
                _this.changeRef.detectChanges();
                if (_this.result.grantCall.grantCallStatus.description == 'Draft') {
                    _this.mode = 'edit';
                    _this.editClass = "committeeBox";
                    _this.dateValidation();
                    if (_this.result.grantCall.sponsorCode != null) {
                        _this.grantService.fetchSponsorsBySponsorType(_this.result.grantCall.sponsorType.code).takeUntil(_this.onDestroy$).subscribe(function (success) {
                            var temp = {};
                            temp = success;
                            _this.sponsorList = temp.sponsors;
                            _this.selectedSponsorType = _this.result.grantCall.sponsorType.description;
                            _this.selectedSponsor = _this.result.grantCall.sponsor.sponsorName;
                            _this.selectedActivityType = _this.result.grantCall.activityType.description;
                            _this.selectedFundingType = _this.result.grantCall.fundingSourceType.description;
                        });
                    }
                    else {
                        _this.grantService.fetchSponsorsBySponsorType(_this.result.sponsorTypes[0].code).takeUntil(_this.onDestroy$).subscribe(function (success) {
                            var temp = {};
                            temp = success;
                            _this.sponsorList = temp.sponsors;
                            _this.selectedSponsorType = _this.result.sponsorTypes[0].description;
                            _this.selectedSponsor = temp.sponsors[0].sponsorName;
                            _this.selectedActivityType = _this.result.activityTypes[0].description;
                            _this.selectedFundingType = _this.result.fundingSourceTypes[0].description;
                            _this.sponsorTypeChange(_this.selectedSponsorType);
                            _this.sponsorNameChange(_this.selectedSponsor);
                            _this.researchTypeChange(_this.selectedActivityType);
                            _this.fundingTypeChange(_this.selectedFundingType);
                        });
                    }
                    _this.keywordsList = _this.completerService.local(_this.result.scienceKeywords, 'description', 'description');
                    _this.areaList = _this.completerService.local(_this.result.researchAreas, 'description', 'description');
                    _this.homeUnits = _this.completerService.local(_this.result.homeUnits, 'unitName', 'unitName');
                    _this.selectedHomeUnit = _this.result.grantCall.homeUnitName;
                }
                else {
                    _this.mode = 'view';
                    _this.editClass = "committeeBoxNotEditable";
                    _this.selectedHomeUnit = _this.result.grantCall.homeUnitName;
                }
                //placing list from loaded grantCall 
                _this.keywordDisplayList = _this.result.grantCall.grantCallKeywords;
                _this.eligibilityList = _this.result.grantCall.grantCallEligibilities;
                _this.grantCallTypeSelected = _this.result.grantCall.grantCallType.description;
            }, function (error) {
            });
        }
    };
    GrantComponent.prototype.differenceBetweenDates = function (startDate, endDate) {
        if (startDate == null) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Select a opening date';
        }
        else if (startDate > endDate) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Opening date is after closing date';
        }
        if (startDate != null && endDate != null && startDate <= endDate) {
            var diffInMs = Math.round(Date.parse(endDate) - Date.parse(startDate));
            // diffInMs = Math.round(1523507183000); for testing
            var difference = Math.floor(diffInMs / 1000 / 60 / 60 / 24 | 0);
            this.durInYears = Math.floor(difference / 365 | 0);
            difference = Math.floor(difference % 365 | 0);
            this.durInMonths = Math.floor(difference / 31 | 0);
            this.durInDays = Math.floor(difference % 31 | 0);
        }
    };
    GrantComponent.prototype.dateValidation = function () {
        if (this.result.grantCall.openingDate == null) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a opening date';
        }
        else if (new Date(this.result.grantCall.openingDate) < this.currentDate) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a opening date from today';
        }
        else if (this.result.grantCall.openingDate != null && this.result.grantCall.closingDate != null && new Date(this.result.grantCall.openingDate) <= new Date(this.result.grantCall.closingDate)) {
            this.isDateWarningText = false;
            this.differenceBetweenDates(this.result.grantCall.openingDate, this.result.grantCall.closingDate);
        }
        else if (this.result.grantCall.closingDate == null) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a closing date';
        }
        else if (new Date(this.result.grantCall.openingDate) > new Date(this.result.grantCall.closingDate)) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a closing date after opening date';
        }
        else if (this.result.grantCall.openingDate != null && this.result.grantCall.closingDate != null && new Date(this.result.grantCall.openingDate) <= new Date(this.result.grantCall.closingDate)) {
            this.isDateWarningText = false;
            this.differenceBetweenDates(this.result.grantCall.openingDate, this.result.grantCall.closingDate);
        }
        else {
            this.isDateWarningText = false;
        }
    };
    GrantComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    GrantComponent.prototype.loadGrantInitData = function () {
        var _this = this;
        this.grantService.createGrantCall().takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
            _this.grantService.fetchSponsorsBySponsorType(_this.result.sponsorTypes[0].code).takeUntil(_this.onDestroy$).subscribe(function (success) {
                var temp = {};
                temp = success;
                _this.sponsorList = temp.sponsors;
                _this.selectedSponsorType = _this.result.sponsorTypes[0].description;
                _this.selectedSponsor = temp.sponsors[0].sponsorName;
                _this.selectedActivityType = _this.result.activityTypes[0].description;
                _this.selectedFundingType = _this.result.fundingSourceTypes[0].description;
                _this.sponsorTypeChange(_this.selectedSponsorType);
                _this.sponsorNameChange(_this.selectedSponsor);
                _this.researchTypeChange(_this.selectedActivityType);
                _this.fundingTypeChange(_this.selectedFundingType);
            });
            _this.keywordsList = _this.completerService.local(_this.result.scienceKeywords, 'description', 'description');
            _this.areaList = _this.completerService.local(_this.result.researchAreas, 'description', 'description');
            _this.homeUnits = _this.completerService.local(_this.result.homeUnits, 'unitName', 'unitName');
        });
    };
    GrantComponent.prototype.showaddPointOfContact = function () {
        this.showAddPointOfContact = !this.showAddPointOfContact;
    };
    GrantComponent.prototype.addPointOfContact = function (pointOfContactObject) {
        this.pocDuplicationMessage = false;
        if (this.validateEmailAndMobile(this.pointOfContactObject.email.trim(), this.pointOfContactObject.mobile) && this.pointOfContactObject.fullName.trim().length > 0 && this.pointOfContactObject.designation.trim().length > 0) {
            if (this.result.grantCall.grantCallContacts.length != 0) {
                for (var _i = 0, _a = this.result.grantCall.grantCallContacts; _i < _a.length; _i++) {
                    var poc = _a[_i];
                    if (poc.email.trim() == this.pointOfContactObject.email.trim()) {
                        this.pocDuplicationMessage = true;
                    }
                }
            }
            if (this.pocDuplicationMessage == false) {
                this.pointOfContactObject.personId = "";
                this.result.grantCall.grantCallContacts.push(pointOfContactObject);
                this.pointOfContactObject = {};
                this.valid = true;
                this.changeRef.detectChanges();
            }
        }
        else {
            this.validationError = "Fields are incorrect or not filled";
            this.valid = false;
        }
    };
    GrantComponent.prototype.validateEmailAndMobile = function (mail, mobile) {
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail) && String(mobile).length >= 10) {
            return (true);
        }
        return (false);
    };
    GrantComponent.prototype.tempSavePointOfContact = function ($event, pointOfContact, k) {
        $event.preventDefault();
        this.tempSavePointOfContactObject = pointOfContact;
        this.index = k;
        this.showDeletePOC = true;
    };
    GrantComponent.prototype.deletePointOfContact = function ($event) {
        var _this = this;
        this.showDeletePOC = false;
        for (var index = 0; index < this.result.grantCall.grantCallContacts.length; index++) {
            if (this.tempSavePointOfContactObject.grantContactId == null) {
                if (index == this.index) {
                    this.result.grantCall.grantCallContacts.splice(this.index, 1);
                    this.changeRef.detectChanges();
                }
            }
            else {
                if (this.result.grantCall.grantCallContacts[index].grantContactId == this.tempSavePointOfContactObject.grantContactId) {
                    this.grantService.deleteGrantCallContact(this.result.grantCall.grantCallId, this.tempSavePointOfContactObject.grantContactId).subscribe(function (deleted) {
                        var temp = {};
                        temp = deleted;
                        _this.result.grantCall.grantCallContacts.splice(_this.index, 1);
                        _this.changeRef.detectChanges();
                    });
                }
            }
        }
    };
    GrantComponent.prototype.showaddAreaOfResearch = function () {
        this.addResearch = !this.addResearch;
    };
    GrantComponent.prototype.showaddEligibility = function () {
        this.isEligibleAddopen = !this.isEligibleAddopen;
    };
    GrantComponent.prototype.addEligibility = function () {
        var tempObj = {};
        var d = new Date();
        var timestamp = d.getTime();
        this.eligibilityWarning = false;
        if (this.selectedCriteria == null || this.selectedEligibilityType == null) {
        }
        else {
            for (var _i = 0, _a = this.result.grantCall.grantCallEligibilities; _i < _a.length; _i++) {
                var eligibility = _a[_i];
                if (eligibility.grantCallCriteria.description == this.selectedCriteria && eligibility.grantCallEligibilityType.description == this.selectedEligibilityType) {
                    this.eligibilityWarning = true;
                    break;
                }
            }
            if (this.eligibilityWarning == false) {
                label: for (var _b = 0, _c = this.result.grantCallCriterias; _b < _c.length; _b++) {
                    var criteria = _c[_b];
                    if (this.selectedCriteria == criteria.description) {
                        tempObj.grantCriteriaCode = criteria.grantCriteriaCode;
                        tempObj.grantCallCriteria = criteria;
                        for (var _d = 0, _e = this.result.grantCallEligibilityTypes; _d < _e.length; _d++) {
                            var type = _e[_d];
                            if (this.selectedEligibilityType == type.description) {
                                tempObj.grantEligibilityTypeCode = type.grantEligibilityTypeCode;
                                tempObj.grantCallEligibilityType = type;
                                tempObj.updateTimestamp = timestamp;
                                tempObj.updateUser = this.currentUser;
                                this.result.grantCall.grantCallEligibilities.push(tempObj);
                                break label;
                            }
                        }
                    }
                }
            }
        }
        this.selectedCriteria = "Select";
        this.selectedEligibilityType = "Select";
    };
    GrantComponent.prototype.tempSaveEligibilityObject = function ($event, eligibility, k) {
        this.showDeleteEligibility = true;
        this.tempSaveEligibility = eligibility;
        this.index = k;
    };
    GrantComponent.prototype.deleteEligibility = function ($event) {
        var _this = this;
        this.showDeleteEligibility = false;
        for (var i = 0; i < this.result.grantCall.grantCallEligibilities.length; i++) {
            if (this.tempSaveEligibility.grantEligibilityId == null) {
                if (i == this.index) {
                    this.result.grantCall.grantCallEligibilities.splice(this.index, 1);
                    break;
                }
            }
            else {
                if (this.result.grantCall.grantCallEligibilities[i].grantEligibilityId == this.tempSaveEligibility.grantEligibilityId) {
                    // service goes here
                    this.grantService.deleteGrantCallEligibility(this.result.grantCall.grantCallId, this.tempSaveEligibility.grantEligibilityId).subscribe(function (deleted) {
                        var temp = {};
                        temp = deleted;
                        _this.result.grantCall.grantCallEligibilities.splice(_this.index, 1);
                    });
                }
            }
        }
    };
    GrantComponent.prototype.showAddAttachmentPopUp = function (e) {
        e.preventDefault();
        this.showAddAttachment = true;
        this.uploadedFile = [];
        this.attachmentDescription = '';
    };
    GrantComponent.prototype.editAttachments = function ($event, i, attachments) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;
    };
    GrantComponent.prototype.saveEditedattachments = function ($event, i, attachments) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;
    };
    GrantComponent.prototype.cancelEditedattachments = function ($event, i, attachments) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;
    };
    GrantComponent.prototype.deleteAttachments = function (e) {
        var _this = this;
        e.preventDefault();
        this.showDeleteAttachment = false;
        if (this.tempSaveAttachment.attachmentId == null) {
            this.result.grantCall.grantCallAttachments.splice(this.index, 1);
        }
        else {
            this.grantService.deleteGrantCallAttachment(this.result.grantCall.grantCallId, this.tempSaveAttachment.attachmentId).subscribe(function (success) {
                var temp = {};
                temp = success;
                _this.result.grantCall.grantCallAttachments.splice(_this.index, 1);
                _this.changeRef.detectChanges();
            });
        }
    };
    GrantComponent.prototype.downloadAttachments = function (event, attachment) {
        event.preventDefault();
        if (attachment.attachmentId != null) {
            this.grantService.downloadAttachment(attachment.attachmentId).takeUntil(this.onDestroy$).subscribe(function (data) {
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
    GrantComponent.prototype.tempSaveAttachments = function (e, attachments, i) {
        this.tempSaveAttachment = attachments;
        this.index = i;
        this.showDeleteAttachment = true;
    };
    GrantComponent.prototype.closeAttachments = function () {
        this.showAddAttachment = false;
        this.uploadedFile = [];
    };
    GrantComponent.prototype.attachmentTypeChange = function (type) {
        var d = new Date();
        var timestamp = d.getTime();
        for (var _i = 0, _a = this.result.grantCallAttachTypes; _i < _a.length; _i++) {
            var attachmentType = _a[_i];
            if (attachmentType.description == type) {
                this.attachmentObject = attachmentType;
            }
        }
    };
    GrantComponent.prototype.addAttachments = function () {
        var _this = this;
        var d = new Date();
        this.attachmentWarning = false;
        this.attachmentTypeWarning = false;
        if (this.result.grantCall.grantCallAttachments.length != 0) {
            if (this.uploadedFile.length != 0) {
                label: for (var _i = 0, _a = this.result.grantCall.grantCallAttachments; _i < _a.length; _i++) {
                    var attachment = _a[_i];
                    for (var _b = 0, _c = this.uploadedFile; _b < _c.length; _b++) {
                        var file = _c[_b];
                        if (attachment.fileName == file.name) {
                            this.attachmentWarning = true;
                            break label;
                        }
                    }
                }
            }
        }
        if (this.attachmentWarning == false) {
            var timestamp = d.getTime();
            var tempObjectForAdd = {};
            if (this.attachmentObject.description != null) {
                this.attachmentTypeWarning = false;
                tempObjectForAdd.grantCallAttachType = this.attachmentObject;
                tempObjectForAdd.grantAttachmentTypeCode = this.attachmentObject.grantAttachmentTypeCode;
                tempObjectForAdd.description = this.attachmentDescription;
                tempObjectForAdd.updateTimestamp = timestamp;
                tempObjectForAdd.updateUser = this.currentUser;
                this.result.newAttachment = tempObjectForAdd;
                this.grantService.addGrantCallAttachment(this.result.grantCall, this.result.newAttachment, this.uploadedFile).subscribe(function (success) {
                    var temporaryObject = {};
                    temporaryObject = success;
                    _this.result.grantCall = temporaryObject.grantCall;
                }, function (error) { }, function () {
                    _this.closeAttachments();
                });
            }
            else {
                this.attachmentTypeWarning = true;
            }
        }
    };
    //when file list changes
    GrantComponent.prototype.onChange = function (files) {
        this.file = files;
        this.ismandatoryFilled = true;
        for (var i = 0; i < this.file.length; i++) {
            this.uploadedFile.push(this.file[i]);
        }
    };
    GrantComponent.prototype.dropped = function (event) {
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
    GrantComponent.prototype.deleteFromUploadedFileList = function (item) {
        for (var i = 0; i < this.uploadedFile.length; i++) {
            if (this.uploadedFile[i].name == item.name) {
                this.uploadedFile.splice(i, 1);
            }
        }
    };
    GrantComponent.prototype.grantCallTypeChange = function (type) {
        for (var _i = 0, _a = this.result.grantCallTypes; _i < _a.length; _i++) {
            var grantCallType = _a[_i];
            if (grantCallType.description == type) {
                this.result.grantCall.grantCallType = grantCallType;
                this.result.grantCall.grantTypeCode = grantCallType.grantTypeCode;
            }
        }
    };
    GrantComponent.prototype.grantCallStatusChange = function (status) {
        for (var _i = 0, _a = this.result.grantCallStatus; _i < _a.length; _i++) {
            var grantCallStatus = _a[_i];
            if (grantCallStatus.description == status) {
                this.result.grantCall.grantCallStatus = grantCallStatus;
                this.result.grantCall.grantStatusCode = grantCallStatus.grantStatusCode;
            }
        }
    };
    GrantComponent.prototype.sponsorTypeChange = function (type) {
        var _this = this;
        for (var _i = 0, _a = this.result.sponsorTypes; _i < _a.length; _i++) {
            var sponsorType = _a[_i];
            if (sponsorType.description == type) {
                this.grantService.fetchSponsorsBySponsorType(sponsorType.code).takeUntil(this.onDestroy$).subscribe(function (success) {
                    var temp = {};
                    temp = success;
                    _this.sponsorList = temp.sponsors;
                    _this.result.grantCall.sponsor = _this.sponsorList[0];
                    _this.result.grantCall.sponsorCode = _this.sponsorList[0].code;
                });
                this.result.grantCall.sponsorType = sponsorType;
                this.result.grantCall.sponsorTypeCode = sponsorType.code;
                this.sponsorNameChange(this.selectedSponsor);
            }
        }
    };
    GrantComponent.prototype.researchTypeChange = function (type) {
        for (var _i = 0, _a = this.result.activityTypes; _i < _a.length; _i++) {
            var activityType = _a[_i];
            if (activityType.description == type) {
                var tempObj = {};
                tempObj.code = activityType.code;
                tempObj.description = activityType.description;
                this.result.grantCall.activityType = tempObj;
                this.result.grantCall.activityTypeCode = activityType.code;
            }
        }
    };
    GrantComponent.prototype.fundingTypeChange = function (type) {
        for (var _i = 0, _a = this.result.fundingSourceTypes; _i < _a.length; _i++) {
            var fundingType = _a[_i];
            if (fundingType.description == type) {
                var tempObj = {};
                tempObj.fundingSourceTypeCode = fundingType.fundingSourceTypeCode;
                tempObj.description = fundingType.description;
                this.result.grantCall.fundingSourceType = tempObj;
                this.result.grantCall.fundingSourceTypeCode = fundingType.fundingSourceTypeCode;
            }
        }
    };
    GrantComponent.prototype.sponsorNameChange = function (sponsorName) {
        for (var _i = 0, _a = this.sponsorList; _i < _a.length; _i++) {
            var sponsor = _a[_i];
            if (sponsor.sponsorName == sponsorName) {
                sponsor.sponsorType = this.result.grantCall.sponsorType;
                sponsor.sponsorTypeCode = this.result.grantCall.sponsorType.code;
                this.result.grantCall.sponsor = sponsor;
                this.result.grantCall.sponsorCode = sponsor.sponsorCode;
            }
        }
    };
    GrantComponent.prototype.keywordChangeFunction = function () {
        var d = new Date();
        var timeStamp = d.getTime();
        this.keywordObject = {};
        var keywordFlag = false;
        for (var _i = 0, _a = this.result.grantCall.grantCallKeywords; _i < _a.length; _i++) {
            var word = _a[_i];
            if (word.scienceKeyword.description == this.selectedKeyword) {
                keywordFlag = true;
                this.keyWordWarningMessage = "Keyword already added";
                break;
            }
        }
        if (keywordFlag == false) {
            for (var _b = 0, _c = this.result.scienceKeywords; _b < _c.length; _b++) {
                var keyword = _c[_b];
                if (keyword.description == this.selectedKeyword) {
                    this.keywordObject.scienceKeywordCode = keyword.code;
                    this.keywordObject.scienceKeyword = keyword;
                    this.keywordObject.updateTimestamp = timeStamp;
                    this.keywordObject.updateUser = this.currentUser;
                    this.result.grantCall.grantCallKeywords.push(this.keywordObject);
                    this.keyWordWarningMessage = null;
                    break;
                }
            }
        }
        else {
            this.keyWordWarningMessage = "Keyword already added";
        }
        this.selectedKeyword = null;
    };
    GrantComponent.prototype.deleteKeyword = function (keyword, k) {
        var _this = this;
        var _loop_1 = function (i) {
            if (this_1.result.grantCall.grantCallKeywords[i].grantKeywordId != null) {
                if (this_1.result.grantCall.grantCallKeywords[i].grantKeywordId == keyword.grantKeywordId) {
                    this_1.grantService.deleteGrantCallKeyword(this_1.result.grantCall.grantCallId, keyword.grantKeywordId).subscribe(function (success) {
                        var temp = {};
                        temp = success;
                        _this.result.grantCall.grantCallKeywords.splice(i, 1);
                    });
                }
            }
            else {
                if (i == k) {
                    this_1.result.grantCall.grantCallKeywords.splice(k, 1);
                    return "break";
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.result.grantCall.grantCallKeywords.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
    };
    GrantComponent.prototype.saveGrant = function () {
        var _this = this;
        if (this.result.grantCall.grantCallType == null || this.result.grantCall.grantCallStatus == null || this.result.grantCall.grantCallName.trim() == null || this.result.grantCall.openingDate == null || this.result.grantCall.closingDate == null || this.result.grantCall.description.trim() == null || this.result.grantCall.maximumBudget == null || this.isDateWarningText == true || this.selectedHomeUnit == null || this.result.grantCall.grantTheme == null) {
            var scrollTop;
            this.showWarning = true;
            this.showSavedSuccessfully = false;
            this.saveSuccessfulMessage = "";
            //Scroll to Top Javascript Function
            scrollTop = setInterval(function () {
                if (document.body.scrollTop == document.documentElement.scrollTop) {
                    clearInterval(scrollTop);
                }
                document.body.scrollTop = document.documentElement.scrollTop -= 10;
            }, 1000 / 30);
        }
        else {
            this.scrollToTop = "";
            this.showWarning = false;
            this.showSavedSuccessfully = true;
            this.keyWordWarningMessage = null;
            var d = new Date();
            var timeStamp = d.getTime();
            this.result.grantCall.createUser = this.currentUser;
            this.result.grantCall.createTimestamp = timeStamp;
            this.result.grantCall.updateTimeStamp = timeStamp;
            this.result.grantCall.updateUser = this.currentUser;
            if (this.result.grantCall.grantCallStatus.description == 'Draft' && this.mode == 'create' && this.result.grantCall.grantCallId == null) {
                this.saveType = "SAVE";
            }
            else {
                this.saveType = "UPDATE";
            }
            this.grantService.saveGrantCall(this.result.grantCall, this.result.newAttachments, this.saveType, this.uploadedFile).takeUntil(this.onDestroy$).subscribe(function (response) {
                var temp = {};
                temp = response;
                _this.result.grantCall = temp.grantCall;
                _this.grantId = _this.result.grantCall.grantCallId;
            }, function (error) {
                _this.saveSuccessfulMessage = null;
            }, function () {
                //Scroll to Top Javascript Function
                scrollTop = setInterval(function () {
                    if (document.body.scrollTop == document.documentElement.scrollTop) {
                        clearInterval(scrollTop);
                    }
                    document.body.scrollTop = document.documentElement.scrollTop -= 10;
                }, 1000 / 30);
            });
            setTimeout(function () {
                _this.showSavedSuccessfully = false;
            }, 8000);
        }
    };
    GrantComponent.prototype.addResearchArea = function () {
        var d = new Date();
        var timeStamp = d.getTime();
        this.areaWarning = false;
        if (this.result.grantCall.grantCallResearchAreas.length != 0) {
            for (var _i = 0, _a = this.result.grantCall.grantCallResearchAreas; _i < _a.length; _i++) {
                var area = _a[_i];
                if (area.researchArea.description == this.selectedResearchArea) {
                    this.areaWarning = true;
                    break;
                }
            }
        }
        if (this.areaWarning == false) {
            for (var _b = 0, _c = this.result.researchAreas; _b < _c.length; _b++) {
                var researchArea = _c[_b];
                if (researchArea.description == this.selectedResearchArea) {
                    var tempObj = {};
                    tempObj.researchAreaCode = researchArea.researchAreaCode;
                    tempObj.researchArea = researchArea;
                    tempObj.updateTimestamp = timeStamp;
                    tempObj.updateUser = this.currentUser;
                    this.result.grantCall.grantCallResearchAreas.push(tempObj);
                    break;
                }
            }
        }
        this.selectedResearchArea = null;
    };
    GrantComponent.prototype.tempSaveResearchAreaObject = function (e, researchArea) {
        e.preventDefault();
        this.tempSaveResearchArea = researchArea;
        this.showDeleteResearchArea = true;
    };
    GrantComponent.prototype.deleteResearchArea = function ($event) {
        var _this = this;
        this.showDeleteResearchArea = false;
        var _loop_2 = function (i) {
            if (this_2.result.grantCall.grantCallResearchAreas[i].researchArea.description == this_2.tempSaveResearchArea.researchArea.description) {
                if (this_2.result.grantCall.grantCallId != null && this_2.result.grantCall.grantCallResearchAreas[i].grantResearchAreaId != null) {
                    this_2.grantService.deleteGrantCallAreaOfResearch(this_2.result.grantCall.grantCallId, this_2.tempSaveResearchArea.grantResearchAreaId).subscribe(function (deleted) {
                        _this.result.grantCall.grantCallResearchAreas.splice(i, 1);
                    });
                }
                else {
                    this_2.result.grantCall.grantCallResearchAreas.splice(i, 1);
                }
            }
        };
        var this_2 = this;
        for (var i = 0; i < this.result.grantCall.grantCallResearchAreas.length; i++) {
            _loop_2(i);
        }
    };
    GrantComponent.prototype.publishCall = function () {
        var _this = this;
        if (this.result.grantCall.grantCallId == null || this.result.grantCall.grantCallType == null || this.result.grantCall.grantCallStatus == null || this.result.grantCall.grantCallName.trim() == null || this.result.grantCall.openingDate == null || this.result.grantCall.closingDate == null || this.result.grantCall.description.trim() == null || this.result.grantCall.maximumBudget == null || this.isDateWarningText == true || this.selectedHomeUnit == null || this.result.grantCall.grantTheme == null) {
            var scrollTop;
            //Scroll to Top Javascript Function
            this.showWarning = true;
            scrollTop = setInterval(function () {
                if (document.body.scrollTop == document.documentElement.scrollTop) {
                    clearInterval(scrollTop);
                }
                document.body.scrollTop = document.documentElement.scrollTop -= 10;
            }, 1000 / 30);
        }
        else {
            this.scrollToTop = "";
            this.showWarning = false;
            this.keyWordWarningMessage = null;
            this.grantService.publishCall(this.result.grantCall).subscribe(function (success) {
                var temp = {};
                temp = success;
                _this.showAddPointOfContact = false;
                _this.addResearch = false;
                _this.isEligibleAddopen = false;
                _this.result.grantCall = temp.grantCall;
                _this.mode = 'view';
                _this.editClass = "committeeBoxNotEditable";
            });
        }
    };
    GrantComponent.prototype.navigate = function ($event, mode) {
        this.router.navigate(['/proposal/createProposal'], { queryParams: { 'grantId': this.result.grantCall.grantCallId, 'mode': mode } });
    };
    GrantComponent.prototype.homeUnitChangeFunction = function () {
        for (var _i = 0, _a = this.result.homeUnits; _i < _a.length; _i++) {
            var homeUnit = _a[_i];
            if (homeUnit.unitName == this.selectedHomeUnit) {
                this.result.grantCall.homeUnitNumber = homeUnit.unitNumber;
                this.result.grantCall.homeUnitName = this.selectedHomeUnit;
            }
        }
    };
    GrantComponent = __decorate([
        Component({
            selector: 'grant',
            templateUrl: 'grant.component.html',
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css'],
            changeDetection: ChangeDetectionStrategy.Default
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, CompleterService, Router, ActivatedRoute, GrantService, SessionManagementService])
    ], GrantComponent);
    return GrantComponent;
}());
export { GrantComponent };
//# sourceMappingURL=grant.component.js.map