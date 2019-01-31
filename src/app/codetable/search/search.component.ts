import { Component, OnInit } from '@angular/core';

import { CompleterService, CompleterData } from 'ng2-completer';
import * as _ from 'lodash';

import { SearchService } from './search.service';

@Component({
  selector   : 'app-search',
  templateUrl: './search.component.html',
  styleUrls  : ['./search.component.css']
})

export class SearchComponent implements OnInit {

    public dataService: CompleterData;
    codeTableProperty: any = {};
    tableProperty: any = {};
    checkedList: any = {};
    isViewEnable: any = [];
    groupNames: any = [];
    groupNameSelected: any;
    codeTableLength: number;
    selectedId: number;
    isCodeTableList;
    isVisible  = false;
    SearchTableName;
    isSavedFlag = {
        isSaved : null
    };

    helpInfo =  false;

    constructor(private _tableService: SearchService,
                private _completerService: CompleterService) { }

    ngOnInit() {
        this._tableService.getTableProperties()
        .subscribe(
            data => {
            this.tableProperty = data;
            this.groupNames    = this.tableProperty.configFile.groups;
            this.groupNames.forEach(element => {
                this.isViewEnable.push(true);
            });
            this.checkedList[this.groupNames[0]] = true;
            this.setCodeTableListBox();
            this.dataService   = this._completerService.local
                                (this.tableProperty.configFile.codetables,
                                'group,codetable_name', 'codetable_name');
            }, err => {
                console.log('Error in Fetching Data', err);
        });
    }
    /**
     * @param  {} groupName
     * generates the first ten code table names which are displayed when the check box is clicked.
     */
    getCodeTableList(groupName: any) {
        this.codeTableLength = _.filter( this.tableProperty.configFile.codetables, {'group': groupName}).length;
        return _.filter( this.tableProperty.configFile.codetables, {'group': groupName}).slice(0, 10);
    }
    /**
     * @param  {} groupName
     * generates the full list of codetable names which are displayed when the 'view more' is clicked.
     */
    getFullCodeTableList (groupName: any) {
        return _.filter( this.tableProperty.configFile.codetables, {'group': groupName});
    }
    /**
     * @param  {} tablename
     * filter out properties of searched table selected from search dropdown
     */
    getSearchedTable(tablename: any) {
        if (tablename != null) {
            const group          = tablename.originalObject.group;
            const codetable_name = tablename.originalObject.codetable_name;
            this.getSelectedTable(group, codetable_name);
            this.getSelectedId(1, codetable_name);
        }

    }
    /**
     * @param  {} modulename
     * @param  {} tablename
     * filter out properties of searched table selected from advance search box
     */
    getSelectedTable(modulename, tablename) {
        if (this.isSavedFlag.isSaved === true || this.isSavedFlag.isSaved === null) {
            this.SearchTableName = tablename;
            this.isVisible         = true;
            this.codeTableProperty = {};
            this.codeTableProperty = this.tableProperty.configFile.codetables.filter(fieldList => (
                                ( modulename === fieldList.group) && (tablename === fieldList.codetable_name)))[0];
        }
    }
    /**
     * @param  {} id
     * set isViewEnable according to the view more click
     */
    setViewEnable(id: number) {
        this.groupNames.forEach((value, index) => {
            if (index === id && this.isViewEnable[index] === true) {
                this.isViewEnable[index] = false;
            } else {
                this.isViewEnable[index] = true;
            }
        });
    }
    /**
     * @param  {} id
     * sets the selected column name index value and group name to sets the color change for the selected codetable name
     */
    getSelectedId(id, groupName) {
        this.selectedId = id;
        this.groupNameSelected = groupName;
    }
    /**
     * sets isCodeTableList to true if checkedList contains true values
     * Used to avoid showing empty box, if checkedList is empty or not containg true values
     */
    setCodeTableListBox() {
        const VALUES = Object.values(this.checkedList);
        this.isCodeTableList = VALUES.find((key) => key === true);
    }
}
