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
var CommitteeMemberEmployeeElasticService = (function () {
    function CommitteeMemberEmployeeElasticService(constant) {
        this.constant = constant;
        if (!this._client) {
            this._connect();
        }
    }
    CommitteeMemberEmployeeElasticService.prototype._connect = function () {
        this._client = new Client({
            host: this.constant.index_url
        });
    };
    CommitteeMemberEmployeeElasticService.prototype.search = function (value) {
        if (value) {
            return this._client.search({
                index: 'fibiperson',
                size: 20,
                type: 'person',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        prncpl_id: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        full_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        prncpl_nm: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        email_addr: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        unit_number: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        unit_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        addr_line_1: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        phone_nbr: {
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
                            prncpl_id: {},
                            full_name: {},
                            prncpl_nm: {},
                            email_addr: {},
                            unit_number: {},
                            unit_name: {},
                            addr_line_1: {},
                            phone_nbr: {},
                        }
                    }
                }
            });
        }
        else {
            return Promise.resolve({});
        }
    };
    CommitteeMemberEmployeeElasticService.prototype.addToIndex = function (value) {
        return this._client.create(value);
    };
    CommitteeMemberEmployeeElasticService.prototype.isAvailable = function () {
        return this._client.ping({
            requestTimeout: Infinity,
            hello: 'elasticsearch!'
        });
    };
    CommitteeMemberEmployeeElasticService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Constants])
    ], CommitteeMemberEmployeeElasticService);
    return CommitteeMemberEmployeeElasticService;
}());
export { CommitteeMemberEmployeeElasticService };
//# sourceMappingURL=committee-members-employees-elastic-search.service.js.map