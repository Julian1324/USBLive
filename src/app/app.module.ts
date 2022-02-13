import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import { provideFirebaseApp, getApp, initializeApp, FirebaseAppModule } from '@angular/fire/app';
import { Firestore, FirestoreModule, getFirestore, provideFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PostComponent } from './components/post/post.component';
import { CommentComponent } from './components/comment/comment.component';
import { FirestoreService } from './services/firestore.service';
import { environment } from 'src/environments/environment';
import { WebSocketService } from './services/web-socket.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PostComponent,
    CommentComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    provideFirebaseApp( () => initializeApp(environment.firebase)),
    provideFirestore( () => getFirestore() ),
    FirestoreModule,
    FirebaseAppModule,
    // provideFirebaseApp(() => initializeApp({
      // apiKey: "AIzaSyBZXJ5IbggU_y7qMKFT-ht4IV2sfsesjUA",
      // authDomain: "usblive-9ca91.firebaseapp.com",
      // projectId: "usblive-9ca91",
      // storageBucket: "usblive-9ca91.appspot.com",
      // messagingSenderId: "24547092478",
      // appId: "1:24547092478:web:3cdb29eaee05c82e8482af",
      // measurementId: "G-JH6TPMX9Z9"
    // })),
    // provideFirestore(() => getFirestore())
  ],
  providers: [FirestoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
