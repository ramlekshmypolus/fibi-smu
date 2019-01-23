import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { GoogleChartService } from '../../../google-chart.service';

declare var google: any;

@Component( {
    selector: 'app-protocols-by-grantcall',
    template: `
  <div id="protocols-by-grantcall-chart" (window:resize)="onResize($event)"></div>`,
} )

export class ProtocolsByGrantcallComponent extends GoogleChartService implements OnInit {

    @Input() pieChartData: any = {};
    @Output() pieChartReportProtocolList: EventEmitter<any> = new EventEmitter<any>();

    private piechartOptions;
    private grantCallChart;
    private piechartDrawData;
    private piechartList: any[];
    private piechartDrawList: any[] = [];

    constructor() {
        super();
    }

    ngOnInit() {
        /* fetches data to draw graph and converts it to required format */
        if ( this.pieChartData.protocolsByType !== undefined && this.pieChartData !== null ) {
            this.piechartList = Object.entries(this.pieChartData.protocolsByType).map(([key, value]) => ([key, value.length]));
            this.piechartDrawList = [];
            this.piechartDrawList.push( ['Type', 'Count'] );
            for ( let index = 0; index < this.piechartList.length; index++ ) {
                this.piechartDrawList.push( [this.piechartList[index][0], this.piechartList[index][1]] );
            }
            super.googleChartFunction();
        }
    }

    /** defines styles and draws chart, handles click event of chart */
    drawGraph() {
        this.piechartDrawData = google.visualization.arrayToDataTable( this.piechartDrawList );
        this.piechartOptions = {
            title: '',
            legend: { position: 'right', alignment: 'center', textStyle: {color: '#424242', fontSize: 13} },
            chartArea: { width: '120%', height: '120%'},
            is3D: true,
            colors: ['#E25B5F', '#EC407A', '#C76FD7', '#7E57C2', '#5E6ABE',
                '#7BCFFF', '#2AB6F4', '#25C8D9', '#24A095', '#68B96A',
                '#9CCC66', '#E5F37A', '#FFF15A', '#FDD154', '#FFA827',
                '#FF7143', '#8C6E63', '#BDBDBD', '#78909C']
        };
        this.grantCallChart = this.createPiChart( document.getElementById( 'protocols-by-grantcall-chart' ) );
        this.grantCallChart.draw( this.piechartDrawData, this.piechartOptions );
        google.visualization.events.addListener( this.grantCallChart, 'onmouseover', ( event ) => {
            document.getElementById( 'protocols-by-grantcall-chart' ).style.cursor = 'pointer';
        } );
        google.visualization.events.addListener( this.grantCallChart, 'onmouseout', ( event ) => {
            document.getElementById( 'protocols-by-grantcall-chart' ).style.cursor = '';
        } );
        google.visualization.events.addListener( this.grantCallChart, 'select', ( event ) => {
            const PROTOCOLS_OBJ: any = {};
            if (this.grantCallChart.getSelection()[0] !== undefined) {
                // retrieves formatted value of selected portion of the chart
                PROTOCOLS_OBJ.reportType = this.piechartDrawData.getFormattedValue(this.grantCallChart.getSelection()[0].row, 0);
                PROTOCOLS_OBJ.chartType = 'PROTOCOL_CHART';
                this.pieChartReportProtocolList.emit(PROTOCOLS_OBJ);
            }
        } );
    }

    /** redraws chart on window resize
     * @param event
     */
    onResize( event ) {
        this.grantCallChart.draw( this.piechartDrawData, this.piechartOptions );
    }

}

