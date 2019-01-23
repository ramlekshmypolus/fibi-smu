var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SessionManagementService } from "../session/session-management.service";
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
var ReportComponent = (function () {
    function ReportComponent(sessionService, changeRef, router) {
        this.sessionService = sessionService;
        this.changeRef = changeRef;
        this.router = router;
        if (!sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
    }
    ReportComponent.prototype.ngOnInit = function () {
    };
    ReportComponent = __decorate([
        Component({
            selector: 'report',
            templateUrl: './report.component.html',
            providers: [SessionManagementService],
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [SessionManagementService, ChangeDetectorRef, Router])
    ], ReportComponent);
    return ReportComponent;
}());
export { ReportComponent };
//# sourceMappingURL=report.component.js.map