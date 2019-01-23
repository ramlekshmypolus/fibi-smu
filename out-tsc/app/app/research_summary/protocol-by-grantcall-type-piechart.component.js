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
var ProtocolByGrantcallTypePieChartComponent = (function (_super) {
    __extends(ProtocolByGrantcallTypePieChartComponent, _super);
    function ProtocolByGrantcallTypePieChartComponent(ref, dashboardService, router, expandedViewDataservice, dashboardData) {
        var _this = _super.call(this) || this;
        _this.ref = ref;
        _this.dashboardService = dashboardService;
        _this.router = router;
        _this.expandedViewDataservice = expandedViewDataservice;
        _this.dashboardData = dashboardData;
        _this.resultPie = {};
        _this.piechartDrawList = [];
        return _this;
    }
    ProtocolByGrantcallTypePieChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.dashboardData.reportDataVariable.subscribe(function (dashboardReportData) {
            if (dashboardReportData.applicationsByGrantCallType != undefined) {
                _this.resultPie = dashboardReportData;
                _super.prototype.googleChartFunction.call(_this);
            }
            _this.ref.detectChanges();
        });
    };
    ProtocolByGrantcallTypePieChartComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.resultPie = {};
        }
    };
    ProtocolByGrantcallTypePieChartComponent.prototype.drawGraph = function () {
        this.resultPie = this.dashboardData.getReportData();
        if (this.resultPie != null && this.resultPie._value.protocolsByType !== undefined) {
            var tempObject = {};
            tempObject = this.resultPie._value.protocolsByType;
            this.piechartList = Object.entries(tempObject).map(function (_a) {
                var key = _a[0], value = _a[1];
                return ([key, value]);
            });
            //this.awardList = this.resultPie._value.applicationsByGrantCallType;
            this.piechartDrawList = [];
            this.piechartDrawList.push(['Type', 'Count']);
            var length_1 = this.piechartList.length;
            for (var i = 0; i < length_1; i++) {
                this.piechartDrawList.push([this.piechartList[i][0], this.piechartList[i][1]]);
            }
            this.piechartDrawData = google.visualization.arrayToDataTable(this.piechartDrawList);
            this.piechartOptions = {
                title: '',
                legend: 'right',
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C']
            };
            this.grantCallChart = this.createPiChart(document.getElementById('pichart_protocol_grantcall'));
            this.grantCallChart.draw(this.piechartDrawData, this.piechartOptions);
        }
    };
    ProtocolByGrantcallTypePieChartComponent.prototype.onResize = function (event) {
        this.grantCallChart.draw(this.piechartDrawData, this.piechartOptions);
    };
    ProtocolByGrantcallTypePieChartComponent = __decorate([
        Component({
            selector: 'protocol-grantcall-type-piechart',
            template: "  \n  <div id=\"pichart_protocol_grantcall\" class=\"col-xl-4 col-lg-4 col-md-4 col-sm-4 col-xs-4\" (window:resize)=\"onResize($event)\"></div>",
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, DashboardService, Router, ExpandedViewDataService, DashboardData])
    ], ProtocolByGrantcallTypePieChartComponent);
    return ProtocolByGrantcallTypePieChartComponent;
}(GoogleChartService));
export { ProtocolByGrantcallTypePieChartComponent };
//# sourceMappingURL=protocol-by-grantcall-type-piechart.component.js.map