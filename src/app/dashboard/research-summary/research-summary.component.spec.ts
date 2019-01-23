import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchSummaryComponent } from './research-summary.component';

describe('ResearchSummaryComponent', () => {
  let component: ResearchSummaryComponent;
  let fixture: ComponentFixture<ResearchSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
