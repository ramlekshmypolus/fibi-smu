import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GrantService } from './services/grant.service';
import { CommonService } from '../common/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
})
export class GrantComponent implements OnInit {

  grantId = '';

  result: any = {};
  showDataFlagObj: any  = {
    isCurrencyFocusOn : false,
    isShowAddPointOfContact : true,
    isShowAreaOfResearch : true,
    isShowEligibility : true,
    isShowAttachmentList: true,
    isDataChange: false,
    mode: '',
    openingDate: null,
    closingDate: null,
    isAttachmentVersionOpen: []
  };
  warningMsgObj: any = {};
  modalHideAndShowObj: any = {};

  constructor( private _route: ActivatedRoute, private _router: Router, private _spinner: NgxSpinnerService,
               private _grantService: GrantService, private _commonService: CommonService ) {}

  ngOnInit() {
    this.result = this._route.snapshot.data.grantDetails;
    this._spinner.hide();
    this.grantId = this._route.snapshot.queryParamMap.get('grantId');
    if (this.grantId == null) {
      this.showDataFlagObj.mode = 'create';
    } else {
        if (this.result.grantCall.grantStatusCode === 1) {
            this.showDataFlagObj.mode = 'edit';
        } else {
            this.showDataFlagObj.mode = 'view';
        }
    }
  }

  setCurrentProposalTab() {
    localStorage.setItem('currentTab', 'PROPOSAL_HOME');
  }

  /** check whether status is draft, if yes show warning else navigate to dashboard */
  openGoBackModal() {
    if ( this.result.grantCall.grantStatusCode === 1 && this.showDataFlagObj.isDataChange) { // status == Draft
        this.modalHideAndShowObj.isShowConfirmGoBack = true;
    } else {
        this._router.navigate( ['fibi/dashboard/grantCall'] );
    }
  }

  /** checks whether all datas are valid and shows publish confrimation modal  */
  checkGrantCallPublish() {
    if (this.result.grantCall.grantCallId == null) {
      this.warningMsgObj.isShowWarning = true;
    } else {
      this.checkGrantMandatoryFilled();
    }
    if (!this.warningMsgObj.isShowWarning && this.warningMsgObj.dateWarningText == null) {
      this.modalHideAndShowObj.isShowPublishWarningModal = true;
    }
  }

  /** saves grant after checking whether all datas are valid */
  saveGrant() {
    let saveType = 'SAVE';
    this.checkGrantMandatoryFilled();
    if (this.warningMsgObj.isShowWarning === false && this.warningMsgObj.dateWarningText == null) {
      this.showDataFlagObj.isCurrencyFocusOn = true;
      this.result.grantCall.createUser = localStorage.getItem('currentUser');
      this.result.grantCall.createTimestamp = new Date().getTime();
      this.result.grantCall.updateTimeStamp = new Date().getTime();
      this.result.grantCall.openingDate = new Date(this.showDataFlagObj.openingDate).getTime();
      this.result.grantCall.closingDate = new Date(this.showDataFlagObj.closingDate).getTime();
      this.result.grantCall.updateUser = localStorage.getItem('currentUser');
      if (this.result.grantCall.grantCallStatus.grantStatusCode === 1 && this.result.grantCall.grantCallId == null) {
          saveType = 'SAVE';
      } else {
          saveType = 'UPDATE';
      }
      this._grantService.saveGrantCall({ 'grantCall' : this.result.grantCall, 'updateType' : saveType}).subscribe(response => {
        let tempSavedGrantObj: any = {};
        tempSavedGrantObj = response;
        this.result.grantCall = tempSavedGrantObj.grantCall;
        this.warningMsgObj = {};
      },
      error => {},
      () => {
        this.showDataFlagObj.isAttachmentVersionOpen = [];
        this.showDataFlagObj.isDataChange = false;
        document.getElementById('openSaveModal').click();
      });
    }
  }

  /** data validation */
  checkGrantMandatoryFilled() {
    if (this.result.grantCall.grantCallType == null || this.result.grantCall.grantCallType === 'null' ||
    this.result.grantCall.grantCallStatus == null || this.result.grantCall.maximumBudget == null ||
    this.showDataFlagObj.openingDate == null || this.showDataFlagObj.closingDate == null ||
    this.result.grantCall.grantTheme === null || this.result.grantCall.grantTheme === '' ||
    this.result.grantCall.grantCallName === null || this.result.grantCall.grantCallName === '' ||
    this.result.grantCall.description === null || this.result.grantCall.description === '' ||
    ( this.result.grantCall.grantTypeCode === 2 && (this.result.grantCall.externalUrl == null ||
      this.result.grantCall.externalUrl === ''))) {
        this.warningMsgObj.isShowWarning = true;
    } else {
      this.warningMsgObj.isShowWarning = false;
    }
  }

  /** publish grant */
  publishGrantCall() {
    this._grantService.publishGrantCall( {'grantCall': this.result.grantCall} ).subscribe( success => {
        this.showDataFlagObj.isShowAddPointOfContact = true;
        this.showDataFlagObj.isShowAreaOfResearch = true;
        this.showDataFlagObj.isShowEligibility = true;
        this.showDataFlagObj.isAttachmentVersionOpen = [];
        this.result = success;
        this.warningMsgObj = {};
        this.showDataFlagObj.mode = 'view';
    } );
  }

  /** copy grant */
  copyGrantCall() {
    this._commonService.copyGrantCall({'grantCallId': this.result.grantCall.grantCallId,
    'userFullName': localStorage.getItem('userFullname')}).subscribe((success: any) => {
      this._router.navigate(['fibi/grant'], { queryParams: { 'grantId': success.grantCallId } });
      window.location.reload();
    });
  }

  backToList( e ) {
    e.preventDefault();
    this._router.navigate( ['fibi/dashboard/grantCall'] );
  }
}
