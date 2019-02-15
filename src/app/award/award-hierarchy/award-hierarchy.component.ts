import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AwardHierarchyService } from './award-hierarchy.service';
import { AwardSummaryService } from '../award-home/award-summary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeModel, TreeNode, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { Subscription } from 'rxjs/Subscription';

@Component( {

    selector: 'app-award-hierarchy',
    templateUrl: './award-hierarchy.component.html',
} )

export class AwardHierarchyComponent implements AfterViewInit, OnDestroy {
    result: any = {};
    temp1Object: any = [{}];
    public tempObject: any[] = [];
    public awardNumber: string;
    public searchKey: any;
    public leadUnitName: string;
    public awardStatus: string;
    public sponsorName: string;
    public rootAwardNumber: string;
    public parentAwardNumber: string;
    public awardId: string;
    public activityType: string;
    public awardType: string;
    public accountType: string;
    public sponsorAwardNumber: string;
    public awardTitle: string;
    public awardEffectiveDate: string;
    public obligationStartDate: string;
    public obligationEndDate: string;
    public noticeDate: string;
    public obligatedAmount: string;
    public anticipatedAmount: string;
    public treeData: any[] = [];
    public accountNumber: string;
    piName: string;
    expandAllEnabled = false;
    awardSummSubscription: Subscription;
    loadAwardHierarchySubscription: Subscription;
    nodes: any = [];
    options: ITreeOptions = {
        displayField: 'name',
        isExpandedField: 'isOpen',
        idField: 'awardId',
        childrenField: 'children',
        actionMapping: {
            mouse: {
                click: ( tree, node, $event ) => {
                    node.setActiveAndVisible();
                    this.awardSummSubscription =  this.awardSummaryService.loadAwardSummary( node.id ).subscribe( data => {
                        this.result = data || [];
                        if ( this.result.awardDetails !== undefined) {
                            this.awardNumber = this.result.awardDetails[0].award_number;
                            this.activityType = this.result.awardDetails[0].activity_type;
                            this.awardType = this.result.awardDetails[0].award_type;
                            this.awardId = node.id;
                            this.accountType = this.result.awardDetails[0].account_type;
                            this.sponsorAwardNumber = this.result.awardDetails[0].sponsor_award_number;
                            this.awardTitle = this.result.awardDetails[0].title;
                            this.awardEffectiveDate = this.result.awardDetails[0].award_effective_date;
                            this.obligationStartDate = this.result.awardDetails[0].obligation_start;
                            this.obligationEndDate = this.result.awardDetails[0].obligation_end;
                            this.noticeDate = this.result.awardDetails[0].notice_date;
                            this.obligatedAmount = this.result.awardDetails[0].obligated_amount;
                            this.anticipatedAmount = this.result.awardDetails[0].anticipated_amount;
                            this.accountNumber = this.result.awardDetails[0].account_number;
                            this.piName = this.result.awardDetails[0].full_name;
                        }
                    } );

                },
                dblClick: ( tree, node, $event ) => {
                    if ( node.hasChildren ) { TREE_ACTIONS.TOGGLE_EXPANDED( tree, node, $event ); }
                }
            }
        }
    };

    constructor( public awardHierarchyService: AwardHierarchyService, public awardSummaryService: AwardSummaryService,
        public route: ActivatedRoute, public router: Router ) {
            this.functionInConstructor();
    }

    @ViewChild('tree') tree;
    ngAfterViewInit() {
        setTimeout(() => {
            this.tree.treeModel.expandAll();
            const currentNode = this.tree.treeModel.getNodeById( this.awardId );
            currentNode.setActiveAndVisible();
        }, 1000 );
    }

    expandAllNodes( e: any ) {
        this.expandAllEnabled = false;
        e.preventDefault();
        this.tree.treeModel.expandAll();
        const currentNode = this.tree.treeModel.getNodeById( this.awardId );
        currentNode.setActiveAndVisible();
    }

    // function to be called in constructor
    functionInConstructor() {
        this.awardId = this.route.snapshot.queryParams['awardId'];
       this.awardSummSubscription = this.awardSummaryService.loadAwardSummary( this.awardId ).subscribe( data => {
            this.result = data || [];
            if ( this.result != null ) {
                this.awardNumber = this.result.awardDetails[0].award_number;
                this.rootAwardNumber = this.result.awardDetails[0].root_award_number;
               this.loadAwardHierarchySubscription = this.awardHierarchyService.loadAwardHierarchy( this.rootAwardNumber, this.awardNumber )
               .subscribe( hierarchyData => {
                    this.result = hierarchyData || [];
                    if ( this.result != null ) {
                        this.nodes = Array.of( this.result.awardHierarchy );
                        this.awardDetailsFetching( this.awardId );
                    }
                } );
            }

        } );
    }

    collapseAllNodes( event: any ) {
        this.expandAllEnabled = true;
        event.preventDefault();
        this.tree.treeModel.collapseAll();
    }
    awardDetailsFetching( awardId: string ) {
       this.awardSummSubscription = this.awardSummaryService.loadAwardSummary( awardId ).subscribe( data => {
            this.result = data || [];
            if ( this.result.awardDetails[0] != null ) {
                this.accountNumber = this.result.awardDetails[0].account_number;
                this.piName = this.result.awardDetails[0].full_name;
                this.activityType = this.result.awardDetails[0].activity_type;
                this.awardType = this.result.awardDetails[0].award_type;
                this.accountType = this.result.awardDetails[0].account_type;
                this.leadUnitName = this.result.awardDetails[0].lead_unit_name;
                this.awardStatus = this.result.awardDetails[0].award_status;
                this.sponsorName = this.result.awardDetails[0].sponsor_name;
                this.awardTitle = this.result.awardDetails[0].title;
                this.awardEffectiveDate = this.result.awardDetails[0].award_effective_date;
                this.obligationStartDate = this.result.awardDetails[0].obligation_start;
                this.obligationEndDate = this.result.awardDetails[0].obligation_end;
                this.noticeDate = this.result.awardDetails[0].notice_date;
                this.obligatedAmount = this.result.awardDetails[0].obligated_amount;
                this.anticipatedAmount = this.result.awardDetails[0].anticipated_amount;
            }
        } );
    }

    // change tab to award-home
    awardView( event: any, awardId: string ) {
        event.preventDefault();
        this.router.navigate( ['fibi/award'], { queryParams: { awardId: awardId } } );
        this.awardHierarchyService.changeCurrenttab( 'award_home' );
    }

    ngOnDestroy() {
        this.loadAwardHierarchySubscription.unsubscribe();
        this.awardSummSubscription.unsubscribe();
    }
}
