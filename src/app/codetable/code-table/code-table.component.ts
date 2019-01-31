import { Component, Input,  OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CodeTableService } from './code-table.service';
// import _filter from 'lodash/filter';


@Component({
  selector   : 'app-code-table',
  templateUrl: './code-table.component.html',
  styleUrls  : ['./code-table.component.css']
})

export class CodeTableComponent implements OnChanges {

  @Input() codeTableProperty: any = {};
  @Input() isSavedFlag: any = {};
  updatedCodeTableData: any = {};
  codeTableValues:  any = [];
  isEditEnable:  any = [];
  tableFieldList: any = [];
  dataType: any = [];
  isPrimary: any = [];
  isValueEmpty: any = [];
  updatedCodeTable: any = {
    codetable: {},
    tableData: [],
    updatedUser: ''
  };
  isLength = false;
  isEmpty  = false;
  isType = false;
  isNoData = false;
  toastMessage: any;
  deleteIndex: number;
  validationId: number;
  selectedRowId: number;
  selectedEditRowId: number;
  cancelData: any;
  placeHolder = 'Search ';
  searchText: any;
  attachmentColumnName: string;

  constructor(private _codeTableService: CodeTableService) { }

  ngOnChanges() {
    this.dataType = [];
    this.tableFieldList = [];
    this.isValueEmpty = [];
    this.codeTableValues = [];
    this.isEditEnable = [];
    this.updatedCodeTableData = {};
    this.placeHolder = 'Search ';
    this.searchText = '';
    this.attachmentColumnName = '';
    localStorage.setItem('currentUser', 'admin');
    this.updatedCodeTable.updatedUser = localStorage.getItem('currentUser');
    this.setValueChaged();
    this.tableFieldList = this.codeTableProperty.fields.filter(fieldList => fieldList.visible === 'true');
    this.tableFieldList.forEach(element => {
          this.placeHolder = this.placeHolder + element.display_name + ', ';
          this.isValueEmpty.push(false);
          if (element.data_type === 'INTEGER') {
            this.dataType.push({'type': 'number', 'display_type': 'numbers'});
          } else if (element.data_type === 'String') {
            this.dataType.push({'type': 'text', 'display_type': 'characters'});
          } else if (element.data_type === 'Blob' || element.data_type === 'Clob' ) {
            this.dataType.push({'type': 'file', 'display_type': 'files'});
          } else if (element.data_type === 'Date') {
            this.dataType.push({'type': 'date', 'display_type': ''});
          } else {
            this.dataType.push({'type': '', 'display_type': ''});
          }
    });
    this.placeHolder = this.placeHolder + '. . .';
    this.updatedCodeTable.codetable = this.codeTableProperty;
    this.getCodeTable();
  }
  /**
   * returns the selected codetable values
   * stores a true value for isEditEnable for all rows of values
   */
  getCodeTable() {
    this._codeTableService.getCodetableValues(this.updatedCodeTable)
    .subscribe((data: any) => {
          this.codeTableValues = data.tableData;
          this.codeTableValues.length === 0 ? this.isNoData = true : this.isNoData = false;
          if (!this.isNoData) {
            this.codeTableValues.forEach(element => {
                this.isEditEnable.push(true);
            });
          }
          setTimeout( () => {
            const id = document.getElementById('codetable-content');
            if (id) {
                id.scrollIntoView({behavior : 'smooth', block: 'start'});
             }
        }, 0);
      }, err => {
          console.log('Error in Fetching Data', err);
    });
  }
  /**
   * @param  {} id
   * @param  {} values
   * sets isEditEnable to false for the currently selected row for editing
   * sets isValueEmpty to true for all the fields in the row; for (field can be empty or not) validations.
   */
  editCodeTable(id, values) {
    if (this.isSavedFlag.isSaved || this.isSavedFlag.isSaved == null) {
      this.updatedCodeTableData = {};
      this.setValueChaged();
    }
    if (Object.getOwnPropertyNames(this.updatedCodeTableData).length === 0) {
      this.selectedEditRowId = id;
      this.isEmpty = false;
      this.isType = false;
      this.isLength = false;
      this.updatedCodeTableData = {};
      this.codeTableValues.forEach((value, index) => {
                      if (index === id) {
                          this.isEditEnable[index] = false;
                      } else {
                          this.isEditEnable[index] = true;
                      }
                    });
      this.updatedCodeTableData = values;
      this.cancelData = Object.assign({}, values);
      this.tableFieldList.forEach((field, index) => {
              this.isValueEmpty[index] = true;
      });
    }
  }
  /**
   * @param  {} index
   * saves changes on edit and updates it
   */
  updateCodetable(index) {
    this.isEmpty = false;
    this.isEditEnable[index] = true;
    delete this.updatedCodeTableData.isEditable;
    this.updatedCodeTableData.UPDATE_TIMESTAMP = '1234';
    this.updatedCodeTable.tableData[0] = this.updatedCodeTableData;
    if (this.isSavedFlag.isSaved === false) {
      this._codeTableService.getUpdatedTableValues(this.updatedCodeTable,  this.attachmentColumnName)
      .subscribe((data: any) => {
          if (data.promptCode === 1) {
              this.codeTableValues.splice(index, 1);
              this.codeTableValues.splice( 0, 0, data.tableData[0]);
              this.toastMessage = data.promptMessage;
              this.toastSuccess(this.toastMessage);
          } else {
              this.toastMessage = data.promptMessage;
              this.toastWarning(this.toastMessage);
          }
      });
    }
    this.updatedCodeTableData = {};
    this.isSavedFlag.isSaved = true;
  }
  /**
   * @param  {} column_name
   * sets the updated column name,
   * sets value_changed of updated rows to true.
   */
  setCodeTableField(column_name, i, type, value = 0) {
      const index = this.codeTableProperty.fields.findIndex(fields => column_name === fields.column_name);
      this.codeTableProperty.fields[index].value_changed = 'true';
      this.selectedRowId = i;
      if (type === 'date' || type === 'Blob' || type === 'Clob') {
          this.isEmpty = false;
          this.isValueEmpty[i] = true;
      }
      if (value === 1) {
        this.isSavedFlag.isSaved = false;
      }
  }
  /**
   * @param  {} event
   * @param  {} tableField
   * @param  {} id
   * checks validation
   */
  checkValidation(event, tableField, id) {
    this.validationId = id;
    if ( event.target.value.length < tableField.length ) {
      this.isLength = false;
    } else {
        this.isLength = true;
        event.target.value = event.target.value.slice(0, tableField.length);
        this.updatedCodeTableData[tableField.column_name] = event.target.value;
      }
    if ( tableField.data_type === 'INTEGER' && event.keyCode >= 65 && event.keyCode <= 90 ) {
      this.isType = true;
      event.target.value = event.target.value.slice(0, 1);
    } else {
        this.isType = false;
      }
    if ( event.target.value.length === 0 && tableField.can_empty === 'false' ) {
      this.isEmpty = true;
      this.isValueEmpty[id] = false;
    } else {
        this.isEmpty = false;
        this.isValueEmpty[id] = true;
      }
  }
  /**
   * add new row of values to code table
   */
  addNewCodeTableData() {
    if ( this.isValueEmpty.filter(empty => empty === false).length !== 0 ) {
      this.isEmpty = true;
    } else {
        this.isEmpty = false;
        document.getElementById('closeModal').click();
        // if (Object.getOwnPropertyNames(this.updatedCodeTableData).length !== 0) {
            this.updatedCodeTable.tableData[0] = this.updatedCodeTableData;
            this.updatedCodeTable.tableData[0].UPDATE_TIMESTAMP = '1234';
            this._codeTableService.addNewCodeTableData(this.updatedCodeTable, this.attachmentColumnName)
            .subscribe(( data: any ) => {
              if ( data.promptCode === 1) {
                data.tableData.length === 0 ? this.isNoData = true : this.isNoData = false;
                this.toastMessage = data.promptMessage;
                this.toastSuccess(this.toastMessage);
                this.isEditEnable[this.codeTableValues.length] = 'true';
                this.codeTableValues.splice( 0, 0, data.tableData[0]);
              } else {
                  this.toastMessage = data.promptMessage;
                  this.toastWarning(this.toastMessage);
                }
              this.setNewCreation();
            });
      //  }
    }
  }
  /**
   * removes the selected row from codetable
   */
  deleteCodeTableData() {
    const REMOVEDDATA = this.codeTableValues[this.deleteIndex];
    this.updatedCodeTable.tableData[0] = REMOVEDDATA;
    this._codeTableService.removeSelectedData(this.updatedCodeTable)
      .subscribe((data: any) => {
          if ( data.promptCode === 1 ) {
            this.codeTableValues.length === 1 ? this.isNoData = true : this.isNoData = false;
            this.toastMessage = data.promptMessage;
            this.toastSuccess(this.toastMessage);
            this.codeTableValues.splice(this.deleteIndex, 1);
          } else {
              this.toastMessage = data.promptMessage;
              this.toastWarning(this.toastMessage);
            }
    });
    this.isSavedFlag.isSaved = true;
    this.isEditEnable[this.deleteIndex] = true;
    this.updatedCodeTableData = {};
    this.isEditEnable[this.selectedEditRowId] = true;
  }
  /**
   * sets requirements for new creation:
   * sets true value to primary keys which are not editable
   * sets true value to fields which can be empty.
   */
  setNewCreation() {
    this.isPrimary = [];
    this.isLength = false;
    this.isType = false;
    this.isEmpty = false;
    this.updatedCodeTableData = {};
    if (this.isSavedFlag.isSaved === false ) {
      this.toastMessage = 'Save the changes';
      this.toastWarning(this.toastMessage);
    } else {
        this.isEditEnable[this.selectedEditRowId] = true;
        this.updatedCodeTableData = {};
      }
    this.tableFieldList.forEach((field, index) => {
      if (this.codeTableProperty.primary_key.find((key) => key === field.column_name && field.is_editable === 'false')) {
        this.isPrimary.push(true);
        this.isValueEmpty[index] = true;
      } else if (field.can_empty === 'true' || field.is_editable === 'false') {
          this.isValueEmpty[index] = true;
          this.isPrimary.push(false);
      } else {
          this.isPrimary.push(false);
          this.isValueEmpty[index] = false;
        }
    });
   this.setValueChaged();
  }
  /**
   * @param  {} toastMessage
   * shows success message
   */
  toastSuccess(toastMessage) {
    const TOASTID = document.getElementById('toast-success');
    this._codeTableService.showToast(TOASTID);
    this.toastMessage = toastMessage;
  }
  /**
   * @param  {} toastMessage
   * shows warning message
   */
  toastWarning(toastMessage) {
    const TOASTID = document.getElementById('toast-warning');
    this._codeTableService.showToast(TOASTID);
    this.toastMessage = toastMessage;
  }
  /**
   * @param  {} index
   * To cancel changes in the previos edit or cancel changes in the current edit
   */
  cancelChangesOnEdit(index) {
    this.isSavedFlag.isSaved = true;
    this.isEditEnable[index] = true;
    this.codeTableValues[index] = this.cancelData;
    this.updatedCodeTableData = {};
  }
  /**
   * Initialises the value_changed property of UPDATE_TIMESTAP to true and others to false.
   */
  setValueChaged() {
    this.codeTableProperty.fields.forEach(element => {
      (element.column_name === 'UPDATE_TIMESTAMP') ? element.value_changed = 'true' : element.value_changed = 'null';
    });
  }
  /**
   * @param  {} values
   * @param  {} column_name
   * downloads attachments in the table
   */
  downloadAttachment(values, column_name) {
    this.updatedCodeTable.tableData[0] = values;
    this.updatedCodeTable.selectedColumnForDownload = column_name;
    this._codeTableService.downloadAttachment(this.updatedCodeTable)
    .subscribe(( data: any) => {
        const a = document.createElement('a');
        const blob = new Blob([data], { type: data.type });
        a.href = URL.createObjectURL(blob);
        a.download = values.FILE_NAME;
        a.id = 'attachment';
        document.body.appendChild(a);
        a.click();
    },
        error => console.log('Error downloading the file.', error),
        () => {console.log('OK');
        document.body.removeChild(document.getElementById('attachment'));
    });
  }
  /**
   * @param  {} file
   * @param  {} column_name
   * @param  {} i
   * @param  {} value=0
   * to add attachments
   */
  addAttachments(file, column_name, i) {
    (<HTMLInputElement>document.getElementById('selectedFile')).value = '';
    this.updatedCodeTableData[column_name] = file;
    this.attachmentColumnName = column_name;
    this.updatedCodeTableData[this.codeTableProperty.file_column_name] = file.name;
    this.codeTableProperty.fields[i].value_changed = 'true';
    const index = this.codeTableProperty.fields.findIndex(fields => fields.column_name === this.codeTableProperty.file_column_name);
    this.codeTableProperty.fields[index].value_changed = 'true';
    this.setCodeTableField(column_name, i, 'Blob');
  }
  /**
   * @param  {} index
   * update the selected answer with mm-dd-yyyy format
   */
  setDateFormat(column_name) {
    if (this.updatedCodeTableData[column_name]) {
        const date  = ('0' + (this.updatedCodeTableData[column_name].getMonth() + 1)).slice(-2)
                + '-' + ('0' + this.updatedCodeTableData[column_name].getDate()).slice(-2)
                + '-' + ( this.updatedCodeTableData[column_name].getFullYear());
        this.updatedCodeTableData[column_name] = date;
    }
  }
}

