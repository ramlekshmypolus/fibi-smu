import { Component, OnInit, Input } from '@angular/core';

import {CommonService} from '../../../common/services/common.service';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.css']
})
export class BudgetOverviewComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() budgetOverviewDateObj: any = {};
  isBudgetOverviewWidgetOpen = true;

  constructor(public _commonService: CommonService) { }

  ngOnInit() { }

  validateBudgetStartDate(startDate, endDate) {
    this.showOrHideDataFlagsObj.dataChangeFlag = true;
    this.budgetOverviewDateObj.isStartError = false;
    if (new Date(startDate) < new Date(this.result.proposal.startDate)) {
      this.budgetOverviewDateObj.isStartError = true;
      if (new Date(startDate) > new Date(endDate)) {
        this.budgetOverviewDateObj.startDateMessage = '* Choose a Budget Start Date which is on or before Budget End Date.';
      } else {
        this.budgetOverviewDateObj.startDateMessage = '* Choose a Budget Start Date which is on or after Proposed Start Date.';
      }
    } else if (new Date(startDate) > new Date(this.result.proposal.endDate)) {
        this.budgetOverviewDateObj.isStartError = true;
        this.budgetOverviewDateObj.startDateMessage = '* Choose a Budget Start Date which is on or before Proposed End Date.';
    }
  }

  validateBudgetEndDate(startDate, endDate) {
    this.showOrHideDataFlagsObj.dataChangeFlag = true;
    this.budgetOverviewDateObj.isEndError = false;
    if (new Date(endDate) < new Date(this.result.proposal.startDate)) {
      this.budgetOverviewDateObj.isEndError = true;
      this.budgetOverviewDateObj.endDateMessage = '* Choose a Budget End Date which is on or after Proposed Start Date.';
    } else if (new Date(endDate) < new Date(this.result.proposal.endDate)) {
        if (new Date(endDate) < new Date(startDate)) {
          this.budgetOverviewDateObj.isEndError = true;
          this.budgetOverviewDateObj.endDateMessage = '* Choose a Budget End Date which is on or after Budget Start Date.';
        }
    } else if (new Date(endDate) > new Date(this.result.proposal.endDate)) {
      this.budgetOverviewDateObj.isEndError = true;
      this.budgetOverviewDateObj.endDateMessage = '* Choose a Budget End Date which is on or before Proposed End Date.';
    }
  }

}
