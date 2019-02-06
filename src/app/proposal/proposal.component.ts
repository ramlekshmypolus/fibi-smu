import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';

import { ProposalService } from './services/proposal.service';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit, OnDestroy {

  result: any = {};
  showOrHideDataFlagsObj = {
    mode : '',
    currentTab: (localStorage.getItem('currentTab') == null) ? 'PROPOSAL_HOME' : localStorage.getItem('currentTab'),
    isGrantCallWdgtOpen: true,
    isAreaOfResearchWidgetOpen: true,
    isProjectTeamWidgetOpen: true,
    isProjectDescWdgtOpen: true,
    isSpecialReviewWidgetOpen: true,
    isDeclarationWidgetOpen: true,
    isBudgetWdgtOpen: true,
    isAttachmentListOpen: true,
    isShowSaveWarningModal: false,
    isShowSaveSuccessModal: false,
    isShowSubmitWarningModal: false,
    isShowSubmitSuccessModal: false
  };
  isShowMoreOptions = false;

  toast_message = '';

  warningMsgObj: any = {};
  proposalDataBindObj: any = {};
  mandatoryObj: any = {};

  private autoSave_subscription: ISubscription;

  constructor( private _route: ActivatedRoute, private _proposalService: ProposalService, private _router: Router ) {
    this.autoSave_subscription = Observable.interval(1000 * 1200).subscribe(x => {
      if (this.result.proposal.proposalId !== null && this.result.proposal.statusCode !== 11) {
          this.saveProposal('autoSave');
      }
    });
   }

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
        this.saveProposal('partialSave');
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

  // proposal details validation
  proposalValidation() {
    if ( this.result.proposal.title === '' || this.result.proposal.title == null ) {
        this.mandatoryObj.field = 'title';
    } else if ( this.proposalDataBindObj.selectedProposalCategory == null ||
              this.proposalDataBindObj.selectedProposalCategory === 'null' ) {
      this.mandatoryObj.field = 'category';
    } else if ( this.proposalDataBindObj.selectedProposalType == null || this.proposalDataBindObj.selectedProposalType === 'null') {
        this.mandatoryObj.field = 'type';
    } else if ( this.result.proposal.homeUnitName === '' || this.result.proposal.homeUnitName == null) {
        this.mandatoryObj.field = 'homeUnit';
    } else if (this.result.proposal.sponsorName === '' || this.result.proposal.sponsorName == null) {
        this.mandatoryObj.field = 'sponsor';
    } else if (this.proposalDataBindObj.proposalStartDate === '' || this.proposalDataBindObj.proposalStartDate == null) {
      this.mandatoryObj.field = 'proposalStartDate';
    } else if (this.proposalDataBindObj.proposalEndDate === '' || this.proposalDataBindObj.proposalEndDate == null) {
      this.mandatoryObj.field = 'proposalEndDate';
    } else if (this.proposalDataBindObj.sponsorDeadlineDate === '' || this.proposalDataBindObj.sponsorDeadlineDate == null) {
      this.mandatoryObj.field = 'sponsorDeadlineDate';
    }else {
        this.mandatoryObj.field = null;
    }
    if ( this.result.proposal.proposalPersons.length > 0 ) {
      let PIExists = {};
      PIExists = this.result.proposal.proposalPersons.find( persons => persons.proposalPersonRole.description === 'Principal Investigator');
      if (PIExists == null) {
        this.warningMsgObj.personWarningMsg = '* Select a member as PI';
      } else {
        this.warningMsgObj.personWarningMsg = null;
      }
    } else {
        this.warningMsgObj.personWarningMsg = '* Select atleast one team member';
    }
  }

  openGoBackModal() {
    this._router.navigate(['/fibi/dashboard/proposalList']);
  }

  saveProposal(saveType) {
    this.showOrHideDataFlagsObj.isShowSaveWarningModal = false;
    this.showOrHideDataFlagsObj.isShowSaveSuccessModal = false;
    this.proposalValidation();
    if (this.mandatoryObj.field != null || this.warningMsgObj.personWarningMsg != null || this.warningMsgObj.dateWarningText != null) {
      this.showOrHideDataFlagsObj.isShowSaveWarningModal = true;
    } else {
      const TYPE = ( this.result.proposal.proposalId != null ) ? 'UPDATE' : 'SAVE';
      this.result.proposal.createTimeStamp = new Date().getTime();
            this.result.proposal.updateUser = localStorage.getItem('currentUser');
            this.result.proposal.updateTimeStamp = new Date().getTime();
            this.result.proposal.startDate = new Date(this.proposalDataBindObj.proposalStartDate).getTime();
            this.result.proposal.endDate = new Date(this.proposalDataBindObj.proposalEndDate).getTime();
            this.result.proposal.submissionDate = new Date(this.proposalDataBindObj.sponsorDeadlineDate).getTime();
            this.result.proposal.internalDeadLineDate = new Date(this.proposalDataBindObj.internalDeadlineDate).getTime();
            this.mandatoryObj.ismandatory = false;
            this.updateAttachmentStatus();
            this._proposalService.saveProposal({'proposal': this.result.proposal,
              'updateType': TYPE, 'personId': localStorage.getItem( 'personId' )}).subscribe( data => {
                this.result = data;
                // if (this.result.proposal.statusCode === 2 && saveType !== 'autoSave') {
                //   let isDocCompleted = false;
                //   for (const DOCUMENT of this.result.proposal.proposalAttachments) {
                //       if (DOCUMENT.narrativeStatusCode === 'C' ) {
                //         isDocCompleted = true;
                //       } else {
                //         isDocCompleted = false;
                //         break;
                //       }
                //   }
                //   if (isDocCompleted) {
                //     this.isNotifyApprover = true;
                //   }
                // }
            },
            err  => {},
            () => {
              if (saveType === 'autoSave') {
                const toastId      = document.getElementById('toast-success-proposal');
                this.toast_message = 'Changes has been saved automatically ';
                toastId.className = 'show';
                setTimeout(function () {
                toastId.className = toastId.className.replace('show', '');
                }, 2000);
              } else if (saveType === 'partialSave') {
                this.showTab('BUDGET');
              } else {
                this.showOrHideDataFlagsObj.isShowSaveSuccessModal = true;
                document.getElementById('openSucessModal').click();
              }
          });
    }
  }

  updateAttachmentStatus() {
    for (const attachment of this.result.proposal.proposalAttachments) {
      const attachmentStatusObj = this.result.narrativeStatus.find( status =>
                                  status.description === attachment.narrativeStatus.description);
      attachment.narrativeStatus = attachmentStatusObj;
      attachment.narrativeStatusCode = attachmentStatusObj.code;
    }
  }

  closeWarningModal() {
    this.showOrHideDataFlagsObj.isShowSaveWarningModal = false;
    this.showOrHideDataFlagsObj.isShowSaveSuccessModal = false;
    this.showOrHideDataFlagsObj.isShowSubmitSuccessModal = false;
    this.showOrHideDataFlagsObj.isShowSubmitWarningModal = false;
    this.warningMsgObj.submitConfirmation = null;
    this.warningMsgObj.submitWarningMsg = null;
  }

  copyProposal(event) {
    event.preventDefault();
    this.result.userFullName = localStorage.getItem('currentUser');
    this.result.proposal.updateUser = localStorage.getItem('currentUser');
    this._proposalService.copyProposal(this.result).subscribe(success => {
    let temryProposalObj: any = {};
    temryProposalObj = success;
      this._router.navigate(['/fibi/proposal'], { queryParams: { 'proposalId': temryProposalObj.proposal.proposalId }});
      window.location.reload();
    });
  }

  checkSubmitProposalValidation() {
    this.proposalValidation();
    if (this.mandatoryObj.field != null || this.warningMsgObj.personWarningMsg != null || this.warningMsgObj.dateWarningText != null) {
      this.showOrHideDataFlagsObj.isShowSaveWarningModal = true;
    } else if (this.result.proposal.proposalAttachments.length === 0) {
      this.showOrHideDataFlagsObj.isShowSubmitWarningModal = true;
      this.warningMsgObj.submitWarningMsg = 'Please add atleast one supporting document to submit the proposal.';
    } else {
      this.showOrHideDataFlagsObj.isShowSubmitWarningModal = true;
      this.warningMsgObj.submitConfirmation = 'Are you sure you want to submit this proposal?';
    }
  }

  submitProposal() {
    this.result.proposal.updateTimeStamp = new Date().getTime();
    this.result.proposal.updateUser = localStorage.getItem('currentUser');
    this.result.proposal.submitUser = localStorage.getItem('currentUser');
    this.updateAttachmentStatus();
    this._proposalService.submitProposal({'proposal': this.result.proposal, 'userName': localStorage.getItem( 'currentUser' ),
    'personId': localStorage.getItem( 'personId' ), 'proposalStatusCode': this.result.proposalStatusCode}).subscribe( data => {
      let tempryProposalObj: any = {};
      tempryProposalObj = data;
      this.result = tempryProposalObj;
      this.result.workflow = tempryProposalObj.workflow;
      // this.updateWorkflowStops();
      // this.updateRouteLogHeader();
      // this.isDeclarationSectionRequired = this.result.isDeclarationSectionRequired;
    },
    err => {},
    () => {
      this.showOrHideDataFlagsObj.isShowSubmitSuccessModal = true;
      document.getElementById('openSucessModal').click();
      this.showOrHideDataFlagsObj.mode = 'view';
    } );
  }

  printProposal(event) {
    event.preventDefault();
      this._proposalService.printProposal(this.result.proposal.proposalId).subscribe(
        data => {
          const temp: any = data || {};
          const printProposalDataElement = document.createElement('a');
          printProposalDataElement.href = URL.createObjectURL(temp);
          printProposalDataElement.download = this.result.proposal.title;
          printProposalDataElement.click();
        });
    }

  ngOnDestroy() {
    this.autoSave_subscription.unsubscribe();
  }
}
