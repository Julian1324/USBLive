import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseAppModule, FirebaseApp, provideFirebaseApp } from '@angular/fire/app';
import { Firestore, FirestoreModule, provideFirestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { AppComponent } from 'src/app/app.component';
import { FirestoreService } from 'src/app/services/firestore.service';
import { environment } from 'src/environments/environment';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  var fireStore: Firestore;
  var fireService: FirestoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        provideFirebaseApp( () => initializeApp(environment.firebase)),
        provideFirestore( () => getFirestore() ),
        FirestoreModule,
        FirebaseAppModule
    ],
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fireService= new FirestoreService(fireStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('send post', (done: DoneFn) => {
    expect(fireService.saveMessage('Bitricio','New prop',6,0,'propuestas')).toBeTruthy();
    done();
  });

});
