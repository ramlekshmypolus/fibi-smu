
/**authour : Mahesh Sreenath V M
 * a common elastic search componet  currently only supports or condition for the feilds
 * options - input
 * selectedResult- output emits the selected output as event listen for this event in the component which use
 * app-elastic-component
 * options => index - index to be searched
 * fields => all the index fileds you want to search for the value
 * debouncetime => delay btn the user event triggers search call
 * url => url for the elastic host with ip and port
 * type => index type for the given search
 * contextFIeld => the field that should be used as serchText value once user selects the reuslt
 * size => the size of the search result
 */
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { AppElasticService } from './app-elastic.service';

@Component({
  selector: 'app-elastic',
  templateUrl: './app-elastic.component.html',
  styleUrls: ['./app-elastic.component.css'],
  providers: [AppElasticService]
})
export class AppElasticComponent implements OnChanges {

  @Input() options: any = {};
  @Input() placeHolder;
  @Input() clearField;
  @Output() selectedResult: EventEmitter<any> = new EventEmitter<any>();
  searchText = '';
  results = [];
  timer: any;
  active = false;
  query = {
    index: null,
    size: 20,
    type: null,
    body: {
        query: {
            bool: {
                should: []
            }
        },
        sort: [{
            _score: {
                order: 'desc'
            }
        }],
        highlight: {
            pre_tags: ['<b>'],
            post_tags: ['</b>'],
        }
    }
  };
  constructor(private _appElasticService: AppElasticService) { }

  ngOnChanges() {
    this.clearField = '' + this.clearField;
    if (this.clearField === 'true') {
      this.searchText = '';
    }
  }

  /**makes a elastic host connection and the result is formmatted in string of label with bold tags for matching
   * fields. use label for showing as it outputs html tag.injected it as innerhtml on html
   * a timer is used to avoid multiple calls to server the call only occurs if the user doesn't trigger the event for
   * 500 millisecods
   */
  getElasticResult() {
    this.results = [];
    clearTimeout(this.timer);
     this.timer = setTimeout(() => {
       this.searchText.trim();
        this.querybuilder();
        const url = this.options.url + this.options.index + '/' + this.options.type + '/' + '_search?size=' + this.options.size;
         this._appElasticService.search(url, this.query.body).then((result: any) => {
          const source    = ((result.hits || {}).hits || []).map((hit) => hit._source );
          const highlight = ((result.hits || {}).hits || []).map((hit) => hit.highlight );
          source.forEach((element, index) => {
            let label = '';
            Object.keys(this.options.fields).forEach(key => {
              label =  label + (highlight[index][key] || source[index][key]) + '|';
            });
          this.results.push({'label': label.slice(0, -1), 'value': element});
          });
        });
      }, this.options.debounceTime || 500);
  }

  /**
   * dynamically build the query for elastic search uses the feilds from the option input and returns a
   * newly generated query for given index and  fields with new updated input value
   */
  querybuilder() {
    this.query.index = this.options.index;
    this.query.type  = this.options.type;
    this.query.body.highlight['fields'] = this.options.fields;
    let condition: any = {};
    this.query.body.query.bool.should = [];
    Object.keys(this.options.fields).forEach(field => {
      condition = Object.assign({} , condition);
      condition.match = {};
      condition.match[field] = { query: this.searchText, operator: 'or'};
      this.query.body.query.bool.should.push(condition);
    });
  }
  emitSelectedObject(value) {
    this.active = false;
    if (value) {
      this.selectedResult.emit(value);
      this.searchText = value[this.options.contextField] || this.searchText;
    } else {
      this.searchText = '';
      this.selectedResult.emit(null);
    }
  }
}
