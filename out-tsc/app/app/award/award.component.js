var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AwardSummaryService } from './award-home/award-summary.service';
import { ActivatedRoute } from '@angular/router';
import { AwardHierarchyService } from '../award/award-hierarchy/award-hierarchy.service';
import { Constants } from '../constants/constants.service';
import { AwardconfigurationService } from '../award/awardconfiguration.service';
var AwardComponent = (function () {
    function AwardComponent(awardSummaryService, route, awardHierarchyService, constant, awardconfigurationService) {
        this.awardSummaryService = awardSummaryService;
        this.route = route;
        this.awardHierarchyService = awardHierarchyService;
        this.constant = constant;
        this.awardconfigurationService = awardconfigurationService;
        this.currentTab = 'award_home';
        this.result = {};
        this.outputPath = this.constant.outputPath;
    }
    AwardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentValueSub = this.awardHierarchyService.currentvalue.subscribe(function (data) {
            _this.currentTab = data;
        });
        this.awardId = this.route.snapshot.queryParams['awardId'];
        this.loadAwardSub = this.awardSummaryService.loadAwardSummary(this.awardId).subscribe(function (data) {
            _this.result = data || [];
            if (_this.result.length !== 0 && _this.result.awardDetails !== undefined && _this.result.awardPersons !== undefined) {
                _this.awardconfigurationService.changeAwardData(_this.result);
                _this.userName = _this.result.awardPersons[0].user_name;
                _this.awardNumber = _this.result.awardDetails[0].award_number;
                _this.accountNumber = _this.result.awardDetails[0].account_number;
                _this.leadUnitName = _this.result.awardDetails[0].lead_unit_name;
                _this.awardStatus = _this.result.awardDetails[0].award_status;
                _this.sponsorName = _this.result.awardDetails[0].sponsor_name;
                _this.lastUpdate = _this.result.awardDetails[0].last_update;
                _this.documentNumber = _this.result.awardDetails[0].document_number;
            }
        });
    };
    AwardComponent.prototype.show_current_tab = function (e, current_tab) {
        e.preventDefault();
        this.currentTab = current_tab;
    };
    AwardComponent.prototype.ngOnDestroy = function () {
        this.currentValueSub.unsubscribe();
        this.loadAwardSub.unsubscribe();
    };
    AwardComponent = __decorate([
        Component({
            templateUrl: 'award.component.html',
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [AwardSummaryService, ActivatedRoute, AwardHierarchyService, Constants, AwardconfigurationService])
    ], AwardComponent);
    return AwardComponent;
}());
export { AwardComponent };
//# sourceMappingURL=award.component.js.map