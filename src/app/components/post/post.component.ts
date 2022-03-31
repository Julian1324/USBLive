import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{
  @Input() userChat:any;
  @Input() actualComponent:any;
  @Input() isAdmin:boolean=false;
  eventName='send-like';
  eventName2='send-comment';

  myMessages:any=[];
  propuestas:any=[];
  proyectos:any=[];
  aperturas:any=[];

  @Output() eventoProp = new EventEmitter<{}>();
  @Output() eventoAp = new EventEmitter<{}>();
  @Output() eventoProy = new EventEmitter<{}>();
  @Output() eventoCProp = new EventEmitter<{}>();
  @Output() eventoCAp = new EventEmitter<{}>();
  @Output() eventoCProy = new EventEmitter<{}>();
  @Output() eventoDeleteCProp = new EventEmitter<{}>();
  @Output() eventoDeleteCProy = new EventEmitter<{}>();
  @Output() eventoDeleteCAp = new EventEmitter<{}>();

  constructor(private router: Router, private activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {
    this.userChat={};
  }

  ngOnInit(): void {

    this.actualComponent=localStorage.getItem('actualComponent');

    this.webService.listen('like-propuestas').subscribe((data:any) =>{
      this.propuestas=data;
      //  console.log(this.propuestas);
      
      this.eventoProp.emit(this.propuestas);
    });

    this.webService.listen('like-aperturas').subscribe((data:any) =>{
      this.aperturas=data;
      this.eventoAp.emit(this.aperturas);
    });

    this.webService.listen('like-proyectos').subscribe((data:any) =>{
      this.proyectos=data;
      this.eventoProy.emit(this.proyectos);
    });
    
    // this.webService.listen('like-event').subscribe((data:any) =>{
    //   this.myMessages=data;
    //   this.eventoProp.emit(this.myMessages);
      
    // });

    // this.webService.listen('comment-event').subscribe((data:any) =>{
    //   this.userChat=data;
    //   this.eventoHijo2.emit(this.userChat);
    // });

    this.webService.listen('comment-propuestas').subscribe((data:any) =>{
      this.userChat=data;
      this.eventoCProp.emit(this.userChat);
    });

    this.webService.listen('comment-aperturas').subscribe((data:any) =>{
      this.userChat=data;
      this.eventoCAp.emit(this.userChat);
    });

    this.webService.listen('comment-proyectos').subscribe((data:any) =>{
      this.userChat=data;
      this.eventoCProy.emit(this.userChat);
    });

    // this.webService.listen('deleteC-event').subscribe((data:any) =>{
    //   this.userChat=data;
    //   this.eventoHijo2.emit(this.userChat);
      
    // });

    this.webService.listen('deleteC-propuestas').subscribe((data:any) =>{
      this.userChat=data;
      this.eventoDeleteCProp.emit(this.userChat);
    });

    this.webService.listen('deleteC-proyectos').subscribe((data:any) =>{
      this.userChat=data;
      this.eventoDeleteCProy.emit(this.userChat);
    });

    this.webService.listen('deleteC-aperturas').subscribe((data:any) =>{
      this.userChat=data;
      this.eventoDeleteCAp.emit(this.userChat);
    });

  }

  like(actualComponent:any){
    
    if(localStorage.getItem('actualComponent')!= undefined){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        // console.log(actualComponent.userChat);
        
        this.webService.emit('send-like-propuestas', this.userChat);
        this.fireService.sendLike(actualComponent.userChat,'propuestas',this.activated.snapshot.params.user);
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        this.webService.emit('send-like-aperturas', this.userChat);
        this.fireService.sendLike(actualComponent.userChat,'aperturas',this.activated.snapshot.params.user);
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        this.webService.emit('send-like-proyectos', this.userChat);
        this.fireService.sendLike(actualComponent.userChat,'proyectos',this.activated.snapshot.params.user);
      }
    }

    // this.webService.emit(this.eventName, this.userChat);
    
  }

  verLikesAdmin(){
    // console.log(this.actualComponent);

    if(this.userChat.likes==0){
      alert('Todavía nadie le ha dado like');
    }else{
      var nombres:any=[];
      this.userChat.userLikes.forEach((element:any) => {
        nombres.push(element.user);
      });

      alert('Personas que apoyan: '+nombres);
    }
    
  }

  makeAComment(actualComponent:any,mensaje:any){

    if(mensaje.value!=''){
      if(localStorage.getItem('actualComponent')!= undefined){
        if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
          this.webService.emit('comment-propuestas', {user: this.activated.snapshot.params.user, comment: mensaje.value, commentID: this.userChat.id});
          this.fireService.sendComment(actualComponent.userChat,'propuestas',this.activated.snapshot.params.user,mensaje.value);
        }
  
        if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
          this.webService.emit('comment-aperturas', {user: this.activated.snapshot.params.user, comment: mensaje.value, commentID: this.userChat.id});
          this.fireService.sendComment(actualComponent.userChat,'aperturas',this.activated.snapshot.params.user,mensaje.value);
        }
  
        if(localStorage.getItem('actualComponent')=='Proyectos'){
          this.webService.emit('comment-proyectos', {user: this.activated.snapshot.params.user, comment: mensaje.value, commentID: this.userChat.id});
          this.fireService.sendComment(actualComponent.userChat,'proyectos',this.activated.snapshot.params.user,mensaje.value);
        }
      }

      // this.webService.emit(this.eventName2, {user: this.activated.snapshot.params.user, comment: mensaje.value, commentID: this.userChat.id});
      mensaje.value='';
    }else{
      console.log('no hay nada');
      
    }
    
  }

  onEliminarPost(actualComponent:any){

    if(localStorage.getItem('actualComponent')!= undefined){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        this.webService.emit('delete-propuestas',actualComponent.userChat);
        this.fireService.deleteP('propuestas',actualComponent.userChat);
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        this.webService.emit('delete-aperturas',actualComponent.userChat);
        this.fireService.deleteP('aperturas',actualComponent.userChat);
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        this.webService.emit('delete-proyectos',actualComponent.userChat);
        this.fireService.deleteP('proyectos',actualComponent.userChat);
      }
    }

    // this.webService.emit('delete-post',actualComponent.userChat);
  }

  showName(){
    alert('Usuario: '+this.userChat.user);
  }

}
