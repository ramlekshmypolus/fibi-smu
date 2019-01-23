import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IacucComponent } from './iacuc.component';

describe('IacucComponent', () => {
  let component: IacucComponent;
  let fixture: ComponentFixture<IacucComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IacucComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IacucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
