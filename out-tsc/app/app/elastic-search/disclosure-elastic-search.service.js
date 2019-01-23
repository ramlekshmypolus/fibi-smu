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
var DisclosureElasticsearchService = (function () {
    function DisclosureElasticsearchService(constant) {
        this.constant = constant;
        if (!this._client) {
            this._connect();
        }
    }
    DisclosureElasticsearchService.prototype._connect = function () {
        this._client = new Client({
            host: this.constant.index_url
        });
    };
    DisclosureElasticsearchService.prototype.search = function (value, personId) {
        if (value) {
            return this._client.search({
                index: 'coifibi',
                size: 20,
                type: 'coi',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        coi_disclosure_number: {
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
                                        disclosure_disposition: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        disclosure_status: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        module_item_key: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
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
                            coi_disclosure_number: {},
                            full_name: {},
                            disclosure_disposition: {},
                            disclosure_status: {},
                            module_item_key: {}
                        }
                    }
                }
            });
        }
        else {
            return Promise.resolve({});
        }
    };
    DisclosureElasticsearchService.prototype.addToIndex = function (value) {
        return this._client.create(value);
    };
    DisclosureElasticsearchService.prototype.isAvailable = function () {
        return this._client.ping({
            requestTimeout: Infinity,
            hello: 'elasticsearch!'
        });
    };
    DisclosureElasticsearchService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Constants])
    ], DisclosureElasticsearchService);
    return DisclosureElasticsearchService;
}());
export { DisclosureElasticsearchService };
//# sourceMappingURL=disclosure-elastic-search.service.js.map