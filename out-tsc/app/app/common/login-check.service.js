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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
var LoginCheckService = (function () {
    function LoginCheckService(router) {
        this.router = router;
        this.loggedIn = new BehaviorSubject(false);
        if (localStorage.getItem('currentUser') != null) {
            this.loggedIn.next(true);
        }
        else {
            this.loggedIn.next(false);
            this.router.navigate(['/loginpage']);
        }
    }
    Object.defineProperty(LoginCheckService.prototype, "isLoggedIn", {
        get: function () {
            return this.loggedIn.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    LoginCheckService.prototype.login = function () {
        if (localStorage.getItem('currentUser') != null) {
            this.loggedIn.next(true);
        }
    };
    LoginCheckService.prototype.logout = function () {
        this.loggedIn.next(false);
        this.router.navigate(['/loginpage']);
    };
    LoginCheckService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Router])
    ], LoginCheckService);
    return LoginCheckService;
}());
export { LoginCheckService };
//# sourceMappingURL=login-check.service.js.map