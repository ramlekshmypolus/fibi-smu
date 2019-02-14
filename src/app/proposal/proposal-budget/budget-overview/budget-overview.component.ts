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

  constructor(private _commonService: CommonService) { }

  ngOnInit() {
    this.budgetOverviewDateObj.budgetStartDate = new Date(this.result.proposal.budgetHeader.startDate);
    this.budgetOverviewDateObj.budgetEndDate = new Date(this.result.proposal.budgetHeader.endDate);
  }

  validateBudgetStartDate(startDate) {
    this.budgetOverviewDateObj.isStartError = false;
    if (new Date(startDate) < new Date(this.result.proposal.startDate)) {
        this.budgetOverviewDateObj.isStartError = true;
        this.budgetOverviewDateObj.startDateMessage = '* Choose a Budget Start Date which is on or after Proposed Start Date.';
    } else if (new Date(startDate) > new Date(this.result.proposal.endDate)) {
        this.budgetOverviewDateObj.isStartError = true;
        this.budgetOverviewDateObj.startDateMessage = '* Choose a Budget Start Date which is on or before Proposed End Date.';
    }
  }

  validateBudgetEndDate(endDate) {
    this.budgetOverviewDateObj.isEndError = false;
    if (new Date(endDate) > new Date(this.result.proposal.endDate)) {
        this.budgetOverviewDateObj.isEndError = true;
        this.budgetOverviewDateObj.endDateMessage = '* Choose a Budget End Date which is on or before Proposed End Date.';
    } else if (new Date(endDate) < new Date(this.result.proposal.startDate)) {
        this.budgetOverviewDateObj.isEndError = true;
        this.budgetOverviewDateObj.endDateMessage = '* Choose a Budget End Date which is on or after Proposed Start Date.';
    }
  }

}
