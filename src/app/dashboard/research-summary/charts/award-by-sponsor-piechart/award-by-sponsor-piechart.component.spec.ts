import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardBySponsorPiechartComponent } from './award-by-sponsor-piechart.component';

describe('AwardBySponsorPiechartComponent', () => {
  let component: AwardBySponsorPiechartComponent;
  let fixture: ComponentFixture<AwardBySponsorPiechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardBySponsorPiechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardBySponsorPiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
