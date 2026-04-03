import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FsocietyComponent } from './fsociety.component';

describe('FsocietyComponent', () => {
  let component: FsocietyComponent;
  let fixture: ComponentFixture<FsocietyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FsocietyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FsocietyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
