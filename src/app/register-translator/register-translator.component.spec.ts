import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTranslatorComponent } from './register-translator.component';

describe('RegisterTranslatorComponent', () => {
  let component: RegisterTranslatorComponent;
  let fixture: ComponentFixture<RegisterTranslatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterTranslatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterTranslatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
