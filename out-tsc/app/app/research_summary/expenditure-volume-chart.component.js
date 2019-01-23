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
import { GoogleChartService } from '../research_summary/google-chart.service';
import { DashboardData } from '../dashboard/dashboard-data.service';
var ExpenditureVolumeChartComponent = (function (_super) {
    __extends(ExpenditureVolumeChartComponent, _super);
    function ExpenditureVolumeChartComponent(ref, dashboardData) {
        var _this = _super.call(this) || this;
        _this.ref = ref;
        _this.dashboardData = dashboardData;
        _this.result = {};
        _this.areaChartList = [];
        _this.noData = false;
        return _this;
    }
    ExpenditureVolumeChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.dashboardData.dashboardAreaChartData1Variable.subscribe(function (dashboardAreaChartData1) {
            if (dashboardAreaChartData1.length > 1) {
                _this.researchSummaryList = dashboardAreaChartData1;
                _super.prototype.googleChartFunction.call(_this);
            }
            _this.ref.detectChanges();
        });
    };
    ExpenditureVolumeChartComponent.prototype.ngOnDestroy = function () {
        if (this.subscription)
            this.subscription.unsubscribe();
        this.researchSummaryList = [];
    };
    ExpenditureVolumeChartComponent.prototype.drawGraph = function () {
        this.researchSummaryList = this.dashboardData.getdashboardAreaChartData();
        if (this.researchSummaryList != null && this.researchSummaryList !== undefined) {
            this.areachartLength = this.researchSummaryList.length;
            if (this.areachartLength == 0) {
                this.noData = true;
            }
            this.areaChartList = [];
            this.areaChartList.push(['Year', 'Direct', 'FA']);
            for (var i = 0; i < this.areachartLength; i++) {
                this.areaChartList.push([this.researchSummaryList[i][0], this.researchSummaryList[i][1], this.researchSummaryList[i][2]]);
            }
            this.data = this.createDataTable(this.areaChartList);
            this.options = {
                hAxis: {
                    title: 'Year',
                    minValue: 0
                },
                legend: { position: 'top', alignment: 'end' },
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
                animation: {
                    duration: 250 * 1.5,
                    easing: 'linear'
                }
            };
            if (this.noData) {
                document.getElementById('chart_divEvolution').innerHTML = 'No data';
            }
            else {
                this.chart = this.createAreaChart(document.getElementById('chart_divEvolution'));
                this.chart.draw(this.data, this.options);
            }
        }
    };
    ExpenditureVolumeChartComponent.prototype.onResize = function (event) {
        if (this.noData == false) {
            this.chart.draw(this.data, this.options);
        }
    };
    ExpenditureVolumeChartComponent = __decorate([
        Component({
            selector: 'areachart',
            template: "<div id=\"chart_divEvolution\" class=\"col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12\" [ngClass]=\"{'noDataOnChart':noData==true}\" (window:resize)=\"onResize($event)\"></div>",
            styleUrls: ['../../assets/css/style.css']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, DashboardData])
    ], ExpenditureVolumeChartComponent);
    return ExpenditureVolumeChartComponent;
}(GoogleChartService));
export { ExpenditureVolumeChartComponent };
//# sourceMappingURL=expenditure-volume-chart.component.js.map