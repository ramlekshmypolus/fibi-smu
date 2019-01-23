import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-disclosure',
  templateUrl: './disclosure.component.html'
})

export class DisclosureComponent implements OnInit {
  isShowResultCard = false;
  isShowAdvanceSearchOptions = false;
  isReverse = true;

  elasticResultObject: any = {};
  elasticSearchOptions: any = {};
  serviceRequestList: any = [];
  result: any = {};
  disclosureRequestObject = this._commonService.getDashboardObject();

  constructor(private _dashboardService: DashboardService, public _commonService: CommonService) { }

  ngOnInit() {
    this.disclosureRequestObject.tabIndex = 'DISCLOSURE';
    if (!this. disclosureRequestObject.isUnitAdmin) {
      this.loadDashboard();
    }
    this.elasticSearchOptions.url = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'coifibi';
    this.elasticSearchOptions.type = 'coi';
    this.elasticSearchOptions.size = 20;
    this.elasticSearchOptions.contextField = 'coi_disclosure_number';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      coi_disclosure_number: {},
      full_name: {},
      disclosure_disposition: {},
      disclosure_status: {},
      module_item_key: {}
    };
  }

  /* fetch DISCLOSURE list */
  loadDashboard() {
    this._dashboardService.getDashboardList(this.disclosureRequestObject)
      .subscribe(data => {
        this.result = data || [];
        if (this.result != null) {
          this.serviceRequestList = this.result.disclosureViews;
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
    this.disclosureRequestObject.property1 = '';
    this.disclosureRequestObject.property2 = '';
    this.disclosureRequestObject.property3 = '';
    this.disclosureRequestObject.property4 = '';
  }

  /** select a result from elastic search
  * @param value
  */
  selectDisclosureElasticResult(value) {
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
    this.isReverse = (this.disclosureRequestObject.sortBy === sortFieldBy) ? !this.isReverse : false;
    if (this.isReverse) {
      this.disclosureRequestObject.reverse = 'DESC';
    } else {
      this.disclosureRequestObject.reverse = 'ASC';
    }
    this.disclosureRequestObject.sortBy = sortFieldBy;
    this.loadDashboard();
  }
}
