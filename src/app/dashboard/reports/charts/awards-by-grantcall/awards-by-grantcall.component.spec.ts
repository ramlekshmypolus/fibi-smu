import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsByGrantcallComponent } from './awards-by-grantcall.component';

describe('AwardsByGrantcallComponent', () => {
  let component: AwardsByGrantcallComponent;
  let fixture: ComponentFixture<AwardsByGrantcallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardsByGrantcallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardsByGrantcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
