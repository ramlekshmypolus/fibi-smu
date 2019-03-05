import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitHierarchyService } from '../unit-hierarchy.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RatePipeService } from './rate-pipe.service';

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
  dummyRate: any;
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
  isViewMode = false;
  isValid = false;
  isDesc = true;
  isYear = false;
  isLaFlag = false;
  isMultiple = false;
  isEdit = false;
  isValueChanged = false;
  selectedIndex = null;
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
  paginatedRateData = {
    limit: 20,
    page_number: 1,
  };
  constructor(private _router: ActivatedRoute,
    private router: Router,
    private _rateService: UnitHierarchyService,
    private _spinner: NgxSpinnerService,
    private _ratePipe: RatePipeService) { }

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
  * Rate maintainance or LA rate maintainance choosing w.r.t user selection for displaying it's respective rates
  */
  maintainanceChoose() {
    if (this._router.snapshot.url[0].path === 'LArateMaintainance') {
      this.laRateMaintainanceData();
      this.isLaFlag = true;
    } else {
      this.rateMaintainanceData();
    }
  }
  rateMaintainanceData() {
    return new Promise((resolve, reject) => {
      this._rateService.getRateMaintainanceData(this.unitId).subscribe((data: any) => {
        this.rateClass = data.rateClassList;
        this.unitName = data.unitName;
        this.rateDetails = data.instituteRatesList;
        this.rateDetails.forEach(element => {
          element.updateTimestamp = this.setFormat(element.updateTimestamp, 0);
          element.startDate = this.setFormat(element.startDate, 0);
        });
        this.projectCount = this.rateDetails.length;
        this.tempRateDetails = this.rateDetails.slice(0, this.paginatedRateData.limit);
        this.rateType = data.rateTypeList;
        this.activityType = data.activityTypeList;
        this.copyRateDetails = this.rateDetails;
        this._spinner.hide();
        resolve(true);
      });
    });
  }
  laRateMaintainanceData() {
    return new Promise((resolve, reject) => {
      this._rateService.getlaRateMaintainanceData(this.unitId).subscribe((data: any) => {
        this.rateClass = data.rateClassLaList;
        this.unitName = data.unitName;
        this.rateDetails = data.instituteLARatesList;
        this.rateDetails.forEach(element => {
          element.updateTimestamp = this.setFormat(element.updateTimestamp, 0);
          element.startDate = this.setFormat(element.startDate, 0);
        });
        this.projectCount = this.rateDetails.length;
        this.tempRateDetails = this.rateDetails.slice(0, this.paginatedRateData.limit);
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
    this.isValueChanged = true;
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
      this.tempRateDetails = this.rateDetails.slice(0, this.paginatedRateData.limit);
    } else {
      this.tempRateDetails = (this.rateDetails.filter((list: any) => list.rateClassCode === this.classCode));
      this.projectCount = this.rateDetails.length;
    }
  }
 /**
  * Go Back to unit hierarchy
  */
  goBacKToUnit() {
    this.router.navigate(['fibi/unitHierarchy']);
  }
  /**
  * Rate table header sorting funtionality
  */
  headerSort(headerName) {
    this._spinner.show();
    this.isDesc = (this.sortBy === headerName) ? !this.isDesc : false;
    this.direction = this.isDesc ? 1 : -1;
    this.sortBy = headerName;
    this.rateDetails = this._ratePipe.sortAnArray(this.rateDetails, headerName, this.direction);
    setTimeout(() => {
      this.tempRateDetails = this.rateDetails.slice(0, this.paginatedRateData.limit);
      this.paginatedRateData.page_number = 1;
      this._spinner.hide();
    }, 0);
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
    this.dummyRate = this.rateMaintainance;
  }
  /**
   * @param  {} rate
   * filter the rate list and set flags to default value
   */
  editRate(rate, rateIndex) {
    this.selectedIndex = rateIndex;
    this.isMultiple = false;
    this.isValueChanged = false;
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
    this.isEdit = false;
    this.isMultiple = false;
    this.isValueChanged = false;
  }
  setIndex(rate, index) {
    this.rateValueSet(rate);
    this.index = index;
  }
  /**
   * Delete a specific rate
   */
  delete() {
    if (!this.isLaFlag) {
      this._rateService.deleteRateData(this.rateMaintainance).subscribe(data => {
        this.tempRateDetails.splice(this.index, 1);
      });
    } else {
      this.rateMaintainance.unitNumber = this.unitId;
      this._rateService.deleteLaRateData(this.rateMaintainance).subscribe(data => {
        this.tempRateDetails.splice(this.index, 1);
      });
    }
  }
  /**
   * Date conversion
   * @param  {} dateValue
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
  limitKeypress(event) {
    this.isValueChanged = true;
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
  rateObjectSet() {
    this.rateMaintainance.unitNumber = this.unitId;
    this.rateMaintainance.updateUser = localStorage.getItem('currentUser');
    this.campusFlag === 'ON' ? this.rateMaintainance.onOffCampusFlag = true : this.rateMaintainance.onOffCampusFlag = false;
    this.rateMaintainance.startDate = this.setFormat(this.rateMaintainance.startDate, 1);
    if (this.isLaFlag) {
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
      || value.fiscalYear === null || value.startDate === null || value.instituteRate === null) {
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
  multipleEntryValidation(rate, selectedIndex) {
    this.isMultiple = false;
    const rateString = rate.rateClassCode.concat(
      rate.rateTypeCode,
      rate.activityTypeCode,
      rate.fiscalYear,
      rate.startDate,
      rate.unitNumber,
      rate.onOffCampusFlag);
    this.rateDetails.forEach((element, index) => {
      if (index !== selectedIndex) {
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
      }
    });
  }
  /**
   *  @param  {} page
   * Slicing data for pagination
   */
  ratePagination(page) {
    this.tempRateDetails = this.rateDetails.slice(page * this.paginatedRateData.limit - this.paginatedRateData.limit,
      page * this.paginatedRateData.limit);
  }
  /**
   * add or update rates after completing proper validation and display the result by appling filter
   */
  saveRate() {
    this.rateObjectSet();
    this.rateValidation(this.rateMaintainance);
    if (this.isValueChanged) {
      this.multipleEntryValidation(this.rateMaintainance, this.selectedIndex);
      if (!this.isYear && !this.isMultiple && !this.isValid) {
        if (this.isLaFlag) {
          if (this.isEdit) {
            this.dummyRate.rateTypeCode = '1';
            delete this.dummyRate.activityTypeCode;
            delete this.dummyRate.id;
            this._rateService.deleteLaRateData(this.dummyRate).subscribe(data => {
              this.addLARateMaintainance();
            });
          } else {
            this.addLARateMaintainance();
          }
        } else {
          this.addRateMaintainance();
        }
      }
    } else {
      if (this.isEdit) {
        document.getElementById('closeModal').click();
      }
    }
  }
  /**
   * Rate and LARate maintainance service calls
   */
  addRateMaintainance() {
    this._rateService.saveInstituteRates(this.rateMaintainance, this.campusFlag).subscribe((data: any) => {
      if (data) { // tslint:disable
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
  addLARateMaintainance() {
    this._rateService.saveLARates(this.rateMaintainance, this.campusFlag)
      .subscribe((data: any) => {
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
