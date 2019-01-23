var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from "../constants/constants.service";
import { HttpHeaders } from '@angular/common/http';
var GrantService = (function () {
    function GrantService(http, constants) {
        this.http = http;
        this.constants = constants;
        this.formData = new FormData();
    }
    GrantService.prototype.createGrantCall = function () {
        return this.http.post(this.constants.createGrantCalls, {});
    };
    GrantService.prototype.saveGrantCall = function (grantCallObject, newAttachments, type, uploadedFile) {
        var sendObject = {
            grantCall: grantCallObject,
            updateType: type,
        };
        return this.http.post(this.constants.saveUpdateGrantCall, sendObject);
    };
    GrantService.prototype.fetchSponsorsBySponsorType = function (code) {
        var params = {
            sponsorTypeCode: code
        };
        return this.http.post(this.constants.fetchSponsorsBySponsorType, params);
    };
    GrantService.prototype.loadGrantById = function (grantCallId) {
        var params = {
            grantCallId: grantCallId
        };
        return this.http.post(this.constants.loadGrantCallById, params);
    };
    GrantService.prototype.deleteGrantCallKeyword = function (grantCallId, grantKeywordId) {
        var params = {
            grantCallId: grantCallId,
            grantKeywordId: grantKeywordId
        };
        return this.http.post(this.constants.deleteGrantCallKeyword, params);
    };
    GrantService.prototype.deleteGrantCallContact = function (grantCallId, grantContactId) {
        var params = {
            grantCallId: grantCallId,
            grantContactId: grantContactId
        };
        return this.http.post(this.constants.deleteGrantCallContact, params);
    };
    GrantService.prototype.deleteGrantCallAreaOfResearch = function (grantCallId, grantResearchAreaId) {
        var params = {
            grantCallId: grantCallId,
            grantResearchAreaId: grantResearchAreaId
        };
        return this.http.post(this.constants.deleteGrantCallAreaOfResearch, params);
    };
    GrantService.prototype.deleteGrantCallEligibility = function (grantCallId, grantEligibilityId) {
        var params = {
            grantCallId: grantCallId,
            grantEligibilityId: grantEligibilityId
        };
        return this.http.post(this.constants.deleteGrantCallEligibility, params);
    };
    GrantService.prototype.addGrantCallAttachment = function (grantCallObject, newAttachment, uploadedFile) {
        this.formData.delete('files');
        this.formData.delete('formDataJson');
        for (var i = 0; i < uploadedFile.length; i++) {
            this.formData.append('files', uploadedFile[i]);
        }
        var sendObject = {
            grantCall: grantCallObject,
            newAttachment: newAttachment,
        };
        this.formData.append('formDataJson', JSON.stringify(sendObject));
        return this.http.post(this.constants.addGrantCallAttachment, this.formData);
    };
    GrantService.prototype.deleteGrantCallAttachment = function (grantCallId, attachmentId) {
        var params = {
            grantCallId: grantCallId,
            attachmentId: attachmentId
        };
        return this.http.post(this.constants.deleteGrantCallAttachment, params);
    };
    GrantService.prototype.downloadAttachment = function (attachmentId) {
        return this.http.get(this.constants.downloadGrantCallAttachment, {
            headers: new HttpHeaders().set('attachmentId', attachmentId.toString()),
            responseType: 'blob'
        });
    };
    GrantService.prototype.publishCall = function (grantCallObject) {
        var params = {
            grantCall: grantCallObject
        };
        return this.http.post(this.constants.publishGrantCall, params);
    };
    GrantService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants])
    ], GrantService);
    return GrantService;
}());
export { GrantService };
//# sourceMappingURL=grant.service.js.map