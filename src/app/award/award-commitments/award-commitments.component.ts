import { Component, OnInit } from '@angular/core';
import { AwardCommitmentsService } from './award-commitments.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
@Component( {
    selector: 'app-award-commitments',
    templateUrl: './award-commitments.component.html',
    // styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
} )
export class AwardCommitmentsComponent implements OnInit {
    showRates: boolean = true;
    showCostsharing: boolean = true;
    noRateData: boolean = true;
    noCostsharingData: boolean = true;
    awardId: string;
    result: any = {};
    subscription : Subscription;

    constructor( private awardCommitmentsService: AwardCommitmentsService, private route: ActivatedRoute ) { }

    ngOnInit() {
        this.awardId = this.route.snapshot.queryParamMap.get( 'awardId' );
        this.subscription = this.awardCommitmentsService.loadCostsharingDetails( this.awardId )
            .subscribe( data => {
                this.result = data;
                if(this.result.costShareDetails !== undefined && this.result.fAndADetails !== undefined){
                    if ( this.result.costShareDetails.length != 0 ) {
                        this.noCostsharingData = false;
                    }
                    if ( this.result.fAndADetails.length != 0 || this.result.benefitsRates.length != 0 ) {
                        this.noRateData = false;
                    }
                }
            } )
    }
    
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    showRatesTab( event: any ) {
        event.preventDefault();
        this.showRates = !this.showRates;
    }

    showCostsharingTab( event: any ) {
        event.preventDefault();
        this.showCostsharing = !this.showCostsharing;
    }
}
