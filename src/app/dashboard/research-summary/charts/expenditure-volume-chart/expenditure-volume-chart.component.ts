import { Component, OnInit, Input } from '@angular/core';

import {GoogleChartService} from '../../../google-chart.service';

@Component({
  selector: 'app-expenditure-volume-chart',
  templateUrl: './expenditure-volume-chart.component.html'
})
export class ExpenditureVolumeChartComponent extends GoogleChartService implements OnInit {

  @Input() expenditureVolumeData;
  private researchSummaryList = [];
  private areaChartList = [];
  private options;
  private data;
  private chart;

  constructor( ) {
    super();
  }

  ngOnInit() {
    if ( this.expenditureVolumeData.length > 0 ) {
      if ( this.expenditureVolumeData !== null && this.expenditureVolumeData !== undefined ) {
          this.areaChartList = [];
          this.areaChartList.push( ['Year', 'Direct', 'FA'] );
          for ( let i = 0; i < this.expenditureVolumeData.length; i++ ) {
              this.areaChartList.push( [this.expenditureVolumeData[i][0],
                                        this.expenditureVolumeData[i][1],
                                        this.expenditureVolumeData[i][2]] );
          }
          super.googleChartFunction();
      }
    }
  }


  drawGraph() {
          this.data = this.createDataTable( this.areaChartList );
          this.options = {
              hAxis: {
                  title: 'Year',
                  minValue: 0,
                  textStyle: {color: '#424242', fontName: 'Roboto'},
                  titleTextStyle: { color: '#424242'}
              },
              legend: { position: 'top', alignment: 'end',
                        textStyle: {color: '#424242' , fontName: 'Roboto'}
              },
              colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                       '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                       '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                       '#FF7143', '#8C6E63', '#BDBDBD', '#78909C'
              ],
              animation: {
                      startup: true,
                      duration: 1000,
                      easing: 'linear'
              },
              vAxis: { title: 'Cost Amount',
                       textStyle: { color: '#424242', fontName: 'Roboto' },
                       titleTextStyle: { color: '#424242', fontName: 'Roboto' }
              }
          };
          this.chart = this.createAreaChart( document.getElementById( 'chart_divEvolution' ) );
          this.chart.draw( this.data, this.options );
      }

  onResize( event ) {
    this.chart.draw( this.data, this.options );
  }
}
