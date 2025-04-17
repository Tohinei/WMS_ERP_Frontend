import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasNoAccessComponent } from './has-no-access.component';

describe('HasNoAccessComponent', () => {
  let component: HasNoAccessComponent;
  let fixture: ComponentFixture<HasNoAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HasNoAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HasNoAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
