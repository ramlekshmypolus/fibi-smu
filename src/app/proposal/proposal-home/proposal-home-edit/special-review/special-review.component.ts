import { Component, OnInit, Input } from '@angular/core';

import { CommonService } from '../../../../common/services/common.service';
import { ProposalHomeService } from '../../proposal-home.service';

declare var $: any;

@Component({
  selector: 'app-special-review',
  templateUrl: './special-review.component.html',
})
export class SpecialReviewDetailsComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() warningMsgObj: any = {};
  @Input() proposalDataBindObj: any = {};

  isShowSpecialReviewModal = false;
  isShowDeleteSpecialReviewModal = false;
  isSpecialReviewUpdate = false;
  selectedSpecialReviewType = null;
  selectedSpecialReviewApprovalStatus = null;

  index: number;
  removeSpecailReviewId: string;

  specialReviewObject: any = {};
  requestObj: any = {};

  constructor(public _commonService: CommonService, private _proposalHomeService: ProposalHomeService) { }

  ngOnInit() {}

  /* shows special review modal */
  showAddSpecialReviewPopUp(e) {
    e.preventDefault();
    this.closeSpecialReview();
    this.isShowSpecialReviewModal = true;
  }

  /* assigns special review type */
  specialReviewTypeChange(type) {
    if (type === 'null') {
      this.specialReviewObject.specialReviewType = null;
      this.specialReviewObject.specialReviewTypeCode = null;
    } else {
      const specialReviewTypeObject = this.result.reviewTypes.find(specialReviewType => specialReviewType.description === type);
      if (specialReviewTypeObject != null) {
        this.specialReviewObject.specialReviewType = specialReviewTypeObject;
        this.specialReviewObject.specialReviewTypeCode = specialReviewTypeObject.specialReviewTypeCode;
      }
    }
  }

  /* assigns special review approval status */
  specialReviewApprovalStatusChange(type) {
    if (type === 'null') {
      this.specialReviewObject.approvalType = null;
      this.specialReviewObject.approvalTypeCode = null;
    } else {
      const specialReviewApprovalStatusObject = this.result.specialReviewApprovalTypes.find
                                                (approvalType => approvalType.description === type);
      this.specialReviewObject.approvalType = specialReviewApprovalStatusObject;
      this.specialReviewObject.approvalTypeCode = specialReviewApprovalStatusObject.approvalTypeCode;
    }
  }

  /* date validation for special review application and expiration date */
  specialReviewDatevalidation() {
    this.warningMsgObj.specialReviewdateWarningMsg = null;
    if (this.specialReviewObject.applicationDate != null || this.specialReviewObject.expirationDate != null) {
      if (new Date(this.specialReviewObject.applicationDate) > new Date(this.specialReviewObject.expirationDate)) {
        this.warningMsgObj.specialReviewdateWarningMsg = '* Expiration Date should be on or after Application Date.';
      } else {
        this.warningMsgObj.specialReviewdateWarningMsg = null;
      }
    }
  }

  /* adds special review */
  addSpecialReview() {
    this.warningMsgObj.specialReviewMandatoryFieldsMsg = null;
    this.warningMsgObj.specialReviewMandatoryFieldsMsg = (this.selectedSpecialReviewType === null ||
      this.selectedSpecialReviewApprovalStatus === null) ? '* Please fill all mandatory fields.' : null;
    if (this.warningMsgObj.specialReviewMandatoryFieldsMsg == null && this.warningMsgObj.specialReviewdateWarningMsg == null) {
      this.specialReviewObject.updateTimeStamp = new Date().getTime();
      this.specialReviewObject.updateUser = localStorage.getItem('currentUser');
      this.result.proposal.propSpecialReviews.push(this.specialReviewObject);
      this.showOrHideDataFlagsObj.dataChangeFlag = true;
      this.showOrHideDataFlagsObj.isSpecialReviewWidgetOpen = true;
      this.closeSpecialReview();
      $('#addSpecialReview').modal('hide');
    }
  }

  /* closes special review modal */
  closeSpecialReview() {
    this.isShowSpecialReviewModal = false;
    this.isSpecialReviewUpdate = false;
    this.selectedSpecialReviewType = null;
    this.selectedSpecialReviewApprovalStatus = null;
    this.warningMsgObj.specialReviewMandatoryFieldsMsg = null;
    this.warningMsgObj.specialReviewdateWarningMsg = null;
    this.specialReviewObject = {};
  }

  /* temporarary saves special review object before deletion */
  temprySpecialReviewObj(removeId, i) {
    this.removeSpecailReviewId = removeId;
    this.index = i;
    this.isShowDeleteSpecialReviewModal = true;
  }

  /* deletes special review details */
  deleteSpecialReview(e) {
    e.preventDefault();
    this.isShowDeleteSpecialReviewModal = false;
    if (this.removeSpecailReviewId != null) {
      this.result.proposal.updateUser = localStorage.getItem('currentUser');
      this.requestObj.proposalId = this.result.proposal.proposalId;
      this.requestObj.proposalSpecialReviewId = this.removeSpecailReviewId;
      this._proposalHomeService.deleteProposalSpecialReview(this.requestObj)
        .subscribe(success => {
          let temp: any = {};
          temp = success;
          this.result.proposal.propSpecialReviews.splice(this.index, 1);
        });
    } else {
      this.result.proposal.propSpecialReviews.splice(this.index, 1);
    }
  }

  /* assigns value to fields in special review modal for editing while clicking edit button */
  editSpecialReview(savedSpecialReviewObject) {
    this.specialReviewObject = JSON.parse(JSON.stringify(savedSpecialReviewObject));
    this.selectedSpecialReviewType = this.specialReviewObject.specialReviewType.description;
    this.selectedSpecialReviewApprovalStatus = this.specialReviewObject.approvalType.description;
    this.specialReviewObject.applicationDate = this.specialReviewObject.applicationDate === null ?
      null : new Date(this.specialReviewObject.applicationDate);
    this.specialReviewObject.approvalDate = this.specialReviewObject.approvalDate === null ?
      null : new Date(this.specialReviewObject.approvalDate);
    this.specialReviewObject.expirationDate = this.specialReviewObject.expirationDate === null ?
      null : new Date(this.specialReviewObject.expirationDate);
    this.isSpecialReviewUpdate = true;
    this.isShowSpecialReviewModal = true;
  }

  /* updates special review */
  updateSpecialReview() {
    this.warningMsgObj.specialReviewMandatoryFieldsMsg = null;
    this.warningMsgObj.specialReviewMandatoryFieldsMsg = (this.selectedSpecialReviewType === null ||
      this.selectedSpecialReviewApprovalStatus === null) ? '* Please fill all mandatory fields.' : null;
    if (this.warningMsgObj.specialReviewMandatoryFieldsMsg == null && this.warningMsgObj.specialReviewdateWarningMsg == null) {
      this.result.proposal.propSpecialReviews.forEach((item, index) => {
        if (item.id === this.specialReviewObject.id) {
          this.result.proposal.propSpecialReviews[index] = Object.assign({}, this.specialReviewObject);
          this.showOrHideDataFlagsObj.dataChangeFlag = true;
        }
      });
      this.closeSpecialReview();
      $('#addSpecialReview').modal('hide');
    }
  }

}
