import { Injectable, OnInit } from '@angular/core';

declare var google: any;

@Injectable()
export class GoogleChartService implements OnInit {

    private static googleLoaded: any;

    constructor() { }

    getGoogle() {
        return google;
    }

    ngOnInit() { }

    googleChartFunction() {
    if ( !GoogleChartService.googleLoaded ) {
          GoogleChartService.googleLoaded = true;
        google.charts.load( 'current',  {packages: [ 'corechart', 'bar' ]} );
      }
        google.charts.setOnLoadCallback( () => this.drawGraph());
    }

    drawGraph() { }

    createAreaChart( element: any ): any {
        return new google.visualization.AreaChart(element);
    }

    createDataTable( array: any[] ): any {
        return new google.visualization.arrayToDataTable(array);
    }

    createPiChart( element: any ): any {
        return new google.visualization.PieChart(element);
    }
}
