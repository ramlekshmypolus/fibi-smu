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
    currentTab: (localStorage.getItem('currentTab') == null) ? 'PROPOSAL_HOME' : localStorage.getItem('currentTab')
  };

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

  saveProposal() {}
}
