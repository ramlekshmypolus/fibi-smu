var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
var TimeoutModalComponent = (function () {
    function TimeoutModalComponent() {
        this.logoutEvent = new EventEmitter();
        this.message = false;
    }
    TimeoutModalComponent.prototype.sendLogoutMessage = function () {
        this.logoutEvent.emit(this.message);
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], TimeoutModalComponent.prototype, "logoutEvent", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], TimeoutModalComponent.prototype, "loggedOutTime", void 0);
    TimeoutModalComponent = __decorate([
        Component({
            selector: 'session-timeout-modal',
            templateUrl: './timeout-modal.component.html',
            styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/style.css']
        }),
        __metadata("design:paramtypes", [])
    ], TimeoutModalComponent);
    return TimeoutModalComponent;
}());
export { TimeoutModalComponent };
//# sourceMappingURL=timeout-modal.component.js.map