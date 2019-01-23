import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-iacuc',
  templateUrl: './iacuc.component.html'
})

export class IacucComponent implements OnInit {
  isShowResultCard = false;
  isShowAdvanceSearchOptions = false;
  isReverse = true;

  elasticResultObject: any = {};
  elasticSearchOptions: any = {};
  serviceRequestList: any = [];
  result: any = {};
  requestObject = this._commonService.getDashboardObject();

  constructor(private _dashboardService: DashboardService, public _commonService: CommonService) { }

  ngOnInit() {
    this.requestObject.tabIndex = 'IACUC';
    if (!this.requestObject.isUnitAdmin) {
      this.loadDashboard();
    }
    this.elasticSearchOptions.url = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'iacucfibi';
    this.elasticSearchOptions.type = 'iacuc';
    this.elasticSearchOptions.size = 20;
    this.elasticSearchOptions.contextField = 'protocol_number';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      protocol_number: {},
      title: {},
      lead_unit_number: {},
      lead_unit_name: {},
      status: {},
      person_name: {},
      protocol_type: {}
    };
  }

  /* fetch IACUC list */
  loadDashboard() {
    this._dashboardService.getDashboardList(this.requestObject)
      .subscribe(data => {
        this.result = data || [];
        if (this.result != null) {
          this.serviceRequestList = this.result.iacucViews;
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
    this.requestObject.property1 = '';
    this.requestObject.property2 = '';
    this.requestObject.property3 = '';
    this.requestObject.property4 = '';
  }

  /** select a result from elastic search
    * @param value
    */
  selectIacucElasticResult(value) {
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
