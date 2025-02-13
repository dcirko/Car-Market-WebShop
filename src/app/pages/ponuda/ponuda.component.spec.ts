import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonudaComponent } from './ponuda.component';

describe('PonudaComponent', () => {
  let component: PonudaComponent;
  let fixture: ComponentFixture<PonudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PonudaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
