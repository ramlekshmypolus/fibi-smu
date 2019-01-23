var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { Ng2CompleterModule } from 'ng2-completer';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FileDropModule } from 'ngx-file-drop';
import { RouterModule } from "@angular/router";
import { CommitteeHomeComponent } from "./committee-home/committee-home.component";
import { CommitteeMembersComponent } from "./committee-members/committee-members.component";
import { ScheduleHomeComponent } from "./schedule/schedule-home/schedule-home.component";
import { MinutesComponent } from "./schedule/minutes/minutes.component";
import { CommitteeComponent } from "./committee.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { ProtocolSubmittedComponent } from "./schedule/schedule-home/protocol-submitted/protocol-submitted.component";
import { ScheduleAttendanceComponent } from "./schedule/schedule-home/schedule-attendance/schedule-attendance.component";
import { ScheduleOtherActionsComponent } from "./schedule/schedule-home/schedule-other-actions/schedule-other-actions.component";
import { ScheduleAttachmentsComponent } from "./schedule/schedule-home/schedule-attachments/schedule-attachments.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommitteeConfigurationService } from "../common/committee-configuration.service";
import { CommitteeMemberEmployeeElasticService } from "../elastic-search/committee-members-employees-elastic-search.service";
import { CommitteeMemberNonEmployeeElasticService } from "../elastic-search/committee-members-nonEmployee-elastic-search.service";
import { ScheduleService } from "./schedule/schedule.service";
import { ScheduleOtherActionsService } from "./schedule/schedule-home/schedule-other-actions/schedule-other-actions.service";
import { ScheduleHomeService } from "./schedule/schedule-home/schedule-home.service";
import { ScheduleAttachmentsService } from "./schedule/schedule-home/schedule-attachments/schedule-attachments.service";
import { ScheduleAttendanceService } from "./schedule/schedule-home/schedule-attendance/schedule-attendance.service";
import { MinutesService } from "./schedule/minutes/minutes.service";
import { ScheduleConfigurationService } from "./schedule/schedule-configuration.service";
import { Constants } from "../constants/constants.service";
var routes = [
    {
        path: '', component: CommitteeComponent,
        children: [{ path: '', redirectTo: 'committeeHome', pathMatch: 'full' },
            { path: 'committeeHome', component: CommitteeHomeComponent },
            { path: 'committeeMembers', component: CommitteeMembersComponent }]
    },
    { path: 'schedule', component: ScheduleComponent,
        children: [{ path: '', redirectTo: 'scheduleHome', pathMatch: 'full' },
            { path: 'scheduleHome', component: ScheduleHomeComponent },
            { path: 'minutes', component: MinutesComponent }]
    }
];
var CommitteeModule = (function () {
    function CommitteeModule() {
    }
    CommitteeModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                Ng2PageScrollModule,
                Ng2CompleterModule,
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                FileDropModule,
                RouterModule.forChild(routes)
            ],
            declarations: [CommitteeHomeComponent,
                CommitteeMembersComponent,
                ScheduleHomeComponent,
                MinutesComponent,
                CommitteeComponent,
                ScheduleComponent,
                ProtocolSubmittedComponent,
                ScheduleAttendanceComponent,
                ScheduleOtherActionsComponent,
                ScheduleAttachmentsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [Constants, CommitteeConfigurationService,
                CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService, DatePipe, ScheduleService, ScheduleConfigurationService, ScheduleOtherActionsService,
                ScheduleHomeService, ScheduleAttachmentsService, ScheduleAttendanceService,
                MinutesService]
        })
    ], CommitteeModule);
    return CommitteeModule;
}());
export { CommitteeModule };
//# sourceMappingURL=committee.module.js.map