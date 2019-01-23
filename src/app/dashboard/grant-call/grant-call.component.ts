import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-grant-call',
  templateUrl: './grant-call.component.html',
})
export class GrantCallListComponent implements OnInit {

  isReverse = true;

  serviceRequestList: any[] = null;
  result: any = {};
  grantCallRequestObject = this._commonService.getDashboardObject();

  constructor( private _dashboardService: DashboardService, private _router: Router,
               private _commonService: CommonService ) { }

  ngOnInit() {
    this.grantCallRequestObject.tabIndex = 'GRANT';
    this.loadDashboard();
  }

  /** navigate to create grant page
   * @param event
   * @param mode
   */
  createGrant(event: any, mode) {
    event.preventDefault();
    this._router.navigate(['fibi/grant'], { queryParams: { 'mode': mode } });
  }

  /** fetch grant call list */
  loadDashboard() {
    this._dashboardService.getDashboardList(this.grantCallRequestObject)
      .subscribe(
          data => {
              this.result = data || [];
              if (this.result !== null) {
                  this.serviceRequestList = this.result.grantCalls;
              }
      });
  }

  /** clear all advanced search fields */
  clear() {
    this.grantCallRequestObject.property1 = '';
    this.grantCallRequestObject.property2 = '';
    this.grantCallRequestObject.property3 = '';
    this.grantCallRequestObject.property4 = '';
    this.loadDashboard();
  }

  /** sorts results based on fields
   * @param sortFieldBy
   */
  sortResult(sortFieldBy) {
    this.isReverse = (this.grantCallRequestObject.sortBy === sortFieldBy) ? !this.isReverse : false;
    if (this.isReverse) {
        this.grantCallRequestObject.reverse = 'DESC';
    } else {
        this.grantCallRequestObject.reverse = 'ASC';
    }
    this.grantCallRequestObject.sortBy = sortFieldBy;
    this.loadDashboard();
  }

  /**navigates to grant call details page
   * @param event
   * @param grantId
   */
  viewGrantById(event: any, grantId) {
    event.preventDefault();
    this._router.navigate(['fibi/grant'], { queryParams: { 'grantId': grantId } });
  }

}
