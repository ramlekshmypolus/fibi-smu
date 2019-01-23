import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CompleterService } from 'ng2-completer';

import { CommonService } from '../../common/services/common.service';
import { GrantService } from '../grant.service';

declare var $: any;

@Component({
  selector: 'app-grant-edit',
  templateUrl: './grant-edit.component.html',
  styleUrls: ['./grant-edit.component.css']
})

export class GrantEditComponent implements OnInit {

  @Input() result: any = {};
  @Input() showDataFlagObj: any = {};

  isPOC_EmployeeChecked = true;

  selectedGrantCallType = null;
  selectedSponsorType = null;
  selectedSponsor = null;
  selectedActivityType = null;
  selectedFundingType = null;
  selectedEligibilityCriteria = null;
  selectedEligibilityType = null;
  attachmentDescription = null;
  selectedAttachmentType = null;
  selectedArea: string;
  selectedKeyword: string;
  clearField;
  removeObjIndex: number;
  removeObjId: number;

  pointOfContactObject: any = {};
  elasticSearchOptions: any = {};
  warningMsgObj: any = {};
  modalHideAndShowObj: any = {};
  homeUnits: any = [];
  keywordsList:  any  = [];
  areaList:  any  = [];
  uploadedFile = [];

  constructor(private _grantService: GrantService,
    private _router: Router,
    private _completerService: CompleterService,
    private _commonService: CommonService) { }

  ngOnInit() {
    this.elasticSearchOptions.url   = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'fibiperson';
    this.elasticSearchOptions.type  = 'person';
    this.elasticSearchOptions.size  = 20;
    this.elasticSearchOptions.contextField = 'full_name';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      full_name: {},
    };
    if (this.result.grantCall.grantCallId !== null) {
        this.selectedSponsorType = (this.result.grantCall.sponsorType != null) ?
                                          this.result.grantCall.sponsorType.description : null;
        this.selectedSponsor = (this.result.grantCall.sponsor != null) ?
                                this.result.grantCall.sponsor.sponsorName : null;
        this.selectedActivityType = (this.result.grantCall.activityType != null) ?
                                    this.result.grantCall.activityType.description : null;
        this.selectedFundingType =  (this.result.grantCall.fundingSourceType != null) ?
                                    this.result.grantCall.fundingSourceType.description : null;
        this.selectedGrantCallType = this.result.grantCall.grantCallType.description;
    }
    this.keywordsList = this._completerService.local( this.result.scienceKeywords, 'description', 'description' );
    this.areaList = this._completerService.local( this.result.researchAreas, 'description', 'description' );
    this.homeUnits =  this._completerService.local( this.result.homeUnits, 'unitName', 'unitName' );
  }

  /** check whether status is draft, if yes show warning else navigate to dashboard */
  openGoBackModal() {
    if ( this.result.grantCall.grantStatusCode === 1 ) { // status == Draft
        this.modalHideAndShowObj.isShowConfirmGoBack = true;
    } else {
        this._router.navigate( ['fibi/dashboard/grantCall'] );
    }
  }

  /** assigns selected grant call to result object */
  grantCallTypeChange() {
    if (this.selectedGrantCallType === 'null') {
        this.result.grantCall.grantCallType = null;
        this.result.grantCall.grantTypeCode = null;
    } else {
        const grantCallTypeObj = this.result.grantCallTypes.find(type => type.description === this.selectedGrantCallType);
        this.result.grantCall.grantCallType = grantCallTypeObj;
        this.result.grantCall.grantTypeCode = grantCallTypeObj.grantTypeCode;
     }
     this.result.grantCall.externalUrl = null;
  }

  /** restrict date input fields to numbers, - and /
   * @param event
   */
  dateInputRestriction(event: any) {
    const pattern = /[0-9\+\-\/\ ]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  }

  /** check for validations in closing and opening dates */
  dateValidation() {
    if ( this.result.grantCall.openingDate == null ) {
        this.warningMsgObj.dateWarningText = 'Please select an opening date';
    } else if ( this.result.grantCall.closingDate == null ) {
        this.warningMsgObj.dateWarningText = 'Please select a closing date';
    } else if ( new Date(this.result.grantCall.openingDate) >= new Date(this.result.grantCall.closingDate) ) {
        this.warningMsgObj.dateWarningText = 'Please select a closing date after opening date';
    } else {
        this.warningMsgObj.dateWarningText = null;
    }
  }

  /** restrict input field to numbers and show validation
   * @param event
   */
  stringInputRestriction(event: any) {
    const pattern = /[0-9]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
      this.warningMsgObj.stringWarningText = 'accept numbers only';
    } else {
        this.warningMsgObj.stringWarningText = null;
    }
  }

  /** assigns selected home unit */
  homeUnitChangeFunction() {
    const homeUnitObj = this.result.homeUnits.find(unit => unit.unitName === this.result.grantCall.homeUnitName);
    this.result.grantCall.homeUnitNumber = homeUnitObj != null ? homeUnitObj.unitNumber : null;
  }

  /** pushes selected keyword into list of keywords if there is no duplication */
  keywordChangeFunction() {
    const keywordObject: any = {};
    this.warningMsgObj.keyWordWarningMessage = null;
    const dupKeywordObj = this.result.grantCall.grantCallKeywords.find(keyword =>
      keyword.scienceKeyword.description === this.selectedKeyword);
      if (dupKeywordObj != null) {
        this.warningMsgObj.keyWordWarningMessage = 'Keyword already added';
      } else if (this.warningMsgObj.keyWordWarningMessage == null) {
        const keywordObj = this.result.scienceKeywords.find(keyword => keyword.description === this.selectedKeyword);
        if (keywordObj != null ) {
          keywordObject.scienceKeywordCode = keywordObj.code;
          keywordObject.scienceKeyword = keywordObj;
          keywordObject.updateTimestamp = new Date().getTime();
          keywordObject.updateUser = localStorage.getItem('currentUser');
          this.result.grantCall.grantCallKeywords.push(keywordObject);
          this.warningMsgObj.keyWordWarningMessage = null;
        }
      }
      this.selectedKeyword = null;
  }

  /** fetch sponsor names using sponsor type
   * @param type
   */
  sponsorTypeChange(type) {
    if (type === 'null') {
      this.result.grantCall.sponsorType = null;
      this.result.grantCall.sponsorTypeCode = null;
      this.result.grantCall.sponsor = null;
      this.result.grantCall.sponsorCode = null;
      this.result.grantCall.activityType = null;
      this.result.grantCall.activityTypeCode = null;
      this.result.grantCall.fundingSourceType = null;
      this.result.grantCall.fundingSourceTypeCode = null;
      this.selectedActivityType = null;
      this.selectedFundingType = null;
      this.result.sponsors = [];
    } else {
      const sponsorTypeObj = this.result.sponsorTypes.find(sponsorType => sponsorType.description === type);
      if (sponsorTypeObj != null ) {
        this._grantService.fetchSponsorsBySponsorType({'sponsorTypeCode' : sponsorTypeObj.code}).subscribe(success => {
          let tempGrantObj: any = {};
          tempGrantObj = success;
          this.result.sponsors = tempGrantObj.sponsors;
          this.result.grantCall.sponsorType = sponsorTypeObj;
          this.result.grantCall.sponsorTypeCode = sponsorTypeObj.code;
          this.selectedSponsor = null;
        });
      }
    }
  }

  /** assign sponsor name
   * @param sponsorName
   */
  sponsorNameChange(sponsorName) {
    if (sponsorName === 'null') {
      this.result.grantCall.sponsor = null;
      this.result.grantCall.sponsorCode = null;
    } else {
      const sponsorTypeObj = this.result.sponsors.find(sponsor => sponsor.sponsorName === sponsorName);
      if (sponsorTypeObj != null) {
        sponsorTypeObj.sponsorType = this.result.grantCall.sponsorType;
        sponsorTypeObj.sponsorTypeCode = this.result.grantCall.sponsorType.code;
        this.result.grantCall.sponsor = sponsorTypeObj;
        this.result.grantCall.sponsorCode = sponsorTypeObj.sponsorCode;
      }
    }
  }

  /** assigns research type
   * @param type
   */
  researchTypeChange(type) {
    if ( type === 'null') {
      this.result.grantCall.activityType = null;
      this.result.grantCall.activityTypeCode = null;
    } else {
      const activityTypeObj = this.result.activityTypes.find(activityType => activityType.description === type);
      if (activityTypeObj != null) {
        this.result.grantCall.activityType = activityTypeObj;
        this.result.grantCall.activityTypeCode = activityTypeObj.code;
      }
    }
  }

  /** assigns funding type
   * @param type
   */
  fundingTypeChange(type) {
    if (type === 'null') {
      this.result.grantCall.fundingSourceType = null;
      this.result.grantCall.fundingSourceTypeCode = null;
    } else {
      const fundingTypeObj = this.result.fundingSourceTypes.find(fundingType => fundingType.description === type);
      if (fundingTypeObj != null) {
        this.result.grantCall.fundingSourceType = fundingTypeObj;
        this.result.grantCall.fundingSourceTypeCode = fundingTypeObj.fundingSourceTypeCode;
      }
    }
  }

  /** style changes for email and phone
   * @param value
   */
  personTypeChanged(value) {
    this.isPOC_EmployeeChecked = value;
    this.pointOfContactObject = {};
  }

  /** assigns selected elastic search result to an object
   * @param value
   */
  selectedPOC( value ) {
    this.pointOfContactObject = {};
    this.pointOfContactObject.fullName = value.full_name;
    this.pointOfContactObject.email = value.email_addr;
    this.pointOfContactObject.mobile = value.phone_nbr;
    this.pointOfContactObject.designation = '';
  }

  /** add point of contact after validations */
  addPointOfContact() {
    // tslint:disable-next-line:no-construct
    this.clearField = new String('true');
    this.warningMsgObj.POCWarningMsg = null;
    if ( this.pointOfContactObject.fullName == null || this.pointOfContactObject.fullName === '') {
        this.warningMsgObj.POCWarningMsg = 'Please choose a person';
    } else {
        if ( this.validateEmailAndMobile( this.pointOfContactObject.email,
            this.pointOfContactObject.mobile ) && this.pointOfContactObject.fullName.length > 0 ) {
              const pocObj = this.result.grantCall.grantCallContacts.find(poc =>
                poc.email.trim() === this.pointOfContactObject.email.trim());
                if (pocObj != null ) {
                  this.warningMsgObj.POCWarningMsg = 'You have already added the same person';
                  this.pointOfContactObject = {};
                } else if ( this.warningMsgObj.POCWarningMsg == null ) {
                  this.pointOfContactObject.personId = '';
                  this.pointOfContactObject.isEmployee = this.isPOC_EmployeeChecked === true ? true : false;
                  this.result.grantCall.grantCallContacts.push( this.pointOfContactObject );
                  this.pointOfContactObject = {};
              }
        } else {
            this.warningMsgObj.POCWarningMsg = 'Fields are incorrect or not filled';
        }
    }
  }

  /** email input validation */
  validateEmailAndMobile(mail, mobile) {
    // tslint:disable-next-line:max-line-length
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(mail) ) {
      return (true);
    }
    return (false);
  }

  /** adds research area */
  addResearchArea() {
    this.warningMsgObj.areaOfResearchWarning = false;
    const dupAreaObj = this.result.grantCall.grantCallResearchAreas.find(area => area.researchArea.description === this.selectedArea);
    this.warningMsgObj.areaOfResearchWarning = dupAreaObj != null ? true : false;
    if (!this.warningMsgObj.areaOfResearchWarning) {
      const areaObj = this.result.researchAreas.find(researchArea => researchArea.description === this.selectedArea);
      if (areaObj != null) {
        const tempObj: any = {};
        tempObj.researchAreaCode = areaObj.researchAreaCode;
        tempObj.researchArea  = areaObj;
        tempObj.updateTimestamp = new Date().getTime();
        tempObj.updateUser = localStorage.getItem('currentUser');
        this.result.grantCall.grantCallResearchAreas.push(tempObj);
      }
    }
    this.selectedArea = null;
  }

  showaddEligibility() {
    this.showDataFlagObj.isShowEligibility = !this.showDataFlagObj.isShowEligibility;
    this.selectedEligibilityCriteria = null;
    this.selectedEligibilityType = null;
  }

  /** adds eligibility */
  addEligibility() {
    const tempObj: any = {};
    this.warningMsgObj.isEligibilityWarning = false;
    if (this.selectedEligibilityCriteria !== null && this.selectedEligibilityType !== null) {
      this.result.grantCall.grantCallEligibilities.forEach(value => {
        if (value.grantCallCriteria.description  === this.selectedEligibilityCriteria.description &&
          value.grantCallEligibilityType.description === this.selectedEligibilityType.description) {
          this.warningMsgObj.isEligibilityWarning = true;
        }
      });
      if (!this.warningMsgObj.isEligibilityWarning ) {
        tempObj.grantCriteriaCode = this.selectedEligibilityCriteria.grantCriteriaCode;
        tempObj.grantCallCriteria = this.selectedEligibilityCriteria;
        tempObj.grantEligibilityTypeCode = this.selectedEligibilityType.grantEligibilityTypeCode;
        tempObj.grantCallEligibilityType = this.selectedEligibilityType;
        tempObj.updateTimestamp = new Date().getTime();
        tempObj.updateUser = localStorage.getItem('currentUser');
        this.result.grantCall.grantCallEligibilities.push(tempObj);
    }
  }
  this.selectedEligibilityCriteria = null;
  this.selectedEligibilityType = null;
  }

  /** temporarily saves grant details while the modal appears
   * @param id
   * @param index
   * @param deleteDetailLabel
   */
  temprySaveGrantObj(id, index, deleteDetailLabel) {
    this.removeObjId = id;
    this.removeObjIndex = index;
    this.modalHideAndShowObj.label = deleteDetailLabel;
    if (deleteDetailLabel !== 'KEYWORD') {
      this.modalHideAndShowObj.isShowDeleteModal = true;
    } else {
      this.deleteGrantDetail();
    }
  }

  /** removes POC */
  deleteGrantDetail() {
    if (this.modalHideAndShowObj.label !== 'KEYWORD') {
      this.modalHideAndShowObj.isShowDeleteModal = false;
    } else {
      this.warningMsgObj.keyWordWarningMessage = null;
    }
    if (this.removeObjId == null) {
      if (this.modalHideAndShowObj.label === 'KEYWORD') {
        this.result.grantCall.grantCallKeywords.splice(this.removeObjIndex, 1);
      } else if (this.modalHideAndShowObj.label === 'POC') {
        this.result.grantCall.grantCallContacts.splice(this.removeObjIndex, 1);
      } else if (this.modalHideAndShowObj.label === 'AREA') {
        this.result.grantCall.grantCallResearchAreas.splice(this.removeObjIndex, 1);
      } else if (this.modalHideAndShowObj.label === 'ELIGIBILITY') {
        this.result.grantCall.grantCallEligibilities.splice(this.removeObjIndex, 1);
      } else if (this.modalHideAndShowObj.label === 'ATTACHMENT') {
        this.result.grantCall.grantCallAttachments.splice(this.removeObjIndex, 1);
      }
    } else {
      if (this.modalHideAndShowObj.label === 'KEYWORD') {
        this._grantService.deleteGrantCallKeyword({'grantCallId' : this.result.grantCall.grantCallId, 'grantKeywordId' : this.removeObjId})
        .subscribe(success => {
          this.result.grantCall.grantCallKeywords.splice(this.removeObjIndex, 1);
        });
      } else if (this.modalHideAndShowObj.label === 'POC') {
        this._grantService.deleteGrantCallContact({'grantCallId' : this.result.grantCall.grantCallId,
        'grantContactId' : this.removeObjId}).subscribe(newGrantDetails => {
        this.result.grantCall.grantCallContacts.splice(this.removeObjIndex, 1);
        });
      } else if (this.modalHideAndShowObj.label === 'AREA') {
        this._grantService.deleteGrantCallAreaOfResearch({'grantCallId' : this.result.grantCall.grantCallId,
        'grantResearchAreaId' : this.removeObjId}).subscribe(newResearchAreaDetails => {
        this.result.grantCall.grantCallResearchAreas.splice(this.removeObjIndex, 1);
        });
      } else if (this.modalHideAndShowObj.label === 'ELIGIBILITY') {
        this._grantService.deleteGrantCallEligibility({'grantCallId' : this.result.grantCall.grantCallId,
        'grantEligibilityId' : this.removeObjId}).subscribe(newEligibilityDetails => {
          this.result.grantCall.grantCallEligibilities.splice(this.removeObjIndex, 1);
        });
      } else if (this.modalHideAndShowObj.label === 'ATTACHMENT') {
        this._grantService.deleteGrantCallAttachment({'grantCallId' : this.result.grantCall.grantCallId,
          'attachmentId' : this.removeObjId}).subscribe(newEligibilityDetails => {
          this.result.grantCall.grantCallAttachments.splice(this.removeObjIndex, 1);
        });
      }
    }
  }

  backToList( e ) {
    e.preventDefault();
    this._router.navigate( ['fibi/dashboard/grantCall'] );
  }

  clearAttachmentDetails() {
    this.warningMsgObj.attachmentWarningMsg = null;
    this.uploadedFile = [];
    this.attachmentDescription = null;
    this.selectedAttachmentType = null;
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
  }

  addAttachments() {
    this.warningMsgObj.attachmentWarningMsg = null;
    if (this.selectedAttachmentType == null || this.selectedAttachmentType === 'null') {
      this.warningMsgObj.attachmentWarningMsg = '* Please select an attachment type';
    } else if (this.uploadedFile.length === 0) {
      this.warningMsgObj.attachmentWarningMsg = '* Please choose atleast one attachment';
    } else {
      for (const attachment of this.result.grantCall.grantCallAttachments) {
        if (this.uploadedFile.find(dupFile => dupFile.name === attachment.fileName) != null) {
          this.warningMsgObj.attachmentWarningMsg = '* File(s) already added in the list';
          break;
        }
      }
    }
    if (this.warningMsgObj.attachmentWarningMsg == null) {
      const tempObjectForAdd: any = {};
      tempObjectForAdd.grantCallAttachType = this.selectedAttachmentType;
      tempObjectForAdd.grantAttachmentTypeCode = this.selectedAttachmentType.grantAttachmentTypeCode;
      tempObjectForAdd.description = this.attachmentDescription;
      tempObjectForAdd.updateTimestamp = new Date().getTime();
      tempObjectForAdd.updateUser = localStorage.getItem('currentUser');
      this.result.newAttachment = tempObjectForAdd;
      const formData = new FormData();
      formData.delete( 'files' );
      formData.delete( 'formDataJson' );
      for (const file of this.uploadedFile) {
        formData.append( 'files', file );
      }
      const addAttachmentReqObject = {
        grantCall : this.result.grantCall,
        newAttachment : this.result.newAttachment,
      };
      formData.append( 'formDataJson', JSON.stringify( addAttachmentReqObject ) );
      this._grantService.addGrantCallAttachment( formData ).subscribe( success => {
        let temporaryAttachmentObject: any = {};
        temporaryAttachmentObject = success;
        this.result.grantCall = temporaryAttachmentObject.grantCall;
      }, error => { },
      () => {
        this.showDataFlagObj.isShowAttachmentList = true;
        this.modalHideAndShowObj.isShowAddAttachment = false;
        this.clearAttachmentDetails();
        $('#addAttachment').modal('hide');
      });
    }
  }

  downloadAttachments( attachment ) {
    if (attachment.attachmentId != null) {
      this._grantService.downloadAttachment( attachment.attachmentId )
      .subscribe( data => {
        const a = document.createElement( 'a' );
        a.href = URL.createObjectURL( data );
        a.download = attachment.fileName;
        document.body.appendChild(a);
        a.click();
      } );
    } else {
      console.log(attachment);
      const URL = 'data:' + attachment.mimeType + ';base64,' + attachment.attachment;
      const a = document.createElement( 'a' );
      a.href = URL;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
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
        document.getElementById('openSaveModal').click();
      });
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

  /** data validation */
  checkGrantMandatoryFilled() {
    if (this.result.grantCall.grantCallType == null || this.result.grantCall.grantCallType === 'null' ||
    this.result.grantCall.grantCallStatus == null || this.result.grantCall.maximumBudget == null ||
    this.result.grantCall.openingDate == null || this.result.grantCall.closingDate == null ||
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
        this.result = success;
        this.warningMsgObj = {};
        this.showDataFlagObj.mode = 'view';
    } );
  }

}
