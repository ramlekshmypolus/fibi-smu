var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectionStrategy, EventEmitter, Output, NgZone, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { AwardElasticsearchService } from './award-elastic-search.service';
import { DisclosureElasticsearchService } from './disclosure-elastic-search.service';
import { IacucElasticsearchService } from './iacuc-elastic-search.service';
import { IrbElasticsearchService } from './irb-elastic-search.service';
import { ProposalElasticsearchService } from "./proposal-elastic-search.service";
var ElasticSearchComponent = (function () {
    function ElasticSearchComponent(es, ps, irb, iacuc, dis, _ngZone) {
        var _this = this;
        this.es = es;
        this.ps = ps;
        this.irb = irb;
        this.iacuc = iacuc;
        this.dis = dis;
        this._ngZone = _ngZone;
        this.found = new EventEmitter();
        this.selected = new EventEmitter();
        this.messageEvent = new EventEmitter();
        this.active = false;
        this.message = '';
        this.resultCardView = false;
        this._results = new Subject();
        this.seachText = new FormControl('');
        this.iconClass = 'fa fa-search';
        this.personId = localStorage.getItem('personId');
        this.rolePerson = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
        this._results.subscribe(function (res) {
            _this.found.emit(res);
        });
    }
    ElasticSearchComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.seachText
            .valueChanges
            .map(function (text) { return text ? text.trim() : ''; })
            .do(function (searchString) { return searchString ? _this.message = 'searching...' : _this.message = ''; })
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap(function (searchString) {
            return new Promise(function (resolve, reject) {
                _this._ngZone.runOutsideAngular(function () {
                    var hits_source = [];
                    var hits_highlight = [];
                    var hits_out = [];
                    var results = [];
                    var awardNumber;
                    var title;
                    var account_number;
                    var pi_name;
                    var lead_unit_name;
                    var lead_unit_number;
                    var test;
                    var all;
                    var documentNo;
                    var proposalNo;
                    var sponsor;
                    var statusCode;
                    var personName;
                    var protocol_id;
                    var protocol_number;
                    var title;
                    var lead_unit;
                    var unit_number;
                    var protocol_type;
                    var lead_unit_number;
                    var full_name;
                    var disclosure_number;
                    var disclosure_disposition;
                    var disclosure_status;
                    var module_item_key;
                    /*ELASTIC SEARCH FOR AWARDS*/
                    if (_this.tabPosition == 'AWARD') {
                        _this.es.search(searchString, _this.personId)
                            .then(function (searchResult) {
                            _this._ngZone.run(function () {
                                hits_source = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit._source; });
                                hits_highlight = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit.highlight; });
                                hits_source.forEach(function (elmnt, j) {
                                    if (hits_source[j].pi_name === _this.rolePerson) {
                                        awardNumber = hits_source[j].award_number;
                                        title = hits_source[j].title;
                                        account_number = hits_source[j].account_number;
                                        pi_name = hits_source[j].pi_name;
                                        lead_unit_name = hits_source[j].lead_unit_name;
                                        lead_unit_number = hits_source[j].lead_unit_number;
                                        sponsor = hits_source[j].sponsor;
                                        test = hits_source[j];
                                        if (typeof (hits_highlight[j].award_number) !== 'undefined') {
                                            awardNumber = hits_highlight[j].award_number;
                                        }
                                        if (typeof (hits_highlight[j].title) !== 'undefined') {
                                            title = hits_highlight[j].title;
                                        }
                                        if (typeof (hits_highlight[j].account_number) !== 'undefined') {
                                            account_number = hits_highlight[j].account_number;
                                        }
                                        if (typeof (hits_highlight[j].pi_name) !== 'undefined') {
                                            pi_name = hits_highlight[j].pi_name;
                                        }
                                        if (typeof (hits_highlight[j].lead_unit_name) !== 'undefined') {
                                            lead_unit_name = hits_highlight[j].lead_unit_name;
                                        }
                                        if (typeof (hits_highlight[j].lead_unit_number) !== 'undefined') {
                                            lead_unit_number = hits_highlight[j].lead_unit_number;
                                        }
                                        if (typeof (hits_highlight[j].sponsor) !== 'undefined') {
                                            sponsor = hits_highlight[j].sponsor;
                                        }
                                        results.push({
                                            label: awardNumber + '  :  ' + account_number
                                                + '  |  ' + title
                                                + '  |  ' + lead_unit_number
                                                + '  |  ' + lead_unit_name
                                                + '  |  ' + pi_name
                                                + '  |  ' + sponsor,
                                            obj: test
                                        });
                                    }
                                });
                                if (results.length > 0) {
                                    _this.message = '';
                                }
                                else {
                                    if (_this.seachTextModel && _this.seachTextModel.trim()) {
                                        _this.message = 'nothing was found';
                                    }
                                }
                                resolve(results);
                            });
                        })
                            .catch(function (error) {
                            _this._ngZone.run(function () {
                                reject(error);
                            });
                        });
                    }
                    /*ELASTIC SEARCH FOR PROPOSALS*/
                    if (_this.tabPosition == 'PROPOSAL') {
                        _this.ps.search(searchString, _this.personId)
                            .then(function (searchResult) {
                            _this._ngZone.run(function () {
                                hits_source = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit._source; });
                                hits_highlight = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit.highlight; });
                                hits_source.forEach(function (elmnt, j) {
                                    proposalNo = hits_source[j].proposal_number;
                                    title = hits_source[j].title;
                                    lead_unit_name = hits_source[j].lead_unit_name;
                                    lead_unit_number = hits_source[j].lead_unit_number;
                                    sponsor = hits_source[j].sponsor;
                                    status = hits_source[j].status;
                                    personName = hits_source[j].person_name;
                                    test = hits_source[j];
                                    if (typeof (hits_highlight[j].proposal_number) !== 'undefined') {
                                        proposalNo = hits_highlight[j].proposal_number;
                                    }
                                    if (typeof (hits_highlight[j].title) !== 'undefined') {
                                        title = hits_highlight[j].title;
                                    }
                                    if (typeof (hits_highlight[j].lead_unit_name) !== 'undefined') {
                                        lead_unit_name = hits_highlight[j].lead_unit_name;
                                    }
                                    if (typeof (hits_highlight[j].lead_unit_number) !== 'undefined') {
                                        lead_unit_number = hits_highlight[j].lead_unit_number;
                                    }
                                    if (typeof (hits_highlight[j].sponsor) !== 'undefined') {
                                        sponsor = hits_highlight[j].sponsor;
                                    }
                                    if (typeof (hits_highlight[j].status) !== 'undefined') {
                                        status = hits_highlight[j].status;
                                    }
                                    if (typeof (hits_highlight[j].person_name) !== 'undefined') {
                                        personName = hits_highlight[j].person_name;
                                    }
                                    results.push({
                                        label: proposalNo + '  :  ' + title
                                            + '  |  ' + lead_unit_number
                                            + '  |  ' + lead_unit_name
                                            + '  |  ' + sponsor
                                            + '  |  ' + personName,
                                        obj: test
                                    });
                                });
                                if (results.length > 0) {
                                    _this.message = '';
                                }
                                else {
                                    if (_this.seachTextModel && _this.seachTextModel.trim()) {
                                        _this.message = 'nothing was found';
                                    }
                                }
                                resolve(results);
                            });
                        })
                            .catch(function (error) {
                            _this._ngZone.run(function () {
                                reject(error);
                            });
                        });
                    }
                    /*ELASTIC SEARCH FOR IRB*/
                    if (_this.tabPosition == 'IRB') {
                        _this.irb.search(searchString, _this.personId)
                            .then(function (searchResult) {
                            _this._ngZone.run(function () {
                                hits_source = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit._source; });
                                hits_highlight = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit.highlight; });
                                hits_source.forEach(function (elmnt, j) {
                                    protocol_number = hits_source[j].protocol_number;
                                    title = hits_source[j].title;
                                    lead_unit = hits_source[j].lead_unit_name;
                                    unit_number = hits_source[j].lead_unit_number;
                                    protocol_type = hits_source[j].protocol_type;
                                    personName = hits_source[j].person_name;
                                    status = hits_source[j].status;
                                    test = hits_source[j];
                                    if (typeof (hits_highlight[j].protocol_number) !== 'undefined') {
                                        protocol_number = hits_highlight[j].protocol_number;
                                    }
                                    if (typeof (hits_highlight[j].title) !== 'undefined') {
                                        title = hits_highlight[j].title;
                                    }
                                    if (typeof (hits_highlight[j].lead_unit_name) !== 'undefined') {
                                        lead_unit = hits_highlight[j].lead_unit_name;
                                    }
                                    if (typeof (hits_highlight[j].lead_unit_number) !== 'undefined') {
                                        unit_number = hits_highlight[j].lead_unit_number;
                                    }
                                    if (typeof (hits_highlight[j].protocol_type) !== 'undefined') {
                                        protocol_type = hits_highlight[j].protocol_type;
                                    }
                                    if (typeof (hits_highlight[j].person_name) !== 'undefined') {
                                        personName = hits_highlight[j].person_name;
                                    }
                                    if (typeof (hits_highlight[j].status) !== 'undefined') {
                                        status = hits_highlight[j].status;
                                    }
                                    results.push({
                                        label: protocol_number + '  :  ' + title
                                            + '  |  ' + unit_number
                                            + '  |  ' + lead_unit
                                            + '  |  ' + protocol_type
                                            + '  |  ' + personName
                                            + '  |  ' + status,
                                        obj: test
                                    });
                                });
                                if (results.length > 0) {
                                    _this.message = '';
                                }
                                else {
                                    if (_this.seachTextModel && _this.seachTextModel.trim()) {
                                        _this.message = 'nothing was found';
                                    }
                                }
                                resolve(results);
                            });
                        })
                            .catch(function (error) {
                            _this._ngZone.run(function () {
                                reject(error);
                            });
                        });
                    }
                    /*ELASTIC SEARCH FOR IACUC*/
                    if (_this.tabPosition == 'IACUC') {
                        _this.iacuc.search(searchString, _this.personId)
                            .then(function (searchResult) {
                            _this._ngZone.run(function () {
                                hits_source = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit._source; });
                                hits_highlight = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit.highlight; });
                                hits_source.forEach(function (elmnt, j) {
                                    protocol_number = hits_source[j].protocol_number;
                                    title = hits_source[j].title;
                                    lead_unit = hits_source[j].lead_unit_name;
                                    lead_unit_number = hits_source[j].lead_unit_number;
                                    protocol_type = hits_source[j].protocol_type;
                                    status = hits_source[j].status;
                                    personName = hits_source[j].person_name;
                                    test = hits_source[j];
                                    if (typeof (hits_highlight[j].protocol_number) !== 'undefined') {
                                        protocol_number = hits_highlight[j].protocol_number;
                                    }
                                    if (typeof (hits_highlight[j].title) !== 'undefined') {
                                        title = hits_highlight[j].title;
                                    }
                                    if (typeof (hits_highlight[j].lead_unit_name) !== 'undefined') {
                                        lead_unit = hits_highlight[j].lead_unit_name;
                                    }
                                    if (typeof (hits_highlight[j].lead_unit_number) !== 'undefined') {
                                        lead_unit_number = hits_highlight[j].lead_unit_number;
                                    }
                                    if (typeof (hits_highlight[j].protocol_type) !== 'undefined') {
                                        protocol_type = hits_highlight[j].protocol_type;
                                    }
                                    if (typeof (hits_highlight[j].status) !== 'undefined') {
                                        status = hits_highlight[j].status;
                                    }
                                    if (typeof (hits_highlight[j].person_name) !== 'undefined') {
                                        personName = hits_highlight[j].person_name;
                                    }
                                    results.push({
                                        label: protocol_number + '  :  ' + title
                                            + '  |  ' + lead_unit_number
                                            + '  |  ' + lead_unit
                                            + '  |  ' + protocol_type
                                            + '  |  ' + status
                                            + '  |  ' + personName,
                                        obj: test
                                    });
                                });
                                if (results.length > 0) {
                                    _this.message = '';
                                }
                                else {
                                    if (_this.seachTextModel && _this.seachTextModel.trim()) {
                                        _this.message = 'nothing was found';
                                    }
                                }
                                resolve(results);
                            });
                        })
                            .catch(function (error) {
                            _this._ngZone.run(function () {
                                reject(error);
                            });
                        });
                    }
                    /*ELASTIC SEARCH FOR DISCLOSURE*/
                    if (_this.tabPosition == 'DISCLOSURE') {
                        _this.dis.search(searchString, _this.personId)
                            .then(function (searchResult) {
                            _this._ngZone.run(function () {
                                hits_source = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit._source; });
                                hits_highlight = ((searchResult.hits || {}).hits || [])
                                    .map(function (hit) { return hit.highlight; });
                                hits_source.forEach(function (elmnt, j) {
                                    full_name = hits_source[j].full_name;
                                    disclosure_number = hits_source[j].coi_disclosure_number;
                                    disclosure_disposition = hits_source[j].disclosure_disposition;
                                    disclosure_status = hits_source[j].disclosure_status;
                                    module_item_key = hits_source[j].module_item_key;
                                    test = hits_source[j];
                                    if (typeof (hits_highlight[j].coi_disclosure_number) !== 'undefined') {
                                        disclosure_number = hits_highlight[j].coi_disclosure_number;
                                    }
                                    if (typeof (hits_highlight[j].full_name) !== 'undefined') {
                                        full_name = hits_highlight[j].full_name;
                                    }
                                    if (typeof (hits_highlight[j].disclosure_disposition) !== 'undefined') {
                                        disclosure_disposition = hits_highlight[j].disclosure_disposition;
                                    }
                                    if (typeof (hits_highlight[j].disclosure_status) !== 'undefined') {
                                        disclosure_status = hits_highlight[j].disclosure_status;
                                    }
                                    if (typeof (hits_highlight[j].module_item_key) !== 'undefined') {
                                        module_item_key = hits_highlight[j].module_item_key;
                                    }
                                    results.push({
                                        label: disclosure_number + '  :  '
                                            + '  |  ' + full_name
                                            + '  |  ' + disclosure_disposition
                                            + '  |  ' + disclosure_status
                                            + '  |  ' + module_item_key,
                                        obj: test
                                    });
                                });
                                if (results.length > 0) {
                                    _this.message = '';
                                }
                                else {
                                    if (_this.seachTextModel && _this.seachTextModel.trim()) {
                                        _this.message = 'nothing was found';
                                    }
                                }
                                resolve(results);
                            });
                        })
                            .catch(function (error) {
                            _this._ngZone.run(function () {
                                reject(error);
                            });
                        });
                    }
                });
            });
        })
            .catch(this.handleError)
            .subscribe(this._results);
    };
    ElasticSearchComponent.prototype.resutSelected = function (result) {
        this.selected.next(result);
        this.active = !this.active;
        switch (this.tabPosition) {
            case 'AWARD':
                this.seachTextModel = result.obj.award_number;
                break;
            case 'PROPOSAL':
                this.seachTextModel = result.obj.proposal_number;
                break;
            case 'IRB':
                this.seachTextModel = result.obj.protocol_number;
                break;
            case 'IACUC':
                this.seachTextModel = result.obj.protocol_number;
                break;
            case 'DISCLOSURE':
                this.seachTextModel = result.obj.coi_disclosure_number;
                break;
        }
        this.showResultDiv();
    };
    ElasticSearchComponent.prototype.handleError = function () {
        this.message = 'something went wrong';
    };
    ElasticSearchComponent.prototype.onSearchValueChange = function () {
        this.iconClass = this.seachTextModel ? 'fa fa-times' : 'fa fa-search';
        if (this.seachTextModel === '' && this.resultCardView === true) {
            this.hideResultDiv();
        }
    };
    ElasticSearchComponent.prototype.clearsearchBox = function (e) {
        e.preventDefault();
        this.seachTextModel = '';
        if (this.resultCardView) {
            this.hideResultDiv();
        }
    };
    ElasticSearchComponent.prototype.sendMessage = function () {
        this.messageEvent.emit(this.resultCardView);
    };
    ElasticSearchComponent.prototype.hideResultDiv = function () {
        this.resultCardView = false;
        this.sendMessage();
    };
    ElasticSearchComponent.prototype.showResultDiv = function () {
        this.resultCardView = true;
        this.sendMessage();
    };
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], ElasticSearchComponent.prototype, "found", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], ElasticSearchComponent.prototype, "selected", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], ElasticSearchComponent.prototype, "messageEvent", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ElasticSearchComponent.prototype, "tabPosition", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], ElasticSearchComponent.prototype, "placeText", void 0);
    ElasticSearchComponent = __decorate([
        Component({
            selector: 'app-elastic-search',
            templateUrl: './elastic-search.component.html',
            styleUrls: ['../../assets/css/bootstrap.min.css',
                '../../assets/css/font-awesome.min.css',
                '../../assets/css/style.css',
                '../../assets/css/search.css'],
            providers: [AwardElasticsearchService],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        __metadata("design:paramtypes", [AwardElasticsearchService, ProposalElasticsearchService,
            IrbElasticsearchService, IacucElasticsearchService,
            DisclosureElasticsearchService, NgZone])
    ], ElasticSearchComponent);
    return ElasticSearchComponent;
}());
export { ElasticSearchComponent };
//# sourceMappingURL=elastic-search.component.js.map