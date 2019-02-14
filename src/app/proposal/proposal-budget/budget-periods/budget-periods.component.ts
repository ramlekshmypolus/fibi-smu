import { Component, OnInit, Input } from '@angular/core';
import { CompleterService } from 'ng2-completer';

import {CommonService} from '../../../common/services/common.service';
import {ProposalBudgetService} from '../proposal-budget.service';

@Component({
  selector: 'app-budget-periods',
  templateUrl: './budget-periods.component.html',
  styleUrls: ['./budget-periods.component.css']
})
export class BudgetPeriodsComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() budgetOverviewDateObj: any = {};
  @Input() budgetPeriodsDateObj: any = {};
  isPersonnelOpen = false;
  nonEmployeeFlag = false;
  isApplyInflation = true;
  clearField;
  selectedPeriod = 1;
  personnelTypeSelected = 'P';
  placeHolderText = 'Search an employee';
  personnelSearchText = null;
  selectedCostElement: string;
  selectedBudgetCategory: string;
  isLineItemPersonnelOpen = [];
  tbnPersonsList: any = [];
  costElements: any = [];
  budgetCategories: any = [];
  iconClass: any = {};
  searchActive: any = {};
  budgetDetail: any = {};
  lineItemObj: any = {};
  rateObj: any = {};
  selectedPeriodTab: any = {};
  actionsModalObj: any = {};
  isInvalidLineItem: any = {};
  elasticSearchOptions: any = {};
  personnelTypes = [
                 { name: 'Proposal Persons', value: 'P' },
                 { name: 'Employee', value: 'E' },
                 { name: 'Non-Employee', value: 'N' },
                 { name: 'To Be Named', value: 'T' }
             ];

  constructor(private _commonService: CommonService,
              private _proposalBudgetService: ProposalBudgetService,
              private _completerService: CompleterService) { }

  ngOnInit() {
    this.selectedPeriodTab.isPeriod = true;
    this.selectedPeriodTab.isPeriodAndTotal = false;
    this.selectedPeriodTab.isCumulative = false;
    this.actionsModalObj.isWarning = false;
    this.iconClass.costElement = this.iconClass.budgetCategory = 'fa fa-search fa-med';
    this.tbnPersonsList = this._completerService.local( this.result.tbnPersons, 'personName', 'personName' );
    this.timeStampToPeriodDates();
  }

  timeStampToPeriodDates() {
    for (let period = 0; period < this.result.proposal.budgetHeader.budgetPeriods.length; period++) {
      this.result.proposal.budgetHeader.budgetPeriods[period].startDate =
          this.result.proposal.budgetHeader.budgetPeriods[period].startDate === null ?
          null : new Date(this.result.proposal.budgetHeader.budgetPeriods[period].startDate);
      this.result.proposal.budgetHeader.budgetPeriods[period].endDate =
          this.result.proposal.budgetHeader.budgetPeriods[period].endDate === null ?
          null : new Date(this.result.proposal.budgetHeader.budgetPeriods[period].endDate);
    }
  }

  budgetDatesToTimeStamp() {
    this.result.proposal.budgetHeader.startDate = new Date(this.budgetOverviewDateObj.budgetStartDate).getTime();
    this.result.proposal.budgetHeader.endDate = new Date(this.budgetOverviewDateObj.budgetEndDate).getTime();
  }

  changeTab(tabLabel, periodNumber) {
    for (let periodIndex = 0; periodIndex < this.result.proposal.budgetHeader.budgetPeriods.length; periodIndex++) {
      for (let detailsIndex = 0;
           detailsIndex < this.result.proposal.budgetHeader.budgetPeriods[periodIndex].budgetDetails.length;
           detailsIndex++) {
        this.isLineItemPersonnelOpen[detailsIndex] = false;
      }
    }
    this.isInvalidLineItem.message = null;
    this.isInvalidLineItem.category = false;
    this.isInvalidLineItem.costElement = false;
    this.isInvalidLineItem.cost = false;

    if (tabLabel === 'PERIOD_AND_TOTAL') {
      this.showOrHideDataFlagsObj.isPeriodsTotalDisabled = true;
      if ( this.result.proposal.budgetHeader.isAutoCalc === false) {
        this.enablePeriodsAndTotal();
      }
      this.selectedPeriod = periodNumber;
      this.selectedPeriodTab.isPeriod = false;
      this.selectedPeriodTab.isPeriodAndTotal = true;
     } else if (tabLabel === 'PERIODS') {
        this.selectedPeriod = periodNumber;
        this.selectedPeriodTab.isPeriod = true;
        this.selectedPeriodTab.isPeriodAndTotal = false;
     }
  }

  enablePeriodsAndTotal() {
    this.showOrHideDataFlagsObj.isPeriodsTotalDisabled = false;
    for (let periodIndex = 0; periodIndex < this.result.proposal.budgetHeader.budgetPeriods.length; periodIndex++) {
        if (this.result.proposal.budgetHeader.budgetPeriods[periodIndex].budgetDetails !== null &&
            this.result.proposal.budgetHeader.budgetPeriods[periodIndex].budgetDetails !== [] &&
            this.result.proposal.budgetHeader.budgetPeriods[periodIndex].budgetDetails.length !== 0) {
            this.showOrHideDataFlagsObj.isPeriodsTotalDisabled = true;
        }
    }
  }

  onAutoCalcChange(selectedPeriod) {
    this.result.proposal.budgetHeader.isAutoCalc = !this.result.proposal.budgetHeader.isAutoCalc;
    this.showOrHideDataFlagsObj.isPeriodsTotalDisabled = true;
    if ( this.result.proposal.budgetHeader.isAutoCalc === false) {
      this.enablePeriodsAndTotal();
      let tempTotalDirectCost = 0;
      for (let periods = 0; periods < this.result.proposal.budgetHeader.budgetPeriods.length; periods++) {
        for (let lineItem = 0; lineItem < this.result.proposal.budgetHeader.budgetPeriods[periods].budgetDetails.length; lineItem++) {
          if (this.result.proposal.budgetHeader.budgetPeriods[periods].budgetPeriod === selectedPeriod) {
            if (this.result.proposal.budgetHeader.budgetPeriods[periods].budgetDetails[lineItem].isSystemGeneratedCostElement === true) {
              this.result.proposal.budgetHeader.budgetPeriods[periods].budgetDetails[lineItem].lineItemCost = 0;
              this.result.proposal.budgetHeader.budgetPeriods[periods].totalIndirectCost = 0;
            } else {
              tempTotalDirectCost =  tempTotalDirectCost +
                                     this.result.proposal.budgetHeader.budgetPeriods[periods].budgetDetails[lineItem].lineItemCost;
            }
            this.result.proposal.budgetHeader.budgetPeriods[periods].totalDirectCost = tempTotalDirectCost;
            this.result.proposal.budgetHeader.budgetPeriods[periods].totalCost =
                          this.result.proposal.budgetHeader.budgetPeriods[periods].totalIndirectCost +
                          this.result.proposal.budgetHeader.budgetPeriods[periods].totalDirectCost;
            this.result.proposal.budgetHeader.budgetPeriods[periods].totalIndirectCost = 0;
            this.result.proposal.budgetHeader.budgetPeriods[periods].totalIndirectCost = 0;
            this.result.proposal.budgetHeader.budgetPeriods[periods].totalCost =
                          this.result.proposal.budgetHeader.budgetPeriods[periods].totalCost;
            this.calculateBudgetTotalCost();
          }
        }
      }
    }
  }

  checkBudgetDetailsExist(action) {
    if (action === 'COPY') {
      const currentPeriod = this.result.proposal.budgetHeader.budgetPeriods.find(period => period.budgetPeriod === this.selectedPeriod);
      const previousPeriod = this.result.proposal.budgetHeader.budgetPeriods.find(period =>
                              period.budgetPeriod === this.selectedPeriod - 1);
      if (previousPeriod.budgetDetails.length > 0) {
        if (currentPeriod.budgetDetails.length > 0) {
          this.actionsModalObj.modalMessage = 'Line Item already exists. Please delete them to proceed with copy period.';
          this.actionsModalObj.isWarning = true;
        } else {
          this.actionsModalObj.modalMessage = 'Are you sure you want to copy line items from period ' +
                                                JSON.stringify(this.selectedPeriod - 1) + ' to period ' +
                                                JSON.stringify(this.selectedPeriod) + ' ?';
        }
      } else {
        this.actionsModalObj.modalMessage = 'No line items exists to copy.';
        this.actionsModalObj.isWarning = true;
      }
    }
    if (action === 'GENERATE') {
      const currentPeriod = this.result.proposal.budgetHeader.budgetPeriods.find(period => period.budgetPeriod === this.selectedPeriod);
      const periodsWithLineItems = this.result.proposal.budgetHeader.budgetPeriods.filter(period =>
                                    period.budgetDetails.length > 0 && period.budgetPeriod !== currentPeriod.budgetPeriod);
      if (currentPeriod.budgetDetails.length > 0) {
        if (periodsWithLineItems.length > 0) {
            this.actionsModalObj.modalMessage =
              'Line Item already exists in other periods. Please delete them to proceed with generate period.';
            this.actionsModalObj.isWarning = true;
        } else {
            this.actionsModalObj.modalMessage = 'Are you sure you want to generate all periods?';
        }
      } else {
        this.actionsModalObj.modalMessage = 'No line items exists to copy.';
        this.actionsModalObj.isWarning = true;
      }
    }
  }

  setPeriodAndTotalDirectCost(cost, periodNumber) {
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost = 0;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost =
        this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost === null ?
        0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost =
        this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost === null ?
        0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost =
        this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost === null ?
        0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost;

    if (cost === null) {
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
        parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost) +
        parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost) + 0;
    } else {
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
        parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost) +
        parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost) + parseFloat(cost);
    }

    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost = cost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost;
    this.calculateBudgetTotalCost();
  }

  setPeriodAndTotalIndirectCost(cost, periodNumber) {
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost = 0;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost === null ?
      0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost === null ?
      0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost === null ?
      0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost;

      if (cost === null) {
        this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
          parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost) +
          parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost) + 0;
      } else {
        this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
          parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost) +
          parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost) + parseFloat(cost);
      }

    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost = cost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost;
    this.calculateBudgetTotalCost();
  }

  setPeriodAndTotalSubcontractCost(cost, periodNumber) {
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost = 0;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost === null ?
      0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost === null ?
      0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost === null ?
      0 : this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost;


      if (cost === null) {
        this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
          parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost) +
          parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost) + 0;
      } else {
        this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
          parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalDirectCost) +
          parseFloat(this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalIndirectCost) + parseFloat(cost);
      }

    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].subcontractCost = cost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost =
      this.result.proposal.budgetHeader.budgetPeriods[periodNumber - 1].totalCost;
    this.calculateBudgetTotalCost();
  }

  calculatePeriodTotalCost(periodNo) {
    let periodTotalCost = 0;
    let periodTotalDirect = 0;
    let periodTotalIndirect = 0;
    let periodTotalSubcontract = 0;
    for (const period of this.result.proposal.budgetHeader.budgetPeriods) {
      if (period.budgetPeriod === periodNo) {
        for (let detailIndex = 0; detailIndex < period.budgetDetails.length; detailIndex++) {
          if (period.budgetDetails[detailIndex].systemGeneratedCEType == null ||
            period.budgetDetails[detailIndex].systemGeneratedCEType === 'BUDGET_FRINGE_ON') {
              if (period.budgetDetails[detailIndex].budgetCategoryCode === '22') {
                periodTotalSubcontract = periodTotalSubcontract + period.budgetDetails[detailIndex].lineItemCost;
              } else {
                periodTotalDirect = periodTotalDirect + period.budgetDetails[detailIndex].lineItemCost;
              }
          } else if (period.budgetDetails[detailIndex].systemGeneratedCEType === 'BUDGET_RESEARCH_OH_ON') {
            periodTotalIndirect = periodTotalIndirect + period.budgetDetails[detailIndex].lineItemCost;
          }
        }
      }
    }
    periodTotalCost = periodTotalCost + periodTotalDirect + periodTotalIndirect + periodTotalSubcontract;
    this.result.proposal.budgetHeader.budgetPeriods[periodNo - 1].totalCost = periodTotalCost;
    this.result.proposal.budgetHeader.budgetPeriods[periodNo - 1].totalDirectCost = periodTotalDirect;
    this.result.proposal.budgetHeader.budgetPeriods[periodNo - 1].totalIndirectCost = periodTotalIndirect;
    this.result.proposal.budgetHeader.budgetPeriods[periodNo - 1].subcontractCost = periodTotalSubcontract;
    this.calculateBudgetTotalCost();
  }

  calculateBudgetTotalCost() {
    let finalTotalCost = 0;
    let finalTotalDirect = 0;
    let finalTotalIndirect = 0;
    let finalSubContractCost = 0;
    if (this.result.proposal.budgetHeader.budgetPeriods.length > 0) {
      for (const period of this.result.proposal.budgetHeader.budgetPeriods) {
        finalTotalCost += period.totalCost;
        finalTotalDirect += period.totalDirectCost;
        finalSubContractCost += period.subcontractCost;
        finalTotalIndirect += period.totalIndirectCost;
      }
      this.result.proposal.budgetHeader.totalDirectCost = finalTotalDirect;
      this.result.proposal.budgetHeader.totalIndirectCost = finalTotalIndirect;
      this.result.proposal.budgetHeader.totalSubcontractCost = finalSubContractCost;
      this.result.proposal.budgetHeader.totalCost = finalTotalCost;
    }
  }

  validatePeriodStartDate(startDate, endDate, periodNo) {
    const periodStartDateString = startDate === null ? null : new Date(startDate);
    const periodEndDateString = endDate === null ? null : new Date(endDate);

    if (periodStartDateString < new Date(this.result.proposal.budgetHeader.startDate) ||
        periodStartDateString > new Date(this.result.proposal.budgetHeader.endDate)) {
      this.budgetPeriodsDateObj.isStartError = true;
      this.budgetPeriodsDateObj.startErrorMessage = '* Choose a Period Start Date between Budget Start Date and Budget End Date.';
    } else if (periodEndDateString !== null && periodStartDateString > periodEndDateString) {
      this.budgetPeriodsDateObj.isStartError = true;
      this.budgetPeriodsDateObj.startErrorMessage = '* Choose a Period Start Date before Period End Date.';
    } else if (periodNo > 0) {
      for (let period = 0; period < this.result.proposal.budgetHeader.budgetPeriods.length; period++) {
        const period_StartDate = new Date(this.result.proposal.budgetHeader.budgetPeriods[period].startDate);
        const period_EndDate = new Date(this.result.proposal.budgetHeader.budgetPeriods[period].endDate);

        if (period_StartDate <= periodStartDateString && period_EndDate >= periodStartDateString && periodNo !== period) {
          this.budgetPeriodsDateObj.isStartError = true;
          this.budgetPeriodsDateObj.startErrorMessage = '* Period dates can not be overlapped each other.';
          break;
        }else {
          this.budgetPeriodsDateObj.isStartError = false;
        }
      }
    }else {
      this.budgetPeriodsDateObj.isStartError = false;
    }
  }

  validatePeriodEndDate(endDate, startDate, periodNo) {
    const periodEndDateString = endDate === null ? null : new Date(endDate);
    const periodStartDateString = startDate === null ? null : new Date(startDate);

    if (periodEndDateString < new Date(this.result.proposal.budgetHeader.startDate)
        || periodEndDateString > new Date(this.result.proposal.budgetHeader.endDate)) {
      this.budgetPeriodsDateObj.isEndError = true;
      this.budgetPeriodsDateObj.endErrorMessage = '* Choose a Period End Date between Budget Start Date and Budget End Date.';
    } else if ( periodStartDateString !== null && periodEndDateString < periodStartDateString) {
      this.budgetPeriodsDateObj.isEndError = true;
      this.budgetPeriodsDateObj.endErrorMessage = '* Choose a Period End Date after Period Start Date.';
    } else if (periodNo > 0) {
      for (let period = 0; period < this.result.proposal.budgetHeader.budgetPeriods.length; period++) {
        const period_StartDate = new Date(this.result.proposal.budgetHeader.budgetPeriods[period].startDate);
        const period_EndDate = new Date(this.result.proposal.budgetHeader.budgetPeriods[period].endDate);

        if (period_StartDate <= periodEndDateString && period_EndDate >= periodEndDateString && periodNo !== period) {
          this.budgetPeriodsDateObj.isEndError = true;
          this.budgetPeriodsDateObj.endErrorMessage = '* Period dates can not be overlapped each other.';
          break;
        }else {
          this.budgetPeriodsDateObj.isEndError = false;
        }
      }
    }else {
      this.budgetPeriodsDateObj.isEndError = false;
    }
  }

  fetchCostElements() {
      this.iconClass.costElement = this.selectedCostElement ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
      /*budgetCategoryCode should be passed as '' instead of null for fetching costElement*/
      const budgetCategoryCode = this.budgetDetail.budgetCategoryCode == null ? '' : this.budgetDetail.budgetCategoryCode;
      this._proposalBudgetService.fetchCostElement( this.selectedCostElement, budgetCategoryCode)
      .subscribe( (data: any) => {
        this.costElements = data;
      });
  }

  costElementChange(selectedResult) {
    this.selectedCostElement = selectedResult.costElementDetail;
    /* for checking whether costElement is typed or selected from list*/
    if (this.selectedCostElement === '' || this.selectedCostElement == null) {
      this.budgetDetail.costElement = null;
      this.budgetDetail.costElementCode = null;
    } else {
        for ( const item of this.costElements ) {
          if ( item.costElementDetail === this.selectedCostElement ) {
            this.budgetDetail.costElement = item;
            this.budgetDetail.costElementCode = item.costElement;
            this.budgetDetail.budgetCategory = item.budgetCategory;
            this.budgetDetail.budgetCategoryCode = item.budgetCategoryCode;
            this.selectedBudgetCategory = item.budgetCategory.description;
            this.isInvalidLineItem.category = this.isInvalidLineItem.costElement = false;
            this.isInvalidLineItem.message = null;
          }
        }
    }
    this.iconClass.budgetCategory = this.selectedBudgetCategory ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  fetchBudgetCategory(e, type) {
    this.iconClass.budgetCategory = this.selectedBudgetCategory ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    if ( this.selectedBudgetCategory === null || this.selectedBudgetCategory === '') {
      this.clearSearchBox(e, type);
    } else {
      this._proposalBudgetService.fetchBudgetCategory( this.selectedBudgetCategory).subscribe( (data: any) => {
        this.budgetCategories = data;
      } );
    }
  }

  budgetCategoryChange(selectedResult) {
    this.selectedBudgetCategory = selectedResult.description;
    if (this.selectedBudgetCategory == null || this.selectedBudgetCategory === '') {
      this.isPersonnelOpen = false;
      this.selectedCostElement = null;
      this.budgetDetail.costElement = null;
      this.budgetDetail.costElementCode = null;
      this.budgetDetail.budgetCategory = null;
      this.budgetDetail.budgetCategoryCode = null;
    } else {
      for ( const item of this.budgetCategories ) {
        if ( item.description === this.selectedBudgetCategory ) {
          this.budgetDetail.budgetCategory = item;
          this.budgetDetail.budgetCategoryCode = item.code;
        }
      }
      this._proposalBudgetService.fetchCostElementByBudgetCategory( {budgetCategoryCode: this.budgetDetail.budgetCategoryCode} )
      .subscribe( (data: any) => {
        this.costElements = data.costElements;
      });
    }
    this.iconClass.budgetCategory = this.selectedBudgetCategory ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  checkBudgetCategoryValidity() {
    this.searchActive.budgetCategory = false;
    if (this.selectedBudgetCategory != null &&
      (this.budgetDetail.budgetCategoryCode === null || this.budgetDetail.budgetCategoryCode === undefined)) {
        this.isInvalidLineItem.category = true;
        this.isInvalidLineItem.message = '* Please choose a budget category from the list.';
      }
  }

  clearSearchBox(e, type) {
    e.preventDefault();
    if (type === 'costElement') {
      this.selectedCostElement = null;
      this.iconClass.costElement = this.selectedCostElement ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    } else if (type === 'budgetCategory') {
      this.selectedBudgetCategory = null;
      this.budgetDetail.budgetCategory = null;
      this.budgetDetail.budgetCategoryCode = null;
      this.isInvalidLineItem.category = false;
      this.isInvalidLineItem.message = null;
      this.iconClass.budgetCategory = this.selectedBudgetCategory ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
      this.clearSearchBox(e, 'costElement');
    }
  }

  personnelTypeChanged() {
    this.budgetDetail.rolodexId = null;
    this.budgetDetail.fullName = null;
    this.budgetDetail.personId = null;
    this.budgetDetail.tbnId = null;
    this.budgetDetail.tbnPerson = null;
    switch (this.personnelTypeSelected) {
      case 'E': this.nonEmployeeFlag = false;
                // tslint:disable-next-line:no-construct
                this.clearField = new String('true');
                this.placeHolderText = 'Search an employee';
                this.budgetDetail.personType = 'E';
                this.setElasticConfig('employee');
                break;
      case 'N': this.nonEmployeeFlag = true;
                // tslint:disable-next-line:no-construct
                this.clearField = new String('true');
                this.placeHolderText = 'Search a non-employee';
                this.budgetDetail.personType = 'N';
                this.setElasticConfig('non-employee');
                break;
      case 'T': this.nonEmployeeFlag = false;
                this.personnelSearchText = '';
                this.budgetDetail.personType = 'T';
                break;
      case 'P': this.nonEmployeeFlag = false;
                this.personnelSearchText = null;
                this.budgetDetail.personType = 'P';
                break;
    }
  }

  personnelNameChange() {
    this.budgetDetail.personId = null;
    this.budgetDetail.fullName = null;
    if ( this.personnelSearchText !== 'null') {
      const proposalPerson = this.result.proposal.proposalPersons.find(person => person.fullName === this.personnelSearchText);
      this.budgetDetail.personId = proposalPerson.personId;
      this.budgetDetail.fullName = proposalPerson.fullName;
    }
  }

  setElasticConfig(type) {
    this.elasticSearchOptions.url   = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.size  = 20;
    this.elasticSearchOptions.index = !this.nonEmployeeFlag ? 'fibiperson' : 'fibirolodex';
    this.elasticSearchOptions.type  = !this.nonEmployeeFlag ? 'person' : 'rolodex';
    this.elasticSearchOptions.contextField = !this.nonEmployeeFlag ? 'full_name' : 'first_name';
    this.elasticSearchOptions.fields = !this.nonEmployeeFlag ? {full_name: {}, prncpl_nm: {}} :
                                        {first_name: {}, middle_name: {}, last_name: {}, organization: {}};
  }

  selectedPersonnel(value) {
    const selectedMember = value;
    if ( !this.nonEmployeeFlag ) {
      this.budgetDetail.personId = value.prncpl_id;
      this.budgetDetail.fullName = value.full_name;
    } else {
      selectedMember.organization = (selectedMember.organization == null) ? '' : selectedMember.organization;
      selectedMember.first_name = (value.first_name == null) ? '' : value.first_name;
      selectedMember.middle_name = (value.middle_name == null) ? '' : value.middle_name;
      selectedMember.last_name = (value.last_name == null) ? '' : value.last_name;
      this.budgetDetail.rolodexId = value.rolodex_id;
      if ((selectedMember.first_name === null || selectedMember.first_name === '') &&
          (selectedMember.middle_name === null || selectedMember.middle_name === '') &&
          (selectedMember.last_name === null || selectedMember.last_name === '')) {
            this.budgetDetail.fullName = selectedMember.organization;
      } else {
        this.budgetDetail.fullName = selectedMember.last_name + ' , ' +
                                    selectedMember.middle_name + ' ' +
                                    selectedMember.first_name;
      }
    }
  }

  tbnChangeFunction() {
    this.budgetDetail.tbnId = null;
    this.budgetDetail.tbnPerson = null;
    const tbnPerson = this.result.tbnPersons.find(person => person.personName === this.personnelSearchText);
    this.budgetDetail.tbnPerson = tbnPerson;
    this.budgetDetail.tbnId = tbnPerson.tbnId;
  }

  addBudgetDetail(periodNo) {
    this.validateBudgetDetail();
    if (this.isInvalidLineItem.message === null) {
      this.budgetDetail.updateUser = localStorage.getItem( 'currentUser' );
      this.budgetDetail.updateTimeStamp = new Date().getTime();
      this.budgetDetail.budgetPeriod = periodNo;
      this.isApplyInflation = true;
      if (this.budgetDetail.fullName == null && this.budgetDetail.tbnId == null) {
        this.budgetDetail.personType = null;
      }
      this.addSystemCostElements();
      this.budgetDetail = {};
      this.selectedBudgetCategory = null;
      this.selectedCostElement = null;
      this.personnelTypeSelected = 'P';
      this.personnelSearchText = null;
      this.nonEmployeeFlag = false;
      this.isPersonnelOpen = false;
      this.placeHolderText = '';
      this.iconClass.costElement = this.selectedCostElement ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
      this.iconClass.budgetCategory = this.selectedBudgetCategory ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
      this.calculatePeriodTotalCost(periodNo);
      this.calculateBudgetTotalCost();
    }
  }

  validateBudgetDetail() {
    this.isInvalidLineItem.message = null;
    this.isInvalidLineItem.costElement = false;
    this.isInvalidLineItem.category = false;
    this.isInvalidLineItem.cost = false;
    if (this.budgetDetail.costElement == null ||
        this.budgetDetail.budgetCategoryCode == null ||
        this.budgetDetail.lineItemCost == null) {
          this.isInvalidLineItem.message = '* Please fill all mandatory fields.';
          this.isInvalidLineItem.costElement = this.budgetDetail.costElement === null || this.budgetDetail.costElement === undefined ?
                                               true : false;
          this.isInvalidLineItem.category = this.budgetDetail.budgetCategoryCode === null  ||
                                            this.budgetDetail.budgetCategoryCode === undefined ? true : false;
          this.isInvalidLineItem.cost = this.budgetDetail.lineItemCost === null  || this.budgetDetail.lineItemCost === undefined ?
                                        true : false;
    }
  }

  addSystemCostElements() {
    for (let periodIndex = 0; periodIndex < this.result.proposal.budgetHeader.budgetPeriods.length; periodIndex++) {
      if (this.result.proposal.budgetHeader.budgetPeriods[periodIndex].budgetPeriod === this.budgetDetail.budgetPeriod) {
        if (this.result.proposal.budgetHeader.budgetPeriods[periodIndex].budgetDetails.length <= 0) {
          for (const sysCost of this.result.sysGeneratedCostElements) {
            const tempSysCost: any = {};
            tempSysCost.budgetCategory = sysCost.budgetCategory;
            tempSysCost.budgetCategoryCode = sysCost.budgetCategoryCode;
            tempSysCost.budgetPeriod = this.budgetDetail.budgetPeriod;
            tempSysCost.costElement = sysCost;
            tempSysCost.costElementCode = sysCost.costElement;
            tempSysCost.lineItemDescription = null;
            tempSysCost.isSystemGeneratedCostElement = true;
            tempSysCost.fullName = null;
            tempSysCost.rolodexId = null;
            tempSysCost.personId = null;
            tempSysCost.updateTimeStamp = new Date().getTime();
            tempSysCost.updateUser = localStorage.getItem( 'currentUser' );
            tempSysCost.systemGeneratedCEType = sysCost.systemGeneratedCEType;
            tempSysCost.lineItemCost = 0;
            tempSysCost.lineItemDescription = null;
            this.result.proposal.budgetHeader.budgetPeriods[periodIndex].budgetDetails.push(tempSysCost);
            this.result.proposal.budgetHeader.budgetPeriods[periodIndex].updateUser = localStorage.getItem( 'currentUser' );
            this.result.proposal.budgetHeader.budgetPeriods[periodIndex].updateTimeStamp = new Date().getTime();
          }
        }
        this.result.proposal.budgetHeader.budgetPeriods[periodIndex].budgetDetails.unshift(this.budgetDetail);
      }
    }
  }

  openActionModal(action) {
    this.actionsModalObj.action = action;
    this.actionsModalObj.isWarning = false;
    switch (action) {
      case 'ADD'            : this.actionsModalObj.showModal = true;
                              this.actionsModalObj.modalHeading = 'Add Period';
                              this.actionsModalObj.modalMessage = 'Are you sure you want to add a new budget period?';
                              break;
      case 'COPY'           : this.actionsModalObj.showModal = true;
                              this.actionsModalObj.modalHeading = 'Copy Period';
                              this.checkBudgetDetailsExist(this.actionsModalObj.action);
                              break;
      case 'GENERATE'       : this.actionsModalObj.showModal = true;
                              this.actionsModalObj.modalHeading = 'Generate Periods';
                              this.checkBudgetDetailsExist(this.actionsModalObj.action);
                              break;
      case 'DELETE_PERIOD'  : this.actionsModalObj.showModal = true;
                              this.actionsModalObj.modalHeading = 'Delete Period';
                              this.result.proposal.budgetHeader.budgetPeriods.length === 1 ? ( this.actionsModalObj.modalMessage =
                                'Cannot delete this period. Minimum one period is required in the budget.',
                                this.actionsModalObj.isWarning = true ) :
                              this.actionsModalObj.modalMessage = 'Are you sure you want to delete this budget period?';
                              break;
      case 'DELETE_LINEITEM': this.actionsModalObj.showModal = true;
                              this.actionsModalObj.modalHeading = 'Delete Line Item';
                              this.actionsModalObj.modalMessage = 'Are you sure you want to delete this line item?';
                              break;
      default: break;
    }
  }

  performBudgetAction() {
    this.result.proposal.updateUser = localStorage.getItem( 'currentUser' );
    this.result.proposal.updateTimeStamp = new Date().getTime();
    this.budgetDatesToTimeStamp();
    switch (this.actionsModalObj.action) {
      case 'ADD'            : this.addBudgetPeriod(); break;
      case 'COPY'           : this.copyBudgetPeriod(); break;
      case 'GENERATE'       : this.generateBudgetPeriod(); break;
      case 'DELETE_PERIOD'  : this.deleteBudgetPeriod(); break;
      case 'DELETE_LINEITEM': this.deleteLineItem(); break;
      default: break;
    }
  }

  addBudgetPeriod() {
    const requestObj = {proposal: this.result.proposal};
    this._proposalBudgetService.addBudgetPeriod(requestObj).subscribe((data: any) => {
      this.result.proposal = data.proposal;
      this.timeStampToPeriodDates();
    });
  }

  copyBudgetPeriod() {
    const requestObj: any = {};
    requestObj.proposal = this.result.proposal;
    requestObj.copyPeriodId = this.result.proposal.budgetHeader.budgetPeriods.find(period =>
                                period.budgetPeriod === this.selectedPeriod - 1).budgetPeriodId;
    requestObj.currentPeriodId = this.result.proposal.budgetHeader.budgetPeriods.find(period =>
                                  period.budgetPeriod === this.selectedPeriod).budgetPeriodId;
    this._proposalBudgetService.copyBudgetPeriod(requestObj).subscribe((data: any) => {
      this.result.proposal = data.proposal;
      this.timeStampToPeriodDates();
    });
  }

  generateBudgetPeriod() {
    const requestObj: any = {};
    requestObj.proposal = this.result.proposal;
    requestObj.currentPeriodId = this.result.proposal.budgetHeader.budgetPeriods.find(period =>
                                  period.budgetPeriod === this.selectedPeriod).budgetPeriodId;
    this._proposalBudgetService.generateBudgetPeriod(requestObj).subscribe((data: any) => {
      this.result.proposal = data.proposal;
      this.timeStampToPeriodDates();
    });
  }

  deleteBudgetPeriod() {
    const requestObj: any = {};
    const deletedPeriod = this.result.proposal.budgetHeader.budgetPeriods.find(period => period.budgetPeriod === this.selectedPeriod);
    const tempPeriod = deletedPeriod.budgetPeriod - 1;
    requestObj.budgetPeriodId = deletedPeriod.budgetPeriodId;
    requestObj.proposal = this.result.proposal;
    this._proposalBudgetService.deleteBudgetPeriod(requestObj).subscribe((data: any) => {
      this.result.proposal = data.proposal;
      this.timeStampToPeriodDates();
      this.calculateBudgetTotalCost();
      this.selectedPeriod = tempPeriod;
    });
  }

  setLineItemObj(lineItem, budgetPeriodId, budgetPeriodNo, index) {
    this.lineItemObj.lineItem = lineItem;
    this.lineItemObj.budgetPeriodId = budgetPeriodId;
    this.lineItemObj.budgetPeriod = budgetPeriodNo;
    this.lineItemObj.index = index;
    this.openActionModal('DELETE_LINEITEM');
  }

  deleteLineItem() {
    const lineItemPeriod = this.result.proposal.budgetHeader.budgetPeriods.find(period =>
                          period.budgetPeriod === this.lineItemObj.budgetPeriod);
    for (const {item, index} of lineItemPeriod.budgetDetails.map ((item, index) => ({item, index }))) {
      if ((item.budgetDetailId === null || item.budgetDetailId === undefined) && index === this.lineItemObj.index) {
          lineItemPeriod.budgetDetails.splice(this.lineItemObj.index, 1);
          if (lineItemPeriod.budgetDetails.length <= 2) {
            lineItemPeriod.budgetDetails = [];
            lineItemPeriod.totalCost = lineItemPeriod.totalDirectCost = lineItemPeriod.totalIndirectCost = 0;
          }
          this.calculatePeriodTotalCost(this.lineItemObj.budgetPeriod);
          this.calculateBudgetTotalCost();
      } else if ((item.budgetDetailId !== null || item.budgetDetailId !== undefined) && index === this.lineItemObj.index) {
        const requestObj = {budgetPeriodId: this.lineItemObj.budgetPeriodId,
                            budgetDetailId: item.budgetDetailId, proposal: this.result.proposal};
        this._proposalBudgetService.deleteLineItem(requestObj).subscribe((data: any) => {
          this.result.proposal = data.proposal;
          this.timeStampToPeriodDates();
        });
      }
    }
  }

  showRatesCalcAmount(periodNumber, index) {
    this.actionsModalObj.showlineItemRate = true;
    this.rateObj = {};
    this.rateObj.periodNo = periodNumber - 1;
    this.rateObj.index = index;
    this.isApplyInflation =
          this.result.proposal.budgetHeader.budgetPeriods[this.rateObj.periodNo].budgetDetails[this.rateObj.index].isApplyInflationRate;
    if (this.result.proposal.budgetHeader.budgetPeriods[this.rateObj.periodNo].budgetDetails[this.rateObj.index].budgetDetailCalcAmounts.length !== 0) {
      this.actionsModalObj.isNoRatesAppplied = false;
    } else {
      this.actionsModalObj.isNoRatesAppplied = true;
    }
  }

  changeApplyInflation () {
    if (this.rateObj.periodNo != null && this.rateObj.index != null) {
      this.result.proposal.budgetHeader.budgetPeriods[this.rateObj.periodNo].budgetDetails[this.rateObj.index].isApplyInflationRate
        = this.isApplyInflation;
    }
  }

  clearModalActions() {
    this.actionsModalObj.showModal = false;
    this.actionsModalObj.action = null;
    this.actionsModalObj.modalHeading = this.actionsModalObj.modalMessage = null;
  }

}

/* table body scroll for lineItems in rates modal */
(function($) {
  $.fn.hasScrollBar = function() {
      return this.get(0).scrollHeight > this.height();
  };
});
(function($) {
   if ($('#mytest').hasScrollBar()) {
     $('.tableSection thead').toggleClass('extrawidth');
   }
});
