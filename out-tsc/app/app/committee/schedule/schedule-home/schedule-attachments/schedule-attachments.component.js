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
import { ScheduleService } from '../../schedule.service';
import { ScheduleConfigurationService } from '../../schedule-configuration.service';
import { ActivatedRoute } from '@angular/router';
import { ScheduleAttachmentsService } from './schedule-attachments.service';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
var ScheduleAttachmentsComponent = (function () {
    function ScheduleAttachmentsComponent(scheduleAttachmentsService, scheduleConfigurationService, scheduleService, activatedRoute) {
        this.scheduleAttachmentsService = scheduleAttachmentsService;
        this.scheduleConfigurationService = scheduleConfigurationService;
        this.scheduleService = scheduleService;
        this.activatedRoute = activatedRoute;
        this.result = {};
        this.onDestroy$ = new Subject();
        this.showPopup = false;
        this.newCommitteeScheduleAttachment = {};
        this.attachmentObject = {};
        this.showAddAttachment = false;
        this.files = [];
        this.uploadedFile = [];
        this.attachmentList = [];
        this.tempSaveAttachment = {};
        this.nullAttachmentData = false;
        this.editScheduleattachment = {};
        this.tempEditObject = {};
        this.ismandatoryFilled = true;
        this.attachment = {};
        this.currentUser = localStorage.getItem("currentUser");
    }
    ScheduleAttachmentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.scheduleConfigurationService.currentScheduleData.takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
            if (_this.result !== null) {
                _this.nullAttachmentData = true;
            }
        });
    };
    ScheduleAttachmentsComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    //when file list changes
    ScheduleAttachmentsComponent.prototype.onChange = function (files) {
        this.fil = files;
        this.ismandatoryFilled = true;
        for (var i = 0; i < this.fil.length; i++) {
            this.uploadedFile.push(this.fil[i]);
        }
    };
    //change type option
    ScheduleAttachmentsComponent.prototype.attachmentTypeChange = function (type) {
        var d = new Date();
        var timestamp = d.getTime();
        for (var _i = 0, _a = this.result.attachmentTypes; _i < _a.length; _i++) {
            var attachmentType = _a[_i];
            if (attachmentType.description == type) {
                this.attachmentObject.attachmentTypecode = attachmentType.attachmentTypecode;
                this.attachmentObject.description = attachmentType.description;
                this.attachment.description = attachmentType.description;
                this.attachmentObject.updateTimestamp = timestamp;
                this.attachmentObject.updateUser = this.currentUser;
            }
        }
    };
    //files are dropped in drag and drop space
    ScheduleAttachmentsComponent.prototype.dropped = function (event) {
        var _this = this;
        this.files = event.files;
        this.ismandatoryFilled = true;
        for (var _i = 0, _a = this.files; _i < _a.length; _i++) {
            var file = _a[_i];
            this.attachmentList.push(file);
        }
        for (var _b = 0, _c = event.files; _b < _c.length; _b++) {
            var file = _c[_b];
            file.fileEntry.file(function (info) {
                _this.uploadedFile.push(info);
            });
        }
    };
    //delete file function
    ScheduleAttachmentsComponent.prototype.deleteFromUploadedFileList = function (item) {
        for (var i = 0; i < this.uploadedFile.length; i++) {
            if (this.uploadedFile[i].name == item.name) {
                this.uploadedFile.splice(i, 1);
            }
        }
    };
    ScheduleAttachmentsComponent.prototype.showAddAttachmentPopUp = function (e) {
        e.preventDefault();
        this.showAddAttachment = true;
        this.ismandatoryFilled = true;
        this.uploadedFile = [];
        this.attachmentTypeDescription = '';
        this.attachment.description = 'Select';
    };
    ScheduleAttachmentsComponent.prototype.addAttachments = function () {
        var _this = this;
        if (this.attachment.description == 'Select') {
            this.ismandatoryFilled = false;
            this.attachmentWarningMsg = '* Please select an attachment type';
        }
        else if (this.uploadedFile.length == 0) {
            this.ismandatoryFilled = false;
            this.attachmentWarningMsg = '* Please choose at least one file to attach';
        }
        else {
            this.ismandatoryFilled = true;
            this.showAddAttachment = false;
            var d = new Date();
            var timestamp = d.getTime();
            this.newCommitteeScheduleAttachment.attachmentType = this.attachmentObject;
            this.newCommitteeScheduleAttachment.attachmentTypeCode = this.attachmentObject.attachmentTypecode;
            this.newCommitteeScheduleAttachment.description = this.attachmentTypeDescription;
            this.newCommitteeScheduleAttachment.updateTimestamp = timestamp;
            this.newCommitteeScheduleAttachment.updateUser = this.currentUser;
            this.result.newCommitteeScheduleAttachment = this.newCommitteeScheduleAttachment;
            this.scheduleAttachmentsService.addAttachments(this.result.committeeSchedule.scheduleId, this.result.newCommitteeScheduleAttachment, this.result.newCommitteeScheduleAttachment.attachmentTypeCode, this.uploadedFile, this.attachmentTypeDescription, this.currentUser).takeUntil(this.onDestroy$).subscribe(function (data) {
                _this.uploadedFile = [];
                var temp = {};
                temp = data;
                _this.result.committeeSchedule = temp.committeeSchedule;
            }, function (error) {
            });
        }
    };
    //temporarily save while showing modal pop up
    ScheduleAttachmentsComponent.prototype.tempSave = function (event, attachment) {
        this.showPopup = true;
        this.tempSaveAttachment = attachment;
    };
    ScheduleAttachmentsComponent.prototype.deleteAttachments = function (event) {
        var _this = this;
        event.preventDefault();
        this.showPopup = false;
        this.scheduleAttachmentsService.deleteAttachments(this.result.committeeSchedule.scheduleId, this.result.committee.committeeId, this.tempSaveAttachment.commScheduleAttachId).takeUntil(this.onDestroy$).subscribe(function (data) {
            var temp = {};
            temp = data;
            _this.result.committeeSchedule = temp.committeeSchedule;
        });
    };
    ScheduleAttachmentsComponent.prototype.downloadAttachements = function (event, attachments) {
        event.preventDefault();
        this.scheduleAttachmentsService.downloadAttachment(attachments.commScheduleAttachId, attachments.mimeType).takeUntil(this.onDestroy$).subscribe(function (data) {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(data);
            a.download = attachments.fileName;
            a.click();
        });
        return false;
    };
    ScheduleAttachmentsComponent.prototype.editAttachments = function (event, index, attachments) {
        event.preventDefault();
        this.tempEditObject.description = attachments.description;
        this.editScheduleattachment[index] = !this.editScheduleattachment[index];
        this.scheduleConfigurationService.changeScheduleHomeAttachmentsEditFlag(true);
    };
    ScheduleAttachmentsComponent.prototype.saveEditedattachments = function (event, index, attachments) {
        var _this = this;
        event.preventDefault();
        this.scheduleConfigurationService.changeScheduleHomeAttachmentsEditFlag(false);
        this.editScheduleattachment[index] = !this.editScheduleattachment[index];
        this.attachmentObject = {};
        this.attachmentObject.description = attachments.description;
        this.attachmentObject.updateTimestamp = new Date().getTime();
        this.attachmentObject.updateUser = this.currentUser;
        this.attachmentObject.commScheduleAttachId = attachments.commScheduleAttachId;
        this.scheduleAttachmentsService.updateScheduleAttachments(this.result.committee.committeeId, this.result.committeeSchedule.scheduleId, this.attachmentObject)
            .takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data;
        });
    };
    ScheduleAttachmentsComponent.prototype.cancelEditedattachments = function (event, index, attachments) {
        event.preventDefault();
        this.editScheduleattachment[index] = !this.editScheduleattachment[index];
        attachments.description = this.tempEditObject.description;
        this.scheduleConfigurationService.changeScheduleHomeAttachmentsEditFlag(false);
    };
    ScheduleAttachmentsComponent.prototype.closeAttachments = function () {
        this.showAddAttachment = false;
        this.uploadedFile = [];
    };
    ScheduleAttachmentsComponent = __decorate([
        Component({
            selector: 'app-schedule-attachments',
            templateUrl: './schedule-attachments.component.html',
            styleUrls: ['../../../../../assets/css/bootstrap.min.css', '../../../../../assets/css/font-awesome.min.css', '../../../../../assets/css/style.css', '../../../../../assets/css/search.css'],
            changeDetection: ChangeDetectionStrategy.Default
        }),
        __metadata("design:paramtypes", [ScheduleAttachmentsService, ScheduleConfigurationService, ScheduleService, ActivatedRoute])
    ], ScheduleAttachmentsComponent);
    return ScheduleAttachmentsComponent;
}());
export { ScheduleAttachmentsComponent };
//# sourceMappingURL=schedule-attachments.component.js.map