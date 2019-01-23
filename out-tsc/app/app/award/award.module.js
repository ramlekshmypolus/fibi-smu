var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'angular-tree-component';
import { AwardComponent } from "./award.component";
import { RouterModule } from "@angular/router";
import { AwardReportsAndTerms } from "./award-reports-and-tabs/award-reports-and-terms.component";
import { AwardHomeComponent } from "./award-home/award-home.component";
import { AwardHierarchyComponent } from "./award-hierarchy/award-hierarchy.component";
import { AwardCommitmentsComponent } from "./award-commitments/award-commitments.component";
import { AwardSummaryService } from "./award-home/award-summary.service";
import { AwardHierarchyService } from "./award-hierarchy/award-hierarchy.service";
import { AwardconfigurationService } from "./awardconfiguration.service";
import { AwardCommitmentsService } from "./award-commitments/award-commitments.service";
import { AwardReportsAndTermsService } from "./award-reports-and-tabs/award-reports-and-terms.service";
import { Constants } from "../constants/constants.service";
var routes = [{ path: '', component: AwardComponent }];
var AwardModule = (function () {
    function AwardModule() {
    }
    AwardModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                RouterModule.forChild(routes),
                TreeModule
            ],
            declarations: [
                AwardComponent,
                AwardReportsAndTerms,
                AwardHomeComponent,
                AwardHierarchyComponent,
                AwardCommitmentsComponent
            ],
            providers: [Constants, AwardSummaryService, AwardHierarchyService,
                AwardconfigurationService, AwardCommitmentsService,
                AwardReportsAndTermsService]
        })
    ], AwardModule);
    return AwardModule;
}());
export { AwardModule };
//# sourceMappingURL=award.module.js.map