import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import * as _ from 'lodash';
// import _.forEach from 'lodash/forEach';
// import _.filter from 'lodash/filter';
// import _mergeWith from 'lodash/mergeWith';

@Component({
  selector: 'app-preview-questionnaire',
  templateUrl: './preview-questionnaire.component.html',
  styleUrls: ['./preview-questionnaire.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewQuestionnaireComponent implements OnInit {

  constructor() { }
  @Input() questionnaire: any = {};
  conditions = [];
  showHelpMsg = [];
  helpMsg     = [];
  ngOnInit() {
    const tempLabels: any = {};
    this.questionnaire.questions.forEach(question => {
      if (!tempLabels[question.GROUP_NAME]) {
        question.SHOW_LABEL = true;
        tempLabels[question.GROUP_NAME] = question.GROUP_NAME;
      }
    });
  }

  /**
   * @param  {} currentQuestion
   * finds the child question of the currently answered question
   */
  showChildQuestions(currentQuestion) {
    if (currentQuestion.HAS_CONDITION === 'Y') {
      this.conditions = _.filter( this.questionnaire.conditions, {'QUESTION_ID': currentQuestion.QUESTION_ID});
      this.conditions.forEach(condition => {
         this.findChildQuestion(currentQuestion, condition);
      });
    }
  }
  /**
   * @param  {} currentQuestion
   * hides the question if the parents answer has been changed and update the answer to empty {}
   */
  hideChildQuestion(currentQuestion) {
    const conditions: any = _.filter( this.questionnaire.conditions, {'QUESTION_ID': currentQuestion.QUESTION_ID});
    conditions.forEach(condition => {
      this.questionnaire.questions.forEach(question => {
        if (condition.GROUP_NAME === question.GROUP_NAME) {
          question.SHOW_QUESTION   = false;
          question.ANSWERS = {};
          if (question.HAS_CONDITION === 'Y') {
            this.hideChildQuestion(question);
          }
        }
      });
    });
  }
  /**
   * @param  {} num
   * returns a array for a given number
   */
  getArray(num) {
      return new Array(num);
  }

  /**
   * @param  {} acType
   * sets acType for the question which is used in backend for identifying
   * updated answer or newly answered question I - Inser U - update D- delete
   */
  setacType(acType) {
    if (acType == null) {
      acType = 'I';
    } else if (acType === 'D') {
      acType = 'U';
    } else if (acType === 'U') {
      acType = 'D';
    } else if (acType === 'I') {
      acType = null;
    }
    return acType;
  }

  /**
   * @param  {} question
   * @param  {} condition
   * for a given condtion and  question - returns true
   * if any of the answer matches the condition value otherwise false
   * different logic for different type of the conditions
   */
  checkAnswer(question, condition) {
    let  result = false;
    if (condition.CONDITION_TYPE === 'EQUALS') {
      result = this.checkEqualCondition(question, condition);
    } else if (condition.CONDITION_TYPE === 'GREATERTHAN') {
      result = this.checkGreathanCondition(question, condition);
    } else if (condition.CONDITION_TYPE === 'LESSTHAN') {
      result = this.checkLessthanCondition(question, condition);
    } else if (condition.CONDITION_TYPE === 'CONTAINS') {
      result = this.checkContainsCondition(question, condition);
    }
    return result;
  }
  /**
   * @param  {} currentQuestion
   * @param  {} condition
   * for a given condition and current question looks in all questions and
   * finds its child questions
   * if question group and check answer returns true - set them as visible
   * if question group matches and check answer fails the set them as invisible
   */
  findChildQuestion(currentQuestion, condition) {
    this.questionnaire.questions.forEach(question => {
      if (condition.GROUP_NAME === question.GROUP_NAME && this.checkAnswer(currentQuestion, condition)) {
        question.SHOW_QUESTION = true;
      } else if (condition.GROUP_NAME === question.GROUP_NAME && !this.checkAnswer(currentQuestion, condition)) {
        question.SHOW_QUESTION   = false;
        question.ANSWERS = {};
        if (question.HAS_CONDITION === 'Y') {
          this.hideChildQuestion(question);
        }
      }
    });
  }
  /**
   * @param  {} question
   * @param  {} condition
   * return true if the question has a matching answer for the condition value
   */
  checkEqualCondition(question, condition) {
    let result = false;
    _.forEach(question.ANSWERS, function(answer, key) {
      if (question.ANSWER_TYPE === 'Checkbox' ) {
        if (answer === true && condition.CONDITION_VALUE === key ) {
          result = true;
          return false;
        }
      } else {
        if ( condition.CONDITION_VALUE === answer) {
          result = true;
          return false;
        }
      }
     });
     return result;
  }
  /**
   * @param  {} question
   * @param  {} condition
   * return true if the question has a greater value as answer for the condition value
   */
  checkGreathanCondition (question, condition) {
    let result = false;
    _.forEach(question.ANSWERS, function(answer, key) {
      if ( parseInt(answer, 10) > parseInt( condition.CONDITION_VALUE, 10)  ) {
        result = true;
        return false;
      }
     });
     return result;
  }
  /**
   * @param  {} question
   * @param  {} condition
   * return true if the question has a lesser value as answer for the condition value
   */
  checkLessthanCondition (question, condition) {
    let result = false;
    _.forEach(question.ANSWERS, function(answer, key) {
      if (  parseInt(answer, 10) < parseInt( condition.CONDITION_VALUE, 10) ) {
        result = true;
        return false;
      }
     });
     return result;
  }
  /**
   * @param  {} question
   * @param  {} condition
   * return true if the question has condition value in answer string
   */
  checkContainsCondition (question, condition) {
    let result = false;
    _.forEach(question.ANSWERS, function(answer, key) {
      if (answer.includes( condition.CONDITION_VALUE) ) {
        result = true;
        return false;
      }
     });
     return result;
  }
  /** assigns help link message of a question
     * sets no help message if help mesag is not available
     * @param helpMsg
     */
    getHelpLink(helpMsg, index) {
      this.showHelpMsg[index] = !this.showHelpMsg[index];
      if (helpMsg == null) {
          this.helpMsg[index] = 'No help message availabe!';
      } else {
          this.helpMsg[index] = helpMsg;
      }
  }
}
