import { Component, OnInit, Input } from '@angular/core';

import { GrantService } from '../../../../grant/services/grant.service';
import { CommonService } from '../../../../common/services/common.service';
import { ProposalHomeService } from '../../proposal-home.service';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.css']
})
export class DeclarationComponent implements OnInit {
  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() warningMsgObj: any = {};

  isShowDeleteSponsorModal = false;
  isSearchProtocolTitleActive = false;
  isShowDeleteIRBDetails = false;

  selectedSponsorType = null;
  selectedSponsorName = null;
  fundingStartDate: any;
  fundingEndDate: any;
  selectedProtocol: string;
  protocolIconClass = 'fa fa-search fa-med';
  sponsorAmount = 0;

  sponsorObject: any = {};
  tempSaveSponsorObject: any = {};
  tempSaveIRBProtocolObject: any = {};
  requestObject: any = {};
  index: number;

  constructor(private _commonService: CommonService,
    private _grantService: GrantService,
    private _proposalHomeService: ProposalHomeService) { }

  ngOnInit() {
  }

  /* fetches sponsors according to sponsor type */
  sponsorTypeChange(type) {
    if (type === 'null') {
      this.result.sponsors = null;
      this.selectedSponsorName = null;
    } else {
      const sponsorTypeObject = this.result.sponsorTypes.find(sponsorType => sponsorType.description === type);
      if (sponsorTypeObject != null) {
        this._grantService.fetchSponsorsBySponsorType({ 'sponsorTypeCode': sponsorTypeObject.code }).subscribe(data => {
          let temp: any = {};
          temp = data;
          this.result.sponsors = temp.sponsors;
          this.selectedSponsorName = null;
        });
      }
    }
  }

  /* assigns sponsor name */
  sponsorNameChange(name) {
    this.sponsorObject = {};
    const sponsor = this.result.sponsors.find(sponsorName => sponsorName.sponsorName === name);
    if (sponsor != null) {
      this.sponsorObject.sponsor = sponsor;
      this.sponsorObject.sponsorCode = sponsor.sponsorCode;
      this.sponsorObject.updateTimeStamp = (new Date()).getTime();
      this.sponsorObject.updateUser = localStorage.getItem('currentUser');
    }
  }

  /* date validation for funding start date and end date */
  sponsorDateValidation() {
    this.warningMsgObj.fundingWarningMsg = null;
    if (this.fundingStartDate == null) {
      this.warningMsgObj.fundingWarningMsg = '* Please select start date';
    } else if (this.fundingEndDate == null) {
      this.warningMsgObj.fundingWarningMsg = '* Please select end date';
    } else if (this.fundingStartDate > this.fundingEndDate) {
      this.warningMsgObj.fundingWarningMsg = '* Please select an end date after start date';
    } else {
      this.warningMsgObj.fundingWarningMsg = null;
    }
  }

  /* adds funding agency */
  addSponsor() {
    this.warningMsgObj.fundingWarningMsg = null;
    if (this.selectedSponsorType == null || this.selectedSponsorType === 'null') {
      this.warningMsgObj.fundingWarningMsg = '* Please select funding agency type';
    } else if (this.selectedSponsorName == null || this.selectedSponsorName === 'null' ) {
      this.warningMsgObj.fundingWarningMsg = '* Please select funding agency name';
    } else if (this.warningMsgObj.fundingWarningMsg === null) {
      this.sponsorDateValidation();
    } else {
      this.warningMsgObj.fundingWarningMsg = null;
    }
    if (this.warningMsgObj.fundingWarningMsg == null) {
      this.sponsorObject.startDate = this.fundingStartDate;
      this.sponsorObject.endDate = this.fundingEndDate;
      this.sponsorObject.amount = this.sponsorAmount;
      this.result.proposal.proposalSponsors.push(this.sponsorObject);
      this.result.sponsors = null;
      this.selectedSponsorType = null;
      this.selectedSponsorName = null;
      this.fundingStartDate = null;
      this.fundingEndDate = null;
      this.sponsorAmount = 0;
    }
  }

  /* temporary saves sponsor object while delete modal opens */
  temprySaveSponsorObject(sponsor, i) {
    this.tempSaveSponsorObject = sponsor;
    this.isShowDeleteSponsorModal = true;
    this.index = i;
  }

  /* deletes funding agency details */
  deleteSponsor() {
    if (this.tempSaveSponsorObject.sponsorId != null) {
      this.requestObject.proposalId = this.result.proposal.proposalId;
      this.requestObject.sponsorId = this.tempSaveSponsorObject.sponsorId;
      this._proposalHomeService.deleteProposalSponsor(this.requestObject)
        .subscribe(data => {
          this.result.proposal.proposalSponsors.splice(this.index, 1);
        });
    } else {
      this.result.proposal.proposalSponsors.splice(this.index, 1);
    }
  }

  /* fetches protocol details according to selected protocol */
  protocolTitleChangeFunction() {
    this.protocolIconClass = this.selectedProtocol ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    this._proposalHomeService.fetchProtocol(this.selectedProtocol).subscribe(data => {
      let temp: any = {};
      temp = data;
      this.result.protocols = temp;
    });
  }

  /* clears protocol search box */
  clearProtocolSearchBox(e) {
    e.preventDefault();
    this.selectedProtocol = null;
    this.protocolIconClass = this.selectedProtocol ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  /* adds protocol details */
  addProtocol(result) {
    this.selectedProtocol = result.title;
    this.warningMsgObj.protocolWarningMsg = null;
    const tempProtocolObject: any = {};
    if (this.selectedProtocol === null || this.selectedProtocol === '') {
      this.warningMsgObj.protocolWarningMsg = '* Please choose a protocol';
    } else {
      if (this.result.proposal.proposalIrbProtocols.length !== 0) {
        const PROTOCOLOBJECT = this.result.proposal.proposalIrbProtocols.find(irbprotocol =>
                                                    irbprotocol.protocol.title === this.selectedProtocol);
        if ( PROTOCOLOBJECT !== null &&  PROTOCOLOBJECT !== undefined) {
        this.warningMsgObj.protocolWarningMsg = 'Protocol already added';
        }
      }
    }
    if (this.warningMsgObj.protocolWarningMsg === null) {
      if ( result !== null && result !== undefined && result.title === this.selectedProtocol ) {
      tempProtocolObject.protocolId = result.protocolId;
      tempProtocolObject.protocol =  result;
      tempProtocolObject.updateTimeStamp = (new Date()).getTime();
      tempProtocolObject.updateUser = localStorage.getItem('currentUser');
      this.result.proposal.proposalIrbProtocols.push(tempProtocolObject);
      }
    }
    this.selectedProtocol = null;
    this.protocolIconClass = this.selectedProtocol ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  /* temporary save protocol details before deletion */
  temprySaveIRBProtocolDetails( e, irb , i ) {
    e.preventDefault();
    this.isShowDeleteIRBDetails = true;
    this.tempSaveIRBProtocolObject = irb;
    this.index = i;
    }

 /* delete IRB protocol Details */
    deleteIRBProtocolDetails() {
      this.requestObject = {};
      if ( this.tempSaveIRBProtocolObject.irbProtocolId != null ) {
        this.requestObject.proposalId = this.result.proposal.proposalId;
        this.requestObject.irbProtocolId = this.tempSaveIRBProtocolObject.irbProtocolId;
        this._proposalHomeService.deleteIrbProtocol( this.requestObject  )
        .subscribe( data => { } );
        this.result.proposal.proposalIrbProtocols.splice( this.index, 1 );
    } else {
         this.result.proposal.proposalIrbProtocols.splice( this.index, 1 );
     }
    }
}
