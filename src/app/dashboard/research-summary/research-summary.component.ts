import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import {DashboardService} from '../dashboard.service';
import { ResearchSummaryConfigService} from '../../common/services/research-summary-config.service';

@Component({
  selector: 'app-research-summary',
  templateUrl: './research-summary.component.html'
})
export class ResearchSummaryComponent implements OnInit, OnDestroy {

  result: any = {};
  researchSummaryData: any = {};
  departmentUnitNumber = null;
  $isExpenditureVolume;
  $isResearchSummary;
  $isAwardedProposal;
  $isAwardBysponsor;
  $isProposalBySponsor;
  $inProgressproposal;
  researchSummaryReqObj = {
        isAdmin: localStorage.getItem('isAdmin'),
        personId: localStorage.getItem('personId'),
        unitNumber: null
  };

  constructor( private _dashboardService: DashboardService,
               private _researchSummaryConfigService: ResearchSummaryConfigService) { }

  ngOnInit() {
    this.loadResearchSummaryData();
    this.getSelectedUnit();
    /** subscription for chart widget status */
    this.$isExpenditureVolume = this._researchSummaryConfigService.expenditureVolume;
    this.$isResearchSummary   = this._researchSummaryConfigService.researchSummary;
    this.$isAwardedProposal   = this._researchSummaryConfigService.awardedProposal;
    this.$isAwardBysponsor    = this._researchSummaryConfigService.awardBysponsor;
    this.$isProposalBySponsor = this._researchSummaryConfigService.proposalBySponsor;
    this.$inProgressproposal  = this._researchSummaryConfigService.inProgressproposal;
  }

  loadResearchSummaryData() {
    this._dashboardService.getResearchSummaryData(this.researchSummaryReqObj)
      .subscribe(data => {
        this.result = data || [];
        if (this.result !== null) {
            this.researchSummaryData = this.result;
            this._researchSummaryConfigService.unitAdministrators.next(this.result.unitAdministrators);
      }
    });
  }
  /**
   * subcribes unit list data from the dashboard component will use load dashboard service
   * to fetch data with updated unit value subcripition output emits the unit value
   */
  getSelectedUnit() {
    this._researchSummaryConfigService.slectetedUnit.subscribe( data => {
      this.researchSummaryReqObj.unitNumber = data;
      this.loadResearchSummaryData();
    });
  }
  ngOnDestroy() {
    this._researchSummaryConfigService.unitAdministrators.next([]);
  }

}
