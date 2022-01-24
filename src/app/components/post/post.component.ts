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
  // myComments:any=[];

  @Output() eventoHijo = new EventEmitter<{}>();
  @Output() eventoHijo2 = new EventEmitter<{}>();

  constructor(private router: Router, private activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {
    this.userChat={};
   }

  ngOnInit(): void {

    // console.log(this.isAdmin);
    
    this.webService.listen('like-event').subscribe((data:any) =>{
      this.myMessages=data;
      this.eventoHijo.emit(this.myMessages);
      
    });

    this.webService.listen('comment-event').subscribe((data:any) =>{
      this.userChat=data;
      this.eventoHijo2.emit(this.userChat);
      
    });

    this.webService.listen('deleteC-event').subscribe((data:any) =>{
      this.userChat=data;
      this.eventoHijo2.emit(this.userChat);
      
    });

  }

  like(actualComponent:any){
    console.log(this.isAdmin);
    
    if(localStorage.getItem('actualComponent')!= undefined){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        this.fireService.sendLike(actualComponent.userChat,'propuestas',this.activated.snapshot.params.user);
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        this.fireService.sendLike(actualComponent.userChat,'aperturas',this.activated.snapshot.params.user);
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        this.fireService.sendLike(actualComponent.userChat,'proyectos',this.activated.snapshot.params.user);
      }
    }

    this.webService.emit(this.eventName, this.userChat);
    
  }

  verLikesAdmin(){

    if(this.userChat.likes==0){
      alert('Todavía nadie le ha dado like');
    }else{
      var nombres:any=[];
      this.userChat.userLikes.forEach((element:any) => {
        nombres.push(element.user);
      });

      alert(nombres);
    }
    

    
  }

  makeAComment(actualComponent:any,mensaje:any){

    
    if(mensaje.value!=''){
      console.log(this.actualComponent);
      if(localStorage.getItem('actualComponent')!= undefined){
        if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
          this.fireService.sendComment(actualComponent.userChat,'propuestas',this.activated.snapshot.params.user,mensaje.value);
        }
  
        if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
          this.fireService.sendComment(actualComponent.userChat,'aperturas',this.activated.snapshot.params.user,mensaje.value);
        }
  
        if(localStorage.getItem('actualComponent')=='Proyectos'){
          this.fireService.sendComment(actualComponent.userChat,'proyectos',this.activated.snapshot.params.user,mensaje.value);
        }
      }

      this.webService.emit(this.eventName2, {user: this.activated.snapshot.params.user, comment: mensaje.value, commentID: this.userChat.id});
      mensaje.value='';
    }else{
      console.log('no hay nada');
      
    }
    
  }

  onEliminarPost(actualComponent:any){
    if(this.actualComponent=='Propuestas Estudiantiles'){
      this.fireService.deleteP('propuestas',actualComponent.userChat);
    }

    if(this.actualComponent=='Apertura de cursos'){
      this.fireService.deleteP('aperturas',actualComponent.userChat);
    }

    if(this.actualComponent=='Proyectos'){
      this.fireService.deleteP('proyectos',actualComponent.userChat);
    }

    this.webService.emit('delete-post',actualComponent.userChat);
  }

}
