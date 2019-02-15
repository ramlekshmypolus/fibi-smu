import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitHierarchyService } from '../unit-hierarchy.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-rate-maintainance',
  templateUrl: './rate-maintainance.component.html',
  styleUrls: ['./rate-maintainance.component.css']
})
export class RateMaintainanceComponent implements OnInit {
  unitId: any;
  unitName: any;
  index: any;
  classCode: any;
  projectCount: any;
  activityType: any;
  rateTypeList: any;
  rateList: any;
  tempRateDetails: any;
  rateType: any;
  direction: any;
  rateDetails: any = [];
  rateClass: any = [];
  copyRateDetails: any = [];
  sortBy = '';
  searchType = '';
  searchClass = '';
  campusFlag = 'ON';
  isValid = false;
  isDesc = true;
  isYear = false;
  laFlag = false;
  isMultiple = false;
  isEdit = false;
  rateMaintainance: any = {
    activityTypeCode: '',
    fiscalYear: '',
    rateClassCode: '',
    rateTypeCode: '',
    objectId: '',
    startDate: '',
    instituteRate: '',
    onOffCampusFlag: true
  };
  requestData = {
    limit: 20,
    page_number: 1,
  };

  constructor(private _router: ActivatedRoute,
    private router: Router,
    private _rateService: UnitHierarchyService,
    private _spinner: NgxSpinnerService) { }

  ngOnInit() {
    this._router.queryParams.subscribe(params => {
      this.unitId = params['unitId'];
    });
    if (this.unitId !== undefined) {
      this._spinner.show();
      this.maintainanceChoose();
    }
  }
  /**
  * Rate maintainance or LA rate maintainance choosing
  * w.r.t user selection for displaying it's respective rates
  */
  maintainanceChoose() {
    if (this._router.snapshot.url[0].path === 'LArateMaintainance') {
      this.laRateMaintainanceData();
      this.laFlag = true;
    } else {
      this.rateMaintainanceData();
    }
  }
  /**
  * Get Institute rate data for rate maintainance
  */
  rateMaintainanceData() {
    return new Promise((resolve, reject) => {
      this._rateService.getRateMaintainanceData(this.unitId).subscribe(
        (data: any) => {
          this.rateClass = data.rateClassList;
          this.unitName = data.unitName;
          this.rateDetails = data.instituteRatesList;
          this.rateDetails.forEach(element => {
            element.updateTimestamp = this.setFormat(element.updateTimestamp, 0);
            element.startDate = this.setFormat(element.startDate, 0);
          });
          this.projectCount = this.rateDetails.length;
          this.tempRateDetails = this.rateDetails.slice(0, this.requestData.limit);
          this.rateType = data.rateTypeList;
          this.activityType = data.activityTypeList;
          this.copyRateDetails = this.rateDetails;
          this._spinner.hide();
          resolve(true);
        });
    });
  }
  /**
  * Get LA Institute rate data for rate maintainance
  */
  laRateMaintainanceData() {
    return new Promise((resolve, reject) => {
      this._rateService.getlaRateMaintainanceData(this.unitId)
        .subscribe(
          (data: any) => {
            this.rateClass = data.rateClassLaList;
            this.unitName = data.unitName;
            this.rateDetails = data.instituteLARatesList;
            this.rateDetails.forEach(element => {
              element.updateTimestamp = this.setFormat(element.updateTimestamp, 0);
              element.startDate = this.setFormat(element.startDate, 0);
            });
            this.projectCount = this.rateDetails.length;
            this.tempRateDetails = this.rateDetails.slice(0, this.requestData.limit);
            this.rateType = data.rateTypeLaList;
            this.copyRateDetails = this.rateDetails;
            this._spinner.hide();
            resolve(true);
          });
    });
  }

  /**
  * Filtering rate type w.r.t rate class
  */
  getRateType(rate) {
    this.searchType = '';
    this.classCode = rate;
    if (rate !== '') {
      this.rateTypeList = this.rateType.filter((list: any) => list.rateClassCode === rate);
      this.rateList = this.rateTypeList;
    } else {
      this.rateTypeList = [];
      this.maintainanceChoose();
    }
  }
  /**
  * Filtering add or edit rate type w.r.t rate class
  */
  getModalRateType(rate) {
    this.classCode = rate;
    this.rateMaintainance.rateTypeCode = '';
    if (rate !== '') {
      this.rateList = this.rateType.filter((list: any) => list.rateClassCode === rate);
    } else {
      this.rateList = [];
      this.maintainanceChoose();
    }
  }
  /**
  *Filtering rates w.r.t rate class and rate code
  */
  getRateDetails(type) {
    if (type !== '') {
      this.rateDetails = this.copyRateDetails;
      this.rateDetails = (this.rateDetails.filter((list: any) => list.rateClassCode === this.classCode))
        .filter((list: any) => list.rateTypeCode === type);
      this.projectCount = this.rateDetails.length;
      this.tempRateDetails = this.rateDetails.slice(0, this.requestData.limit);
    } else {
      this.tempRateDetails = (this.rateDetails.filter((list: any) => list.rateClassCode === this.classCode));
      this.projectCount = this.rateDetails.length;
    }
  }
  /**
   * Rate table header sorting funtionality
   */
  headerSort(headerName) {
    this._spinner.show();
    this.isDesc = (this.sortBy === headerName) ? !this.isDesc : false;
    this.direction = this.isDesc ? 1 : -1;
    this.sortBy = headerName;
    this.rateDetails = this.sortAnArray(this.rateDetails, headerName, this.direction);
    setTimeout( () => {
      this.tempRateDetails = this.rateDetails.slice(0, this.requestData.limit);
      this._spinner.hide();
    }, 0);
  }
  /**
  * Go back to unit hierarchy page
  */
  openGoBackUnit() {
    this.router.navigate(['fibi/unitHierarchy']);
  }
  /**
  * Bind rate maintainance object with selected rate value
  */
  rateValueSet(rate) {
    this.rateMaintainance.rateClassCode = rate.rateClassCode;
    this.rateMaintainance.rateTypeCode = rate.rateTypeCode;
    this.rateMaintainance.activityTypeCode = rate.activityTypeCode;
    this.campusFlag = rate.campusFlag;
    this.rateMaintainance.id = rate.id;
    this.rateMaintainance.instituteRate = rate.instituteRate;
    this.rateMaintainance.fiscalYear = rate.fiscalYear;
    this.rateMaintainance.onOffCampusFlag = rate.onOffCampusFlag;
    this.rateMaintainance.startDate = this.setFormat(rate.startDate, 1);
    this.rateMaintainance.objectId = rate.objectId;
    this.rateMaintainance.versionNumber = rate.versionNumber;
    this.rateMaintainance.active = rate.active;
  }
  /**
   * @param  {} rate
   * filter the rate list and set flags to default value
   */
  editRate(rate) {
    this.isEdit = true;
    this.rateValueSet(rate);
    this.isYear = false;
    this.isValid = false;
    this.rateList = this.rateType.filter((list: any) => list.rateClassCode === this.rateMaintainance.rateClassCode);
  }
  /**
   *Setting dummy objectId and other required data to the object
   */
  newRate() {
    this.isEdit = false;
    this.rateMaintainance.objectId = 'newRateobjectIdHasBeenGenerated';
    this.rateMaintainance.rateClassCode = this.searchClass;
    this.rateMaintainance.rateTypeCode = this.searchType;
    this.rateMaintainance.activityTypeCode = '';
    this.rateMaintainance.startDate = null;
    this.rateMaintainance.id = null;
    this.rateMaintainance.fiscalYear = null;
    this.rateMaintainance.instituteRate = null;
    this.campusFlag = 'ON';

    this.isValid = false;
    this.isYear = false;
  }
  setIndex(rate, index) {
    this.rateValueSet(rate);
    this.index = index;
  }
  /**
   * Delete a specific rate
   */
  delete() {
    if (!this.laFlag) {
      this._rateService.deleteRateData(this.rateMaintainance)
        .subscribe(data => {
          this.tempRateDetails.splice(this.index, 1);
        });
    } else {
      this.rateMaintainance.unitNumber = this.unitId;
      this._rateService.deleteLaRateData(this.rateMaintainance)
        .subscribe(data => {
          this.tempRateDetails.splice(this.index, 1);
        });
    }
  }
  /**
   * Date conversion
   *  @param  {} dateValue
   */
  setFormat(dateValue, value) {
    const date = new Date(dateValue),
      month = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    if (value === 0) {
      return [month, day, date.getFullYear()].join('/');
    } else {
      return [date.getFullYear(), month, day].join('-');
    }
  }
  /**
  * restrict input fields to numbers, - and /
  * @param event
  */
  inputRestriction(event: any) {
    const pattern = /[0-9\+\-\/\ ]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  }
  limitKeypress(event) {debugger
    const pattern = /^(?:[0-9][0-9]{0,2}(?:\.\d{0,2})?|999|999.00|999.99)$/;
    if (!pattern.test(event)) {
      this.rateMaintainance.instituteRate = '';
    }
  }
  /**
   * @param  {} year
   * Year validation by checking whether the length is 4 or not
   */
  checkValidYear(year) {
    if (year >= 1900 && year < 2100) {
      this.isYear = false;
    } else {
      this.isYear = true;
    }
  }
  /**
   * Remaining rate maintainance object value setting
   */
  valueSet() {
    this.rateMaintainance.unitNumber = this.unitId;
    this.rateMaintainance.updateUser = localStorage.getItem('currentUser');
    if (this.campusFlag === 'ON') {
      this.rateMaintainance.onOffCampusFlag = true;
    } else {
      this.rateMaintainance.onOffCampusFlag = false;
    }
    if (this.rateMaintainance.startDate !== null) {
      this.rateMaintainance.startDate = this.setFormat(this.rateMaintainance.startDate, 1);
    }
    if (this.laFlag) {
      this.rateMaintainance.rateTypeCode = '1';
      delete this.rateMaintainance.activityTypeCode;
      delete this.rateMaintainance.id;
    }
  }
  /**
   * @param  {} value
   * Rate validation by checking null value
   */
  rateValidation(value) {
    if (value.rateClassCode === '' || value.rateTypeCode === '' || value.activityTypeCode === ''
      || value.fiscalYear === null || value.instituteRate === null || value.startDate === null) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }
    /**
   * @param  {} rate
   * Rate validation by checking multiple entries in datebase with same
   * unitNumber,rateClasscode,rateTypecode,activityTypeCode,fiscalYear,startDate and onOffCampusFlag
   */
  multipleEntryValidation(rate) {
    this.isMultiple = false;
    const rateString = rate.rateClassCode.concat(
      rate.rateTypeCode,
      rate.activityTypeCode,
      rate.fiscalYear,
      rate.startDate,
      rate.unitNumber,
      rate.onOffCampusFlag);
    this.rateDetails.forEach(element => {
      const rateArray = element.rateClassCode.concat(
        element.rateTypeCode,
        element.activityTypeCode,
        element.fiscalYear,
        this.setFormat(element.startDate, 1),
        element.unitNumber,
        element.onOffCampusFlag);
      if (rateArray === rateString) {
        this.isMultiple = true;
      }
    });
  }
  /**
   *  @param  {} page
   * Slicing data for pagination
   */
  ratePagination(page) {
    this.tempRateDetails = this.rateDetails.slice(page * this.requestData.limit - this.requestData.limit,
      page * this.requestData.limit);
  }
  /**
   * @param  {} array
   * @param  {} column
   * @param  {} direction
   * rate maintainance table header sort
   */
  sortAnArray(array, column, direction) {
    const sortedArray = array.sort(function (a, b) {
      if (a[column] === '' || a[column] === null || typeof a[column] === 'undefined') {
        return 1 * direction;
      }
      if (b[column] === '' || b[column] === null || typeof b[column] === 'undefined') {
        return -1 * direction;
      }
      if (column === 'instituteRate' || column === 'fiscalYear') {
        if ((a[column]) <= (b[column])) {
          return -1 * direction;
        }
        if ((a[column]) > (b[column])) {
          return 1 * direction;
        }
      }
      if (column === 'startDate' || column === 'updateTimestamp') {
        if (Number(new Date(a[column])) <= Number(new Date(b[column]))) {
          return -1 * direction;
        }
        if (Number(new Date(a[column])) > Number(new Date(b[column]))) {
          return 1 * direction;
        }
      }
      if (column === 'updateUser' || column === 'onOffCampusFlag') {
        if (((a[column]).toString()).toLowerCase() <= ((b[column]).toString()).toLowerCase()) {
          return -1 * direction;
        }
        if (((a[column]).toString()).toLowerCase() > ((b[column]).toString()).toLowerCase()) {
          return 1 * direction;
        }
      }
      if (((a[column].description).toString()).toLowerCase() <= ((b[column].description).toString()).toLowerCase()) {
        return -1 * direction;
      }
      if (((a[column].description).toString()).toLowerCase() > ((b[column].description).toString()).toLowerCase()) {
        return 1 * direction;
      }
    });
    return sortedArray;
  }
  /**
   * add or update rates after completing proper validation and
   * display the result by appling filter
   */
  saveRate() {
    this.valueSet();
    this.rateValidation(this.rateMaintainance);
    this.multipleEntryValidation(this.rateMaintainance);
    if (!this.isYear) {
      if (!this.isMultiple) {
        if (!this.isValid) {
          if (this._router.snapshot.url[0].path === 'LArateMaintainance') {
            this.addLARateMaintainance();
          } else {
            this.addRateMaintainance();
          }
        }
      }
    }
  }
  /**
   * Rate maintainance service call
   */
  addRateMaintainance() {
    this._rateService.saveInstituteRates(this.rateMaintainance, this.campusFlag)
      .subscribe(
        (data: any) => {
          if (data) {
            // tslint:disable
            this.rateMaintainanceData().then(data => {
              this.searchClass = this.rateMaintainance.rateClassCode;
              this.getRateType(this.searchClass);
              this.searchType = this.rateMaintainance.rateTypeCode;
              this.getRateDetails(this.searchType);
            });
          }
          document.getElementById('closeModal').click();
        });
  }
  /**
  * LA Rate maintainance service call
  */
  addLARateMaintainance() {
    this._rateService.saveLARates(this.rateMaintainance, this.campusFlag)
      .subscribe(
        (data: any) => {
          if (data) {
            this.laRateMaintainanceData().then(data => {
              this.searchClass = this.rateMaintainance.rateClassCode;
              this.getRateType(this.searchClass);
              this.searchType = this.rateMaintainance.rateTypeCode;
              this.getRateDetails(this.searchType);
            });
          }
          document.getElementById('closeModal').click();
        });
  }
}
