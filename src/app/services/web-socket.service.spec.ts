import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';

import { WebSocketService } from './web-socket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;
  var fireStore: Firestore;
  var fireService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: WebSocketService}
      ]
    });
    service = TestBed.inject(WebSocketService);
    fireService= new FirestoreService(fireStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('email-sent', (done: DoneFn) => {
    service.listen('email-sent').subscribe( (data)=> {
      
      expect(data).toBeTruthy();
      done();
    });

    var userChat={
      id:3,
      user:'Bitricio',
      text:'',
      likes:4
    }
    
    service.emit('send-like',userChat);
  });
});
