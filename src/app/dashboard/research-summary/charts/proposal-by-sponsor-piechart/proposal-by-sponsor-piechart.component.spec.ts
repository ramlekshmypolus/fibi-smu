import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalBySponsorPiechartComponent } from './proposal-by-sponsor-piechart.component';

describe('ProposalBySponsorPiechartComponent', () => {
  let component: ProposalBySponsorPiechartComponent;
  let fixture: ComponentFixture<ProposalBySponsorPiechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalBySponsorPiechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalBySponsorPiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
