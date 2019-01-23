import { BehaviorSubject } from "rxjs/BehaviorSubject";
var ScheduleConfigurationService = (function () {
    function ScheduleConfigurationService() {
        this.scheduleData = new BehaviorSubject({});
        this.currentScheduleData = this.scheduleData.asObservable();
        this.scheduleHomeEdit = new BehaviorSubject(false);
        this.currentschedulehomeEdit = this.scheduleHomeEdit.asObservable();
        this.currentTab = new BehaviorSubject("");
        this.currentactivatedTab = this.currentTab.asObservable();
        this.scheduleHomeDetailEditFlag = new BehaviorSubject(false);
        this.currentScheduleHomeDetailEditFlag = this.scheduleHomeDetailEditFlag.asObservable();
        this.scheduleHomeAttachmentsEditFlag = new BehaviorSubject(false);
        this.currentScheduleHomeAttachmentsEditFlag = this.scheduleHomeAttachmentsEditFlag.asObservable();
        this.scheduleHomeAttendanceEditFlag = new BehaviorSubject(false);
        this.currentScheduleHomeAttendanceEditFlag = this.scheduleHomeAttendanceEditFlag.asObservable();
        this.minutesEditFlag = new BehaviorSubject(false);
        this.currentMinutesEditFlag = this.minutesEditFlag.asObservable();
    }
    ScheduleConfigurationService.prototype.changeScheduleData = function (scheduleData) {
        this.scheduleData.next(scheduleData);
    };
    ScheduleConfigurationService.prototype.changeScheduleHomeDetailEditFlag = function (flag) {
        this.scheduleHomeDetailEditFlag.next(flag);
    };
    ScheduleConfigurationService.prototype.changeScheduleHomeAttachmentsEditFlag = function (flag) {
        this.scheduleHomeAttachmentsEditFlag.next(flag);
    };
    ScheduleConfigurationService.prototype.changeScheduleHomeAttendanceEditFlag = function (flag) {
        this.scheduleHomeAttendanceEditFlag.next(flag);
    };
    ScheduleConfigurationService.prototype.changeMinutesEditFlag = function (flag) {
        this.minutesEditFlag.next(flag);
    };
    return ScheduleConfigurationService;
}());
export { ScheduleConfigurationService };
//# sourceMappingURL=schedule-configuration.service.js.map