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
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
var AppHttpInterceptor = (function () {
    function AppHttpInterceptor(_router) {
        this._router = _router;
    }
    /**catches every request and adds the authentication token from local storage
     * creates new header with auth-key
    */
    AppHttpInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        this.Authtoken = localStorage.getItem('authToken');
        if (this.Authtoken == null) {
            this.Authtoken = '';
        }
        var authReq = req.clone({ headers: req.headers.set('Authorization', this.Authtoken) });
        /**send the newly created request*/
        return next.handle(authReq).catch(function (error) {
            console.log('"Error Occurred"');
            _this.unauthorized = error;
            if (_this.unauthorized.status === 401) {
                _this._router.navigate(['/login']);
            }
            return Observable.throw(error);
        });
    };
    AppHttpInterceptor = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Router])
    ], AppHttpInterceptor);
    return AppHttpInterceptor;
}());
export { AppHttpInterceptor };
//# sourceMappingURL=http-interceptor.js.map