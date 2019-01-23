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
import { Client } from 'elasticsearch';
import { Constants } from '../constants/constants.service';
var CommitteeMemberNonEmployeeElasticService = (function () {
    function CommitteeMemberNonEmployeeElasticService(constant) {
        this.constant = constant;
        if (!this._client) {
            this._connect();
        }
    }
    CommitteeMemberNonEmployeeElasticService.prototype._connect = function () {
        this._client = new Client({
            host: this.constant.index_url
        });
    };
    CommitteeMemberNonEmployeeElasticService.prototype.search = function (value) {
        if (value) {
            return this._client.search({
                index: 'fibirolodex',
                size: 20,
                type: 'rolodex',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        first_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        middle_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        last_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        organization: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    sort: [{
                            _score: {
                                order: 'desc'
                            }
                        }],
                    highlight: {
                        pre_tags: ['<b>'],
                        post_tags: ['</b>'],
                        fields: {
                            rolodex_id: {},
                            first_name: {},
                            middle_name: {},
                            last_name: {},
                            organization: {},
                        }
                    }
                }
            });
        }
        else {
            return Promise.resolve({});
        }
    };
    CommitteeMemberNonEmployeeElasticService.prototype.addToIndex = function (value) {
        return this._client.create(value);
    };
    CommitteeMemberNonEmployeeElasticService.prototype.isAvailable = function () {
        return this._client.ping({
            requestTimeout: Infinity,
            hello: 'elasticsearch!'
        });
    };
    CommitteeMemberNonEmployeeElasticService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Constants])
    ], CommitteeMemberNonEmployeeElasticService);
    return CommitteeMemberNonEmployeeElasticService;
}());
export { CommitteeMemberNonEmployeeElasticService };
//# sourceMappingURL=committee-members-nonEmployee-elastic-search.service.js.map