import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
// import _.forEach from 'lodash/forEach';
// import _.filter from 'lodash/filter';
import { CreateQuestionnaireService } from '../services/create.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { Constants } from './../questionnaire.constants';

@Component({
  selector: 'app-create-main',
  templateUrl: './create-main.component.html',
  styleUrls: ['./create-main.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateMainComponent implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute,
              private _createQuestionnaireService: CreateQuestionnaireService,
              private _spinner: NgxSpinnerService) { }
  data: any = {};
  toast_message = 'Questionnaire Saved Sucessfully';
  QuestionnaireCommonValues: any = {
    lastQuestionId  : 1,
    lastGroupName   : 1,
    lastConditionId : 1
  };
  currentTab = 'create';
  nodes: any = {
    nodes : []
  };
  errorList = {
    questions  : [],
    conditions : [],
    options    : []
   };
  groupLabels = {};
  /**
   * takes the data from the resolver output,
   * updates the lastGroupName with max value to the current questionnaire group number;
   */
  ngOnInit() {
    this.data = this._activatedRoute.snapshot.data['Questionnaire'];
    this.QuestionnaireCommonValues.lastGroupName = this.data.questionnaire.maxGroupNumber + 1 || 1;
    this.createTreeNodes(null);
    this._spinner.hide();
    setTimeout( () => {
      document.getElementById('questionaireName').focus();
     }, 100);
  }
  changeCurrentTab(selectedTab) {
    this.currentTab = selectedTab;
  }
  validateQuestionniare() {
    let isQuestionnaireValid = true;
    _.forEach(this.data.questionnaire.questions, (question) => {
       if ( question.QUESTION === '' || question.QUESTION == null ) {
         this.errorList.questions.push(question);
       }
    });
    _.forEach(this.data.questionnaire.options, (option) => {
      if ( option.OPTION_LABEL === '' || option.OPTION_LABEL == null ) {
        this.errorList.options.push(option);
      }
    });
    _.forEach(this.data.questionnaire.conditions, (condition) => {
      if ( condition.CONDITION_VALUE === '' || condition.CONDITION_VALUE == null ) {
        this.errorList.conditions.push(condition);
      }
    });
    if (this.errorList.conditions.length > 0 ||
        this.errorList.questions.length > 0  ||
        this.errorList.options.length > 0 ) {
      isQuestionnaireValid = false;
    }
    return isQuestionnaireValid;
  }

  /**
   * creates the questionnaire heirarchy tree for a given questionnaire.
   * creates the node to be appended to the tree
   * creates an object with respective groupname and group labels
   */
  createTreeNodes(event) {
    this.nodes.nodes = [];
    _.forEach( this.data.questionnaire.questions , (question, key) => {
      if (question.GROUP_NAME === 'G0') {
        question.GROUP_LABEL =  this.data.header.QUESTIONNAIRE_NAME || question.GROUP_LABEL;
      }
      if (!this.groupLabels[question.GROUP_NAME]) {
        this.groupLabels[question.GROUP_NAME] = question.GROUP_LABEL ||  question.GROUP_NAME;
      }
      const newNode = {
        questionId: question.QUESTION_ID,
        name      : question.GROUP_LABEL + ': Q ' + question.QUESTION_ID,
        groupName : question.GROUP_NAME,
        children  : []
      };
      if (newNode.groupName === 'G0') {
        this.nodes.nodes.push(newNode);
      } else {
        this.createTree(this.nodes.nodes, question.PARENT_QUESTION_ID , newNode);
      }
    });
    this.nodes = Object.assign({}, this.nodes);
  }
   /**
   * @param  {} nodes
   * @param  {} questionId
   * @param  {} newNode
   * travesers the existing tree and appends the node to  correct postion using the parent questionid
   */
  createTree(nodes, questionId , newNode) {
    _.forEach(nodes, (node) => {
      if (node.questionId === questionId) {
        node.children.push(newNode);
        return false;
      } else if ( node.children.length > 0) {
        this.createTree(node.children, questionId, newNode);
      }
    });
  }

  findSubmodulelist(moduleId) {
    return _.filter( Constants.subModuleList , {'moduleId': parseInt(moduleId, 10)});
  }

  confirmSave(event) {
    this.data.question_editted = event;
    if (this.data.header.IS_FINAL === true) {
      document.getElementById('saveQuestionniare').click();
    } else {
      this.saveQuestionniare();
    }
  }
  /**
   * saves the questionnaire
   */
  saveQuestionniare() {
    this.updateGroupLabel();
    const toastId = document.getElementById('toast-success');
    this._createQuestionnaireService.saveQuestionnaireList(this.data).subscribe(
      data => {
        this.data = data;
        this.showToast(toastId);
      }
    );
  }
  /**
   * updates the group label of questionnaire with user updated values or group name itself
   */
  updateGroupLabel() {
    _.forEach(this.data.questionnaire.questions, (question) => {
      question.GROUP_LABEL = this.groupLabels[question.GROUP_NAME];
    });
  }
  /**
   * creates new usage item with current questionnaire id as its questionnaire id
   */
  addNewUsage() {
    Constants.newUsage.QUESTIONNAIRE_ID = this.data.header.QUESTIONNAIRE_ID;
    this.data.usage.push(Object.assign({}, Constants.newUsage));
  }
  removeUsage(index) {
    this.data.usage[index].AC_TYPE = 'D';
  }
  /**
   * @param  {} toastId
   * enables a toast for sucessful save
   */
  showToast(toastId) {
    toastId.className = 'show';
    setTimeout(function () {
    toastId.className = toastId.className.replace('show', '');
    }, 2000);
  }
  updateGroupname() {
    _.forEach( this.data.questionnaire.questions , (question, key) => {
      this.groupLabels[question.GROUP_NAME] = question.GROUP_LABEL ||  question.GROUP_NAME;
    });
  }
}
