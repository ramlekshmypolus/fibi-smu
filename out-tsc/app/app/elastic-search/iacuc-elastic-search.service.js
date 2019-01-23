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
var IacucElasticsearchService = (function () {
    function IacucElasticsearchService(constant) {
        this.constant = constant;
        if (!this._client) {
            this._connect();
        }
    }
    IacucElasticsearchService.prototype._connect = function () {
        this._client = new Client({
            host: this.constant.index_url
        });
    };
    IacucElasticsearchService.prototype.search = function (value, personId) {
        if (value) {
            return this._client.search({
                index: 'iacucfibi',
                size: 20,
                type: 'iacuc',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        protocol_number: {
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
                                        status: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        person_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        protocol_type: {
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
                            protocol_number: {},
                            title: {},
                            lead_unit_number: {},
                            lead_unit_name: {},
                            status: {},
                            person_name: {},
                            protocol_type: {}
                        }
                    }
                }
            });
        }
        else {
            return Promise.resolve({});
        }
    };
    IacucElasticsearchService.prototype.addToIndex = function (value) {
        return this._client.create(value);
    };
    IacucElasticsearchService.prototype.isAvailable = function () {
        return this._client.ping({
            requestTimeout: Infinity,
            hello: 'elasticsearch!'
        });
    };
    IacucElasticsearchService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Constants])
    ], IacucElasticsearchService);
    return IacucElasticsearchService;
}());
export { IacucElasticsearchService };
//# sourceMappingURL=iacuc-elastic-search.service.js.map