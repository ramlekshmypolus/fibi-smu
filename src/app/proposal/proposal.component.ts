import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';

import { ProposalService } from './services/proposal.service';
import { CommonService } from '../common/services/common.service';
import { ProposalBudgetService } from './proposal-budget/proposal-budget.service';
import { QuestionnaireService } from './questionnaire/questionnaire.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit, OnDestroy {

  @ViewChild( 'moreOptionsBtn' ) moreOptions: ElementRef;

  result: any = {};
  showOrHideDataFlagsObj: any = {
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
    isAttachmentEditable: true,
    periodWithoutDate: null,
    isAttachmentVersionOpen: []
  };

  isShowMoreOptions = false;
  isShowPreReviewModalOptions = false;
  isPreReviewExist = false;
  isReviewMandatoryFilled = true;
  isQuestionnaireComplete = false;
  isApplyRates = false;
  isRequestNewReviewerOpen = false;

  toast_message = '';
  rate_toast_message = '';
  clearField;
  superUser = localStorage.getItem( 'superUser');
  tempSavecurrentTab: string;
  selectedRateClassType = '';

  selectedReviewAttachment = [];
  isReviewTypeOpen = [];
  uploadedFile = [];
  applicableQuestionnaire = [];

  warningMsgObj: any = {};
  proposalDataBindObj: any = {
    successModalHeader: 'Success'
  };
  mandatoryObj: any = {};
  addPreReviewerObj: any = {};
  elasticSearchOptions: any = {};
  requestObject: any = {};
  showApproveDisapproveModal: any = {};

  versionHistorySelected: number;
  workflowDetailsMap: any = [];
  selectedAttachmentStop: any = [];
  commentsApproverExpand: any = {};
  budgetOverviewDateObj: any = {};
  budgetPeriodsDateObj: any = {};

  private autoSave_subscription: ISubscription;

  constructor( private _route: ActivatedRoute, private _proposalService: ProposalService, private _spinner: NgxSpinnerService,
    private _router: Router, private _commonService: CommonService, private _questionnaireService: QuestionnaireService,
    private _proposalBudgetService: ProposalBudgetService) {
    document.addEventListener( 'mouseup', this.offClickHandler.bind( this ) );
    this.autoSave_subscription = Observable.interval(1000 * 120).subscribe(x => {
      if (this.result.proposal.proposalId !== null && this.showOrHideDataFlagsObj.dataChangeFlag &&
          this.result.proposal.statusCode !== 11 && this.showOrHideDataFlagsObj.isAttachmentEditable) {
          this.saveProposal('autoSave');
      }
    });
   }

  ngOnInit() {
    this.elasticSearchOptions.url   = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'fibiperson';
    this.elasticSearchOptions.type  = 'person';
    this.elasticSearchOptions.size  = 20;
    this.elasticSearchOptions.contextField = 'full_name';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      full_name: {},
      prncpl_nm: {}
    };
    this.result = this._route.snapshot.data.proposalDetails;
    this._spinner.hide();
    /** added to naviagate to proposal home if user is in create budget page and automatically loggs out due to session timeout */
    if (this.showOrHideDataFlagsObj.currentTab !== 'PROPOSAL_HOME' && this.result.proposal.proposalId == null) {
      this.showOrHideDataFlagsObj.currentTab = 'PROPOSAL_HOME';
    }
    if (this._route.snapshot.queryParamMap.get('proposalId') == null) {
      this.showOrHideDataFlagsObj.mode = 'create';
    } else {
        if (this.result.proposal.statusCode === 2 || this.result.proposal.statusCode === 11) {
            this.showOrHideDataFlagsObj.mode = 'view';
        } else {
            this.showOrHideDataFlagsObj.mode = 'edit';
        }
    }
    this.initialiseProposalFormElements();
  }

  showTab(currentTab) {
    this.tempSavecurrentTab = currentTab;
    if (currentTab === 'BUDGET' && this.result.proposal.budgetHeader == null) {
      if (this.result.proposal.proposalId != null ) {
        this._proposalService.createProposalBudget({'userName': localStorage.getItem('currentUser'),
        'userFullName': localStorage.getItem('userFullname'), 'proposal': this.result.proposal})
          .subscribe( data => {
            let tempryProposalObj: any = {};
			      /*no full update: for getting objects in VO that dosen't get returned in craeteBudget call */
            tempryProposalObj = data;
            this.result.proposal = tempryProposalObj.proposal;
            this.result.sysGeneratedCostElements = tempryProposalObj.sysGeneratedCostElements;
            this.result.tbnPersons = tempryProposalObj.tbnPersons;
            this.result.rateClassTypes = tempryProposalObj.rateClassTypes;
            this.showOrHideDataFlagsObj.currentTab = currentTab;
            localStorage.setItem('currentTab', currentTab);
            this.timeStampToBudgetDates();
          });
      } else {
        this.saveProposal('partialSave');
      }
    } else if (currentTab === 'QUESTIONNAIRE' && this.result.proposal.proposalId == null) {
        this.saveProposal('partialSave');
    } else {
        if (this.showOrHideDataFlagsObj.dataChangeFlag) {
          this.showOrHideDataFlagsObj.isSaveOnTabSwitch = true;
        } else {
          this.showOrHideDataFlagsObj.currentTab = currentTab;
          localStorage.setItem('currentTab', currentTab);
        }
      }
  }

  offClickHandler( event: any ) {
    if ( !this.moreOptions.nativeElement.contains( event.target ) ) {
        this.isShowMoreOptions = false;
    }
  }

  initialiseProposalFormElements() {
    this.proposalDataBindObj.proposalStartDate = this.result.proposal.startDate === null ? null : new Date(this.result.proposal.startDate);
    this.proposalDataBindObj.proposalEndDate = this.result.proposal.endDate === null ? null : new Date(this.result.proposal.endDate);
    this.proposalDataBindObj.sponsorDeadlineDate = this.result.proposal.submissionDate === null ?
      null : new Date(this.result.proposal.submissionDate);
    this.proposalDataBindObj.internalDeadlineDate = this.result.proposal.internalDeadLineDate === null ?
      null : new Date(this.result.proposal.internalDeadLineDate);
    this.proposalDataBindObj.selectedResearchType = this.result.proposalResearchTypes === null ?
      null : this.result.proposalResearchTypes[0].description;
    this.proposalDataBindObj.selectedAreaType = this.result.proposalResearchTypes === null ?
      null : this.result.proposalResearchTypes[0].description;
    if ( this.requestObject.actionType === 'R' ) {
      this.showOrHideDataFlagsObj.mode = 'edit';
    }
    this.timeStampToBudgetDates();
    this.proposalDataBindObj.selectedProposalType = ( this.result.proposal.proposalType != null ) ?
                            this.result.proposal.proposalType.description : null;
    this.proposalDataBindObj.selectedProposalCategory = ( this.result.proposal.activityType != null ) ?
                            this.result.proposal.activityType.description : null;
    // set default grantCallType to Others if no grant call is associated with the proposal
    if (this.result.proposal.grantCallType == null) {
      this.result.proposal.grantCallType = this.result.defaultGrantCallType;
      this.result.proposal.grantTypeCode = this.result.defaultGrantCallType.grantTypeCode;
    } else if (this.result.proposal.grantCall != null) {
      this.result.proposal.grantCallType = this.result.proposal.grantCall.grantCallType;
      this.result.proposal.grantTypeCode = this.result.proposal.grantCall.grantCallType.grantTypeCode;
    } else if (this.result.proposal.grantCall == null) { }
    if (this.result.proposal.proposalStatus.statusCode !== 11) {
        this.showOrHideDataFlagsObj.isAttachmentEditable = (this.result.isProposalPerson === true ||
          localStorage.getItem('currentUser') === this.result.proposal.createUser ||
          localStorage.getItem('isAdmin') === 'true' ) ? true : false;
      if ((this.showOrHideDataFlagsObj.mode !== 'create') &&
        (this.result.proposal.proposalStatus.statusCode === 3 || this.result.proposal.proposalStatus.statusCode === 1)) {
        this.showOrHideDataFlagsObj.mode = (this.result.isProposalPerson === true ||
          localStorage.getItem('currentUser') === this.result.proposal.createUser ||
          localStorage.getItem('isAdmin') === 'true' ) ? 'edit' : 'view';
      }
    } else { this.showOrHideDataFlagsObj.isAttachmentEditable = false; }
    this.updateWorkflowStops();
  }

  // proposal details validation
  proposalValidation() {
    this.mandatoryObj.field = null;
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
    }
    if ( this.result.proposal.proposalPersons.length > 0 ) {
      const PIExists = this.result.proposal.proposalPersons.find( role => role.proposalPersonRole.description === 'Principal Investigator');
      this.warningMsgObj.personWarningMsg = PIExists == null ? '* Select a member as PI' : null;
    } else {
        this.warningMsgObj.personWarningMsg = '* Select atleast one team member';
    }
    if (this.result.proposal.proposalId && this.result.proposal.budgetHeader != null) {
      this.setProposalBudgetDetails();
    }
  }

  openGoBackModal() {
    if (this.showOrHideDataFlagsObj.dataChangeFlag) {
      this.showOrHideDataFlagsObj.isShowSaveBeforeExitWarning = true;
    } else {
      this._router.navigate(['/fibi/dashboard/proposalList']);
    }
  }

  closeGoBackModal() {
    this.showOrHideDataFlagsObj.isShowSaveBeforeExitWarning = false;
    $('#warning-modal').modal('hide');
    this._router.navigate(['/fibi/dashboard/proposalList']);
  }

  saveProposal(saveType) {
    this.closeWarningModal();
    // preserve showOrHideDataFlagsObj.isShowSaveSuccessModal value if autosave to show message in popup else make it false
    this.showOrHideDataFlagsObj.isShowSaveSuccessModal = (saveType === 'autoSave') ?
                                                          this.showOrHideDataFlagsObj.isShowSaveSuccessModal : false;
    const isMandatoryFilled = this.checkMandatoryFilled();
    if (isMandatoryFilled) {
      /** call save proposal only if there is a change in data */
      if (this.showOrHideDataFlagsObj.dataChangeFlag) {
        const TYPE = ( this.result.proposal.proposalId != null ) ? 'UPDATE' : 'SAVE';
        if (TYPE === 'SAVE') {
          this.result.proposal.createUser = localStorage.getItem('currentUser');
        }
        this.result.proposal.createTimeStamp = new Date().getTime();
        this.result.proposal.updateUser = localStorage.getItem('currentUser');
        this.result.proposal.updateTimeStamp = new Date().getTime();
        this.result.proposal.startDate = new Date(this.proposalDataBindObj.proposalStartDate).getTime();
        this.result.proposal.endDate = new Date(this.proposalDataBindObj.proposalEndDate).getTime();
        this.result.proposal.submissionDate = new Date(this.proposalDataBindObj.sponsorDeadlineDate).getTime();
        this.result.proposal.internalDeadLineDate = new Date(this.proposalDataBindObj.internalDeadlineDate).getTime();
        this.updateAttachmentStatus();
        this._proposalService.saveProposal({'proposal': this.result.proposal,
        'updateType': TYPE, 'personId': localStorage.getItem( 'personId' )}).subscribe( data => {
          // when route log is open and autosave happens version changes automatically, so update only proposal obj
          let tempProposalData: any = {};
          tempProposalData = data;
          this.result.proposal = tempProposalData.proposal;
          this.result.rateClassTypes = tempProposalData.rateClassTypes;
          this.showOrHideDataFlagsObj.dataChangeFlag = false;
        },
        err => {
          $('#warning-modal').modal('hide');
          this.warningMsgObj.errorMsg = 'Error in saving proposal';
          document.getElementById('openSucessModal').click();
        },
        () => {
          this.showOrHideDataFlagsObj.isAttachmentVersionOpen = [];
          if (saveType === 'autoSave') {
            const toastId      = document.getElementById('toast-success-proposal');
            this.toast_message = 'Changes has been saved automatically ';
            toastId.className = 'show';
            setTimeout(function () {
            toastId.className = toastId.className.replace('show', '');
            }, 2000);
          } else if (saveType === 'partialSave') {
            this.showTab(this.tempSavecurrentTab);
          } else if (saveType === 'promptSave') {
            $('#saveAndExitModal').modal('hide');
            this._router.navigate(['/fibi/dashboard/proposalList']);
          } else if (saveType === 'saveOnTabSwitch') {
            $('#warning-modal').modal('hide');
            this.showTab(this.tempSavecurrentTab);
          } else {
            this.showOrHideDataFlagsObj.isShowSaveSuccessModal = true;
            this.proposalDataBindObj.successMessage = 'Proposal has been saved successfully.';
            this.proposalDataBindObj.isSaved = true;
            document.getElementById('openSucessModal').click();
          } if (this.result.proposal.proposalId && this.result.proposal.budgetHeader != null) {
            this.timeStampToPeriodDates();
          }
        });
      } else {
        this.showOrHideDataFlagsObj.isShowSaveSuccessModal = true;
        this.proposalDataBindObj.successModalHeader = 'Save';
        this.proposalDataBindObj.successMessage = 'There are no changes made to be saved.';
        this.proposalDataBindObj.isSaved = false;
        document.getElementById('openSucessModal').click();
      }
    }
  }

  openNotifyApprover() {
    if (this.result.proposal.statusCode === 2) {
      let isDocCompleted = false;
      const docStatus = this.result.proposal.proposalAttachments.find( attachObj =>
                        attachObj.narrativeStatusCode === 'I' && attachObj.documentStatusCode === 1 );
      isDocCompleted = docStatus != null ? false : true;
      if (isDocCompleted) {
        this.showOrHideDataFlagsObj.isShowNotifyApprover = true;
        document.getElementById('openWarningModal').click();
      }
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
    $('#warning-modal').modal('hide');
    $('#successModal').modal('hide');
    $('#saveAndExitModal').modal('hide');
    this.showOrHideDataFlagsObj.isShowSaveWarningModal = false;
    this.showOrHideDataFlagsObj.isShowSaveSuccessModal = false;
    this.showOrHideDataFlagsObj.isShowSuccessModal = false;
    this.showOrHideDataFlagsObj.isShowSubmitWarningModal = false;
    this.showOrHideDataFlagsObj.isShowSaveBeforeExitWarning = false;
    this.showOrHideDataFlagsObj.isShowNotifyApprover = false;
    this.showOrHideDataFlagsObj.isSaveOnTabSwitch = false;
    this.warningMsgObj.submitConfirmation = null;
    this.warningMsgObj.submitWarningMsg = null;
    this.warningMsgObj.errorMsg = null;
    this.proposalDataBindObj.successModalHeader = 'Success';
    this.proposalDataBindObj.successMessage = null;
  }

  closeSaveAndExitModal() {
    const isMandatoryFilled = this.checkMandatoryFilled();
    if (isMandatoryFilled) {
      this.showOrHideDataFlagsObj.dataChangeFlag = false;
      this.showTab(this.tempSavecurrentTab);
    }
  }

  copyProposal(event) {
    event.preventDefault();
    this.result.userFullName = localStorage.getItem('userFullname');
    this.result.proposal.updateUser = localStorage.getItem('currentUser');
    this._commonService.copyProposal(this.result).subscribe(success => {
    let temryProposalObj: any = {};
    temryProposalObj = success;
      this._router.navigate(['/fibi/proposal'], { queryParams: { 'proposalId': temryProposalObj.proposal.proposalId }});
      window.location.reload();
    });
  }

  checkMandatoryFilled() {
    this.proposalValidation();
    if (this.mandatoryObj.field != null || this.warningMsgObj.personWarningMsg != null || this.warningMsgObj.dateWarningText != null) {
      document.getElementById('openWarningModal').click();
      this.showOrHideDataFlagsObj.isShowSaveWarningModal = true;
      this.showOrHideDataFlagsObj.isShowSaveBeforeExitWarning = false;
      return false;
    }
     return true;
  }

  checkSubmitProposalValidation() {
    this.closeWarningModal();
    const isMandatoryFilled = this.checkMandatoryFilled();
    if (isMandatoryFilled) {
      if (this.result.proposal.proposalAttachments.length === 0) {
        this.showOrHideDataFlagsObj.isShowSubmitWarningModal = true;
        this.warningMsgObj.submitWarningMsg = 'Please add atleast one supporting document to submit the proposal.';
        document.getElementById('openWarningModal').click();
      } else {
          this.checkQuestionnaireCompletion();
      }
    }
  }

  checkQuestionnaireCompletion() {
    this._questionnaireService.getApplicableQuestionnaire({'module_sub_item_code': 0, 'module_sub_item_key': 0,
      'module_item_code': 3, 'module_item_key': this.result.proposal.proposalId}).subscribe(data => {
      let tempryQuestionnaireObj: any = {};
      tempryQuestionnaireObj = data;
      this.applicableQuestionnaire = tempryQuestionnaireObj.applicableQuestionnaire;
    }, err => {},
    () => {
      let humanSubjectQuestionnaire: any = {};
      let questionnaireComplete: any = {};
      humanSubjectQuestionnaire = this.result.proposal.propSpecialReviews.find(PROPOSAL_INDEX =>
                                  PROPOSAL_INDEX.specialReviewTypeCode === '1' || PROPOSAL_INDEX.specialReviewTypeCode === '13' ||
                                  PROPOSAL_INDEX.specialReviewTypeCode === '15');
      if (humanSubjectQuestionnaire != null) {
        questionnaireComplete = this.applicableQuestionnaire.find(questionnaireIndex => questionnaireIndex.RULE_ID != null &&
          (questionnaireIndex.QUESTIONNAIRE_COMPLETED_FLAG === 'N' || questionnaireIndex.QUESTIONNAIRE_COMPLETED_FLAG == null));
      } else {
        questionnaireComplete = this.applicableQuestionnaire.find(questionnaireIndex => questionnaireIndex.RULE_ID == null &&
          (questionnaireIndex.QUESTIONNAIRE_COMPLETED_FLAG === 'N' || questionnaireIndex.QUESTIONNAIRE_COMPLETED_FLAG == null));
      }
      this.isQuestionnaireComplete = questionnaireComplete != null ? false : true;
      if (!this.isQuestionnaireComplete) {
        this.showOrHideDataFlagsObj.isShowSubmitWarningModal = true;
        this.warningMsgObj.submitWarningMsg = 'Please complete the Questionnaires before submitting proposal.';
      } else {
        this.showOrHideDataFlagsObj.isShowSubmitWarningModal = true;
        this.warningMsgObj.submitConfirmation = 'Are you sure you want to submit this proposal?';
      }
      document.getElementById('openWarningModal').click();
    });
  }

  submitProposal() {
    this.warningMsgObj.errorMsg = null;
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
      this.updateWorkflowStops();
    },
    err => {
      $('#warning-modal').modal('hide');
      this.warningMsgObj.errorMsg = 'Error in submitting proposal';
      document.getElementById('openSucessModal').click();
      },
    () => {
      this.showOrHideDataFlagsObj.isAttachmentVersionOpen = [];
      $('#warning-modal').modal('hide');
      this.showOrHideDataFlagsObj.isShowSuccessModal = true;
      this.proposalDataBindObj.successModalHeader = 'Submit Proposal';
      this.proposalDataBindObj.successMessage = 'Proposal has been submitted successfully';
      document.getElementById('openSucessModal').click();
      this.showOrHideDataFlagsObj.mode = 'view';
    } );
  }

  printPage(event, printPage) {
    event.preventDefault();
    if (printPage === 'BUDGET') {
      this._proposalBudgetService.printBudget(this.result.proposal.proposalId).subscribe(
        data => {
          this.parsePrintedPage(data);
        });
    } else if (printPage === 'PROPOSAL') {
      this._proposalService.printProposal(this.result.proposal.proposalId).subscribe(
        data => {
          this.parsePrintedPage(data);
        });
    }
   }

  parsePrintedPage(data) {
    const tempData: any = data || {};
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob( new Blob([data], { type: 'application/pdf' }), this.result.proposal.title + '.pdf' );
      } else {
        const printBudgetElement = document.createElement( 'a' );
        document.body.appendChild(printBudgetElement);
        printBudgetElement.href = URL.createObjectURL( tempData );
        printBudgetElement.download = this.result.proposal.title;
        printBudgetElement.click();
      }
  }

  printProposal(event) {
    event.preventDefault();
      this._proposalService.printProposal(this.result.proposal.proposalId).subscribe(
        data => {
          const tempData: any = data || {};
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob( new Blob([data], { type: 'application/pdf' }), this.result.proposal.title + '.pdf' );
          } else {
            const printProposalDataElement = document.createElement('a');
            printProposalDataElement.href = URL.createObjectURL(tempData);
            printProposalDataElement.download = this.result.proposal.title;
            printProposalDataElement.click();
          }
        });
    }

  getPreReview() {
    this.addPreReviewerObj = {};
    this.addPreReviewerObj.preReviewType = null;
    if (this.result.proposal.proposalPreReviews != null) {
      if (this.result.proposal.proposalPreReviews.length <= 0) {
        this.isShowPreReviewModalOptions = true;
      } else {
        this.isShowPreReviewModalOptions = false;
        this.result.proposal.proposalPreReviews.forEach((reviews, reviewsIndex) => {
          this.selectedReviewAttachment[reviewsIndex] = [];
            reviews.proposalPreReviewComments.forEach((value, index) => {
            if (value.proposalPreReviewAttachments.length !== 0) {
              this.selectedReviewAttachment[reviewsIndex][index] = value.proposalPreReviewAttachments[0].fileName;
            }
          });
        });
      }
    }
  }

  showRequestNewReview() {
    this.isShowPreReviewModalOptions = !this.isShowPreReviewModalOptions;
    this.isReviewMandatoryFilled = true;
    this.isPreReviewExist = false;
    this.addPreReviewerObj = {};
    this.addPreReviewerObj.preReviewType = null;
  }

  selected( value ) {
    if ( value != null) {
        this.addPreReviewerObj.reviewerPersonId = value.prncpl_id;
        this.addPreReviewerObj.reviewerFullName = value.full_name;
        this.addPreReviewerObj.reviewerEmailAddress = value.email_addr;
    } else {
        this.addPreReviewerObj.reviewerPersonId = null;
        this.addPreReviewerObj.reviewerFullName = null;
        this.addPreReviewerObj.reviewerEmailAddress = null;
    }
  }

  closePreReviewModal() {
    this.addPreReviewerObj = {};
    this.isShowPreReviewModalOptions = false;
    this.selectedReviewAttachment = [];
    this.isReviewTypeOpen = [];
    this.isReviewMandatoryFilled = true;
    this.isPreReviewExist = false;
  }

  addPreReviewer() {
    this.isReviewMandatoryFilled = true;
    this.isPreReviewExist = false;
    if ( this.addPreReviewerObj.preReviewType == null || this.addPreReviewerObj.preReviewType === 'null' ||
        this.addPreReviewerObj.requestorComment == null || this.addPreReviewerObj.requestorComment === '' ||
        this.addPreReviewerObj.reviewerPersonId == null) {
        this.isReviewMandatoryFilled = false;
     } else {
      this.addPreReviewerObj.reviewTypeCode = this.addPreReviewerObj.preReviewType.reviewTypeCode;
      this.addPreReviewerObj.proposalId = this.result.proposal.proposalId;
      this.addPreReviewerObj.requestorPersonId = localStorage.getItem('personId');
      this.addPreReviewerObj.requestorFullName = localStorage.getItem('userFullname');
      this.addPreReviewerObj.requestorEmailAddress = localStorage.getItem('userEmailId');
      this.addPreReviewerObj.requestDate = new Date().getTime();
      this.addPreReviewerObj.updateTimeStamp = new Date().getTime();
      this.addPreReviewerObj.updateUser = localStorage.getItem( 'currentUser' );
      this._proposalService.createProposalPreReview ({'proposal': this.result.proposal,
        'newProposalPreReview': this.addPreReviewerObj, 'personId': localStorage.getItem( 'personId' )})
        .subscribe( data => {
          // tslint:disable-next-line:no-construct
          this.clearField = new String('true');
          let temp: any = {};
          temp = data || [];
          this.showOrHideDataFlagsObj.isAttachmentVersionOpen = [];
          if (temp.proposal.preReviewExist) {
            this.isPreReviewExist = true;
          } else {
            this.result.proposal = temp.proposal;
            this.addPreReviewerObj = {};
            this.addPreReviewerObj.preReviewType = null;
            this.isShowPreReviewModalOptions = false;
          }
        });
     }
  }

  downloadReviewAttachment( event, selectedFileName, selectedAttachArray: any[] ) {
    event.preventDefault();
      for ( const ATTACHMENT of selectedAttachArray ) {
        if ( ATTACHMENT.fileName === selectedFileName ) {
          this._proposalService.downloadPreReviewAttachment( ATTACHMENT.preReviewAttachmentId )
          .subscribe(
            data => {
              if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob( new Blob([data], { type: ATTACHMENT.mimeType }), ATTACHMENT.fileName );
              } else {
                  const a = document.createElement( 'a' );
                  a.href = URL.createObjectURL( data );
                  a.download = ATTACHMENT.fileName;
                  a.click();
              }
            } );
        }
      }
  }

  updatePreReviewAttachmentSelectbox() {
    this.result.proposal.reviewerReview.proposalPreReviewComments.forEach((value, index) => {
      if (value.proposalPreReviewAttachments.length !== 0) {
        this.selectedReviewAttachment[index] = value.proposalPreReviewAttachments[0].fileName;
      }
    });
  }

  fileDrop(files) {
    this.warningMsgObj.attachmentWarningMsg = null;
    let dupCount = 0;
    for (let index = 0; index < files.length; index++) {
      if (this.uploadedFile.find(dupFile => dupFile.name === files[index].name) != null) {
        dupCount = dupCount + 1;
        this.warningMsgObj.attachmentWarningMsg = '* ' + dupCount + ' File(s) already added';
      } else {
        this.uploadedFile.push(files[index]);
      }
    }
  }

  deleteFromUploadedFileList(index) {
    this.uploadedFile.splice(index, 1);
    this.warningMsgObj.attachmentWarningMsg = null;
  }

  addPreReview() {
    this.isReviewMandatoryFilled = true;
    if (this.addPreReviewerObj.reviewComment == null || this.addPreReviewerObj.reviewComment === '') {
      this.isReviewMandatoryFilled = false;
    } else {
      this.addPreReviewerObj.proposalId = this.result.proposal.proposalId;
      this.addPreReviewerObj.updateTimeStamp = new Date().getTime();
      this.addPreReviewerObj.updateUser = localStorage.getItem('currentUser');
      this.result.proposal.reviewerReview.proposalPreReviewComments.push(this.addPreReviewerObj);

      const formData = new FormData();
      for ( let i = 0; i < this.uploadedFile.length; i++ ) {
          formData.append( 'files', this.uploadedFile[i] );
      }
      const sendObject = {
          proposal: this.result.proposal,
          userName: localStorage.getItem( 'currentUser' )
      };
      formData.append( 'formDataJson', JSON.stringify( sendObject ) );

      this._proposalService.addPreReviewComment( formData ).subscribe( success => {
          let temporaryObject: any = {};
          temporaryObject = success;
          this.result.proposal = temporaryObject.proposal;
          this.updatePreReviewAttachmentSelectbox();
          this.clearPreReviewDatas();
      });
    }
  }

  approveDisapprovePreReview(actionType) {
    this.warningMsgObj.errorMsg = null;
    this._proposalService.approveOrDisapprovePreReview( {'proposal': this.result.proposal,
      'actionType': actionType, 'personId': localStorage.getItem( 'personId' )} ).subscribe( success => {
    let temporaryObject: any = {};
    temporaryObject = success;
    this.result.proposal = temporaryObject.proposal;
    this.updatePreReviewAttachmentSelectbox();
    this.clearPreReviewDatas();
    }, err => {
        $('#completePreReviewModal').modal('hide');
        this.warningMsgObj.errorMsg = 'Error in approve/disapprove pre-review';
        document.getElementById('openSucessModal').click();
      },
    () => { this.showOrHideDataFlagsObj.isAttachmentVersionOpen = [];
      $('#completePreReviewModal').modal('hide'); });
  }

  clearPreReviewDatas() {
    this.addPreReviewerObj = {};
    this.uploadedFile = [];
    this.isReviewMandatoryFilled = true;
  }

  /* approve proposal */
  approveProposal() {
    this.checkPreReviewCompletion();
    this.proposalDataBindObj.modalAproveHeading = 'Approve';
    this.showApproveDisapproveModal.isReadyToApprove = false;
    if (!this.showApproveDisapproveModal.isPrereviewCompletionRequired) {
      this.requestObject = {};
      this.requestObject.actionType = 'A';
      this.checkSuperUserIsFinalApprover();
      this.showApproveDisapproveModal.isAttachmentIncomplete = false;
      if ((this.result.finalApprover && this.result.isApproved === false) ||
            (this.superUser && this.showApproveDisapproveModal.isLastApproval) ) {
        const attachments = this.result.proposal.proposalAttachments.find(attachment =>
                                                  attachment.narrativeStatus.code === 'I' && attachment.documentStatusCode === 1);
        this.showApproveDisapproveModal.isAttachmentIncomplete = (attachments != null) ? true : false;
        this.showApproveDisapproveModal.isReadyToApprove =  this.showApproveDisapproveModal.isAttachmentIncomplete === true ? false : true;
      } else {
        this.showApproveDisapproveModal.isReadyToApprove = true;
      }
    }
  }

  /* checking whether superuser is final approver or not */
  checkSuperUserIsFinalApprover() {
    let lastStop: any;
    lastStop = this.result.workflow.workflowDetailMap[Object
      .keys(this.result.workflow.workflowDetailMap)[Object.keys(this.result.workflow.workflowDetailMap).length - 1]];
      this.showApproveDisapproveModal.isLastApproval = lastStop.filter(stop => stop.approvalStatusCode === 'W').length > 0 ? true : false;
  }

  /* disapprove proposal */
  disapproveProposal() {
    this.showApproveDisapproveModal.isReadyToApprove = true;
    this.requestObject = {};
    this.proposalDataBindObj.modalAproveHeading = 'Disapprove';
    this.requestObject.actionType = 'R';
  }

  /* checking whether any prereview exists with inprogress status */
  checkPreReviewCompletion() {
    this.showApproveDisapproveModal.isPrereviewCompletionRequired = false;
    this.checkSuperUserIsFinalApprover();
    if (this.result.finalApprover && this.result.isPreReviewCompletionRequired ||
                (this.superUser && this.showApproveDisapproveModal.isLastApproval) ) {
      const prereviews = this.result.proposal.proposalPreReviews.find(prereview => prereview.preReviewStatus.reviewStatusCode === '1');
      this.showApproveDisapproveModal.isPrereviewCompletionRequired = (prereviews != null) ? true : false;
    }
  }

  /* approves or disapproves proposal */
  approveDisapproveProposal() {
    this.warningMsgObj.errorMsg = null;
    this.requestObject.personId = localStorage.getItem('personId');
    this.requestObject.proposalId = this.result.proposal.proposalId;
    this.requestObject.isSuperUser = this.superUser;
    this.requestObject.approverStopNumber = this.result.approverStopNumber;
    const approveFormData = new FormData();

    for ( let i = 0; i < this.uploadedFile.length; i++ ) {
      approveFormData.append( 'files', this.uploadedFile[i] );
    }
    approveFormData.append( 'formDataJson', JSON.stringify( this.requestObject ) );
    this._proposalService.approveDisapproveProposal(approveFormData ).subscribe(data => {
      let temp: any = {};
      temp = data;
      this.result = temp;
      this.initialiseProposalFormElements();
    },
    err => {
      $('#approveDisapproveModal').modal('hide');
      this.closeApproveDisapproveModal();
      this.warningMsgObj.errorMsg = 'Error in approve/disapprove proposal';
      document.getElementById('openSucessModal').click();
     },
    () => {
      this.showOrHideDataFlagsObj.isAttachmentVersionOpen = [];
      $('#approveDisapproveModal').modal('hide');
      this.showOrHideDataFlagsObj.isShowSuccessModal = true;
      if (this.requestObject.actionType === 'A') {
        this.proposalDataBindObj.successMessage = this.superUser === 'true' && !this.result.isApprover ?
                    'Proposal has been approved successfully by SuperUser.' :
                    (this.superUser === 'true' && this.result.isApprover || this.superUser === 'false' && this.result.isApprover) ?
                    'Proposal has been approved successfully' : null ;
      } else if (this.requestObject.actionType === 'R') {
        this.proposalDataBindObj.successMessage = this.superUser === 'true' && !this.result.isApprover ?
                    'Proposal has been disapproved successfully by SuperUser.' :
                    (this.superUser  === 'true' && this.result.isApprover || this.superUser === 'false' && this.result.isApprover) ?
                    'Proposal has been disapproved successfully' : null  ;
      }
      document.getElementById('openSucessModal').click();
      this.closeApproveDisapproveModal();
    });
  }

  openRouteLog() {
    this.versionHistorySelected = this.result.workflow.workflowSequence;
    this.routeLogVersionChange();
    this.showOrHideDataFlagsObj.isShowRouteLogModal = true;
  }

  updateWorkflowStops() {
    this.workflowDetailsMap = [];
    if ( this.result.workflow != null && this.result.workflow.workflowDetails.length > 0 ) {
        for (const KEY in this.result.workflow.workflowDetailMap) {
          if (this.result.workflow.workflowDetailMap[KEY] !== null) {
            const value = this.result.workflow.workflowDetailMap[KEY];
            this.workflowDetailsMap.push(value);
          }
        }
    }
  }

  routeLogVersionChange() {
    const WORKFLOW = this.result.workflowList.find(workflow => workflow.workflowSequence.toString() ===
                                                             this.versionHistorySelected.toString());
    if (WORKFLOW != null) {
      this.workflowDetailsMap = [];
      for (const KEY in WORKFLOW.workflowDetailMap) {
        if (KEY != null) {
        const value = WORKFLOW.workflowDetailMap[KEY];
        this.workflowDetailsMap.push(value);
        }
      }
    }
    this.updateWorkflowattachments();
  }

  updateWorkflowattachments () {
    this.workflowDetailsMap.forEach(( value, index ) => {
      this.selectedAttachmentStop[index] = [];
      value.forEach(( workFlowValue, valueIndex ) => {
          if ( workFlowValue.workflowAttachments != null && workFlowValue.workflowAttachments.length > 0 ) {
            this.selectedAttachmentStop[index][valueIndex] = workFlowValue.workflowAttachments[0].fileName;
          }
      });
    });
  }

  downloadRouteAttachment( event, selectedFileName, selectedAttachArray: any[] ) {
    event.preventDefault();
    const attachment = selectedAttachArray.find(attachmentDetail => attachmentDetail.fileName === selectedFileName);
    if ( attachment != null) {
      this._commonService.downloadRoutelogAttachment( attachment.attachmentId ).subscribe(
        data => {
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob( new Blob([data], { type: attachment.mimeType }), attachment.fileName );
          } else {
              const a = document.createElement( 'a' );
              a.href = URL.createObjectURL( data );
              a.download = attachment.fileName;
              a.click();
          }
        } );
    }
  }

  /* closes approve-disapprove modal */
  closeApproveDisapproveModal() {
    this.proposalDataBindObj.modalAproveHeading = null;
    this.requestObject = {};
    this.uploadedFile = [];
    this.showApproveDisapproveModal.isReadyToApprove = false;
    this.showApproveDisapproveModal.isPrereviewCompletionRequired = false;
    this.showApproveDisapproveModal.isAttachmentIncomplete = false;
  }

  notifyAttachmentIncomplete() {
    this._proposalService.sendPIAttachmentNotification( this.result ).subscribe( data => {
        let temp: string;
        temp = data;
    },
    err => {},
    () => {
        document.getElementById('openSucessModal').click();
        this.showOrHideDataFlagsObj.isShowSuccessModal = true;
        this.proposalDataBindObj.successMessage = 'Notification mail has been sent successfully';
    } );
  }

  notifyApprover() {
    this.warningMsgObj.errorMsg = null;
    this._proposalService.sendDocCompleteApproverNotification( this.result ).subscribe( data => {
      let temp: string;
      temp = data;
      if ( temp === 'SUCCESS') {
        this.showOrHideDataFlagsObj.isShowSuccessModal = true;
      }
    },
    err => {
      $('#warning-modal').modal('hide');
      this.warningMsgObj.errorMsg = 'Error in notifying approver';
      document.getElementById('openSucessModal').click(); },
    () => {
      this.showOrHideDataFlagsObj.isShowNotifyApprover = false;
      this.proposalDataBindObj.successMessage = 'Notification mail has been sent successfully';
      $('#warning-modal').modal('hide');
      document.getElementById('openSucessModal').click();
    } );
  }

  setProposalBudgetDetails() {
    if (this.budgetOverviewDateObj.isStartError || this.budgetOverviewDateObj.isEndError ||
        this.budgetOverviewDateObj.budgetStartDate === null || this.budgetOverviewDateObj.budgetEndDate === null) {
      this.showOrHideDataFlagsObj.isShowSaveWarningModal = true;
      this.mandatoryObj.field = 'budgetDates';
    } else {
      this.result.proposal.budgetHeader.startDate = new Date(this.budgetOverviewDateObj.budgetStartDate).getTime();
      this.result.proposal.budgetHeader.endDate = new Date(this.budgetOverviewDateObj.budgetEndDate).getTime();
    }
    this.showOrHideDataFlagsObj.periodWithoutDate = this.result.proposal.budgetHeader.budgetPeriods.find(
                              period => period.startDate == null || period.endDate == null);
    if (this.showOrHideDataFlagsObj.periodWithoutDate != null ||
        this.budgetPeriodsDateObj.isStartError || this.budgetPeriodsDateObj.isEndError) {
      this.showOrHideDataFlagsObj.isShowSaveWarningModal = true;
      this.mandatoryObj.field = 'periodDates';
    } else {
      this.timeStampToPeriodDates();
    }
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

  applyRates(event, isToast) {
    event.preventDefault();
    const requestObj = {
      userName: localStorage.getItem( 'currentUser' ),
      userFullName: localStorage.getItem( 'userFullname' ),
      proposal: this.result.proposal
    };
    this._proposalBudgetService.applyRates ( requestObj ).subscribe( (data: any) => {
        this.result.proposal = data.proposal;
        this.timeStampToPeriodDates();
    }, err => {},
    () => {
      if (isToast) {
        this.showToast();
      } else {
        this.showOrHideDataFlagsObj.isShowSuccessModal = true;
        this.proposalDataBindObj.successMessage = 'Budget amounts has been calculated successfully.';
        document.getElementById('openSucessModal').click();
      }
    });
  }

  resetBudgetRates() {
      const requestObj = {
        userName: localStorage.getItem( 'currentUser' ),
        userFullName: localStorage.getItem( 'userFullname' ),
        proposal: this.result.proposal
      };
      this._proposalBudgetService.resetBudgetRates ( requestObj ).subscribe( (data: any) => {
          this.result.proposal = data.proposal;
          this.timeStampToPeriodDates();
          this.showToast();
      });
  }

  getSyncBudgetRates() {
      const requestObj = {
        userName: localStorage.getItem( 'currentUser' ),
        userFullName: localStorage.getItem( 'userFullname' ),
        proposal: this.result.proposal
      };
      this._proposalBudgetService.getSyncBudgetRates ( requestObj ).subscribe( (data: any) => {
        this.result.proposal = data.proposal;
        this.timeStampToPeriodDates();
        this.showToast();
      });
    }

   showToast() {
    const toastId = document.getElementById('rate-toast-success');
    this.rate_toast_message = 'Rates updated successfully';
    toastId.className = 'show';
    setTimeout(function () {
    toastId.className = toastId.className.replace('show', '');
    }, 2000);
  }

  timeStampToBudgetDates() {
    if ( this.result.proposal.budgetHeader != null) {
      this.budgetOverviewDateObj.budgetStartDate = this.result.proposal.budgetHeader.startDate === null ?
                                                  null : new Date(this.result.proposal.budgetHeader.startDate);
      this.budgetOverviewDateObj.budgetEndDate = this.result.proposal.budgetHeader.endDate === null ?
                                                 null : new Date(this.result.proposal.budgetHeader.endDate);
    }
  }

  ngOnDestroy() {
    this.autoSave_subscription.unsubscribe();
  }

}
