import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InprogressProposalsDonutChartComponent } from './inprogress-proposals-donut-chart.component';

describe('InprogressProposalsDonutChartComponent', () => {
  let component: InprogressProposalsDonutChartComponent;
  let fixture: ComponentFixture<InprogressProposalsDonutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InprogressProposalsDonutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InprogressProposalsDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
