import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrendaComponent } from './modal-prenda.component';

describe('ModalPrendaComponent', () => {
  let component: ModalPrendaComponent;
  let fixture: ComponentFixture<ModalPrendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPrendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
