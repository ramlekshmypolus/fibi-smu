import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxEditorModule } from 'ngx-editor';

import { AwardComponent } from './award.component';
import { RouterModule } from '@angular/router';
import { AwardReportsAndTerms } from './award-reports-and-tabs/award-reports-and-terms.component';
import { AwardHomeComponent } from './award-home/award-home.component';
import { AwardHierarchyComponent } from './award-hierarchy/award-hierarchy.component';
import { AwardCommitmentsComponent } from './award-commitments/award-commitments.component';
import { AwardSummaryService } from './award-home/award-summary.service';
import { AwardHierarchyService } from './award-hierarchy/award-hierarchy.service';
import { AwardconfigurationService } from './awardconfiguration.service';
import { AwardCommitmentsService } from './award-commitments/award-commitments.service';
import { AwardReportsAndTermsService } from './award-reports-and-tabs/award-reports-and-terms.service';

const routes = [{ path: '', component: AwardComponent }];
@NgModule( {
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild( routes ),
        TreeModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgxEditorModule
    ],
    declarations: [
        AwardComponent,
        AwardReportsAndTerms,
        AwardHomeComponent,
        AwardHierarchyComponent,
        AwardCommitmentsComponent],
    providers: [AwardSummaryService, AwardHierarchyService,
                AwardconfigurationService, AwardCommitmentsService,
        AwardReportsAndTermsService]
} )
export class AwardModule { }
