import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html',
  styleUrls: ['./proposal-details.component.css']
})
export class ProposalDetailsComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};

  constructor() { }

  ngOnInit() {}

}
