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
import { LoginCheckService } from '../common/login-check.service';
var FooterComponent = (function () {
    function FooterComponent(loginCheckService) {
        this.loginCheckService = loginCheckService;
        this.polusWebsite = 'http://polussolutions.com/';
        this.footerLogo = './assets/images/footerLogo.png';
    }
    FooterComponent.prototype.ngOnInit = function () {
        this.isLoggedIn$ = this.loginCheckService.isLoggedIn;
    };
    FooterComponent = __decorate([
        Component({
            selector: 'footer-tpl',
            templateUrl: 'footer-tpl.component.html',
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [LoginCheckService])
    ], FooterComponent);
    return FooterComponent;
}());
export { FooterComponent };
//# sourceMappingURL=footer-tpl.component.js.map