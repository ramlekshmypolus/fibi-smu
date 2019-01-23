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
import { Router, NavigationEnd } from '@angular/router';
import { LoginCheckService } from './common/login-check.service';
import { SessionManagementService } from './session/session-management.service';
var AppComponent = (function () {
    function AppComponent(loginCheckService, sessionService, router) {
        var _this = this;
        this.loginCheckService = loginCheckService;
        this.sessionService = sessionService;
        this.router = router;
        this.subscription = router.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                if (event.url == '/logout') {
                    localStorage.removeItem('currentUser');
                    _this.loginCheckService.logout();
                    _this.router.navigate(['/loginpage']);
                }
            }
        });
        if (!sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
    }
    AppComponent.prototype.ngOnInit = function () {
        this.isLoggedIn$ = this.loginCheckService.isLoggedIn;
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html',
            providers: [SessionManagementService],
            styleUrls: ['../assets/css/bootstrap.min.css', '../assets/css/font-awesome.min.css', '../assets/css/style.css', '../assets/css/search.css']
        }),
        __metadata("design:paramtypes", [LoginCheckService, SessionManagementService, Router])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map