import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grant-view',
  templateUrl: './grant-view.component.html',
  styleUrls: ['./grant-view.component.css']
})
export class GrantViewComponent implements OnInit {

  @Input() result: any = {};
  @Input() showDataFlagObj: any = {};

  readMoreOrNotObj: any = {};

  constructor( private _router: Router ) { }

  ngOnInit() {}

  /** navigate to dashboard */
  openGoBackModal() {
    this._router.navigate( ['fibi/dashboard/grantCall'] );
  }

}
