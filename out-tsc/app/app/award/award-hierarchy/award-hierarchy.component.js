var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { AwardHierarchyService } from './award-hierarchy.service';
import { AwardSummaryService } from '../award-home/award-summary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TREE_ACTIONS } from 'angular-tree-component';
var AwardHierarchyComponent = (function () {
    function AwardHierarchyComponent(awardHierarchyService, awardSummaryService, route, router) {
        var _this = this;
        this.awardHierarchyService = awardHierarchyService;
        this.awardSummaryService = awardSummaryService;
        this.route = route;
        this.router = router;
        this.result = {};
        this.temp1Object = [{}];
        this.tempObject = [];
        this.treeData = [];
        this.expandAllEnabled = false;
        this.nodes = [];
        this.options = {
            displayField: 'name',
            isExpandedField: 'isOpen',
            idField: 'awardId',
            childrenField: 'children',
            actionMapping: {
                mouse: {
                    click: function (tree, node, $event) {
                        node.setActiveAndVisible();
                        _this.awardSummSubscription = _this.awardSummaryService.loadAwardSummary(node.id).subscribe(function (data) {
                            _this.result = data || [];
                            if (_this.result.awardDetails !== undefined) {
                                _this.awardNumber = _this.result.awardDetails[0].award_number;
                                _this.activityType = _this.result.awardDetails[0].activity_type;
                                _this.awardType = _this.result.awardDetails[0].award_type;
                                _this.awardId = node.id;
                                _this.accountType = _this.result.awardDetails[0].account_type;
                                _this.sponsorAwardNumber = _this.result.awardDetails[0].sponsor_award_number;
                                _this.awardTitle = _this.result.awardDetails[0].title;
                                _this.awardEffectiveDate = _this.result.awardDetails[0].award_effective_date;
                                _this.obligationStartDate = _this.result.awardDetails[0].obligation_start;
                                _this.obligationEndDate = _this.result.awardDetails[0].obligation_end;
                                _this.noticeDate = _this.result.awardDetails[0].notice_date;
                                _this.obligatedAmount = _this.result.awardDetails[0].obligated_amount;
                                _this.anticipatedAmount = _this.result.awardDetails[0].anticipated_amount;
                                _this.accountNumber = _this.result.awardDetails[0].account_number;
                                _this.piName = _this.result.awardDetails[0].full_name;
                            }
                        });
                    },
                    dblClick: function (tree, node, $event) {
                        if (node.hasChildren)
                            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
                    }
                }
            }
        };
        this.functionInConstructor();
    }
    AwardHierarchyComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.tree.treeModel.expandAll();
            var currentNode = _this.tree.treeModel.getNodeById(_this.awardId);
            currentNode.setActiveAndVisible();
        }, 1000);
    };
    AwardHierarchyComponent.prototype.expandAllNodes = function (e) {
        this.expandAllEnabled = false;
        e.preventDefault();
        this.tree.treeModel.expandAll();
        var currentNode = this.tree.treeModel.getNodeById(this.awardId);
        currentNode.setActiveAndVisible();
    };
    //function to be called in constructor
    AwardHierarchyComponent.prototype.functionInConstructor = function () {
        var _this = this;
        this.awardId = this.route.snapshot.queryParams['awardId'];
        this.awardSummSubscription = this.awardSummaryService.loadAwardSummary(this.awardId).subscribe(function (data) {
            _this.result = data || [];
            if (_this.result != null) {
                _this.awardNumber = _this.result.awardDetails[0].award_number;
                _this.rootAwardNumber = _this.result.awardDetails[0].root_award_number;
                _this.loadAwardHierarchySubscription = _this.awardHierarchyService.loadAwardHierarchy(_this.rootAwardNumber, _this.awardNumber).subscribe(function (data) {
                    _this.result = data || [];
                    if (_this.result != null) {
                        _this.nodes = Array.of(_this.result.awardHierarchy);
                        _this.awardDetailsFetching(_this.awardId);
                    }
                });
            }
        });
    };
    AwardHierarchyComponent.prototype.collapseAllNodes = function (event) {
        this.expandAllEnabled = true;
        event.preventDefault();
        this.tree.treeModel.collapseAll();
    };
    AwardHierarchyComponent.prototype.awardDetailsFetching = function (awardId) {
        var _this = this;
        this.awardSummSubscription = this.awardSummaryService.loadAwardSummary(awardId).subscribe(function (data) {
            _this.result = data || [];
            if (_this.result.awardDetails[0] != null) {
                _this.accountNumber = _this.result.awardDetails[0].account_number;
                _this.piName = _this.result.awardDetails[0].full_name;
                _this.activityType = _this.result.awardDetails[0].activity_type;
                _this.awardType = _this.result.awardDetails[0].award_type;
                _this.accountType = _this.result.awardDetails[0].account_type;
                _this.leadUnitName = _this.result.awardDetails[0].lead_unit_name;
                _this.awardStatus = _this.result.awardDetails[0].award_status;
                _this.sponsorName = _this.result.awardDetails[0].sponsor_name;
                _this.awardTitle = _this.result.awardDetails[0].title;
                _this.awardEffectiveDate = _this.result.awardDetails[0].award_effective_date;
                _this.obligationStartDate = _this.result.awardDetails[0].obligation_start;
                _this.obligationEndDate = _this.result.awardDetails[0].obligation_end;
                _this.noticeDate = _this.result.awardDetails[0].notice_date;
                _this.obligatedAmount = _this.result.awardDetails[0].obligated_amount;
                _this.anticipatedAmount = _this.result.awardDetails[0].anticipated_amount;
            }
        });
    };
    //change tab to award-home
    AwardHierarchyComponent.prototype.awardView = function (event, awardId) {
        event.preventDefault();
        this.router.navigate(['/award'], { queryParams: { awardId: awardId } });
        this.awardHierarchyService.changeCurrenttab('award_home');
    };
    AwardHierarchyComponent.prototype.ngOnDestroy = function () {
        this.loadAwardHierarchySubscription.unsubscribe();
        this.awardSummSubscription.unsubscribe();
    };
    __decorate([
        ViewChild('tree'),
        __metadata("design:type", Object)
    ], AwardHierarchyComponent.prototype, "tree", void 0);
    AwardHierarchyComponent = __decorate([
        Component({
            selector: 'app-award-hierarchy',
            templateUrl: './award-hierarchy.component.html',
            styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
        }),
        __metadata("design:paramtypes", [AwardHierarchyService, AwardSummaryService, ActivatedRoute, Router])
    ], AwardHierarchyComponent);
    return AwardHierarchyComponent;
}());
export { AwardHierarchyComponent };
//# sourceMappingURL=award-hierarchy.component.js.map