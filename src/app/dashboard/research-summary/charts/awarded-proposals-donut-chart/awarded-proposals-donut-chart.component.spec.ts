import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardedProposalsDonutChartComponent } from './awarded-proposals-donut-chart.component';

describe('AwardedProposalsDonutChartComponent', () => {
  let component: AwardedProposalsDonutChartComponent;
  let fixture: ComponentFixture<AwardedProposalsDonutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardedProposalsDonutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardedProposalsDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
