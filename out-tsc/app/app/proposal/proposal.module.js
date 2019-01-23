var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalComponent } from './proposal.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2CompleterModule } from 'ng2-completer';
import { FileDropModule } from 'ngx-file-drop';
import { CommitteeMemberNonEmployeeElasticService } from '../elastic-search/committee-members-nonEmployee-elastic-search.service';
import { CommitteeMemberEmployeeElasticService } from '../elastic-search/committee-members-employees-elastic-search.service';
import { GrantService } from "../grant/grant.service";
import { ProposalCreateEditService } from '../proposal/proposal-create-view.service';
var routes = [{ path: '', component: ProposalComponent },
    { path: 'proposal', component: ProposalComponent },
    { path: 'createProposal', component: ProposalComponent },
    { path: 'editProposal', component: ProposalComponent },
    { path: 'viewSubmittedProposal', component: ProposalComponent }];
var ProposalModule = (function () {
    function ProposalModule() {
    }
    ProposalModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                FormsModule, ReactiveFormsModule,
                Ng2CompleterModule,
                FileDropModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ProposalComponent],
            providers: [ProposalCreateEditService, CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService, GrantService]
        })
    ], ProposalModule);
    return ProposalModule;
}());
export { ProposalModule };
//# sourceMappingURL=proposal.module.js.map