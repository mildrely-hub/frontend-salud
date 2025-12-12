// src/app/pages/login/login.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login'; // 👈 Cambia 'Login' por 'LoginComponent'

describe('LoginComponent', () => { // 👈 Cambia 'Login' por 'LoginComponent'
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent] // 👈 Nombre corregido
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent); // 👈 Cambia 'Login' por 'LoginComponent'
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});