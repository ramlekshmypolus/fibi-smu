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
var InProgressProposalDonutChartComponent = (function (_super) {
    __extends(InProgressProposalDonutChartComponent, _super);
    function InProgressProposalDonutChartComponent(ref, dashboardService, router, expandedViewDataservice, dashboardData) {
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
    InProgressProposalDonutChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.dashboardData.dashboardPieChartData1Variable.subscribe(function (dashboardPieChartData1) {
            if (dashboardPieChartData1.summaryAwardPieChart != undefined) {
                _this.resultPie = dashboardPieChartData1;
                _super.prototype.googleChartFunction.call(_this);
            }
            _this.ref.detectChanges();
        });
    };
    InProgressProposalDonutChartComponent.prototype.ngOnDestroy = function () {
        if (this.subscription)
            this.subscription.unsubscribe();
    };
    InProgressProposalDonutChartComponent.prototype.drawGraph = function () {
        var _this = this;
        this.expandedViewDataservice.setDonutChartIndex('');
        this.expandedViewDataservice.setResearchSummaryIndex('');
        this.resultPie = this.dashboardData.getDashboardPieChartData();
        if (this.resultPie != null && this.resultPie.summaryProposalDonutChart !== undefined) {
            this.proposalList = this.resultPie.summaryProposalDonutChart;
            this.proposalStateList = [];
            this.proposalStateList.push(['Task', 'Hours per Day']);
            this.proposalLength = this.proposalList.length;
            for (var j = 0; j < this.proposalLength; j++) {
                this.proposalstatuscode.push([this.proposalList[j][0], this.proposalList[j][1]]);
                this.proposalStateList.push([this.proposalList[j][1], this.proposalList[j][2]]);
            }
            this.proposalData = google.visualization.arrayToDataTable(this.proposalStateList);
            this.proposalOptions = {
                title: 'In Progress Proposals By Sponsors',
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
                pieHole: 0.2,
            };
            this.proposalChart = this.createPiChart(document.getElementById('donut_proposal_chart'));
            this.proposalChart.draw(this.proposalData, this.proposalOptions);
            google.visualization.events.addListener(this.proposalChart, 'select', function (event) {
                _this.expandedViewDataservice.setDonutChartIndex('INPROGRESS');
                var selection = _this.proposalChart.getSelection();
                for (var i = 0; i < selection.length; i++) {
                    var item = selection[i];
                    if (item.row != null) {
                        _this.proposalType = _this.proposalData.getFormattedValue(item.row, 0);
                        for (var j = 0; j < _this.proposalstatuscode.length; j++) {
                            if (_this.proposalType === _this.proposalstatuscode[j][1]) {
                                _this.expandedViewDataservice.setSponsorCode(_this.proposalstatuscode[j][0]);
                                _this.sponsorCode = _this.proposalstatuscode[j][0];
                                _this.expandedViewDataservice.setExpandedDonutViewProposalHeading("Proposals by " + _this.proposalType);
                                _this.router.navigate(['/expandedview'], { queryParams: { "donutchartIndex": "INPROGRESS", "sponsorCode": _this.sponsorCode, "donutProposalHeading": "Proposals by " + _this.proposalType } });
                            }
                        }
                    }
                }
            });
            google.visualization.events.addListener(this.proposalChart, 'onmouseover', function (event) {
                document.getElementById('donut_proposal_chart').style.cursor = 'pointer';
            });
            google.visualization.events.addListener(this.proposalChart, 'onmouseout', function (event) {
                document.getElementById('donut_proposal_chart').style.cursor = '';
            });
        }
    };
    InProgressProposalDonutChartComponent.prototype.onResize = function (event) {
        if (this.resultPie != null && this.resultPie.summaryProposalDonutChart !== undefined) {
            this.proposalChart.draw(this.proposalData, this.proposalOptions);
        }
    };
    InProgressProposalDonutChartComponent = __decorate([
        Component({
            selector: 'in-progress-proposal-donut-chart',
            template: "\n  <div id=\"donut_proposal_chart\" class=\"col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6\" (window:resize)=\"onResize($event)\"></div>",
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, DashboardService, Router, ExpandedViewDataService, DashboardData])
    ], InProgressProposalDonutChartComponent);
    return InProgressProposalDonutChartComponent;
}(GoogleChartService));
export { InProgressProposalDonutChartComponent };
//# sourceMappingURL=in-progress-proposal-donut-chart.component.js.map