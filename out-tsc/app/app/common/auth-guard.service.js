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
import { Router } from '@angular/router';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { LoginCheckService } from './login-check.service';
var AuthGuard = (function () {
    function AuthGuard(logincheckService, router) {
        this.logincheckService = logincheckService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        var _this = this;
        return this.logincheckService.isLoggedIn
            .take(1)
            .map(function (isLoggedIn) {
            if (!isLoggedIn) {
                _this.router.navigate(['/loginpage']);
                return false;
            }
            return true;
        });
    };
    AuthGuard = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [LoginCheckService, Router])
    ], AuthGuard);
    return AuthGuard;
}());
export { AuthGuard };
//# sourceMappingURL=auth-guard.service.js.map