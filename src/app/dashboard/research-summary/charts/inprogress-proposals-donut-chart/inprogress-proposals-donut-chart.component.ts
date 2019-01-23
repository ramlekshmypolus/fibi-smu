import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import {GoogleChartService} from '../../../google-chart.service';

declare var google: any;

@Component({
  selector: 'app-inprogress-proposals-donut-chart',
  templateUrl: './inprogress-proposals-donut-chart.component.html',
  styleUrls: ['./inprogress-proposals-donut-chart.component.css']
})
export class InprogressProposalsDonutChartComponent extends GoogleChartService implements OnInit {

    @Input() summaryProposalDonutChartData = [];
    @Input() deptUnitNumber = null;
    private proposalOptions = {};
    private proposalStateList = [];
    private sponsorList = [];
    private proposalData;
    private proposalChart;

    constructor( private router: Router) {
        super();
    }
    ngOnInit() {
      if ( this.summaryProposalDonutChartData !== undefined && this.summaryProposalDonutChartData !== null ) {
          this.proposalStateList = [];
          this.proposalStateList.push( ['Sponsor', 'ProposalCount'] );
          for ( let index = 0; index < this.summaryProposalDonutChartData.length; index++ ) {
            this.sponsorList.push( [this.summaryProposalDonutChartData[index][0], this.summaryProposalDonutChartData[index][1]] );
            this.proposalStateList.push( [this.summaryProposalDonutChartData[index][1], this.summaryProposalDonutChartData[index][2]] );
           }
          super.googleChartFunction();
      }
    }
    drawGraph() {
        this.proposalData = google.visualization.arrayToDataTable( this.proposalStateList );
        this.proposalOptions = {
                colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                    '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                    '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                    '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'],
                pieHole: 0.2,
                pieStartAngle: 90,
                chartArea: { width: '120%', height: '120%'},
                legend: { position: 'right', alignment: 'center',
                textStyle: {color: '#424242', fontSize: 13, fontName: 'Roboto'} },
        };
        this.proposalChart = this.createPiChart( document.getElementById( 'donut_proposal_chart' ) );
        this.proposalChart.draw( this.proposalData, this.proposalOptions );
        google.visualization.events.addListener( this.proposalChart, 'select', ( event ) => {
            let sponsorType = '';
            if ( this.proposalChart.getSelection()[0].row !== null && this.proposalChart.getSelection()[0].row !== undefined ) {
                sponsorType = this.proposalData.getFormattedValue( this.proposalChart.getSelection()[0].row, 0 );
                for ( let index = 0; index < this.sponsorList.length; index++ ) {
                    if ( sponsorType === this.sponsorList[index][1] ) {
                        this.router.navigate( ['fibi/dashboard/expandedView'],
                                              {queryParams : {'donutChartIndex' : 'INPROGRESS',
                                                              'sponsorCode' : this.sponsorList[index][0],
                                                              'donutProposalHeading' : 'Proposals by ' + sponsorType ,
                                                              'departUnitNumber': this.deptUnitNumber }
                        });
                    }
                }
            }
          });

          google.visualization.events.addListener( this.proposalChart, 'onmouseover', ( event ) => {
              document.getElementById( 'donut_proposal_chart' ).style.cursor = 'pointer';
          } );
          google.visualization.events.addListener( this.proposalChart, 'onmouseout', ( event ) => {
              document.getElementById( 'donut_proposal_chart' ).style.cursor = '';
          } );
    }

    onResize( event ) {
        if ( this.summaryProposalDonutChartData != null && this.summaryProposalDonutChartData !== undefined ) {
            this.proposalChart.draw( this.proposalData, this.proposalOptions );
        }
    }
}
