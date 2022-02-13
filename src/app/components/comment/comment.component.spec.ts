import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseAppModule, provideFirebaseApp } from '@angular/fire/app';
import { Firestore, FirestoreModule, provideFirestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { environment } from 'src/environments/environment';

import { CommentComponent } from './comment.component';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  var fireStore: Firestore;
  var fireService: FirestoreService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        RouterModule.forRoot([]),
        provideFirebaseApp( () => initializeApp(environment.firebase)),
        provideFirestore( () => getFirestore() ),
        FirestoreModule,
        FirebaseAppModule
      ],
      declarations: [ CommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    fireService= new FirestoreService(fireStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('delete comment', (done: DoneFn) => {
    var userChat={
      id:6,
      user:'Bitricio',
      text:'',
      likes:0,
      userLikes:[],
      userComments:[]
    }
    expect(fireService.deleteC('propuestas',userChat)).toBeTruthy();
    done();
  });
});
