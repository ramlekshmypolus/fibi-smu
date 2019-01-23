import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureVolumeChartComponent } from './expenditure-volume-chart.component';

describe('ExpenditureVolumeChartComponent', () => {
  let component: ExpenditureVolumeChartComponent;
  let fixture: ComponentFixture<ExpenditureVolumeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenditureVolumeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenditureVolumeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
