import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;
  // server = io('https://thawing-dusk-95924.herokuapp.com/',{transports: ['websocket']});
  server = io('http://localhost:3000/',{transports: ['websocket']});

  constructor() {
    this.socket = this.server;
  }

  listen(eventName: String){
    return new Observable((Subscriber) =>{
      this.socket.on(eventName, (data:any)=>{
        Subscriber.next(data);
      })
    })
  }

  emit(eventName: String, data:any){
    this.socket.emit(eventName, data);
  }
}