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
import { AwardCommitmentsService } from './award-commitments.service';
import { ActivatedRoute } from '@angular/router';
var AwardCommitmentsComponent = (function () {
    function AwardCommitmentsComponent(awardCommitmentsService, route) {
        this.awardCommitmentsService = awardCommitmentsService;
        this.route = route;
        this.showRates = true;
        this.showCostsharing = true;
        this.noRateData = true;
        this.noCostsharingData = true;
        this.result = {};
    }
    AwardCommitmentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.awardId = this.route.snapshot.queryParamMap.get('awardId');
        this.subscription = this.awardCommitmentsService.loadCostsharingDetails(this.awardId)
            .subscribe(function (data) {
            _this.result = data;
            if (_this.result.costShareDetails !== undefined && _this.result.fAndADetails !== undefined) {
                if (_this.result.costShareDetails.length != 0) {
                    _this.noCostsharingData = false;
                }
                if (_this.result.fAndADetails.length != 0 || _this.result.benefitsRates.length != 0) {
                    _this.noRateData = false;
                }
            }
        });
    };
    AwardCommitmentsComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    AwardCommitmentsComponent.prototype.showRatesTab = function (event) {
        event.preventDefault();
        this.showRates = !this.showRates;
    };
    AwardCommitmentsComponent.prototype.showCostsharingTab = function (event) {
        event.preventDefault();
        this.showCostsharing = !this.showCostsharing;
    };
    AwardCommitmentsComponent = __decorate([
        Component({
            selector: 'app-award-commitments',
            templateUrl: './award-commitments.component.html',
            styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [AwardCommitmentsService, ActivatedRoute])
    ], AwardCommitmentsComponent);
    return AwardCommitmentsComponent;
}());
export { AwardCommitmentsComponent };
//# sourceMappingURL=award-commitments.component.js.map