import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolsByGrantcallComponent } from './protocols-by-grantcall.component';

describe('ProtocolsByGrantcallComponent', () => {
  let component: ProtocolsByGrantcallComponent;
  let fixture: ComponentFixture<ProtocolsByGrantcallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolsByGrantcallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolsByGrantcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
