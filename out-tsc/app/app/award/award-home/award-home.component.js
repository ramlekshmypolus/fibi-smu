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
import { AwardSummaryService } from './award-summary.service';
import { ActivatedRoute } from '@angular/router';
import { AwardComponent } from '../award.component';
import { AwardconfigurationService } from '../../award/awardconfiguration.service';
var AwardHomeComponent = (function () {
    function AwardHomeComponent(awardComponent, awardSummaryService, route, awardconfigurationService) {
        this.awardComponent = awardComponent;
        this.awardSummaryService = awardSummaryService;
        this.route = route;
        this.awardconfigurationService = awardconfigurationService;
        this.result = {};
        this.awardPersons = [];
        this.awardSponsorContacts = [];
        this.awardUnitContacts = [];
        this.awardSpecialReviews = [];
        this.awardFundedProposals = [];
        this.pi_coiTrigger = false;
        this.kpTrigger = false;
    }
    AwardHomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.awardId = this.route.snapshot.queryParams['awardId'];
        this.currentDataSubscription = this.awardconfigurationService.currentAwardData.subscribe(function (data) {
            _this.result = data;
            if (_this.result.length !== 0 && _this.result.awardDetails != null) {
                _this.activityType = _this.result.awardDetails[0].activity_type;
                _this.awardNumber = _this.result.awardDetails[0].award_number;
                _this.awardType = _this.result.awardDetails[0].award_type;
                _this.accountType = _this.result.awardDetails[0].account_type;
                _this.sponsorAwardNumber = _this.result.awardDetails[0].sponsor_award_number;
                _this.awardTitle = _this.result.awardDetails[0].title;
                _this.awardEffectiveDate = _this.result.awardDetails[0].award_effective_date;
                _this.obligationStartDate = _this.result.awardDetails[0].obligation_start;
                _this.obligationEndDate = _this.result.awardDetails[0].obligation_end;
                _this.noticeDate = _this.result.awardDetails[0].notice_date;
                _this.obligatedAmount = _this.result.awardDetails[0].obligated_amount;
                _this.anticipatedAmount = _this.result.awardDetails[0].anticipated_amount;
                _this.awardPersons = _this.result.awardPersons;
                _this.awardSponsorContacts = _this.result.awardSponsorContact;
                _this.awardUnitContacts = _this.result.awardUnitContact;
                _this.awardSpecialReviews = _this.result.awardSpecialReviews;
                _this.awardFundedProposals = _this.result.awardFundedProposals;
                for (var i = 0; i < _this.awardPersons.length; i++) {
                    if (_this.awardPersons[i].contact_role_code == 'PI' || _this.awardPersons[i].contact_role_code == 'COI') {
                        _this.pi_coiTrigger = true;
                    }
                    else if (_this.awardPersons[i].contact_role_code == 'KP') {
                        _this.kpTrigger = true;
                    }
                }
            }
        });
    };
    AwardHomeComponent.prototype.ngOnChanges = function () { };
    AwardHomeComponent.prototype.ngOnDestroy = function () {
        this.currentDataSubscription.unsubscribe();
    };
    AwardHomeComponent = __decorate([
        Component({
            selector: 'app-award-home',
            templateUrl: './award-home.component.html',
            styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [AwardComponent, AwardSummaryService, ActivatedRoute, AwardconfigurationService])
    ], AwardHomeComponent);
    return AwardHomeComponent;
}());
export { AwardHomeComponent };
//# sourceMappingURL=award-home.component.js.map