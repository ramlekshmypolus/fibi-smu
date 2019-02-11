import { Component, OnInit, Input } from '@angular/core';

import { ProposalHomeService } from '../../proposal-home.service';
import { CommonService } from '../../../../common/services/common.service';

declare var require: any;
const Holidays = require('date-holidays');

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.css']
})
export class ProposalDetailsComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() warningMsgObj: any = {};
  @Input() proposalDataBindObj: any = {};
  @Input() mandatoryObj: any = {};

  isSearchLeadUnitActive = false;
  isSearchSponsorActive = false;

  leadUnits: any = [];

  leadUnitIconClass = 'fa fa-search fa-med';
  sponsorIconClass  = 'fa fa-search fa-med';
  keywordIconClass = 'fa fa-search fa-med';

  constructor( private _proposalHomeService: ProposalHomeService, private _commonService: CommonService ) { }

  ngOnInit() {
    this.leadUnitIconClass = this.result.proposal.homeUnitName ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    this.sponsorIconClass = this.result.proposal.homeUnitName ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  proposalCategoryChange() {
    if (this.proposalDataBindObj.selectedProposalCategory === 'null') {
      this.result.proposal.activityTypeCode = null;
      this.result.proposal.activityType = null;
    } else {
      const categoryObj = this.result.activityTypes.find( category =>
                          category.description === this.proposalDataBindObj.selectedProposalCategory);
      this.result.proposal.activityTypeCode = categoryObj.code;
      this.result.proposal.activityType = categoryObj;
    }
  }

  proposalTypeChange() {
    if (this.proposalDataBindObj.selectedProposalType === 'null') {
      this.result.proposal.proposalType = null;
      this.result.proposal.typeCode = null;
    } else {
      const typeObj = this.result.proposalTypes.find( category =>
                          category.description === this.proposalDataBindObj.selectedProposalType);
      this.result.proposal.proposalType = typeObj;
      this.result.proposal.typeCode = typeObj.typeCode;
    }
  }

  leadUnitChangeFunction() {
    this.leadUnitIconClass = this.result.proposal.homeUnitName ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    this._proposalHomeService.fetchLeadUnit(this.result.proposal.homeUnitName, localStorage.getItem('personId')).subscribe(data => {
        this.leadUnits = data;
    });
  }

  leadUnitSelectFunction(selectedLeadUnit) {
    const homeUnitObj = this.leadUnits.find( homeunit => homeunit.unitName === selectedLeadUnit.unitName);
    if (homeUnitObj != null) {
      this.result.proposal.homeUnitNumber = homeUnitObj.unitNumber;
      this.result.proposal.homeUnitName = homeUnitObj.unitName;
      this.leadUnitIconClass = this.result.proposal.homeUnitName ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    }
  }

  clearLeadUnitSearchBox( e ) {
    e.preventDefault();
    this.result.proposal.homeUnitName = '';
    this.result.proposal.homeUnitNumber = null;
    this.leadUnitIconClass =  this.result.proposal.homeUnitName ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  sponsorChangeFunction() {
    this.sponsorIconClass = this.result.proposal.sponsorName ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    this._proposalHomeService.fetchSponsors(this.result.proposal.sponsorName).subscribe(data => {
        this.result.sponsors = data;
    });
  }

  sponsorSelectFunction(selectedSponsor) {
    const sponsorObj = this.result.sponsors.find( sponsor => sponsor.sponsorName === selectedSponsor.sponsorName);
    if (sponsorObj != null) {
      this.result.proposal.sponsorCode = sponsorObj.sponsorCode;
      this.result.proposal.sponsorName = sponsorObj.sponsorName;
      this.sponsorIconClass = this.result.proposal.sponsorName ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    }
  }

  clearSponsorSearchBox(e) {
      e.preventDefault();
      this.result.proposal.sponsorName = '';
      this.result.proposal.sponsorCode = null;
      this.sponsorIconClass = this.result.proposal.sponsorName ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  dateValidation() {
    const currentDate: Date = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if ( this.proposalDataBindObj.sponsorDeadlineDate != null &&
        new Date(this.proposalDataBindObj.sponsorDeadlineDate) < currentDate ) {
        this.warningMsgObj.dateWarningText = '* Please select a sponsor deadline date from today';
    } else if ( this.proposalDataBindObj.sponsorDeadlineDate != null &&
        new Date(this.proposalDataBindObj.internalDeadlineDate) <= currentDate ) {
        this.warningMsgObj.dateWarningText = '* Internal deadline date already passed. Please choose another sponsor deadline date.';
    } else if ( this.proposalDataBindObj.proposalStartDate != null && this.proposalDataBindObj.proposalEndDate != null &&
        new Date(this.proposalDataBindObj.proposalStartDate) <= new Date(this.proposalDataBindObj.proposalEndDate) ) {
        this.warningMsgObj.dateWarningText = null;
    } else if ( new Date(this.proposalDataBindObj.proposalStartDate) > new Date(this.proposalDataBindObj.proposalEndDate) ) {
        this.warningMsgObj.dateWarningText = '* Please select an end date after start date';
    } else {
        this.warningMsgObj.dateWarningText = null;
    }
  }

  getInternalDeadlineDate(sponsorDeadlineDate) {
    this.proposalDataBindObj.internalDeadlineDate = null;
    let dateCount = 0;
    let isDateDecrement = false;
    let holidaysArray = [];
    if (sponsorDeadlineDate !== null) {
      const YEAR = new Date(sponsorDeadlineDate).getFullYear();
      holidaysArray = new Holidays('US').getHolidays(YEAR);
      this.proposalDataBindObj.internalDeadlineDate = new Date(sponsorDeadlineDate);
      do {
          this.proposalDataBindObj.internalDeadlineDate.setDate(this.proposalDataBindObj.internalDeadlineDate.getDate() - 1);
          if (new Date(this.proposalDataBindObj.internalDeadlineDate).getFullYear() !== YEAR) {
              holidaysArray = new Holidays('US').getHolidays(new Date(this.proposalDataBindObj.internalDeadlineDate).getFullYear());
          }
          for (const HOLIDAY of holidaysArray) {
              if (this.proposalDataBindObj.internalDeadlineDate.getTime() !== new Date(HOLIDAY.date).getTime() &&
                  this.proposalDataBindObj.internalDeadlineDate.toString().split(' ')[0] !== 'Sun' &&
                  this.proposalDataBindObj.internalDeadlineDate.toString().split(' ')[0] !== 'Sat') {
                  isDateDecrement = true;
              } else {
                  isDateDecrement = false; break;
              }
          }
          if (isDateDecrement) {
              dateCount++;
          } else {
          }
      } while (dateCount < 5);
    }
    this.result.proposal.internalDeadLineDate = new Date(this.proposalDataBindObj.internalDeadlineDate).getTime();
    this.dateValidation();
  }

  keywordChangeFunction() {
    this.keywordIconClass = this.proposalDataBindObj.selectedKeyword ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    this._proposalHomeService.fetchKeyword(this.proposalDataBindObj.selectedKeyword).subscribe(data => {
        this.result.scienceKeywords = data;
    });
  }

  keywordSelectFunction(selectedResult) {
    this.proposalDataBindObj.selectedKeyword = selectedResult.description;
    let keywordFlag = false;
    const keywordObject: any = {};
    if (this.result.proposal.proposalKeywords.length !== 0) {
      const dupKeywordObject = this.result.proposal.proposalKeywords.find( dupKeyword =>
                         dupKeyword.scienceKeyword.description === this.proposalDataBindObj.selectedKeyword);
      if ( dupKeywordObject != null) {
        keywordFlag = true;
        this.warningMsgObj.keywordWarningText = '* Keyword already added';
      }
    }
    if (keywordFlag === false) {
      const dupKeywordObject = this.result.scienceKeywords.find( keyword =>
                               keyword.description === this.proposalDataBindObj.selectedKeyword);
      if (dupKeywordObject != null) {
        keywordObject.scienceKeyword = dupKeywordObject;
        keywordObject.scienceKeywordCode = dupKeywordObject.code;
        keywordObject.updateTimeStamp = new Date().getTime();
        keywordObject.updateUser = localStorage.getItem('currentUser');
        this.result.proposal.proposalKeywords.push(keywordObject);
        this.warningMsgObj.keywordWarningText = null;
      }
    } else {
        this.warningMsgObj.keywordWarningText = '* Keyword already added';
    }
    this.proposalDataBindObj.selectedKeyword = '';
  }

  deleteKeyword(id, index) {
    this.warningMsgObj.keywordWarningText = null;
    if (id != null) {
      this._proposalHomeService.deleteProposalKeyword({'proposalId': this.result.proposal.proposalId,
      'keywordId': id}).subscribe(success => {
          this.result.proposal.proposalKeywords.splice(index, 1);
        });
    } else {
      this.result.proposal.proposalKeywords.splice(index, 1);
    }
    this.proposalDataBindObj.selectedKeyword = '';
    this.keywordIconClass = this.proposalDataBindObj.selectedKeyword ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  clearKeywordSearchBox(e) {
      e.preventDefault();
      this.proposalDataBindObj.selectedKeyword = '';
      this.keywordIconClass = this.proposalDataBindObj.selectedKeyword ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

}
