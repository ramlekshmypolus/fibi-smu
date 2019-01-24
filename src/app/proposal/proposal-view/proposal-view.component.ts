import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.css']
})
export class ProposalViewComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};

  constructor() { }

  ngOnInit() {}

}
