import { Component, OnInit, Input } from '@angular/core';
import { CompleterService } from 'ng2-completer';

import { CommonService } from '../../common/services/common.service';
import { GrantService } from '../services/grant.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-grant-edit',
  templateUrl: './grant-edit.component.html',
  styleUrls: ['./grant-edit.component.css']
})

export class GrantEditComponent implements OnInit {

  @Input() result: any = {};
  @Input() showDataFlagObj: any = {};
  @Input() warningMsgObj: any = {};
  @Input() modalHideAndShowObj: any = {};

  isPOC_EmployeeChecked = true;
  isReplaceAttachment = false;

  selectedGrantCallType = null;
  selectedSponsorType = null;
  selectedSponsor = null;
  selectedActivityType = null;
  selectedFundingType = null;
  selectedEligibilityCriteria = null;
  selectedEligibilityType = null;
  selectedArea: string;
  selectedKeyword: string;
  clearField;
  removeObjIndex: number;
  removeObjId: number;
  documentId: number;
  removeObjDocId: number;

  pointOfContactObject: any = {};
  elasticSearchOptions: any = {};
  replaceAttachmentObj: any = {};
  homeUnits: any = [];
  keywordsList:  any  = [];
  areaList:  any  = [];
  uploadedFile = [];
  attachmentVersions = [];
  selectedAttachmentDescription = [];
  selectedAttachmentType: any[] = [];

  constructor(private _grantService: GrantService,
    private _completerService: CompleterService,
    public _commonService: CommonService,
    private _spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.showDataFlagObj.isAttachmentVersionOpen = [];
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
        this.showDataFlagObj.openingDate = this.result.grantCall.openingDate === null ? null : new Date(this.result.grantCall.openingDate);
        this.showDataFlagObj.closingDate = this.result.grantCall.closingDate === null ? null : new Date(this.result.grantCall.closingDate);
    }
    this.keywordsList = this._completerService.local( this.result.scienceKeywords, 'description', 'description' );
    this.areaList = this._completerService.local( this.result.researchAreas, 'description', 'description' );
    this.homeUnits =  this._completerService.local( this.result.homeUnits, 'unitName', 'unitName' );
  }

  /** assigns selected grant call to result object */
  grantCallTypeChange() {
    this.showDataFlagObj.isDataChange = true;
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

  /** check for validations in closing and opening dates */
  dateValidation() {
    if ( this.showDataFlagObj.openingDate == null ) {
        this.warningMsgObj.dateWarningText = 'Please select an opening date';
    } else if ( this.showDataFlagObj.closingDate == null ) {
        this.warningMsgObj.dateWarningText = 'Please select a closing date';
    } else if ( new Date(this.showDataFlagObj.openingDate) >= new Date(this.showDataFlagObj.closingDate) ) {
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
          keywordObject.updateTimeStamp = new Date().getTime();
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
                  this.showDataFlagObj.isDataChange = true;
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
        tempObj.updateTimeStamp = new Date().getTime();
        tempObj.updateUser = localStorage.getItem('currentUser');
        this.result.grantCall.grantCallResearchAreas.push(tempObj);
        this.showDataFlagObj.isDataChange = true;
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
        tempObj.updateTimeStamp = new Date().getTime();
        tempObj.updateUser = localStorage.getItem('currentUser');
        this.result.grantCall.grantCallEligibilities.push(tempObj);
        this.showDataFlagObj.isDataChange = true;
    }
  }
  this.selectedEligibilityCriteria = null;
  this.selectedEligibilityType = null;
  }

  /** temporarily saves grant details while the modal appears
   * @param id
   * @param index
   * @param deleteDetailLabel
   * @param removeDocumentId
   */
  temprySaveGrantObj(id, index, deleteDetailLabel, removeDocumentId) {
    this.removeObjId = id;
    this.removeObjIndex = index;
    this.modalHideAndShowObj.label = deleteDetailLabel;
    if (deleteDetailLabel !== 'KEYWORD') {
      this.modalHideAndShowObj.isShowDeleteModal = true;
      this.removeObjDocId = removeDocumentId;
    } else {
      this.deleteGrantDetail();
    }
  }

  /** removes grant details */
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
        this.showDataFlagObj.isAttachmentVersionOpen = [];
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
        this._grantService.deleteGrantCallAttachment({'grantCallId' : this.result.grantCall.grantCallId, 'attachmentId': this.removeObjId ,
        'userFullName': localStorage.getItem('userFullname'), 'documentId': this.removeObjDocId}).subscribe(newEligibilityDetails => {
          this.result.grantCall.grantCallAttachments = this.result.grantCall.grantCallAttachments.filter(attachmentObject =>
            attachmentObject.documentId !== this.removeObjDocId );
         this.showDataFlagObj.isAttachmentVersionOpen = [];
        });
      }
    }
  }

  showAddAttachmentPopUp(event, attachment) {
    event.preventDefault();
    this.modalHideAndShowObj.isShowAddAttachment = true;
    if (this.isReplaceAttachment) {
      this.replaceAttachmentObj = attachment;
    }
  }

  getVersion(index, documentId, isOpen) {
    this.attachmentVersions = [];
    this.documentId = documentId;
    this.showDataFlagObj.isAttachmentVersionOpen = [];
    if (!isOpen || isOpen == null) {
      this.showDataFlagObj.isAttachmentVersionOpen[index] = true;
    }
    this.attachmentVersions = this.result.grantCall.grantCallAttachments.filter(attachObj =>
                                    attachObj.documentStatusCode === 2 && attachObj.documentId === documentId );
  }

  clearAttachmentDetails() {
    this.warningMsgObj.attachmentWarningMsg = null;
    this.uploadedFile = [];
    this.modalHideAndShowObj.isShowAddAttachment = false;
    this.isReplaceAttachment = false;
  }

  fileDrop(files) {
    this.warningMsgObj.attachmentWarningMsg = null;
    let dupCount = 0;
    for (let index = 0; index < files.length; index++) {
      if (this.uploadedFile.find(dupFile => dupFile.name === files[index].name) != null) {
        dupCount = dupCount + 1;
        this.warningMsgObj.attachmentWarningMsg = '* ' + dupCount + ' File(s) already added';
      } else {
        if (!this.isReplaceAttachment) {
          this.uploadedFile.push(files[index]);
          this.selectedAttachmentType[this.uploadedFile.length - 1] = null;
          this.selectedAttachmentDescription[this.uploadedFile.length - 1] = '';
        } else if (this.isReplaceAttachment === true) {
          if (files.length === 1) {
            this.uploadedFile = [];
            this.uploadedFile.push(files[index]);
            this.selectedAttachmentType[this.uploadedFile.length - 1] = this.replaceAttachmentObj.grantCallAttachType.description;
            this.selectedAttachmentDescription[this.uploadedFile.length - 1] = this.replaceAttachmentObj.description;
          } else {
            this.warningMsgObj.attachmentWarningMsg = '* Choose only one document to replace';
          }
        }
      }
    }
  }

  deleteFromUploadedFileList(index) {
    this.uploadedFile.splice(index, 1);
    this.warningMsgObj.attachmentWarningMsg = null;
  }

  checkAttachmentSize() {
    for ( let sizeIndex = 0; sizeIndex < this.uploadedFile.length; sizeIndex++ ) {
        if (this.uploadedFile[sizeIndex].size > 19591292 || !(this.uploadedFile[sizeIndex].size > 0)) {
          this.warningMsgObj.attachmentWarningMsg = '* Document size must be greater than 0KB and less than 20MB';
        }
    }
  }

  addAttachments() {
    const tempArrayForAdd = [];
    this.warningMsgObj.attachmentWarningMsg = null;
    for (let uploadIndex = 0; uploadIndex < this.uploadedFile.length; uploadIndex++) {
      if (this.selectedAttachmentType[uploadIndex] === 'null' || this.selectedAttachmentType[uploadIndex] == null) {
            this.warningMsgObj.attachmentWarningMsg = '* Please fill all the mandatory fields';
      }
    }
    if (this.uploadedFile.length === 0) {
      this.warningMsgObj.attachmentWarningMsg = '* Please choose atleast one document';
    } else {
      for (const attachment of this.result.grantCall.grantCallAttachments) {
        if (this.uploadedFile.find(dupFile => dupFile.name === attachment.fileName) != null) {
          this.warningMsgObj.attachmentWarningMsg = '* Document already added';
          break;
        }
      }
    }
    this.checkAttachmentSize();
    if (this.warningMsgObj.attachmentWarningMsg == null) {
      for (let uploadIndex = 0; uploadIndex < this.uploadedFile.length; uploadIndex++) {
        const tempObjectForAdd: any = {};
        if (!this.isReplaceAttachment) {
          const attachTypeObj = this.result.grantCallAttachTypes.find( attachtype =>
                                attachtype.grantAttachmentTypeCode === parseInt(this.selectedAttachmentType[uploadIndex], 10));
            tempObjectForAdd.grantCallAttachType = attachTypeObj;
            tempObjectForAdd.grantAttachmentTypeCode = attachTypeObj.grantAttachmentTypeCode;
        } else {
          const attachTypeObj = this.result.grantCallAttachTypes.find( attachtype =>
                                attachtype.description === this.selectedAttachmentType[uploadIndex]);
            tempObjectForAdd.grantCallAttachType = attachTypeObj;
            tempObjectForAdd.grantAttachmentTypeCode = attachTypeObj.grantAttachmentTypeCode;
            tempObjectForAdd.attachmentId = this.replaceAttachmentObj.attachmentId;
        }
        tempObjectForAdd.description = this.selectedAttachmentDescription[uploadIndex];
        tempObjectForAdd.fileName = this.uploadedFile[uploadIndex].name;
        tempObjectForAdd.updateTimeStamp = new Date().getTime();
        tempObjectForAdd.updateUser = localStorage.getItem('userFullname');
        tempArrayForAdd[uploadIndex] = tempObjectForAdd;
    }
    this.result.newAttachments = tempArrayForAdd;
    this.result.grantCall.updateUser = localStorage.getItem('currentUser');

    this._spinner.show();
    const formData = new FormData();
    for (const file of this.uploadedFile) {
      formData.append( 'files', file );
    }
    formData.append( 'formDataJson', JSON.stringify( {'grantCall': this.result.grantCall,
      'newAttachments': this.result.newAttachments, 'userFullName': localStorage.getItem('userFullname')} ) );
    this._grantService.addGrantCallAttachment( formData ).subscribe( success => {
      let temporaryAttachmentObject: any = {};
      temporaryAttachmentObject = success;
      this.result.grantCall = temporaryAttachmentObject.grantCall;
    },
    error => {
      console.log( error );
      this._spinner.hide();
      this.showDataFlagObj.isShowAttachmentList = true;
      this.modalHideAndShowObj.isShowAddAttachment = false;
      this.clearAttachmentDetails();
      $('#addGrantAttachment').modal('hide');
      const toastId = document.getElementById('attach-toast-fail');
       toastId.className = 'show';
       setTimeout(function () {
       toastId.className = toastId.className.replace('show', '');
      }, 2000);
    },
    () => {
      this.showDataFlagObj.isAttachmentVersionOpen = [];
      this._spinner.hide();
      this.showDataFlagObj.isShowAttachmentList = true;
      this.modalHideAndShowObj.isShowAddAttachment = false;
      this.clearAttachmentDetails();
      this.showDataFlagObj.isDataChange = true;
      $('#addGrantAttachment').modal('hide');
    });
    }
  }

  downloadAttachments( attachment ) {
    if (attachment.attachmentId != null) {
      this._grantService.downloadAttachment( attachment.attachmentId )
      .subscribe( data => {
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob( new Blob([data], { type: attachment.mimeType }), attachment.fileName );
        } else {
          const a = document.createElement( 'a' );
          a.href = URL.createObjectURL( data );
          a.download = attachment.fileName;
          document.body.appendChild(a);
          a.click();
        }
      } );
    } else {
      const URL = 'data:' + attachment.mimeType + ';base64,' + attachment.attachment;
      const a = document.createElement( 'a' );
      a.href = URL;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
    }
  }

}
