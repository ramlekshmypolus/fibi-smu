import {Injectable} from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class CommitteeConfigurationService {
    private committeeMode = new BehaviorSubject<string>("");
    currentMode = this.committeeMode.asObservable(); 
    private committeeAreaOfResearch = new BehaviorSubject<any[]>([]);
    currentAreaOfResearch = this.committeeAreaOfResearch.asObservable();
    private committeeData = new BehaviorSubject<any[]>([]);
    currentCommitteeData = this.committeeData.asObservable();
    private currentMember = new BehaviorSubject<any[]>([]);
    currentMemberData = this.currentMember.asObservable();
    committeeEditFlag = new BehaviorSubject<boolean>(false);
    currentEditFlag = this.committeeEditFlag.asObservable();
    committeeMemberEditFlag = new BehaviorSubject<boolean>(false);
    currentMemberEditFlag = this.committeeMemberEditFlag.asObservable();
    currentTab = new BehaviorSubject<string>("");
    currentactivatedTab = this.currentTab.asObservable();
    scheduleHomeDetailEditFlag = new BehaviorSubject<boolean>(false);
    scheduleHomeAttachmentsEditFlag = new BehaviorSubject<boolean>(false);
    scheduleHomeAttendanceEditFlag = new BehaviorSubject<boolean>(false);
    
    constructor() {
        
    }
    
    changeMode(mode :string){
        this.committeeMode.next(mode);
    }
    
    changeAreaOfResearch(areaOfResearch :any[]){
        this.committeeAreaOfResearch.next(areaOfResearch);
    }
    
    changeCommmitteeData(data :any[]){
        this.committeeData.next(data);
    }
    
    changeMemberData(data :any[]){
        this.currentMember.next(data);
    }
    
    changeEditFlag(flag: boolean){
        this.committeeEditFlag.next(flag);
    }
    
    changeEditMemberFlag(flag: boolean){
        this.committeeMemberEditFlag.next(flag);
    }
    
    changeActivatedtab(tab: string){
        this.currentTab.next(tab);
    }
    changeScheduleHomeDetailEditFlag (flag: boolean) {
        this.scheduleHomeDetailEditFlag.next(flag);
    }

    changeScheduleHomeAttachmentsEditFlag (flag: boolean) {
        this.scheduleHomeAttachmentsEditFlag.next(flag);
    }

    changeScheduleHomeAttendanceEditFlag (flag: boolean) {
        this.scheduleHomeAttendanceEditFlag.next(flag);
    }
}