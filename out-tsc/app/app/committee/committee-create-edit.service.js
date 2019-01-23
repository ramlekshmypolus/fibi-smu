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
import { HttpClient } from "@angular/common/http";
var CommitteCreateEditService = (function () {
    function CommitteCreateEditService(http, constant) {
        this.http = http;
        this.constant = constant;
    }
    CommitteCreateEditService.prototype.getCommitteeData = function (committeeTypeCode) {
        var params = {
            committeeTypeCode: committeeTypeCode,
        };
        return this.http.post(this.constant.committeeCreateUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.loadCommittee = function (committeeId) {
        var params = {
            committeeId: committeeId,
        };
        return this.http.post(this.constant.committeeViewUrl, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.addMember = function (Id, committeeId, nonEmployeeFlag, committeeObj) {
        var params = {};
        if (nonEmployeeFlag == true) {
            params = {
                rolodexId: Id,
                committeeId: committeeId,
                nonEmployeeFlag: nonEmployeeFlag,
                committee: committeeObj
            };
        }
        if (nonEmployeeFlag == false) {
            params = {
                personId: Id,
                committeeId: committeeId,
                nonEmployeeFlag: nonEmployeeFlag,
                committee: committeeObj
            };
        }
        return this.http.post(this.constant.addCommitteeMembership, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.saveCommitteeMembers = function (CommiteeeObj) {
        return this.http.post(this.constant.saveCommitteeMembers, CommiteeeObj)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.deleteRoles = function (commMemberRolesId, commMembershipId, committeeId) {
        var params = {
            commMemberRolesId: commMemberRolesId,
            committeeId: committeeId,
            commMembershipId: commMembershipId
        };
        return this.http.post(this.constant.deleteMemberRoles, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.deleteExpertises = function (commMemberExpertiseId, commMembershipId, committeeId) {
        var params = {
            commMemberExpertiseId: commMemberExpertiseId,
            committeeId: committeeId,
            commMembershipId: commMembershipId
        };
        return this.http.post(this.constant.deleteMemberExpertise, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.deleteMember = function (commMembershipId, committeeId) {
        var params = {
            committeeId: committeeId,
            commMembershipId: commMembershipId
        };
        return this.http.post(this.constant.deleteCommitteeMembers, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.saveCommMemberRole = function (commMembershipId, committeeId, committeeMemberRole) {
        var params = {
            committeeId: committeeId,
            commMembershipId: commMembershipId,
            committeeMemberRole: committeeMemberRole
        };
        return this.http.post(this.constant.saveCommitteeMembersRole, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.saveCommMemberExpertise = function (commMembershipId, committeeId, committeeMemberExpertise) {
        var params = {
            committeeId: committeeId,
            commMembershipId: commMembershipId,
            committeeMemberExpertise: committeeMemberExpertise
        };
        return this.http.post(this.constant.saveCommitteeMembersExpertise, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService.prototype.updateMemberRoles = function (commMemberRolesId, committeeId, commMembershipId, role) {
        var params = {
            commMemberRolesId: commMemberRolesId,
            committeeId: committeeId,
            commMembershipId: commMembershipId,
            committeeMemberRole: role
        };
        return this.http.post(this.constant.updateMemberRoles, params)
            .catch(function (error) {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
    };
    CommitteCreateEditService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient, Constants])
    ], CommitteCreateEditService);
    return CommitteCreateEditService;
}());
export { CommitteCreateEditService };
//# sourceMappingURL=committee-create-edit.service.js.map