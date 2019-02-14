import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { QuestionnaireService } from '../questionnaire.service';

@Component({
  selector: 'app-view-questionnaire',
  templateUrl: './view-questionnaire.component.html',
  styleUrls: ['./view-questionnaire.component.css']
})
export class ViewQuestionnaireComponent implements OnInit {

  @Input() questionnaireData: any;
  @Input() showOrHideDataFlagsObj: any;
  @Input() proposalData: any;

  constructor(private _questionnaireService: QuestionnaireService,
              private _activatedRoute: ActivatedRoute) { }
  questionnaire: any = {};
  attachmentIndex    = null;
  requestObject: any = {};
  filesArray  = [];
  conditions  = [];
  tempFiles   = [];
  result: any = {};
  showHelpMsg = [];
  helpMsg     = [];

  QuestionnaireCompletionFlag = 'N';

  ngOnInit() {
    if (this.questionnaireData.hasOwnProperty('QUESTIONNAIRE_ANS_HEADER_ID') &&
        this.questionnaireData.QUESTIONNAIRE_ANS_HEADER_ID != null) {
          this.requestObject.questionnaire_answer_header_id = this.questionnaireData.QUESTIONNAIRE_ANS_HEADER_ID;
    }
    this.requestObject.questionnaire_id = this.questionnaireData.QUESTIONNAIRE_ID;
    this._questionnaireService.getQuestionnaire(this.requestObject).subscribe(
    data => {
      this.result  = data;
      this.result.module_item_code = 3;
      this.result.module_sub_item_code = 0;
      this.result.module_sub_item_key = 0;
      this.result.module_item_key = this.proposalData.proposal.proposalId;
      // save issue handled
      this.result.action_user_id = localStorage.getItem('personId');
      this.result.action_person_name = localStorage.getItem('currentUser');

      this.questionnaire = this.result.questionnaire;
      const tempLabels: any = {};
      this.questionnaire.questions.forEach(question => {
        if (!tempLabels[question.GROUP_NAME]) {
          question.SHOW_LABEL = true;
          tempLabels[question.GROUP_NAME] = question.GROUP_NAME;
        }
        this.showChildQuestions(question);
      });
    });
  }
   /**
   * @param  {} currentQuestion
   * finds the child question of the currently answered question
   */
  showChildQuestions(currentQuestion) {
    currentQuestion.AC_TYPE = this.setUpdateacType(currentQuestion.AC_TYPE);
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
          question.AC_TYPE = this.setDeleteacType(question.AC_TYPE);
          question.SHOW_QUESTION  = false;
          // question.ANSWERS        = {};
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
   * updated answer or newly answered question
   */
  setUpdateacType(acType) {
    if (acType == null) {
      acType = 'I';
    } else if (acType === 'D') {
      acType = 'U';
    }
    return acType;
  }
    /**
   * @param  {} acType
   * sets acType for the question to "D" which is used in backend for identifying
   * deleting previously answered question
   */
  setDeleteacType(acType) {
    if (acType === 'U') {
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
        question.AC_TYPE = this.setUpdateacType(question.AC_TYPE);
      } else if (condition.GROUP_NAME === question.GROUP_NAME && !this.checkAnswer(currentQuestion, condition)) {
        question.SHOW_QUESTION   = false;
        question.AC_TYPE = this.setDeleteacType(question.AC_TYPE);
        // question.ANSWERS = {};
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
  /**
   * @param  {} index
   * update the selected answer with mm/dd/yyyy format
   */
  setDateFormat(index) {
    const date = new Date( this.questionnaire.questions[index].ANSWERS[1]);
    this.questionnaire.questions[index].ANSWERS[1]  = ('0' + (date.getMonth() + 1)).slice(-2)
                                                      + '/' + ('0' + date.getDate()).slice(-2)
                                                      + '/' + date.getFullYear();
  }
  /**
   * pushes the files to the file list once user confirms the attachment upload
   */
  addFiletoArray() {
    if ( this.tempFiles.length >= 1) {
      if (this.questionnaire.questions[this.attachmentIndex].AC_TYPE == null) {
        this.questionnaire.questions[this.attachmentIndex].AC_TYPE = 'I';
      }
      if (this.questionnaire.questions[this.attachmentIndex].AC_TYPE === 'D') {
        this.questionnaire.questions[this.attachmentIndex].AC_TYPE = 'U';
      }
      this.removeDulplicateFile(this.questionnaire.questions[this.attachmentIndex].QUESTION_ID, null);
      this.questionnaire.questions[this.attachmentIndex].ANSWERS[1] = this.tempFiles[0].fileName;
      this.filesArray.push(this.tempFiles[0]);
      this.tempFiles = [];
    }
  }
  /**
   * @param  {} questionId
   * removes duplicate entry for files
   */
  removeDulplicateFile(questionId, index) {
    if (this.filesArray.length > 0) {
      _.remove( this.filesArray, { 'questionId': questionId });
    }
    if ( index !== null) {
      this.questionnaire.questions[index].ANSWERS[1] = '';
      this.questionnaire.questions[index].AC_TYPE    = 'D';
    }
  }
  /**
   * @param  {} file
   * add file to temporarylist
   */
  addFileToTempFiles(file) {
    //(<HTMLInputElement>document.getElementById('selectedFile')).value = '';
    if (file) {
      this.tempFiles = [];
      this.tempFiles.push({ attachment : file,
                            questionId : this.questionnaire.questions[this.attachmentIndex].QUESTION_ID,
                            fileName   : file.name,
                            type       : file.type});
    }
  }
  saveQuestionnaire() {
    this.QuestionnaireCompletionFlag = 'Y';
    this.checkQuestionaireCompletion();
    this.result.questionnaire_complete_flag = this.QuestionnaireCompletionFlag;
    const toastId = document.getElementById('prop-save-questionnaire-success');
    this._questionnaireService.saveQuestionnaire(this.result, this.filesArray).subscribe(
      data => {
        this.result = data;
        this.questionnaire = this.result.questionnaire;
        if (this.result.hasOwnProperty('questionnaire_answer_header_id') && this.result.questionnaire_answer_header_id != null) {
          this.requestObject.questionnaire_answer_header_id = this.result.questionnaire_answer_header_id;
          this.questionnaireData.QUESTIONNAIRE_ANS_HEADER_ID = this.result.questionnaire_answer_header_id;
          this.questionnaireData.QUESTIONNAIRE_COMPLETED_FLAG = this.QuestionnaireCompletionFlag;
        }
        this.showToast(toastId);
    });
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
  /**downloads file added
   */
  downloadAttachment(attachmentId, attachmentName) {
   this._questionnaireService.downloadAttachment(attachmentId)
    .subscribe(( data: any) => {
        const a = document.createElement('a');
        const blob = new Blob([data], { type: data.type });
        a.href = URL.createObjectURL(blob);
        a.download = attachmentName;
        a.id = 'attachment';
        document.body.appendChild(a);
        a.click();
    },
        error => console.log('Error downloading the file.', error),
        () => {
          console.log('OK');
          document.body.removeChild(document.getElementById('attachment'));
      });
  }

  setIndex(index) {
    this.attachmentIndex = index;
  }

  saveOnComplete() {
    this.QuestionnaireCompletionFlag = 'Y';
    this.checkQuestionaireCompletion();
    if (this.QuestionnaireCompletionFlag === 'Y') {
       this.saveQuestionnaire();
     }
  }
  /**checks whether the questionnaire is complete and sets the flag */
  checkQuestionaireCompletion() {
    this.questionnaire.questions.forEach(question => {
      // '' and null checked bcz new questionnaire returns ''
      if ((question.ANSWERS[1] === '' || question.ANSWERS[1] == null) && question.SHOW_QUESTION === true) {
        this.QuestionnaireCompletionFlag = 'N';
        this.questionnaireData.QUESTIONNAIRE_COMPLETED_FLAG = this.QuestionnaireCompletionFlag;
        this.result.questionnaire_complete_flag = 'N';
      }
    });
  }
}
