import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import {GoogleChartService} from '../../../google-chart.service';

declare var google: any;

@Component({
  selector: 'app-proposal-by-sponsor-piechart',
  templateUrl: './proposal-by-sponsor-piechart.component.html',
  styleUrls: ['./proposal-by-sponsor-piechart.component.css']
})
export class ProposalBySponsorPiechartComponent extends GoogleChartService implements OnInit {

    @Input() summaryProposalPieChartData = [];
    @Input() deptUnitNumber = null;
    private proposalOptions = {};
    private proposalStateList = [];
    private sponsorList = [];
    private proposalData;
    private proposalChart;

    constructor( private router: Router ) {
        super();
    }


    ngOnInit() {
      if ( this.summaryProposalPieChartData !== undefined && this.summaryProposalPieChartData != null ) {
          this.proposalStateList = [];
          this.proposalStateList.push( ['Sponsor', 'ProposalCount'] );
          for ( let index = 0; index < this.summaryProposalPieChartData.length; index++ ) {
              this.sponsorList.push( [this.summaryProposalPieChartData[index][0], this.summaryProposalPieChartData[index][1]] );
              this.proposalStateList.push( [this.summaryProposalPieChartData[index][1], this.summaryProposalPieChartData[index][2]] );
          }
            super.googleChartFunction();
        }
    }

    drawGraph() {
        this.proposalData = google.visualization.arrayToDataTable( this.proposalStateList );
        this.proposalOptions = {
            is3D: true,
            legend: { position: 'right', alignment: 'center',
                      textStyle: {color: '#424242', fontSize: 13, fontName: 'Roboto'}
                    },
            chartArea: { width: '140%', height: '140%'},
            colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                     '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                     '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                     '#FF7143', '#8C6E63', '#BDBDBD', '#78909C']
        };
        this.proposalChart = this.createPiChart( document.getElementById( 'pichart_divEvolution' ) );
        this.proposalChart.draw( this.proposalData, this.proposalOptions );
        google.visualization.events.addListener( this.proposalChart, 'select', ( event ) => {
            let sponsorType = '';
            if ( this.proposalChart.getSelection()[0].row !== null || this.proposalChart.getSelection()[0].row !== undefined ) {
                sponsorType = this.proposalData.getFormattedValue( this.proposalChart.getSelection()[0].row, 0 );
                for ( let index = 0; index < this.sponsorList.length; index++ ) {
                    if ( sponsorType === this.sponsorList[index][1] ) {
                        localStorage.setItem( 'sponsorCode', this.sponsorList[index][0] );
                        this.router.navigate( ['fibi/dashboard/expandedView'],
                                              {queryParams : {
                                                'pieChartIndex' : 'PROPOSAL',
                                                'sponsorCode' :  this.sponsorList[index][0],
                                                'proposalHeading' :  'Proposals by ' + sponsorType ,
                                                'departUnitNumber': this.deptUnitNumber  }
                        });
                    }
                }
            }
        });

        google.visualization.events.addListener( this.proposalChart, 'onmouseover', ( event ) => {
            document.getElementById( 'pichart_divEvolution' ).style.cursor = 'pointer';
        } );
        google.visualization.events.addListener( this.proposalChart, 'onmouseout', ( event ) => {
            document.getElementById( 'pichart_divEvolution' ).style.cursor = '';
        } );
    }

    onResize( event ) {
        if ( this.summaryProposalPieChartData != null && this.summaryProposalPieChartData !== undefined ) {
            this.proposalChart.draw( this.proposalData, this.proposalOptions );
        }
    }

}
