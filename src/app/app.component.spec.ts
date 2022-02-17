import { TestBed } from '@angular/core/testing';
import { FirebaseAppModule } from '@angular/fire/app';
import { FirestoreModule } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {AppModule} from './app.module';
// import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { WebSocketService } from 'src/app/services/web-socket.service';
// import { FirestoreService } from 'src/app/services/firestore.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppModule,
        FirestoreModule,
        FirebaseAppModule
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'USBLive'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   console.log(app);
    
  //   expect(app.title).toEqual('USBLive');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('USBLive app is running!');
  // });
});