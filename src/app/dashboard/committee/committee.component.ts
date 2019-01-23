import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-committee',
  templateUrl: './committee.component.html'
})
export class CommitteeComponent implements OnInit {

  isReverse = true;
  serviceRequestList = [];
  result: any = {};
  committeeRequestObject = this._commonService.getDashboardObject();

  constructor( private _dashboardService: DashboardService, public _commonService: CommonService) { }

  ngOnInit() {
    this.committeeRequestObject.tabIndex = 'COMMITTEE';
    this.loadDashboard();
  }

  /** fetch committee list */
  loadDashboard() {
    this._dashboardService.getDashboardList(this.committeeRequestObject)
      .subscribe( data => {
        this.result = data || [];
        if (this.result !== null) {
            this.serviceRequestList = this.result.committees;
        }
    });
  }

  /** sorts results based on fields
   * @param sortFieldBy
   */
  sortResult(sortFieldBy) {
    this.isReverse = (this.committeeRequestObject.sortBy === sortFieldBy) ? !this.isReverse : false;
    if (this.isReverse) {
        this.committeeRequestObject.reverse = 'DESC';
    } else {
        this.committeeRequestObject.reverse = 'ASC';
    }
    this.committeeRequestObject.sortBy = sortFieldBy;
    this.loadDashboard();
  }

}
