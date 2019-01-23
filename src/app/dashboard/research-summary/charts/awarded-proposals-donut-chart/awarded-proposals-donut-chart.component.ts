import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import {GoogleChartService} from '../../../google-chart.service';

declare var google: any;

@Component({
  selector: 'app-awarded-proposals-donut-chart',
  templateUrl: './awarded-proposals-donut-chart.component.html'
})
export class AwardedProposalsDonutChartComponent extends GoogleChartService implements OnInit {

  @Input() summaryAwardDonutChartData = [];
  @Input() deptUnitNumber = null;
  private awardOptions = {};
  private awardList = [];
  private awardStateList = [];
  private sponsorList = [];
  private awardChart;
  private awardData;

  constructor( private router: Router) {
      super();
  }

  ngOnInit() {
    if ( this.summaryAwardDonutChartData !== undefined && this.summaryAwardDonutChartData !== null ) {
        this.awardList = this.summaryAwardDonutChartData;
        this.awardStateList = [];
        this.awardStateList.push( ['Sponsor', 'AwardedProposalCount'] );
        for ( let index = 0; index < this.awardList.length; index++ ) {
            this.sponsorList.push( [this.awardList[index][0], this.awardList[index][1]] );
            this.awardStateList.push( [this.awardList[index][1], this.awardList[index][2]] );
        }
        super.googleChartFunction();
    }
  }

  drawGraph() {
      this.awardData = google.visualization.arrayToDataTable( this.awardStateList );
      this.awardOptions = {
          legend: { position: 'right', alignment: 'center', textStyle: {color: '#424242', fontSize: 13, fontName: 'Roboto'} },
          colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                   '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                   '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                   '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
          pieHole: 0.2,
          chartArea: { width: '140%', height: '140%'}
      };
      this.awardChart = this.createPiChart( document.getElementById( 'donut_award_chart' ) );
      this.awardChart.draw( this.awardData, this.awardOptions );
      google.visualization.events.addListener( this.awardChart, 'select', ( event ) => {
              let sponsorType = '';
              if ( this.awardChart.getSelection()[0].row !== null && this.awardChart.getSelection()[0].row !== undefined ) {
                  sponsorType = this.awardData.getFormattedValue( this.awardChart.getSelection()[0].row, 0 );
                  for ( let index = 0; index < this.sponsorList.length; index++ ) {
                      if ( sponsorType === this.sponsorList[index][1] ) {
                          this.router.navigate( ['fibi/dashboard/expandedView'],
                                                {queryParams : {
                                                  'donutChartIndex' : 'AWARDED',
                                                  'sponsorCode' : this.sponsorList[index][0],
                                                  'donutAwardHeading': 'Awards by ' + sponsorType,
                                                  'departUnitNumber': this.deptUnitNumber }} );
                          break;
                      }
                  }
              }
      } );
      google.visualization.events.addListener( this.awardChart, 'onmouseover', ( event ) => {
          document.getElementById( 'donut_award_chart' ).style.cursor = 'pointer';
      } );
      google.visualization.events.addListener( this.awardChart, 'onmouseout', ( event ) => {
          document.getElementById( 'donut_award_chart' ).style.cursor = '';
      } );
  }

  onResize( event ) {
      if ( this.awardList != null && this.awardList !== undefined ) {
          this.awardChart.draw( this.awardData, this.awardOptions );
      }
  }

}
