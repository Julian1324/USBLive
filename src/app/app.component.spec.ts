import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
// import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { WebSocketService } from 'src/app/services/web-socket.service';
// import { FirestoreService } from 'src/app/services/firestore.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('Lectura de propuesta', () => {
    let propuesta:any= document.querySelector('.messageBox');
    // propuesta= propuesta.innerHTML;

    expect(propuesta).toContain('Propongo esto ');
  });


  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  it(`should have as title 'USBLive'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('USBLive');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('USBLive app is running!');
  // });
});