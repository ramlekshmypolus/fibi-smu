import { Component, OnInit, Input } from '@angular/core';

import { ProposalHomeService } from '../../proposal-home.service';

@Component({
  selector: 'app-area-of-research',
  templateUrl: './area-of-research.component.html'
})
export class AreaOfResearchDetailsComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() warningMsgObj: any = {};
  @Input() proposalDataBindObj: any = {};

  isSearchResearchTypeActive = false;
  isShowDeleteResearchArea = false;

  selectedAreaOfResearch: string;
  researchAreaTypeIconClass = 'fa fa-search fa-med';
  index: number;

  selectedAreaOfResearchObject: any = {};
  tempraryAreaObject: any = {};
  requestObj: any = {};

  constructor(private _proposalHomeService: ProposalHomeService) { }

  ngOnInit() {
    this.proposalDataBindObj.selectedResearchType = this.result.proposalResearchTypes[0].description;
    this.proposalDataBindObj.selectedAreaType = this.result.proposalResearchTypes[0].description;
    this.researchAreaTypeIconClass = this.selectedAreaOfResearch ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  /* select type of research */
  researchTypeChange(type) {
    this.selectedAreaOfResearch = '';
    this.proposalDataBindObj.selectedAreaType = type;
  }

  /* changes research type */
  researchAreaTypeChange(type) {
    if (type === 'Area of Excellence') {
      this.researchAreaTypeIconClass = this.selectedAreaOfResearch ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
      this._proposalHomeService.fetchAreaOfExcellence(this.selectedAreaOfResearch).subscribe(data => {
        let temp: any = {};
        temp = data;
        this.result.proposalExcellenceAreas = temp;
      });

    } else {
      this.researchAreaTypeIconClass = this.selectedAreaOfResearch ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
      this._proposalHomeService.fetchAreaOfResearch(this.selectedAreaOfResearch).subscribe(data => {
        let temp: any = {};
        temp = data;
        this.result.researchAreas = temp;
      });
    }
  }

  /* sets selected value  from result */
  researchTypeSelectedFunction(result) {
    this.selectedAreaOfResearchObject = result;
    this.selectedAreaOfResearch = result.description;
    this.researchAreaTypeIconClass = this.selectedAreaOfResearch ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  /* clears research type searchbox */
  clearResearchTypeSearchBox(e) {
    e.preventDefault();
    this.selectedAreaOfResearch = '';
    this.researchAreaTypeIconClass = this.selectedAreaOfResearch ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  /* adds area of research */
  addAreaOfResearch() {
    const areaOfResearchObject: any = {};
    this.warningMsgObj.areaOfResearchWarningMsg = null;
    if (this.selectedAreaOfResearch != null && this.selectedAreaOfResearch !== '') {
      if (this.result.proposal.proposalResearchAreas.length !== 0) {
        for (const dupAreaOfResearchObject of this.result.proposal.proposalResearchAreas) {
          if (this.proposalDataBindObj.selectedAreaType === 'Area of Excellence' &&
          dupAreaOfResearchObject.proposalExcellenceArea != null &&
          dupAreaOfResearchObject.proposalExcellenceArea.description === this.selectedAreaOfResearch) {
            this.warningMsgObj.areaOfResearchWarningMsg = 'Area already added';
            break;
          } else if (this.proposalDataBindObj.selectedAreaType === 'Area of Research' &&
          dupAreaOfResearchObject.researchArea != null &&
          dupAreaOfResearchObject.researchArea.description === this.selectedAreaOfResearch) {
            this.warningMsgObj.areaOfResearchWarningMsg = 'Area already added';
            break;
          }
        }
      }
      if (this.warningMsgObj.areaOfResearchWarningMsg == null) {
        if (this.proposalDataBindObj.selectedAreaType === 'Area of Excellence') {
          if (this.selectedAreaOfResearchObject != null && this.selectedAreaOfResearchObject.description === this.selectedAreaOfResearch) {
            areaOfResearchObject.researchTypeCode = this.result.proposalResearchTypes[0].researchTypeCode;
            areaOfResearchObject.proposalResearchType = this.result.proposalResearchTypes[0];
            areaOfResearchObject.excellenceAreaCode = this.selectedAreaOfResearchObject.excellenceAreaCode;
            areaOfResearchObject.proposalExcellenceArea = this.selectedAreaOfResearchObject;
          }
        } else {
          if (this.selectedAreaOfResearchObject != null && this.selectedAreaOfResearchObject.description === this.selectedAreaOfResearch ) {
            areaOfResearchObject.researchTypeCode = this.result.proposalResearchTypes[1].researchTypeCode;
            areaOfResearchObject.proposalResearchType = this.result.proposalResearchTypes[1];
            areaOfResearchObject.researchAreaCode = this.selectedAreaOfResearchObject.researchAreaCode;
            areaOfResearchObject.researchArea = this.selectedAreaOfResearchObject;
          }
        }
        areaOfResearchObject.updateTimeStamp = new Date().getTime();
        areaOfResearchObject.updateUser = localStorage.getItem('currentUser');
        this.result.proposal.proposalResearchAreas.push(areaOfResearchObject);
        this.showOrHideDataFlagsObj.dataChangeFlag = true;
      }
    }
    this.selectedAreaOfResearch = '';
    this.selectedAreaOfResearchObject = {};
    this.researchAreaTypeIconClass = this.selectedAreaOfResearch ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  /* temporarary saves area of research object before deletion */
  temprySaveAreaOfResearch(e, area, i) {
    e.preventDefault();
    this.isShowDeleteResearchArea = true;
    this.tempraryAreaObject = area;
    this.index = i;
  }

  /*deletes area of reasearch*/
  deleteAreaOfResearch() {
    this.requestObj.proposalId = this.result.proposal.proposalId;
    this.requestObj.researchAreaId = this.tempraryAreaObject.researchAreaId;
    if (this.tempraryAreaObject.researchAreaId != null) {
      this._proposalHomeService.deleteProposalResearchArea(this.requestObj)
      .subscribe(() => {});
    }
    this.result.proposal.proposalResearchAreas.splice(this.index, 1);
    if (this.result.proposal.proposalResearchAreas.length === 0) {
      this.result.proposal.researchDescription = '';
    }
  }

}
