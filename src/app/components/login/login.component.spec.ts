import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseAppModule, provideFirebaseApp } from '@angular/fire/app';
import { FirestoreModule, provideFirestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { AppModule } from 'src/app/app.module';
import { FirestoreService } from 'src/app/services/firestore.service';
import { environment } from 'src/environments/environment';
import { Firestore} from '@angular/fire/firestore';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getting users to confirm access', (done: DoneFn) => {
    fireService= new FirestoreService(fireStore);
    fireService.getUser().then( (snapshot) =>{
      expect(snapshot.exists()).toBeTruthy();
      done();
    });
    
  });

});
