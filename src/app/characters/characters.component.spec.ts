import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { charactersComponent } from './characters.component';

describe('charactersComponent', () => {
  let component: charactersComponent;
  let fixture: ComponentFixture<charactersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ charactersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(charactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
