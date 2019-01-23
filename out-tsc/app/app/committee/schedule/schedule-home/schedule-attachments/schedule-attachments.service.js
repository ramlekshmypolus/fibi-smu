var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Constants } from "../../../../constants/constants.service";
var ScheduleAttachmentsService = (function () {
    function ScheduleAttachmentsService(http, constant, httpReq) {
        this.http = http;
        this.constant = constant;
        this.httpReq = httpReq;
        this.formData = new FormData();
    }
    ScheduleAttachmentsService.prototype.addAttachments = function (scheduleId, newCommitteeScheduleAttachment, attachmentTypeCode, uploadedFile, Description, currentUser) {
        this.formData.delete('file');
        this.formData.delete('formDataJson');
        for (var i = 0; i < uploadedFile.length; i++) {
            this.formData.append('files', uploadedFile[i]);
        }
        var sendObject = {
            scheduleId: scheduleId,
            newCommitteeScheduleAttachment: newCommitteeScheduleAttachment
        };
        this.formData.append('formDataJson', JSON.stringify(sendObject));
        return this.http.post(this.constant.addScheduleAttachment, this.formData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ScheduleAttachmentsService.prototype.deleteAttachments = function (scheduleId, committeeId, commScheduleAttachId) {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            commScheduleAttachId: commScheduleAttachId
        };
        return this.http.post(this.constant.deleteScheduleAttachment, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ScheduleAttachmentsService.prototype.downloadAttachment = function (commScheduleAttachId, mimeType) {
        return this.http.get(this.constant.downloadAttachments, {
            headers: new HttpHeaders().set('commScheduleAttachId', commScheduleAttachId.toString()),
            responseType: 'blob'
        });
    };
    ScheduleAttachmentsService.prototype.updateScheduleAttachments = function (committeeId, scheduleId, newCommitteeScheduleAttachment) {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            newCommitteeScheduleAttachment: newCommitteeScheduleAttachment
        };
        return this.http.post(this.constant.updateScheduleAttachments, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ScheduleAttachmentsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants, Http])
    ], ScheduleAttachmentsService);
    return ScheduleAttachmentsService;
}());
export { ScheduleAttachmentsService };
//# sourceMappingURL=schedule-attachments.service.js.map