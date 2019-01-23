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
var IrbElasticsearchService = (function () {
    function IrbElasticsearchService(constant) {
        this.constant = constant;
        if (!this._client) {
            this._connect();
        }
    }
    IrbElasticsearchService.prototype._connect = function () {
        this._client = new Client({
            host: this.constant.index_url
        });
    };
    IrbElasticsearchService.prototype.search = function (value, personId) {
        if (value) {
            return this._client.search({
                index: 'irbfibi',
                size: 20,
                type: 'irb',
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
                                        status: {
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
                                        person_name: {
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
                            status: {},
                            lead_unit_name: {},
                            person_name: {}
                        }
                    }
                }
            });
        }
        else {
            return Promise.resolve({});
        }
    };
    IrbElasticsearchService.prototype.addToIndex = function (value) {
        return this._client.create(value);
    };
    IrbElasticsearchService.prototype.isAvailable = function () {
        return this._client.ping({
            requestTimeout: Infinity,
            hello: 'elasticsearch!'
        });
    };
    IrbElasticsearchService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Constants])
    ], IrbElasticsearchService);
    return IrbElasticsearchService;
}());
export { IrbElasticsearchService };
//# sourceMappingURL=irb-elastic-search.service.js.map