var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
var GoogleChartService = (function () {
    function GoogleChartService() {
    }
    GoogleChartService_1 = GoogleChartService;
    GoogleChartService.prototype.getGoogle = function () {
        return google;
    };
    GoogleChartService.prototype.ngOnInit = function () { };
    GoogleChartService.prototype.googleChartFunction = function () {
        var _this = this;
        if (!GoogleChartService_1.googleLoaded) {
            GoogleChartService_1.googleLoaded = true;
            google.charts.load('current', { packages: ['corechart', 'bar'] });
        }
        google.charts.setOnLoadCallback(function () { return _this.drawGraph(); });
    };
    GoogleChartService.prototype.drawGraph = function () { };
    GoogleChartService.prototype.createAreaChart = function (element) {
        return new google.visualization.AreaChart(element);
    };
    GoogleChartService.prototype.createDataTable = function (array) {
        return new google.visualization.arrayToDataTable(array);
    };
    GoogleChartService.prototype.createPiChart = function (element) {
        return new google.visualization.PieChart(element);
    };
    GoogleChartService = GoogleChartService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], GoogleChartService);
    return GoogleChartService;
    var GoogleChartService_1;
}());
export { GoogleChartService };
//# sourceMappingURL=google-chart.service.js.map