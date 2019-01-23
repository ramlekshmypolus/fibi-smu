var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ViewChildren, Renderer, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { SessionManagementService } from '../session/session-management.service';
import { LoginCheckService } from '../common/login-check.service';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';
var LoginComponent = (function () {
    function LoginComponent(loginService, router, dashboardService, sessionService, renderer, loginCheck) {
        this.loginService = loginService;
        this.router = router;
        this.dashboardService = dashboardService;
        this.sessionService = sessionService;
        this.renderer = renderer;
        this.loginCheck = loginCheck;
        this.credentials = {
            username: '',
            password: ''
        };
        this.onDestroy$ = new Subject();
        this.loginFail = false;
        this.result = {};
        this.isAdmin = false;
        this.isLoginPage = false;
        if (!this.sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
        }
        else {
            this.router.navigate(['/dashboard']);
        }
    }
    LoginComponent.prototype.ngAfterViewInit = function () {
        this.usernameInput.first.nativeElement.focus();
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.loginService.login(this.credentials.username, this.credentials.password).takeUntil(this.onDestroy$).subscribe(function (data) {
            _this.result = data.body;
            if (_this.result != null) {
                localStorage.setItem('authToken', data.headers.get("Authorization"));
                if (_this.result.login == true) {
                    _this.fullName = _this.result.fullName;
                    _this.personId = _this.result.personID;
                    _this.isAdmin = _this.result.unitAdmin;
                    _this.unitNumber = _this.result.unitNumber;
                    _this.firstName = _this.result.firstName;
                    _this.lastName = _this.result.lastName;
                    localStorage.setItem('currentUser', _this.result.userName);
                    localStorage.setItem('personId', _this.personId);
                    localStorage.setItem('userFullname', _this.result.fullName);
                    localStorage.setItem('firstName', _this.result.firstName);
                    localStorage.setItem('lastName', _this.result.lastName);
                    localStorage.setItem('isAdmin', String(_this.isAdmin));
                    localStorage.setItem('unitNumber', String(_this.unitNumber));
                    localStorage.setItem('provost', String(_this.result.provost));
                    localStorage.setItem('grantManager', String(_this.result.grantManager));
                    _this.loginCheck.login();
                    _this.router.navigate(['/dashboard']);
                }
                else {
                    _this.loginFail = true;
                    _this.credentials.username = '';
                    _this.credentials.password = '';
                    _this.renderer.invokeElementMethod(_this.input.nativeElement, 'focus');
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    };
    __decorate([
        ViewChildren('input'),
        __metadata("design:type", Object)
    ], LoginComponent.prototype, "usernameInput", void 0);
    __decorate([
        ViewChild('input'),
        __metadata("design:type", ElementRef)
    ], LoginComponent.prototype, "input", void 0);
    LoginComponent = __decorate([
        Component({
            selector: 'login-tpl',
            templateUrl: 'login.component.html',
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css'],
            providers: [SessionManagementService],
            outputs: ['fullName']
        }),
        __metadata("design:paramtypes", [LoginService, Router, DashboardService, SessionManagementService, Renderer, LoginCheckService])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map