import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantEditComponent } from './grant-edit.component';

describe('GrantEditComponent', () => {
  let component: GrantEditComponent;
  let fixture: ComponentFixture<GrantEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrantEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
