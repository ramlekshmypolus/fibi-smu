import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { UnitHierarchyService } from '../unit-hierarchy.service';
import { CommonService } from '../../common/services/common.service';


@Component({
  selector: 'app-hierarchy-treeview',
  templateUrl: './hierarchy-treeview.component.html',
  styleUrls: ['./hierarchy-treeview.component.css']
})

export class HierarchyTreeviewComponent implements OnInit {

  unitList: any;
  isDropdown: boolean;
  selectedNode: any;
  treeData = [];
  unitProperties: any = {
    unit: {
      unitNumber: null,
      parentUnitNumber: null,
      unitName: null,
      organizationId: '000001',
      updateUser: '',
      objectId: '151GH433UZT7W110872R2',
      versionNumber: '1',
      active: true
    },
    unitAdministrators: [{}]
  };
  isViewmode = false;
  parentNode: any;
  isParentUnitNumEmpty = false;
  isUnitNumEmpty = false;
  isUnitNumLength = false;
  isUnitNumRepeat = false;
  isUnitNumDataType = false;
  isUnitNameEmpty = false;
  isUnitNameLength = false;
  isAdministratorsRepeat = false;
  isSameUnit = false;
  isValueChanged = false;
  isAdmnUserEmpty: any = [];
  isAdmnTypeEmpty: any = [];
  elasticSearchOptions: any = {};
  unitId: any;
  isPersonEdit: any = [];
  unitAdministratorTypeList: any = [];
  searchText: any;
  tempPersonId: any;
  tempAdmnArray = [];

  constructor(private _treeService: UnitHierarchyService,
    public _commonService: CommonService,
    private _spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.unitProperties.unit.updateUser = localStorage.getItem('currentUser');
    this._spinner.show();
    this.getTreeViewList();
    this.getSearchList();
    this.elasticSearchOptions.url = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'fibiperson';
    this.elasticSearchOptions.type = 'person';
    this.elasticSearchOptions.size = 20;
    this.elasticSearchOptions.contextField = 'full_name';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      // prncpl_id: {},
      full_name: {},
      // prncpl_nm: {},
      // email_addr: {},
      // unit_number: {},
      // unit_name: {},
      // addr_line_1: {},
      // phone_nbr: {}
    };
  }
  /**
   * Get treeview data for unit hierarchy list
   */
  getTreeViewList() {
    this._treeService.getHierarchylist().subscribe((data: any) => {
      this.treeData = data.unitHierarchyList;
      this.unitAdministratorTypeList = data.unitAdministratorTypeList;
      this.openAllNodes(this.treeData);
      this._spinner.hide();
    });
  }
  /**
  * Get search data for unit hierarchy list
  */
  getSearchList() {
    this._treeService.getUnitlist().subscribe((data: any) => {
      this.unitList = data;
    });
  }
  /**
   * @param  {} event
   * @param  {} node
   * Accordion functionality on clicking a specific node
   */
  listClick(event, node) {
    this.selectedNode = node;
    node.visible = !node.visible;
    event.stopPropagation();
  }
  /**
   * @param  {} nodes
   * Expand every nodes in the treeview
   */
  openAllNodes(nodes) {
    nodes.forEach(node => {
      node.visible = true;
      if (node.childUnits) {
        this.openAllNodes(node.childUnits);
      }
    });
  }
  /**
  * @param  {} unitId
  * Scroll to specific node and highlight it
  * on selecting specific field in the search box
  */
  selectUnit(unitId) {
    this.openAllNodes(this.treeData);
    this.unitId = unitId;
    this.isDropdown = false;
    setTimeout(() => {
      this.unitId = document.getElementById(unitId);
      this.unitId.scrollIntoView({ behavior: 'instant', block: 'center' });
      this.unitId.classList.add('highlight-node');
    }, 0);
    this.searchText = '';
  }
  /**
   * @param  {} node
   * sets the parent node for the new unit to be added.
   * clears input fields.
   * resets the valiadators.
   */
  addNewUnitParentSet(node) {
    this.validatorsReset();
    this.isDropdown = false;
    this.parentNode = node;
    this.unitProperties.unit.unitNumber = null;
    this.unitProperties.unit.parentUnitNumber = node.unitNumber;
    this.unitProperties.unit.parentUnitName = node.unitName;
    this.unitProperties.unit.unitName = null;
    this.unitProperties.unitAdministrators = [{
      personId: '', unitAdministratorTypeCode: '',
      objectId: '4FA4601B8483F7FE9501EACF7040167', versionNumber: '1',
    }];
  }
  /**
   * Checks empty validations To add new unit under selected unit.
   * considers parent unit, unit number and unit name
   * calls function which calls service to add new unit if the validations are correct.
   */
  addNewUnit() {
    if (this.unitProperties.unit.unitNumber == null || this.unitProperties.unit.unitNumber === '') {
      this.isUnitNumEmpty = true;
    }
    if (this.unitProperties.unit.unitName == null || this.unitProperties.unit.unitName === '') {
      this.isUnitNameEmpty = true;
    }
    if (this.unitProperties.unit.parentUnitNumber === 'null' || this.unitProperties.unit.parentUnitNumber === '') {
      this.isParentUnitNumEmpty = true;
    } else {
      this.isParentUnitNumEmpty = false;
    }
    if (this.unitProperties.unit.unitNumber === this.unitProperties.unit.parentUnitNumber) {
      this.isSameUnit = true;
    } else {
      this.isSameUnit = false;
    }
    const INDEX = this.unitProperties.unitAdministrators.length - 1;
    this.administratorRepeatValidation(this.unitProperties.unitAdministrators[INDEX]);
    this.administratorEmpty(INDEX);
    if (this.isParentUnitNumEmpty === false && this.isUnitNumEmpty === false && this.isUnitNumLength === false &&
      this.isUnitNumRepeat === false && this.isUnitNumDataType === false && this.isUnitNameEmpty === false &&
      this.isUnitNameLength === false && this.isAdministratorsRepeat === false && this.isSameUnit === false) {
      if (!this.isAdmnTypeEmpty.find((key) => key === true) && !this.isAdmnUserEmpty.find((key) => key === true)) {
        this.saveUnit();
      }
    }

  }
  /**
   * calls delete service to delete all the administrators stored in the tempAdmnArray
   * Calls the service to add new unit if the validations are correct.
   */
  saveUnit() {
    if (this.isValueChanged) {
      if (this.unitProperties.unitAdministrators.length === 0 ||
        this.unitProperties.unitAdministrators.length <= 1 &&
        this.unitProperties.unitAdministrators[0].personId === '' &&
        this.unitProperties.unitAdministrators[0].unitAdministratorTypeCode === '') {
        this.unitProperties.unitAdministrators = [];
      }
      delete this.unitProperties.unit.parentUnitName;
      if (this.tempAdmnArray.length !== 0) {
        this._treeService.deleteUnitAdministrator(this.tempAdmnArray)
          .subscribe((result: any) => { });
      }
      this._treeService.addNewUnit(this.unitProperties)
        .subscribe((data: any) => {
          if (data === 'Success') {
            document.getElementById('closeModal').click();
            this.getTreeViewList();
            this.getSearchList();
            this.openAllNodes(this.treeData);
            setTimeout(() => {
              this.unitId = document.getElementById(this.unitProperties.unit.unitNumber);
              this.unitId.scrollIntoView({ behavior: 'instant', block: 'center' });
              this.unitId.classList.add('highlight-node');
            }, 400);
          }
          this.validatorsReset();
        });
    } else {
      document.getElementById('closeModal').click();
    }
  }
  /**
   * @param  {} event
   * checks maximum length validations for the new unit to be added
   * considers unit number and name
   */
  checkLengthValidation(event, field) {
    if (field === 'unitNumber') {
      if (this.unitList.find((key) => key.unitNumber === event.target.value)) {
        this.isUnitNumRepeat = true;
      } else {
        this.isUnitNumRepeat = false;
      }
      if (event.target.value.length >= 9) {
        this.isUnitNumLength = true;
      } else {
        this.isUnitNumLength = false;
      }
      if (event.keyCode >= 65 && event.keyCode <= 90) {
        this.isUnitNumDataType = true;
      } else {
        this.isUnitNumDataType = false;
      }
      this.isUnitNumEmpty = false;
    } else {
      if (event.target.value.length === 60) {
        this.isUnitNameLength = true;
      } else {
        this.isUnitNameLength = false;
      }
      this.isUnitNameEmpty = false;
    }
  }
  /** select a result from elastic search
   * @param value
   */
  selectUserElasticResult(value, index) {
    if (value) {
      this.unitProperties.unitAdministrators[index].personId = value.prncpl_id;
      this.isAdmnUserEmpty[index] = false;
      this.isValueChanged = true;
    } else {
      this.isValueChanged = false;
        }
  }
  /**
  * @param  {} administrator
  * @param  {} index
  * validates if administrator is empty
  */
  administratorEmpty(index) {
    this.unitProperties.unitAdministrators.forEach((element, id) => {
      if (element.personId === '') {
        this.isAdmnUserEmpty[id] = true;
      } else {
        this.isAdmnUserEmpty[id] = false;
      }
      if (element.unitAdministratorTypeCode === '') {
        this.isAdmnTypeEmpty[id] = true;
      } else {
        this.isAdmnTypeEmpty[id] = false;
      }
      if (element.personId === '' && element.unitAdministratorTypeCode === '') {
        this.isAdmnUserEmpty[id] = true;
        this.isAdmnTypeEmpty[id] = true;
      }
      if (element.personId !== '' && element.unitAdministratorTypeCode !== '') {
        this.isAdmnUserEmpty[id] = false;
        this.isAdmnTypeEmpty[id] = false;
      }
    });
    if (index === this.unitProperties.unitAdministrators.length - 1) {
      if (this.unitProperties.unitAdministrators.length === 1 && this.unitProperties.unitAdministrators[0].personId === '' &&
        this.unitProperties.unitAdministrators[0].unitAdministratorTypeCode === '') {
        this.isAdmnUserEmpty[index] = false;
        this.isAdmnTypeEmpty[index] = false;
      }
      if (this.unitProperties.unitAdministrators.length !== 1 && this.unitProperties.unitAdministrators[index].personId === '' &&
        this.unitProperties.unitAdministrators[index].unitAdministratorTypeCode === '') {
        this.isAdmnUserEmpty.splice(index, 1);
        this.isAdmnTypeEmpty.splice(index, 1);
        this.unitProperties.unitAdministrators.splice(index, 1);
      }
    }
  }
  /**
     * @param  {} administrator
     * validates if administrator user with same role repeated.
     */
  administratorRepeatValidation(administrator) {
    const repeatAdmnArrayLength = this.unitProperties.unitAdministrators.filter(item =>
      item.personId === administrator.personId && item.unitAdministratorTypeCode === administrator.unitAdministratorTypeCode).length;
    if (repeatAdmnArrayLength > 1 && administrator.personId !== '' && administrator.unitAdministratorTypeCode !== '') {
      this.isAdministratorsRepeat = true;
    } else {
      this.isAdministratorsRepeat = false;
    }
  }
  /**
   * push new administrator object to unitAdministartor array if administrators not repeated
   */
  addUnitAdministrator(administrator, index) {
    this.administratorRepeatValidation(administrator);
    this.administratorEmpty(index);
    if (this.isAdministratorsRepeat !== true) {
      if ((administrator.personId !== '' && administrator.unitAdministratorTypeCode !== '') ||
        this.unitProperties.unitAdministrators.length === 0) {
        this.unitProperties.unitAdministrators.push({
          personId: '', unitAdministratorTypeCode: '',
          objectId: '4FA4601B8483F7FE9501EACF7040167', versionNumber: '1',
        });
      }
      this.isPersonEdit.push(null);
    }
  }
  /**
   * @param  {} index
   * removes selected object from unitAdministrator array when new units are adding
   */
  removeUnitAdministrator(administrator, index) {
    this.unitProperties.unitAdministrators.splice(index, 1);
    this.isPersonEdit.splice(index, 1);
    this.isAdministratorsRepeat = false;
    this.isValueChanged = false;
    if (this.unitProperties.unitAdministrators.length === 0) {
      this.addUnitAdministrator(administrator, index);
    }
  }
  /**
   * @param  {} unitNumber
   * returns details of selected unit
   */
  viewUnitDetails(node, editmode) {
    this.validatorsReset();
    this.isPersonEdit = [];
    this._treeService.viewUnitDetails(node.unitNumber)
      .subscribe((data: any) => {
        this.unitProperties = data;
        this.unitProperties.unitAdministrators.forEach(element => {
          this.isPersonEdit.push(true);
        });
        if (editmode === true && data.unitAdministrators.length === 0) {
          this.unitProperties.unitAdministrators = [{
            personId: '', unitAdministratorTypeCode: '',
            objectId: '4FA4601B8483F7FE9501EACF7040167', versionNumber: '1',
          }];
        }
      });
    this.isDropdown = false;
  }
  /**
   * @param  {} id
   * allows to change selected administrator person
   */
  adminPersonEdit(id, type) {
    this.unitProperties.unitAdministrators.forEach((value, index) => {
      if (index === id) {
        (this.isPersonEdit[index]) ? this.isPersonEdit[index] = false : this.isPersonEdit[index] = true;
      } else {
        this.isPersonEdit[index] = true;
      }
    });
    if (type === 'edit') {
      this.tempPersonId = this.unitProperties.unitAdministrators[id].personId;
      this.isAdmnUserEmpty[id] = true;
      this.unitProperties.unitAdministrators[id].personId = '';
    }
    if (type === 'undo') {
      this.unitProperties.unitAdministrators[id].personId = this.tempPersonId;
      this.isAdmnUserEmpty[id] = false;
    }
  }
  /**
   * @param  {scroll'} 'window
   * @param  {} []
   * @param  {} onWindowScroll(
   * to set scroll to top
   */
  @HostListener('window:scroll', []) onWindowScroll() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById('scrollUpBtn').style.display = 'block';
    } else {
      document.getElementById('scrollUpBtn').style.display = 'none';
    }
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  /**
   * @param  {} administrator
   * @param  {} index
   * removes selected object from unitAdministrator array when editing existing units
   * stores removed unit administrators in tempAdmnArray
   */
  deleteUnitAdministrator(administrator, index) {
    delete administrator.unitAdministratorType;
    delete administrator.fullName;
    this.tempAdmnArray.push(administrator);
    this.unitProperties.unitAdministrators.splice(index, 1);
    this.isPersonEdit.splice(index, 1);
    this.isAdmnUserEmpty.splice(index, 1);
    this.isAdmnTypeEmpty.splice(index, 1);
    this.isAdministratorsRepeat = false;
    this.isValueChanged = true;
    if (this.unitProperties.unitAdministrators.length === 0) {
      this.addUnitAdministrator(administrator, index);
    }
  }
  /**
   * @param  {} unit
   * sets parent unit number
   */
  setParentUnit(unit) {
    this.unitProperties.unit.parentUnitNumber = unit.unitNumber;
    this.isDropdown = false;
    this.unitProperties.unit.parentUnitName = unit.unitName;
    this.isParentUnitNumEmpty = false;
    this.isValueChanged = true;
  }
  /**
   * resets the validators to initial state.
   */
  validatorsReset() {
    this.isParentUnitNumEmpty = false;
    this.isUnitNumEmpty = false;
    this.isUnitNumLength = false;
    this.isUnitNumRepeat = false;
    this.isUnitNumDataType = false;
    this.isUnitNameEmpty = false;
    this.isUnitNameLength = false;
    this.isAdministratorsRepeat = false;
    this.isSameUnit = false;
    this.isValueChanged = false;
    this.isAdmnUserEmpty = [];
    this.isAdmnTypeEmpty = [];
    this.tempAdmnArray = [];
  }
  /**
   * @param  {} index
   * removes administrator type empty validation messages when the type is selected.
   */
  isAdmnTypeSelected(index) {
    if (this.unitProperties.unitAdministrators[index].unitAdministratorTypeCode !== '') {
      this.isAdmnTypeEmpty[index] = false;
    }
  }
  /**
   * @param  {} event
   * @param  {} Index=-1
   * shows validation message when clears administrator user or parent unit when clears those fields using backspace or delete keys.
   */
  emptyValidationKeyup(event, Index = -1) {
    if (Index >= 0) {
      if (event.keyCode === 8 || event.keyCode === 46) {
        this.unitProperties.unitAdministrators[Index].personId = '';
      }
    } else {
      let index;
      index = this.unitList.findIndex((key) => key.unitName.toString().toLowerCase() === event.target.value.toString().toLowerCase());
      if (index >= 0) {
        this.unitProperties.unit.parentUnitName = this.unitList[index].unitName;
        this.unitProperties.unit.parentUnitNumber = this.unitList[index].unitNumber;
        this.isDropdown = false;
        this.isParentUnitNumEmpty = false;
      } else {
        this.unitProperties.unit.parentUnitNumber = '';
      }
    }
  }
  /**
   * triggers cancel button if click yes in cancel confirmation modal
   */
  cancelChanges() {
    document.getElementById('closeModal').click();
  }
  /**
   * @param  {} value
   * sets isValuechanged to true if administartor type is selected.
   */
  administratorTypeValue(value) {
    if (value === '') {
      this.isValueChanged = false;
    } else {
      this.isValueChanged = true;
    }
  }

}
