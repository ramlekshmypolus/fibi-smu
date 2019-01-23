import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrbComponent } from './irb.component';

describe('IrbComponent', () => {
  let component: IrbComponent;
  let fixture: ComponentFixture<IrbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
