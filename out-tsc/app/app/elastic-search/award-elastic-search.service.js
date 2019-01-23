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
var AwardElasticsearchService = (function () {
    function AwardElasticsearchService(constant) {
        this.constant = constant;
        if (!this._client) {
            this._connect();
        }
    }
    AwardElasticsearchService.prototype._connect = function () {
        this._client = new Client({
            host: this.constant.index_url
        });
    };
    AwardElasticsearchService.prototype.search = function (value, personId) {
        if (value) {
            return this._client.search({
                index: 'awardfibi',
                size: 20,
                type: 'award',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        award_number: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        pi_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        sponsor: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        account_number: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        lead_unit_number: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        lead_unit_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        title: {
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
                            award_number: {},
                            pi_name: {},
                            sponsor: {},
                            account_number: {},
                            lead_unit_number: {},
                            lead_unit_name: {},
                            title: {}
                        }
                    }
                }
            });
        }
        else {
            return Promise.resolve({});
        }
    };
    AwardElasticsearchService.prototype.addToIndex = function (value) {
        return this._client.create(value);
    };
    AwardElasticsearchService.prototype.isAvailable = function () {
        return this._client.ping({
            requestTimeout: Infinity,
            hello: 'elasticsearch!'
        });
    };
    AwardElasticsearchService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Constants])
    ], AwardElasticsearchService);
    return AwardElasticsearchService;
}());
export { AwardElasticsearchService };
//# sourceMappingURL=award-elastic-search.service.js.map