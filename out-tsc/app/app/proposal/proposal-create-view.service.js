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
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/add/operator/map';
var ProposalCreateEditService = (function () {
    function ProposalCreateEditService(http, constant) {
        this.http = http;
        this.constant = constant;
        this.formData = new FormData();
        this.approveFormData = new FormData();
    }
    ProposalCreateEditService.prototype.loadCreateProposalData = function (object) {
        return this.http.post(this.constant.createProposalUrl, object)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.addProposalAttachment = function (proposalObject, newAttachment, uploadedFile) {
        this.formData.delete('files');
        this.formData.delete('formDataJson');
        for (var i = 0; i < uploadedFile.length; i++) {
            console.log("item->", i + 1, uploadedFile[i].name);
            this.formData.append('files', uploadedFile[i]);
        }
        var sendObject = {
            proposal: proposalObject,
            newAttachment: newAttachment,
        };
        this.formData.append('formDataJson', JSON.stringify(sendObject));
        return this.http.post(this.constant.addProposalAttachment, this.formData);
    };
    ProposalCreateEditService.prototype.deleteProposalAttachment = function (proposalId, attachmentId) {
        var params = {
            proposalId: proposalId,
            attachmentId: attachmentId
        };
        return this.http.post(this.constant.deleteProposalAttachment, params);
    };
    ProposalCreateEditService.prototype.saveProposal = function (proposalObject, type) {
        var sendObject = {
            proposal: proposalObject,
            updateType: type,
        };
        return this.http.post(this.constant.saveOrUpdateProposal, sendObject)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.downloadProposalAttachment = function (attachmentId) {
        return this.http.get(this.constant.downloadProposalAttachment, {
            headers: new HttpHeaders().set('attachmentId', attachmentId.toString()),
            responseType: 'blob'
        });
    };
    ProposalCreateEditService.prototype.deleteProposalResearchArea = function (proposalId, researchAreaId) {
        var params = {
            proposalId: proposalId,
            researchAreaId: researchAreaId
        };
        return this.http.post(this.constant.deleteProposalResearchArea, params);
    };
    ProposalCreateEditService.prototype.deleteIrbProtocol = function (proposalId, irbProtocolId) {
        var params = {
            proposalId: proposalId,
            irbProtocolId: irbProtocolId
        };
        return this.http.post(this.constant.deleteIrbProtocol, params);
    };
    ProposalCreateEditService.prototype.deleteProposalSponsor = function (proposalId, sponsorId) {
        var params = {
            proposalId: proposalId,
            sponsorId: sponsorId
        };
        return this.http.post(this.constant.deleteProposalSponsor, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.deleteProposalPerson = function (proposalId, personId) {
        var params = {
            proposalId: proposalId,
            proposalPersonId: personId
        };
        return this.http.post(this.constant.deleteProposalPersonUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.deleteBudget = function (proposalId, budgetId) {
        var params = {
            proposalId: proposalId,
            budgetId: budgetId
        };
        return this.http.post(this.constant.deleteBudgetUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.deleteProposalKeyword = function (proposalId, keywordId) {
        var params = {
            proposalId: proposalId,
            keywordId: keywordId
        };
        return this.http.post(this.constant.deleteProposalKeywordUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.fetchCostElementData = function (budgetCategoryCode) {
        var params = {
            budgetCategoryCode: budgetCategoryCode
        };
        return this.http.post(this.constant.fetchCostElementUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.loadProposalById = function (proposalId, personId, currentUser) {
        var params = {
            proposalId: proposalId,
            personId: personId,
            userName: currentUser
        };
        return this.http.post(this.constant.loadProposalById, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.submitProposal = function (proposal, userName, proposalStatusCode) {
        var params = {
            proposal: proposal,
            userName: userName,
            proposalStatusCode: proposalStatusCode
        };
        return this.http.post(this.constant.submitProposalUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.approveDisapproveProposal = function (sendObject, uploadedFile) {
        this.approveFormData.delete('files');
        this.approveFormData.delete('formDataJson');
        for (var i = 0; i < uploadedFile.length; i++) {
            this.approveFormData.append('files', uploadedFile[i]);
        }
        this.approveFormData.append('formDataJson', JSON.stringify(sendObject));
        return this.http.post(this.constant.approveRejectProposalUrl, this.approveFormData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.downloadRoutelogAttachment = function (attachmentId) {
        return this.http.get(this.constant.downloadRoutelogAttachmentUrl, {
            headers: new HttpHeaders().set('attachmentId', attachmentId.toString()),
            responseType: 'blob'
        });
    };
    ProposalCreateEditService.prototype.assignReviewer = function (proposal, loggedInWorkflowDetail, proposalId) {
        var params = {
            proposal: proposal,
            proposalId: proposalId,
            loggedInWorkflowDetail: loggedInWorkflowDetail
        };
        return this.http.post(this.constant.addReviewerUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.completeReviewAction = function (sendObject, uploadedFile) {
        this.approveFormData.delete('files');
        this.approveFormData.delete('formDataJson');
        for (var i = 0; i < uploadedFile.length; i++) {
            this.approveFormData.append('files', uploadedFile[i]);
        }
        this.approveFormData.append('formDataJson', JSON.stringify(sendObject));
        return this.http.post(this.constant.completeReviewUrl, this.approveFormData)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.fetchAvailableReviewers = function (proposal, personId) {
        var params = {
            proposal: proposal,
            personId: personId
        };
        return this.http.post(this.constant.fetchReviewerUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.deleteAssignedReviewer = function (proposalId, reviewerId) {
        var params = {
            proposalId: proposalId,
            reviewerId: reviewerId
        };
        return this.http.post(this.constant.removeAssignedReviewerUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.submitForEndorsement = function (proposalId, proposal) {
        var params = {
            proposalId: proposalId,
            proposal: proposal
        };
        return this.http.post(this.constant.submitEndorsementUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService.prototype.approveByProvost = function (proposalId, proposal, userName) {
        var params = {
            proposalId: proposalId,
            proposal: proposal,
            userName: userName
        };
        return this.http.post(this.constant.approveByProvost, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    ProposalCreateEditService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants])
    ], ProposalCreateEditService);
    return ProposalCreateEditService;
}());
export { ProposalCreateEditService };
//# sourceMappingURL=proposal-create-view.service.js.map