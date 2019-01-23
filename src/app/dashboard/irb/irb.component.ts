import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-irb',
  templateUrl: './irb.component.html'
})

export class IrbComponent implements OnInit {

  isShowResultCard = false;
  isShowAdvanceSearchOptions = false;
  isReverse = true;

  elasticResultObject: any = {};
  elasticSearchOptions: any = {};
  serviceRequestList: any = [];
  result: any = {};
  irbRequestObject = this._commonService.getDashboardObject();

  constructor ( private _dashboardService: DashboardService, public _commonService: CommonService) { }

  ngOnInit() {
    this.irbRequestObject.tabIndex = 'IRB';
    if (!this.irbRequestObject.isUnitAdmin) {
      this.loadDashboard();
    }
    this.elasticSearchOptions.url = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'irbfibi';
    this.elasticSearchOptions.type = 'irb';
    this.elasticSearchOptions.size = 20;
    this.elasticSearchOptions.contextField = 'protocol_number';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      protocol_number: {},
      title: {},
      lead_unit_number: {},
      status: {},
      lead_unit_name: {},
      person_name: {}
    };
  }

/* fetch IRB list */
  loadDashboard() {
    this._dashboardService.getDashboardList(this.irbRequestObject)
      .subscribe(data => {
        this.result = data || [];
        if (this.result != null) {
          this.serviceRequestList = this.result.protocolViews;
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
    this.irbRequestObject.property1 = '';
    this.irbRequestObject.property2 = '';
    this.irbRequestObject.property3 = '';
    this.irbRequestObject.property4 = '';
  }

   /** select a result from elastic search
   * @param value
   */
  selectIrbElasticResult(value) {
    if (value) {
      this.isShowResultCard = true;
      this.elasticResultObject = value;
    } else {
      this.isShowResultCard = false;
      this.elasticResultObject = {};
    }
  }

   /** sends boolean value to elastic component - when clearing the elastic input result card also vanishes
   * @param $event
   */
  receiveResultCard($event) {
    this.isShowResultCard = $event;
  }

  /** sorts results based on fields
   * @param sortFieldBy
   */
  sortResult(sortFieldBy) {
    this.isReverse = (this.irbRequestObject.sortBy === sortFieldBy) ? !this.isReverse : false;
    if (this.isReverse) {
      this.irbRequestObject.reverse = 'DESC';
    } else {
      this.irbRequestObject.reverse = 'ASC';
    }
    this.irbRequestObject.sortBy = sortFieldBy;
    this.loadDashboard();
  }

}
