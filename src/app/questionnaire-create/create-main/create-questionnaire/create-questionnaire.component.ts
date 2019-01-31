import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../questionnaire.constants';
import * as _ from 'lodash';
// import _.remove from 'lodash/remove';
// import _.filter from 'lodash/filter';
// import _.forEach from 'lodash/forEach';
// import _.find from 'lodash/find';

@Component({
  selector: 'app-create-questionnaire',
  templateUrl: './create-questionnaire.component.html',
  styleUrls: ['./create-questionnaire.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateQuestionnaireComponent implements OnInit {

  constructor( private _activatedRoute: ActivatedRoute ) { }

  @Output() saveQuestionniare: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() createTree: EventEmitter<number> = new EventEmitter<number>();
  @Output() previewTab: EventEmitter<string> = new EventEmitter<string>();
  @Input()  questionnaire: any = {};
  @Input()  commonValues: any  = {};
  @Input()  groupLabels: any   = {};
  @Input()  nodes: any  = {};
  isQuestionEdited      = false;
  selectedQuestionIndex = 0;
  toDeleteData   = {};
  editorConfig   = Constants.editorConfig;
  parentDetails  = '';
  isViewmode     = false;
  deleteTypeFlag = null;

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe( data  => {
      const result: any = data;
      this.isViewmode   = (result.viewmode === 'true');
      this.editorConfig.editable = !this.isViewmode;
      if (result.id === undefined && this.questionnaire.questions.length === 0 ) {
        this.addNewQuestion('G0');
      }
    });
  }
  /**
   * @param  {} groupName
   * @param  {} parentId
   * Creates a new question which will be pushed into questinnaire questions array the basic details for the
   * question is added here
   */
  configureNewQuestion(groupName, parentId) {
    this.isQuestionEdited = true;
    if (groupName === 'G0') {
      Constants.newQuestion.SHOW_QUESTION = true;
      this.addParentToTree(this.commonValues.lastQuestionId, groupName);
      this.nodes = Object.assign({}, this.nodes);
    } else {
      Constants.newQuestion.SHOW_QUESTION = false;
      this.addChildToTree(this.nodes.nodes, parentId, this.commonValues.lastQuestionId, groupName);
      this.nodes = Object.assign({}, this.nodes);
    }
    Constants.newQuestion.GROUP_NAME  = groupName;
    Constants.newQuestion.QUESTION_ID = this.commonValues.lastQuestionId;
    Constants.newQuestion.GROUP_LABEL = this.groupLabels[groupName] || groupName ;
    Constants.newQuestion.PARENT_QUESTION_ID = parentId;
    this.addOption(this.commonValues.lastQuestionId, null);
    this.commonValues.lastQuestionId ++;
    return Object.assign({}, Constants.newQuestion);
  }
  /**
   * @param  {} id
   * event from the tree is catched here
   * it allows to navigate to selected question and focus is set on the question field
   */
  viewQuestion(id) {
    document.getElementById(id).scrollIntoView({behavior: 'instant' });
    document.getElementById('question' + id).focus();
  }
  /**
   * @param  {} groupName
   * Adds a base question(G0).A timeout is used to avoid error of navigating to question before creation
   */
  addNewQuestion(groupName) {
    this.groupLabels[groupName] = this.groupLabels[groupName] || groupName;
    this.questionnaire.questions.push( Object.assign({}, this.configureNewQuestion(groupName, null)));
    const id = (this.commonValues.lastQuestionId - 1).toString();
    setTimeout( () => {
      document.getElementById(id).scrollIntoView({behavior: 'instant' });
      document.getElementById('question' + id).focus();
    });
  }
  /**
   * @param  {} questionid
   * @param  {} optionLabel
   * updates the QuestionnaireOptions in Questionaire the basic details of option are added
   * the option number is calculated with QuestionnaireOptions array length
   */
  addOption(questionid, optionLabel) {
    this.isQuestionEdited = true;
    let optionNumber      = 1;
    if (this.questionnaire.options.length > 0) {
      optionNumber = this.questionnaire.options[this.questionnaire.options.length - 1].QUESTION_OPTION_ID + 1;
    }
    Constants.newOption.QUESTION_ID        = questionid;
    Constants.newOption.QUESTION_OPTION_ID = optionNumber;
    Constants.newOption.OPTION_LABEL       = optionLabel;
    this.questionnaire.options.push(Object.assign({}, Constants.newOption));
  }
  /**
   * @param  {} questionId
   * @param  {} index
   * creates a new Condition for a selected question and pushed into QuestionnaireCondition array of questionnaire
   */
  addBranching(questionId, index) {
    this.isQuestionEdited = true;
    this.questionnaire.questions[index].HAS_CONDITION = 'Y';
    Constants.newCondition.QUESTION_CONDITION_ID = this.commonValues.lastConditionId;
    Constants.newCondition.QUESTION_ID = questionId;
    Constants.newCondition.GROUP_NAME  = 'G' + this.commonValues.lastGroupName;
    this.commonValues.lastGroupName ++;
    this.commonValues.lastConditionId ++;
    this.questionnaire.conditions.push(Object.assign({}, Constants.newCondition));
  }
  /**
   * @param  {} index
   * @param  {} groupname
   * @param  {} parentId
   * Adds a new Child question to the selected question, child question is pushed just below the parent in array
   * A timeout is used to avoid error of navigating to question before creation
   */
  addConditionBasedQuestion(index, groupName, parentId) {
    this.groupLabels[groupName] = this.groupLabels[groupName] || groupName;
    this.questionnaire.questions.splice(index + 1, 0, this.configureNewQuestion(groupName, parentId));
    const id = (this.commonValues.lastQuestionId - 1).toString();
    setTimeout( () => {
      document.getElementById(id).scrollIntoView({ behavior: 'instant' });
      document.getElementById('question' + id).focus();
     });
  }
  /**
   * @param  {} optionId
   * removes an option matching the optionNumber from QuestionnaireOptions
   */
  removeOption(option) {
    if (option.AC_TYPE === undefined) {
      this.questionnaire.deleteList.option.push(option.QUESTION_OPTION_ID);
      this.isQuestionEdited = true;
    }
    _.remove( this.questionnaire.options, { 'QUESTION_OPTION_ID': option.QUESTION_OPTION_ID });
    const matchingCondtion = _.find( this.questionnaire.conditions,
                                  { 'CONDITION_VALUE': option.OPTION_LABEL, 'QUESTION_ID': option.QUESTION_ID });
    if (matchingCondtion) {
      this.removeCondition(matchingCondtion);
    }
  }
  /**
   * @param  {} conditionId
   * removes a condition matching the conditionId
   */
  removeCondition(condition) {
    if (condition.AC_TYPE === undefined) {
      this.isQuestionEdited = true;
      this.questionnaire.deleteList.condition.push(condition.QUESTION_CONDITION_ID);
    }
    const matchingQuestions: any = _.filter(this.questionnaire.questions, { 'GROUP_NAME': condition.GROUP_NAME });
    if (matchingQuestions) {
      _.forEach(matchingQuestions , (question) => {
        this.removeQuestion(question);
      });
      this.createTree.emit();
    }
    _.remove( this.questionnaire.conditions, { 'QUESTION_CONDITION_ID': condition.QUESTION_CONDITION_ID });
  }
  /**
   * @param  {} questionid
   * Removes all options for a given questionid from QuestionnaireOptions
   */
  removeQuestionOptions(questionId) {
    _.remove( this.questionnaire.options, { 'QUESTION_ID': questionId });
  }
   /**
   * @param  {} questionId
   * removes all conditions for the a given questionId
   */
  removeQuestionConditions(questionId) {
    _.remove( this.questionnaire.conditions, { 'QUESTION_ID': questionId });
  }

  removeQuestion(question) {
    if (question.AC_TYPE === undefined) {
      this.isQuestionEdited = true;
     this.questionnaire.deleteList.question.push(question.QUESTION_ID);
    }
    _.remove( this.questionnaire.questions, { 'QUESTION_ID': question.QUESTION_ID });
    this.removeQuestionConditions(question.QUESTION_ID);
    this.removeQuestionOptions(question.QUESTION_ID);
    const childQuestionList: any = _.filter( this.questionnaire.questions, {'PARENT_QUESTION_ID': question.QUESTION_ID});
    _.forEach( childQuestionList, (childQuestion) => {
      this.removeQuestion(childQuestion);
    });
  }
  /**
   * @param  {} questionId
   * returns an array of options matching the given questionid
   */
  getOptions(questionId) {
    return _.filter( this.questionnaire.options, {'QUESTION_ID': questionId});
  }
  /**
   * @param  {} questionId
   * @param  {} questionType
   * for a given question looks for enabling braching for the question.
   * returns true
   * if the length of matching conditions is less than matching option for the given questionid or
   * ceratin types which does not have options
   */
  enableBraching(questionId, questionType) {
    if (questionType === 'Text' || questionType === 'Textarea') {
      return true;
    } else {
      const optionLength    = _.filter( this.questionnaire.options, {'QUESTION_ID': questionId}).length;
      const conditionLength = _.filter( this.questionnaire.conditions, {'QUESTION_ID': questionId}).length + 1;
      if ( optionLength >= conditionLength || conditionLength === 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  /**
   * @param  {} index
   * hides the child question of a particular base question(G0)
   */
  hideQuestions(index) {
    for (let i = index + 1; i <  this.questionnaire.questions.length; i++ ) {
      if (this.questionnaire.questions[i].GROUP_NAME !== 'G0') {
        this.questionnaire.questions[i].HIDE_QUESTION = !this.questionnaire.questions[i].HIDE_QUESTION;
      } else {
        break;
      }
    }
  }
  /**
   * @param  {} questionType
   * @param  {} questionId
   * updates the questionnaireOptions for change in questionType.
   * removes the existing questions and updates with default options
   */
  changeQuestionType(questionType, questionId , index) {
    this.isQuestionEdited = true;
    this.questionnaire.questions[index].HAS_CONDITION = null;
    const options = _.filter( this.questionnaire.options, {'QUESTION_ID': questionId});
    _.forEach( options, (option) => {
      this.removeOption(option);
    });
    if (questionType === 'Radio' || questionType === 'Checkbox') {
      this.addOption(questionId, null);
    }
    if (questionType === 'Y/N') {
      ['Yes', 'No'].forEach(element => {
        this.addOption(questionId, element);
      });
    }
    if (questionType === 'Y/N/NA') {
      ['Yes', 'No' , 'N/A'].forEach(element => {
        this.addOption(questionId, element);
      });
    }
  }
  /**
   * @param  {} groupLabel
   * @param  {} groupName
   * Changes the name of the group in the questionnaire heirarchy tree
   */
  updateTree(groupLabel , groupName) {
    this.updateTreeWithNewGroupName(this.nodes.nodes, groupLabel , groupName);
    this.nodes = Object.assign({}, this.nodes);
    this.isQuestionEdited       = true;
    this.groupLabels[groupName] = groupLabel;
  }
  /**
   * @param  {} questionId
   * @param  {} groupName
   * adds a base node to tree(G0)
   * simply pushes the created node to the nodes array and creates new nodes reference
   */
  addParentToTree( questionId, groupName) {
    this.nodes.nodes.push({
      questionId: questionId,
      name: (this.groupLabels[ groupName] || groupName ) + ': Q ' + questionId,
      groupName: groupName,
      children: []
    });
  }
  /**
   * @param  {} nodes
   * @param  {} parentId
   * @param  {} childId
   * @param  {} groupName
   * Traverese the existing tree to find the exact postion of parent node.
   * pushes the created node to the children of parent tree and breaks the tree traversal
   */
  addChildToTree( nodes, parentId, childId, groupName) {
    _.forEach(nodes, (node) => {
      if (node.questionId === parentId) {
        node.children.push({questionId: childId,
                            name: (this.groupLabels[ groupName] || groupName ) + ': Q ' + childId,
                            groupName: groupName ,
                            children: []
                          });
        return false;
      } else if ( node.children.length > 0) {
        this.addChildToTree(node.children, parentId, childId, groupName);
      }
    });
  }
  /**
   * @param  {} nodes
   * @param  {} groupLabel
   * @param  {} groupName
   * traverse the tree to find the exact nodes.updates the name of the node with new groupName
   */
  updateTreeWithNewGroupName(nodes, groupLabel , groupName) {
    _.forEach(nodes, (node) => {
      if (node.groupName === groupName) {
        node.name = groupLabel + ':' + node.name.split(':')[1];
      } else if ( node.children.length > 0) {
        this.updateTreeWithNewGroupName(node.children, groupLabel, groupName);
      }
    });
  }
  getParentDetails(parentId, groupname) {
    if (groupname === 'G0') {
      this.parentDetails = 'It does not have a parent question';
    } else {
      if (parentId !== undefined ) {
      const parentCondition: any = _.find(this.questionnaire.conditions, {'QUESTION_ID': parentId, 'GROUP_NAME': groupname});
      const parentQuestion: any  = _.find(this.questionnaire.questions, {'QUESTION_ID': parentId});
      this.parentDetails         = 'If ' + '"' + parentQuestion.QUESTION + '"' + ' ' +
                                    parentCondition.CONDITION_TYPE  + ' ' +
                                    '"' + parentCondition.CONDITION_VALUE + '"';

      }
    }
  }
  /**
   * @param  {} deleteData - data to be deleted
   * @param  {} deleteTypeFlag - who intiated the delete
   * a single modal is used for all delete conformation.
   * selected data to delete  and from where flag is set here
   */
  setDeleteData(deleteData, deleteTypeFlag) {
    this.toDeleteData   = deleteData;
    this.deleteTypeFlag = deleteTypeFlag;
  }
   /**
    * executes the delete option if the user confirms the delete
   */
  executeDeleteData() {
    if (this.deleteTypeFlag === 'question') {
      this.removeQuestion(this.toDeleteData);
    } else if ( this.deleteTypeFlag === 'condition') {
      this.removeCondition(this.toDeleteData);
    } else if ( this.deleteTypeFlag === 'option') {
      this.removeOption(this.toDeleteData);
    }
    this.createTree.emit();
    this.toDeleteData   = {};
    this.deleteTypeFlag = null;
  }
  /**
   * emits an event to the parent for saving questionnaire also attaches the user created groupnames to the
   * grouplabl of questions
   */
  save() {
    this.saveQuestionniare.emit(this.isQuestionEdited);
  }

  /**
   * @param  {} selectedTab changes to priview tab
   */
  changeCurrentTab(selectedTab) {
    this.previewTab.emit(selectedTab);
  }
  /**
   * @param  {} index
   * set actype to u if user changes
   */
  updateOptionACType(index) {
    this.isQuestionEdited = true;
    if (this.questionnaire.options[index].AC_TYPE === undefined) {
      this.questionnaire.options[index].AC_TYPE = 'U';
    }
  }
  /**
   * @param  {} index
   * set actype to u if user changes
   */
  updateConditionACType(index) {
    this.isQuestionEdited = true;
    if (this.questionnaire.conditions[index].AC_TYPE === undefined) {
      this.questionnaire.conditions[index].AC_TYPE = 'U';
    }
  }
}
