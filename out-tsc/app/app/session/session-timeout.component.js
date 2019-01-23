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
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { LoginCheckService } from '../common/login-check.service';
var IDLE_TIME = 1200; // Watching for an event for 1200 seconds(20 min.)
var EXIT_TIME = 300; // Automatically logouts after 300 seconds(5 min.)
var SessionTimeoutComponent = (function () {
    function SessionTimeoutComponent(idle, router, loginCheckService) {
        var _this = this;
        this.idle = idle;
        this.router = router;
        this.loginCheckService = loginCheckService;
        this.warningModal = false;
        this.timeoutModal = false;
        this.timerTime = Math.ceil(EXIT_TIME / 60);
        this.timeToLogout = Math.ceil((IDLE_TIME + EXIT_TIME) / 60);
        idle.setIdle(IDLE_TIME);
        idle.setTimeout(EXIT_TIME);
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
        this.subscription = idle.onTimeoutWarning.subscribe(function (countdown) {
            _this.warningModal = true;
            _this.exitTimeInMin = Math.floor(countdown / 60);
            _this.exitTimeInSec = countdown % 60;
        });
        this.subscription = idle.onTimeout.subscribe(function () {
            _this.warningModal = false;
            _this.timeoutModal = true;
        });
        idle.watch();
    }
    SessionTimeoutComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    SessionTimeoutComponent.prototype.close = function (value) {
        this.warningModal = false;
    };
    SessionTimeoutComponent.prototype.closeModal = function (value) {
        this.warningModal = false;
        this.idle.watch();
    };
    SessionTimeoutComponent.prototype.reRoute = function ($event) {
        this.timeoutModal = $event;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userFullname');
        this.loginCheckService.logout();
    };
    SessionTimeoutComponent.prototype.receiveContinueMessage = function ($event) {
        this.warningModal = $event;
        this.idle.watch();
    };
    SessionTimeoutComponent = __decorate([
        Component({
            selector: 'app-sessiontimeout',
            templateUrl: 'session-timeout.component.html',
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css']
        }),
        __metadata("design:paramtypes", [Idle, Router, LoginCheckService])
    ], SessionTimeoutComponent);
    return SessionTimeoutComponent;
}());
export { SessionTimeoutComponent };
//# sourceMappingURL=session-timeout.component.js.map