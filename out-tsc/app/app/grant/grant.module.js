var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2CompleterModule } from 'ng2-completer';
import { FileDropModule } from 'ngx-file-drop';
import { GrantComponent } from './grant.component';
import { GrantService } from "./grant.service";
var routes = [{ path: '', component: GrantComponent }];
var GrantModule = (function () {
    function GrantModule() {
    }
    GrantModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                Ng2CompleterModule,
                FileDropModule,
                RouterModule.forChild(routes)
            ],
            declarations: [
                GrantComponent
            ],
            providers: [GrantService]
        })
    ], GrantModule);
    return GrantModule;
}());
export { GrantModule };
//# sourceMappingURL=grant.module.js.map