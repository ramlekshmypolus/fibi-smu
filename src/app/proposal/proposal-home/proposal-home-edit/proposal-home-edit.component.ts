import { Component, OnInit, Input } from '@angular/core';

import { ProposalComponent } from '../../proposal.component';

import { ProposalHomeService } from '../proposal-home.service';

@Component({
  selector: 'app-proposal-home-edit',
  templateUrl: './proposal-home-edit.component.html',
  styleUrls: ['./proposal-home-edit.component.css']
})
export class ProposalHomeEditComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() warningMsgObj: any = {};
  @Input() proposalDataBindObj: any = {};
  @Input() mandatoryObj: any = {};

  isSearchGrantCallActive = false;
  isGrantThemeReadMore = false;

  grantCallIconClass = 'fa fa-search fa-med';

  constructor( private _proposalHomeService: ProposalHomeService, public _proposalComponent: ProposalComponent ) { }

  ngOnInit() {
    this.grantCallIconClass = this.proposalDataBindObj.selectedGrantCall ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }


  grantCallChangeFunction() {
    this.grantCallIconClass = this.proposalDataBindObj.selectedGrantCall ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    this._proposalHomeService.fetchGrantCall( this.proposalDataBindObj.selectedGrantCall).subscribe( data => {
      this.result.grantCalls = data;
    } );
  }

  grantCallSelectFunction(result) {
    this.proposalDataBindObj.selectedGrantCall = result.grantCallName;
    const grantObj = this.result.grantCalls.find( grant => grant.grantCallName === this.proposalDataBindObj.selectedGrantCall);
    if (grantObj != null) {
      this.result.proposal.grantCall = grantObj;
      this.result.proposal.grantCallId = grantObj.grantCallId;
      this.result.proposal.grantCallType = grantObj.grantCallType;
      this.result.proposal.grantCall.updateTimeStamp = new Date().getTime();
      this.result.proposal.grantCall.updateUser = localStorage.getItem('currentUser');
      this.grantCallIconClass = this.proposalDataBindObj.selectedGrantCall ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    }
  }

  clearGrantCallSearchBox( e ) {
    e.preventDefault();
    this.proposalDataBindObj.selectedGrantCall = '';
    this.grantCallIconClass = this.proposalDataBindObj.selectedGrantCall ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  removeSelectedGrant(e) {
    e.preventDefault();
    this.result.proposal.grantCall = null;
    this.result.proposal.grantCallId = null;
    this.result.proposal.grantCallType = this.result.defaultGrantCallType;
    this.proposalDataBindObj.selectedGrantCall = null;
    this.isSearchGrantCallActive = false;
    this.showOrHideDataFlagsObj.dataChangeFlag = true;
  }

}
