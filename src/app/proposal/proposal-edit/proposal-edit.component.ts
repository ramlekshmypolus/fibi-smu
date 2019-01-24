import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-edit',
  templateUrl: './proposal-edit.component.html',
  styleUrls: ['./proposal-edit.component.css']
})
export class ProposalEditComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};

  constructor() { }

  ngOnInit() {}

}
