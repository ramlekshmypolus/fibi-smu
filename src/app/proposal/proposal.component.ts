import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProposalService } from './services/proposal.service';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  result: any = {};
  showOrHideDataFlagsObj = {
    mode : '',
    currentTab: (localStorage.getItem('currentTab') == null) ? 'PROPOSAL_HOME' : localStorage.getItem('currentTab'),
    isSpecialReviewWidgetOpen: true,
    isGrantCallWdgtOpen: true,
    isProjectDescWdgtOpen: true,
    isBudgetWdgtOpen: true,
    isAreaOfResearchWidgetOpen: true,
    isDeclarationWidgetOpen: true
  };
  warningMsgObj: any = {};
  proposalDataBindObj: any = {};

  constructor( private _route: ActivatedRoute, private _proposalService: ProposalService ) { }

  ngOnInit() {
    this.result = this._route.snapshot.data.proposalDetails;
    if (this._route.snapshot.queryParamMap.get('proposalId') == null) {
      this.showOrHideDataFlagsObj.mode = 'create';
    } else {
        if (this.result.proposal.statusCode === 2 || this.result.proposal.statusCode === 11) {
            this.showOrHideDataFlagsObj.mode = 'view';
        } else {
            this.showOrHideDataFlagsObj.mode = 'edit';
        }
        this.initialiseProposalFormElements();
    }
  }

  showTab(currentTab) {
    if (currentTab === 'BUDGET' && this.result.proposal.budgetHeader == null) {
      if (this.result.proposal.proposalId != null ) {
        this._proposalService.createProposalBudget({'userName': localStorage.getItem('currentUser'),
        'userFullName': localStorage.getItem('userFullname'), 'proposal': this.result.proposal})
          .subscribe( data => {
            let tempryProposalObj: any = {};
            tempryProposalObj = data;
            this.result.proposal = tempryProposalObj.proposal;
            this.showOrHideDataFlagsObj.currentTab = currentTab;
            localStorage.setItem('currentTab', currentTab);
          });
      } else {
        // fill this with flag to show modal for goto budget without saving proposal
      }
    } else {
      this.showOrHideDataFlagsObj.currentTab = currentTab;
      localStorage.setItem('currentTab', currentTab);
    }
  }

  initialiseProposalFormElements() {
    this.proposalDataBindObj.proposalStartDate = this.result.proposal.startDate === null ?
                                                 null : new Date(this.result.proposal.startDate);
    this.proposalDataBindObj.proposalEndDate = this.result.proposal.endDate === null ?
                                               null : new Date(this.result.proposal.endDate);
    this.proposalDataBindObj.sponsorDeadlineDate = this.result.proposal.submissionDate === null ?
                                                   null : new Date(this.result.proposal.submissionDate);
    this.proposalDataBindObj.internalDeadlineDate = this.result.proposal.internalDeadLineDate === null ?
                                                    null : new Date(this.result.proposal.internalDeadLineDate);
    // set default grantCallType to Others if no grant call is associated with the proposal
    if ( this.result.proposal.grantCallType == null ) {
        this.result.proposal.grantCallType = this.result.defaultGrantCallType;
        this.result.proposal.grantTypeCode = this.result.defaultGrantCallType.grantTypeCode;
    } else if (this.result.proposal.grantCall != null) {
        this.result.proposal.grantCallType = this.result.proposal.grantCall.grantCallType;
        this.result.proposal.grantTypeCode = this.result.proposal.grantCall.grantCallType.grantTypeCode;
    } else if ( this.result.proposal.grantCall == null ) {}
}
  saveProposal() {}
}
