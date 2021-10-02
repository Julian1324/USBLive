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

  myMessages:any=[];

  @Output() eventoHijo = new EventEmitter<{}>();

  constructor(private router: Router, private activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {
    this.userChat={};
   }

  ngOnInit(): void {
    
    this.webService.listen('like-event').subscribe((data:any) =>{
      this.myMessages=data;
      this.eventoHijo.emit(this.myMessages);
      
    });

  }

  
  ngOnChanges(changes: this){
    // this.valueResponse.emit("Bienvenido!!!");
  }

  like(actualComponent:any){
    if(this.actualComponent=='Propuestas Estudiantiles'){
      this.fireService.sendLike(actualComponent.userChat,'propuestas',this.activated.snapshot.params.user);
    }

    if(this.actualComponent=='Apertura de cursos'){
      this.fireService.sendLike(actualComponent.userChat,'aperturas',this.activated.snapshot.params.user);
    }

    if(this.actualComponent=='Proyectos'){
      this.fireService.sendLike(actualComponent.userChat,'proyectos',this.activated.snapshot.params.user);
    }
    this.webService.emit(this.eventName, this.userChat);
    // this.fireService.getUserLikes('aperturas',1).then( (snapshot)=>{
    //   if (snapshot.exists()) {
    //     console.log(snapshot.val().user);
        
    //   } else {
    //     console.log("No data available");
    //   }
    // } );
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

}
