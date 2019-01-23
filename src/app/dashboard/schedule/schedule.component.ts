import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {
  filterStartDate: Date;
  filterEndDate: Date;
  isReverse = true;
  isValid = true;
  errorMsg = '';
  serviceRequestList: any = [];
  result: any = {};
  requestObject = this._commonService.getDashboardObject();

  constructor( private _dashboardService: DashboardService, private _router: Router,
              private _commonService: CommonService) { }

  ngOnInit() {
    this.requestObject.tabIndex = 'SCHEDULE';
    this.loadDashboard();
  }

  /* fetch SCHEDULE list */
  loadDashboard() {
    this._dashboardService.getDashboardList(this.requestObject)
      .subscribe(data => {
        this.result = data || [];
        if (this.result != null) {
          this.serviceRequestList = this.result.committeeSchedules;
        }
      });
  }

  /* filter schedule based on dates */
  filterSchedule() {
    if (this.filterStartDate > this.filterEndDate) {
     this.isValid = false;
     this.errorMsg = '* Please ensure that the To : Date is greater than or equal to the From : Date.';
    } else if (this.filterStartDate === null || this.filterStartDate === undefined ||
      this.filterEndDate === null || this.filterEndDate === undefined) {
      this.isValid = false;
      this.errorMsg = '* Please enter the necessary dates to apply filter.';
    }
    if (this.isValid) {
      this.loadDashboard();
    }
  }

  /* clear filter schedule dates */
  clearFilterSchedule() {
    this.filterStartDate = this.filterEndDate = null;
    this.isValid = true;
    this.loadDashboard();
  }
  /* view schedule */
  loadSchedules(event: any, scheduleId) {
    event.preventDefault();
    this._router.navigate(['committee/schedule'], { queryParams: { 'scheduleId': scheduleId } });
  }

  /** sorts results based on fields
    * @param sortFieldBy
    */
  sortResult(sortFieldBy) {
    this.isReverse = (this.requestObject.sortBy === sortFieldBy) ? !this.isReverse : false;
    if (this.isReverse) {
      this.requestObject.reverse = 'DESC';
    } else {
      this.requestObject.reverse = 'ASC';
    }
    this.requestObject.sortBy = sortFieldBy;
    this.loadDashboard();
  }

}
