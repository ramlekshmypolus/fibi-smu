var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleChartService } from '../research_summary/google-chart.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { DashboardData } from '../dashboard/dashboard-data.service';
import { ExpandedViewDataService } from './expanded-view-data-service';
var AwardedProposalDonutChartComponent = (function (_super) {
    __extends(AwardedProposalDonutChartComponent, _super);
    function AwardedProposalDonutChartComponent(ref, dashboardService, router, expandedViewDataservice, dashboardData) {
        var _this = _super.call(this) || this;
        _this.ref = ref;
        _this.dashboardService = dashboardService;
        _this.router = router;
        _this.expandedViewDataservice = expandedViewDataservice;
        _this.dashboardData = dashboardData;
        _this.resultPie = {};
        _this.awardStateList = [];
        _this.proposalStateList = [];
        _this.statuscode = [];
        _this.proposalstatuscode = [];
        return _this;
    }
    AwardedProposalDonutChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.dashboardData.dashboardPieChartData1Variable.subscribe(function (dashboardPieChartData) {
            if (dashboardPieChartData.summaryAwardDonutChart != undefined) {
                _this.resultPie = dashboardPieChartData;
                _super.prototype.googleChartFunction.call(_this);
            }
            _this.ref.detectChanges();
        });
    };
    AwardedProposalDonutChartComponent.prototype.ngOnDestroy = function () {
        if (this.subscription)
            this.subscription.unsubscribe();
        this.resultPie = {};
    };
    AwardedProposalDonutChartComponent.prototype.drawGraph = function () {
        var _this = this;
        this.expandedViewDataservice.setDonutChartIndex('');
        this.expandedViewDataservice.setResearchSummaryIndex('');
        this.resultPie = this.dashboardData.getDashboardPieChartData();
        if (this.resultPie != null && this.resultPie.summaryAwardDonutChart !== undefined) {
            this.awardList = this.resultPie.summaryAwardDonutChart;
            this.awardStateList = [];
            this.awardStateList.push(['Task', 'Hours per Day']);
            this.awardLength = this.awardList.length;
            for (var i = 0; i < this.awardLength; i++) {
                this.statuscode.push([this.awardList[i][0], this.awardList[i][1]]);
                this.awardStateList.push([this.awardList[i][1], this.awardList[i][2]]);
            }
            this.awardData = google.visualization.arrayToDataTable(this.awardStateList);
            this.awardOptions = {
                title: 'Awarded Proposals By Sponsors',
                legend: 'right',
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
                pieHole: 0.2,
            };
            this.awardChart = this.createPiChart(document.getElementById('donut_award_chart'));
            this.awardChart.draw(this.awardData, this.awardOptions);
            google.visualization.events.addListener(this.awardChart, 'select', function (event) {
                _this.expandedViewDataservice.setDonutChartIndex('AWARDED');
                var selection = _this.awardChart.getSelection();
                for (var i = 0; i < selection.length; i++) {
                    var item = selection[i];
                    if (item.row != null) {
                        _this.sponsorType = _this.awardData.getFormattedValue(item.row, 0);
                        for (var j = 0; j < _this.statuscode.length; j++) {
                            if (_this.sponsorType === _this.statuscode[j][1]) {
                                _this.expandedViewDataservice.setSponsorCode(_this.statuscode[j][0]);
                                _this.expandedViewDataservice.setExpandedDonutViewAwardHeading("Awards by " + _this.sponsorType);
                                _this.router.navigate(['/expandedview'], { queryParams: { "donutchartIndex": "AWARDED", "sponsorCode": _this.statuscode[j][0], "donutAwardHeading": "Awards by " + _this.sponsorType } });
                                break;
                            }
                        }
                    }
                }
            });
            google.visualization.events.addListener(this.awardChart, 'onmouseover', function (event) {
                document.getElementById('donut_award_chart').style.cursor = 'pointer';
            });
            google.visualization.events.addListener(this.awardChart, 'onmouseout', function (event) {
                document.getElementById('donut_award_chart').style.cursor = '';
            });
        }
    };
    AwardedProposalDonutChartComponent.prototype.onResize = function (event) {
        if (this.resultPie != null && this.resultPie.summaryAwardDonutChart !== undefined) {
            this.awardChart.draw(this.awardData, this.awardOptions);
        }
    };
    AwardedProposalDonutChartComponent = __decorate([
        Component({
            selector: 'awarded-proposal-donut-chart',
            template: "  \n  <div id=\"donut_award_chart\" class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6\" (window:resize)=\"onResize($event)\"></div>",
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, DashboardService, Router, ExpandedViewDataService, DashboardData])
    ], AwardedProposalDonutChartComponent);
    return AwardedProposalDonutChartComponent;
}(GoogleChartService));
export { AwardedProposalDonutChartComponent };
//# sourceMappingURL=awarded-proposal-donut-chart.component.js.map