import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseAppModule, provideFirebaseApp } from '@angular/fire/app';
import { Firestore, FirestoreModule, provideFirestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { environment } from 'src/environments/environment';

import { PostComponent } from './post.component';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
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
      declarations: [ PostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fireService= new FirestoreService(fireStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('send comment', (done: DoneFn) => {
    var userChat={
      id:6,
      user:'Bitricio',
      text:'',
      likes:0,
      userLikes:[]
    }
    expect(fireService.sendComment(userChat,'propuestas','Fernando','Muy buena la new prop')).toBeTruthy();
    done();
  });

  it('delete post', (done: DoneFn) => {
    var userChat={
      id:6,
      user:'Bitricio',
      text:'',
      likes:0,
      userLikes:[]
    }
    expect(fireService.deleteP('propuestas',userChat)).toBeTruthy();
    done();
  });

  it('send like', (done: DoneFn) => {
    var userChat={
      id:6,
      user:'Bitricio',
      text:'',
      likes:0
    }
    expect(fireService.sendLike(userChat,'propuestas','Roberto')).toBeTruthy();
    done();
  });
});
