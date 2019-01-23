import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantCallListComponent } from './grant-call.component';

describe('GrantCallListComponent', () => {
  let component: GrantCallListComponent;
  let fixture: ComponentFixture<GrantCallListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrantCallListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantCallListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
