import { Component, OnInit, Input } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { CommonService } from '../../../../common/services/common.service';
import { ProposalHomeService } from '../../proposal-home.service';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.css']
})
export class ProjectTeamComponent implements OnInit {
  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() warningMsgObj: any = {};
  @Input() proposalDataBindObj: any = {};

  isNonEmployeeFlag = false;
  isSearchDepartmentActive = false;
  isShowDeleteMember = false;

  memberTypeSelected = 'Employee';
  personRoleSelected: string;
  departmentSelected: string;
  departmentIconClass = 'fa fa-search fa-med';
  clearField;
  percentageEffort: number;
  index: number;

  elasticSearchOptions: any = {};
  tempSavePersonObject: any = {};
  selectedMemberObject: any;
  requestObject: any = {};
  memberTypes = [
    { name: 'Employee', value: 'Employee' },
    { name: 'Non-Employee', value: 'Non-Employee' }
  ];
  personDepartments: any = [];

  constructor(private _commonService: CommonService, private _proposalHomeService: ProposalHomeService) { }

  ngOnInit() {
    this.proposalDataBindObj.personRoleSelected = null;
    this.proposalDataBindObj.personRolesList = this.result.proposalPersonRoles;
    this.elasticSearchOptions.url = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'fibiperson';
    this.elasticSearchOptions.type = 'person';
    this.elasticSearchOptions.size = 20;
    this.elasticSearchOptions.contextField = 'full_name';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      full_name: {},
      prncpl_nm: {}
    };
  }

  /* assigns elastic result to an object */
  selectedMemberName(value) {
    this.selectedMemberObject = value;
  }

  /* calls elastic search according to member type selected */
  memberTypeChanged() {
    // tslint:disable-next-line:no-construct
    this.clearField = new String('true');
    this.selectedMemberObject = null;
    if (this.memberTypeSelected === 'Employee') {
      this.isNonEmployeeFlag = false;
      this.elasticSearchOptions.index = 'fibiperson';
      this.elasticSearchOptions.type = 'person';
      this.elasticSearchOptions.contextField = 'full_name';
      this.elasticSearchOptions.fields = {
        full_name: {},
        prncpl_nm: {}
      };
    } else {
      this.isNonEmployeeFlag = true;
      this.elasticSearchOptions.index = 'fibirolodex';
      this.elasticSearchOptions.type = 'rolodex';
      this.elasticSearchOptions.contextField = 'first_name';
      this.elasticSearchOptions.fields = {
        first_name: {},
        last_name: {},
        middle_name: {},
        organization: {}
      };
    }
  }

  /* validation for percentage effort field */
  checkPercentageEffortValidation() {
    this.warningMsgObj.isPercentageValueErrorMsg = null;
    if (this.percentageEffort != null && this.percentageEffort < 0 || this.percentageEffort > 100) {
      this.warningMsgObj.isPercentageValueErrorMsg = '* Please enter percentage value between 0 and 100.';
    } else {
      this.warningMsgObj.isPercentageValueErrorMsg = null;
    }
  }

  /* fetches department */
  departmentFetchCall() {
    this.departmentIconClass = this.departmentSelected ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
    this._proposalHomeService.fetchDepartment(this.departmentSelected).subscribe(data => {
      let temp: any = {};
      temp = data;
      this.result.departments = temp;
    });
  }

  /* clears department search box */
  clearDepartmentSearchBox(e) {
    e.preventDefault();
    this.departmentSelected = '';
    this.departmentIconClass = this.departmentSelected ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  /* pushes selected department into list of departments if there is no duplication  */
  departmentChangeFunction(result) {
    this.warningMsgObj.departmentWarningMsg = null;
    const departmentObject: any = {};
    let selectedDepartmentObject: any = {};
    selectedDepartmentObject = result;
    this.departmentSelected = result.unitDetail;
    if (this.personDepartments.length !== 0) {
      const departmentObj = this.personDepartments.find(department => department.unit.unitDetail === this.departmentSelected);
      this.warningMsgObj.departmentWarningMsg = departmentObj != null ? '* Department already added' : null;
    }
    if (this.warningMsgObj.departmentWarningMsg === null) {
      if (selectedDepartmentObject != null && selectedDepartmentObject.unitDetail === this.departmentSelected) {
        departmentObject.unit = selectedDepartmentObject;
        departmentObject.unitNumber = selectedDepartmentObject.unitNumber;
        departmentObject.updateTimeStamp = new Date().getTime();
        departmentObject.updateUser = localStorage.getItem('currentUser');
        this.personDepartments.push(departmentObject);
      }
    }
    this.departmentSelected = '';
    this.departmentIconClass = this.departmentSelected ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
  }

  /* delete departments selected */
  deleteDepartment(depart, k) {
    this.warningMsgObj.departmentWarningMsg = null;
    this.personDepartments.forEach(element => {
      if (element.unit.unitDetail === depart.unit.unitDetail) {
        this.personDepartments.splice(k, 1);
      }
    });
    this.departmentSelected = '';
  }

  /* adds proposal team member */
  addProposalTeamMember() {
    const tempDeptObj: any = {};
    this.warningMsgObj.personWarningMsg = null;
    if (this.selectedMemberObject != null && this.proposalDataBindObj.personRoleSelected !== null &&
      this.proposalDataBindObj.personRoleSelected !== 'null') {
      if (!this.isNonEmployeeFlag) {
        tempDeptObj.personId = this.selectedMemberObject.prncpl_id;
        tempDeptObj.fullName = this.selectedMemberObject.full_name;
        tempDeptObj.emailAddress = this.selectedMemberObject.email_addr;
      } else {
        this.selectedMemberObject.first_name = (this.selectedMemberObject.first_name == null) ?
                                               '' : this.selectedMemberObject.first_name;
        this.selectedMemberObject.middle_name = (this.selectedMemberObject.middle_name == null) ?
                                               '' : this.selectedMemberObject.middle_name;
        this.selectedMemberObject.last_name = (this.selectedMemberObject.last_name == null) ?
                                               '' : this.selectedMemberObject.last_name;
        this.selectedMemberObject.organization = (this.selectedMemberObject.organization == null) ?
                                               '' : this.selectedMemberObject.organization;
        tempDeptObj.rolodexId = this.selectedMemberObject.rolodex_id;
        tempDeptObj.fullName = (this.selectedMemberObject.first_name == null || this.selectedMemberObject.first_name === '') &&
          (this.selectedMemberObject.middle_name == null || this.selectedMemberObject.middle_name === '') &&
          (this.selectedMemberObject.last_name == null || this.selectedMemberObject.last_name === '') ?
          this.selectedMemberObject.organization : this.selectedMemberObject.last_name + ' , ' +
          this.selectedMemberObject.middle_name + ' ' + this.selectedMemberObject.first_name;
      }
      this.proposalDataBindObj.personRolesList.forEach((value, index) => {
        if (value.description === this.proposalDataBindObj.personRoleSelected) {
          tempDeptObj.proposalPersonRole = value;
          tempDeptObj.personRoleId = value.id;
        }
      });
      if (this.result.proposal.proposalPersons.length !== 0) {
        for (const PERSON of this.result.proposal.proposalPersons) {
          if (PERSON.proposalPersonRole.description === 'Principal Investigator' &&
            tempDeptObj.proposalPersonRole.description === 'Principal Investigator') {
            this.warningMsgObj.personWarningMsg = '* You have already added a Principal Investigator';
            this.clearField = 'false';
            this.proposalDataBindObj.personRoleSelected = null;
            break;
          } if (PERSON.fullName === tempDeptObj.fullName) {
            this.warningMsgObj.personWarningMsg = '* You have already added ' + tempDeptObj.fullName;
            this.selectedMemberObject = null;
            break;
          }
        }
      }
      if (this.warningMsgObj.personWarningMsg === null && !this.warningMsgObj.isPercentageValueErrorMsg) {
        tempDeptObj.updateTimeStamp = (new Date()).getTime();
        tempDeptObj.updateUser = localStorage.getItem('currentUser');
        tempDeptObj.percentageOfEffort = this.percentageEffort == null ? 0 : this.percentageEffort;
        if (this.personDepartments.length === 0 && this.result.departments === null) {
            this._proposalHomeService.fetchDepartment(this.selectedMemberObject.unit_number).subscribe(data => {
              let temp: any = {};
              temp = data;
              this.result.departments = temp;
              for (const deptObj of this.result.departments) {
                const tempDeptmtObj: any = {};
                tempDeptmtObj.unit = deptObj;
                tempDeptmtObj.unitNumber = deptObj.unitNumber;
                tempDeptmtObj.updateTimeStamp = new Date().getTime();
                tempDeptmtObj.updateUser = localStorage.getItem('currentUser');
                this.personDepartments.push(tempDeptmtObj);
              }
              tempDeptObj.units = this.personDepartments;
              this.result.departments = null;
              this.personDepartments = [];
            });
        } else {
          tempDeptObj.units = this.personDepartments;
        }
        this.result.proposal.proposalPersons.push(tempDeptObj);
        this.showOrHideDataFlagsObj.dataChangeFlag = true;
        this.memberTypeSelected = 'Employee';
        this.memberTypeChanged();
        this.proposalDataBindObj.personRoleSelected = null;
        this.percentageEffort = null;
        this.departmentSelected = null;
        this.result.departments = null;
        this.personDepartments = [];
        this.departmentIconClass = this.departmentSelected ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
      }
    } else if (this.proposalDataBindObj.personRoleSelected === 'null' || this.proposalDataBindObj.personRoleSelected === null) {
      this.warningMsgObj.personWarningMsg = '* Please choose a role';
    } else {
      this.warningMsgObj.personWarningMsg = '* Please choose name of a member';
    }
  }

  /* saves project team member details before deletion */
  tempSavePerson(e, person, i) {
    e.preventDefault();
    this.isShowDeleteMember = true;
    this.tempSavePersonObject = person;
    this.index = i;
  }

  /* deletes project team member details */
  deletePerson() {
    this.isShowDeleteMember = false;
    this.requestObject.proposalId = this.result.proposal.proposalId;
    this.requestObject.proposalPersonId = this.tempSavePersonObject.proposalPersonId;
    if (this.tempSavePersonObject.proposalPersonId == null) {
      this.result.proposal.proposalPersons.splice(this.index, 1);
    } else {
      this._proposalHomeService.deleteProposalPerson(this.requestObject)
        .subscribe(data => {
          this.result.proposal.proposalPersons.splice(this.index, 1);
        });
    }
    this.memberTypeSelected = 'Employee';
  }

}
