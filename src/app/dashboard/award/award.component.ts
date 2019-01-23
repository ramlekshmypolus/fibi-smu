import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-award-list',
  templateUrl: './award.component.html',
})
export class AwardListComponent implements OnInit {

  isReverse = true;
  isShowResultCard = false;
  isShowAdvanceSearchOptions = false;
  serviceRequestList: any[] = null;
  result: any = {};
  elasticResultObject: any = {};
  awardRequestObject = this._commonService.getDashboardObject();
  elasticSearchOptions: any = {};

  constructor(private _dashboardService: DashboardService, public _commonService: CommonService) { }

  ngOnInit() {
    this.awardRequestObject.tabIndex = 'AWARD';
    if (!this.awardRequestObject.isUnitAdmin) {
      this.loadDashboard();
    }
    this.elasticSearchOptions.url = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'awardfibi';
    this.elasticSearchOptions.type = 'award';
    this.elasticSearchOptions.size = 20;
    this.elasticSearchOptions.contextField = 'award_number';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      award_number: {},
      pi_name: {},
      sponsor: {},
      account_number: {},
      lead_unit_number: {},
      lead_unit_name: {},
      title: {}
    };
  }

  /** fetch award list */
  loadDashboard() {
    this._dashboardService.getDashboardList(this.awardRequestObject)
      .subscribe((data: any) => {
        this.result = data || [];
        if (this.result !== null) {
          this.serviceRequestList = this.result.awardViews;
        }
      });
  }

  /** show and hide advance search feature
   * @param event
   */
  showAdvanceSearch(event: any) {
    event.preventDefault();
    this.isShowAdvanceSearchOptions = !this.isShowAdvanceSearchOptions;
    this.clear();
  }

  /** searches using advance search options */
  searchUsingAdvanceOptions() {
    /* close elastic search result if it is open */
    if (this.isShowResultCard === true) {
      this.isShowResultCard = false;
    }
    this.loadDashboard();
  }

  /** clear all advanced search fields */
  clear() {
    this.awardRequestObject.property1 = '';
    this.awardRequestObject.property2 = '';
    this.awardRequestObject.property3 = '';
    this.awardRequestObject.property4 = '';
  }

  /** select a result from elastic search
   * @param value
   */
  selectAwardElasticResult(value) {
    if (value) {
      this.isShowResultCard = true;
      this.elasticResultObject = value;
    } else {
      this.isShowResultCard = false;
      this.elasticResultObject = {};
    }
  }

  /** sorts results based on fields
   * @param sortFieldBy
   */
  sortResult(sortFieldBy) {
    this.isReverse = (this.awardRequestObject.sortBy === sortFieldBy) ? !this.isReverse : false;
    if (this.isReverse) {
      this.awardRequestObject.reverse = 'DESC';
    } else {
      this.awardRequestObject.reverse = 'ASC';
    }
    this.awardRequestObject.sortBy = sortFieldBy;
    this.loadDashboard();
  }

}
