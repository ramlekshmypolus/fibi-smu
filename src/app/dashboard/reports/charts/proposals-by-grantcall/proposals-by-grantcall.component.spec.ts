import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalsByGrantcallComponent } from './proposals-by-grantcall.component';

describe('ProposalsByGrantcallComponent', () => {
  let component: ProposalsByGrantcallComponent;
  let fixture: ComponentFixture<ProposalsByGrantcallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalsByGrantcallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalsByGrantcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
