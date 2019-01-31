import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import { ITreeOptions, TREE_ACTIONS, TreeComponent } from 'angular-tree-component';

@Component({
  selector: 'app-questionnaire-tree',
  template:  `<div class ="fixed-tree">
                <div class="col-12 qst-head">
                    <h5>Question Tree</h5>
                </div>
                <div class ="qst-tree-content">
                  <tree-root #tree [nodes]="nodes.nodes" [options]="options"></tree-root>
                </div>
              </div>`,
  styleUrls: ['./questionnaire-tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionnaireTreeComponent implements OnInit, OnChanges {

  constructor() { }
  @Input() nodes: any;
  @Output() viewQuestion: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  options: ITreeOptions = {
    displayField: 'name',
    isExpandedField: 'isOpen',
    idField: 'questionId',
    childrenField: 'children',
    actionMapping: {
        mouse: {
            click: ( tree, node, $event ) => {
                node.setActiveAndVisible();
                this.viewQuestion.emit(node.data.questionId);
            },
            dblClick: ( tree, node, $event ) => {
                if ( node.hasChildren ) {
                  TREE_ACTIONS.TOGGLE_EXPANDED( tree, node, $event );
                }
            }
        }
    }
  };
  ngOnInit() {
  }
  ngOnChanges() {
    this.tree.treeModel.update();
    setTimeout( () => {
      this.tree.treeModel.expandAll();
    });
  }

}
