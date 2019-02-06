import { Component, OnInit, Input } from '@angular/core';
import { ProposalHomeService } from '../../proposal-home.service';

declare var $: any;
@Component({
  selector: 'app-supporting-documents',
  templateUrl: './supporting-documents.component.html',
})
export class SupportingDocumentsComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() warningMsgObj: any = {};
  @Input() proposalDataBindObj: any = {};

  isReplaceAttachment = false;
  isShowAddAttachment = false;
  isShowDeleteAttachment = false;

  removeObjIndex: number;
  removeObjId: number;

  replaceAttachmentObj: any = {};
  uploadedFile = [];
  selectedAttachmentStatus = [];
  selectedAttachmentDescription = [];
  selectedAttachmentType: any[] = [];

  constructor( private _proposalHomeService: ProposalHomeService) { }

  ngOnInit() {}

  showAddAttachmentPopUp(event, attachment) {
    event.preventDefault();
    this.isShowAddAttachment = true;
    if (this.isReplaceAttachment) {
      this.replaceAttachmentObj = attachment;
    }
  }

  clearAttachmentDetails() {
    this.warningMsgObj.attachmentWarningMsg = null;
    this.uploadedFile = [];
    this.isShowAddAttachment = false;
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
          this.selectedAttachmentStatus[this.uploadedFile.length - 1] = null;
        } else if (this.isReplaceAttachment === true) {
          if (files.length === 1) {
            this.uploadedFile = [];
            this.uploadedFile.push(files[index]);
            this.selectedAttachmentType[this.uploadedFile.length - 1] = this.replaceAttachmentObj.attachmentType.description;
            this.selectedAttachmentDescription[this.uploadedFile.length - 1] = this.replaceAttachmentObj.description;
            this.selectedAttachmentStatus[this.uploadedFile.length - 1] = this.replaceAttachmentObj.narrativeStatus.description;
          } else {
            this.warningMsgObj.attachmentWarningMsg = '* Choose only one document to replace';
          }
        }
      }
    }
  }

  checkAttachmentSize() {
    for ( let sizeIndex = 0; sizeIndex < this.uploadedFile.length; sizeIndex++ ) {
        if (this.uploadedFile[sizeIndex].size > 19591292) {
          this.warningMsgObj.attachmentWarningMsg = '* Document size must be  below 20MB';
        }
    }
  }

  deleteFromUploadedFileList(index) {
    this.uploadedFile.splice(index, 1);
  }

  addAttachments() {
    const tempArrayForAdd = [];
    this.warningMsgObj.attachmentWarningMsg = null;
    for (let uploadIndex = 0; uploadIndex < this.uploadedFile.length; uploadIndex++) {
      if (this.selectedAttachmentType[uploadIndex] === 'null' || this.selectedAttachmentType[uploadIndex] == null ||
          this.selectedAttachmentStatus[uploadIndex] === 'null' || this.selectedAttachmentStatus[uploadIndex] == null) {
            this.warningMsgObj.attachmentWarningMsg = '* Please fill all the mandatory fields';
      }
    }
    if (this.uploadedFile.length === 0) {
      this.warningMsgObj.attachmentWarningMsg = '* Please choose atleast one document';
    } else {
      for (const attachment of this.result.proposal.proposalAttachments) {
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
          const attachTypeObj = this.result.proposalAttachmentTypes.find( attachtype =>
                                attachtype.attachmentTypeCode === parseInt(this.selectedAttachmentType[uploadIndex], 10));
            tempObjectForAdd.attachmentType = attachTypeObj;
            tempObjectForAdd.attachmentTypeCode = attachTypeObj.attachmentTypeCode;
        } else {
          const attachTypeObj = this.result.proposalAttachmentTypes.find( attachtype =>
                                attachtype.description === this.selectedAttachmentType[uploadIndex]);
            tempObjectForAdd.attachmentType = attachTypeObj;
            tempObjectForAdd.attachmentTypeCode = attachTypeObj.attachmentTypeCode;
          tempObjectForAdd.attachmentId = this.replaceAttachmentObj.attachmentId;
        }
        const statusObj = this.result.narrativeStatus.find( status => status.description === this.selectedAttachmentStatus[uploadIndex]);
        tempObjectForAdd.narrativeStatus = statusObj;
        tempObjectForAdd.narrativeStatusCode = statusObj.code;

        tempObjectForAdd.description = this.selectedAttachmentDescription[uploadIndex];
        tempObjectForAdd.fileName = this.uploadedFile[uploadIndex].name;
        tempObjectForAdd.updateTimeStamp = new Date().getTime();
        tempObjectForAdd.updateUser = localStorage.getItem('currentUser');
        tempArrayForAdd[uploadIndex] = tempObjectForAdd;
    }
    this.result.newAttachments = tempArrayForAdd;
    this.result.proposal.updateUser = localStorage.getItem('currentUser');

    const formData = new FormData();
    formData.delete( 'files' );
    formData.delete( 'formDataJson' );
    for (const file of this.uploadedFile) {
      formData.append( 'files', file );
    }
    formData.append( 'formDataJson', JSON.stringify( {'proposal': this.result.proposal,
      'newAttachments': this.result.newAttachments} ) );
    this._proposalHomeService.addProposalAttachment( formData).subscribe( success => {
    let temporaryObject: any = {};
    temporaryObject = success;
    this.result.proposal = temporaryObject.proposal;
    },
    error => {
      console.log( error );
            },
    () => {
      this.clearAttachmentDetails();
      $('#addAttachment').modal('hide');
    } );
    }
  }

  temprySaveAttachments(removeId, removeIndex) {
    this.removeObjId = removeId;
    this.removeObjIndex = removeIndex;
    this.isShowDeleteAttachment = true;
  }

  deleteAttachments() {
    if (this.removeObjId == null) {
      this.result.proposal.proposalAttachments.splice(this.removeObjIndex, 1);
    } else {
      this._proposalHomeService.deleteProposalAttachment({'proposalId': this.result.proposal.proposalId,
        'attachmentId': this.removeObjId}).subscribe(data => {
        this.result.proposal.proposalAttachments.splice(this.removeObjIndex, 1);
      });

    }
  }

  downloadProposalAttachments( attachment ) {
    if (attachment.attachmentId != null) {
      this._proposalHomeService.downloadProposalAttachment( attachment.attachmentId )
      .subscribe( data => {
        const a = document.createElement( 'a' );
        a.href = URL.createObjectURL( data );
        a.download = attachment.fileName;
        document.body.appendChild(a);
        a.click();
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
