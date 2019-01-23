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
import { AwardReportsAndTermsService } from '../award-reports-and-tabs/award-reports-and-terms.service';
var AwardReportsAndTerms = (function () {
    function AwardReportsAndTerms(awardreportsandtermsService) {
        this.awardreportsandtermsService = awardreportsandtermsService;
        this.showReports = true;
        this.showPaymentAndInvoice = true;
        this.showApprovedSpecialItems = true;
        this.showTerms = true;
        this.noReports = false;
        this.noPayment = false;
        this.noApprovedEquipment = false;
        this.noApprovedTravel = false;
        this.noTerms = false;
        this.result = {};
        this.awardReportKeyList = [];
        this.awardTermsKeyList = [];
    }
    AwardReportsAndTerms.prototype.ngOnInit = function () {
        var _this = this;
        this.getReportadTermsSubscription = this.awardreportsandtermsService.getAwardReportsAndTerms().subscribe(function (data) {
            _this.result = data;
            if (_this.result.awardPaymntSchedule !== undefined && _this.result.awardTerms !== undefined && _this.result.awardPaymntInvoice !== undefined && _this.result.approvedTravel !== undefined) {
                _this.awardReportKeyList = Object.keys(_this.result.awardReport);
                _this.awardTermsKeyList = Object.keys(_this.result.awardTerms);
                if (_this.result.awardReport == null || _this.result.awardReport.length == 0) {
                    _this.noReports = true;
                }
                if (_this.result.awardApprovdEquipment == null || _this.result.awardApprovdEquipment.length == 0) {
                    _this.noApprovedEquipment = true;
                }
                if (_this.result.approvedTravel == null || _this.result.approvedTravel.length == 0) {
                    _this.noApprovedTravel = true;
                }
                if (_this.result.awardTerms == null || _this.result.awardTerms.length == 0) {
                    _this.noTerms = true;
                }
                if (_this.result.awardPaymntInvoice == null || _this.result.awardPaymntInvoice.length == 0) {
                    _this.noPayment = true;
                }
            }
        });
    };
    AwardReportsAndTerms.prototype.showReportingTab = function (event) {
        event.preventDefault();
        this.showReports = !this.showReports;
    };
    AwardReportsAndTerms.prototype.showPaymentAndInvoiceTab = function (event) {
        event.preventDefault();
        this.showPaymentAndInvoice = !this.showPaymentAndInvoice;
    };
    AwardReportsAndTerms.prototype.showApprovedSpecialItemsTab = function (event) {
        event.preventDefault();
        this.showApprovedSpecialItems = !this.showApprovedSpecialItems;
    };
    AwardReportsAndTerms.prototype.showTermsTab = function (event) {
        event.preventDefault();
        this.showTerms = !this.showTerms;
    };
    AwardReportsAndTerms.prototype.ngOnDestroy = function () {
        this.getReportadTermsSubscription.unsubscribe();
    };
    AwardReportsAndTerms = __decorate([
        Component({
            selector: 'award-reports-and-terms',
            templateUrl: 'award-reports-and-terms.component.html',
            styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [AwardReportsAndTermsService])
    ], AwardReportsAndTerms);
    return AwardReportsAndTerms;
}());
export { AwardReportsAndTerms };
//# sourceMappingURL=award-reports-and-terms.component.js.map