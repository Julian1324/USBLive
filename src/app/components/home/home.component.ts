import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userChat={
    id:0,
    user:'',
    text: '',
    likes:0,
    userLikes:[],
    userComments:[]
  }
  myMessages:any=[];
  eventName='send-message';
  mensajeHijo={};
  actualComponent:any;
  isAdmin:boolean=false;

  constructor(private activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {

  }

  ngOnInit(): void {
    this.webService.listen('text-event').subscribe((data) =>{
      this.myMessages=data;
    });

    this.webService.listen('deleteP-event').subscribe((data) =>{
      this.myMessages=data;
      
    });

    if(localStorage.getItem('actualComponent')!= undefined){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        this.refreshMessages('propuestas');
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        this.refreshMessages('aperturas');
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        this.refreshMessages('proyectos');
      }
    }
    this.isadminn();
  }

  isadminn(){
    this.fireService.getUser().then( (snapshot) =>{
      if (snapshot.exists()){
        snapshot.forEach( (data:any) => {
          
          if(data.val().nombre==this.activated.snapshot.params.user){
            this.isAdmin=data.val().isAdmin;
          }else{
            // console.log('nonas');
          }
        }); 
      }
      
      
    } );
  }

  refreshMessages(section:string){
    this.webService.emit('init-app', this.userChat);

    this.fireService.getMessages(section).then( (snapshot) => {
      
      if (snapshot.exists()) {
        snapshot.forEach((data:any) => {
          this.userChat= data.val();
          this.webService.emit(this.eventName, this.userChat );
          this.userChat.text='';
        });
        
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

  }

  onMensajeHijo(mensaje:any) { 
    this.myMessages=mensaje;
  }

  onMensajeHijo2(userChatHijo:any) { 
    this.myMessages=userChatHijo;
  }

  myMessage(){
    this.userChat.user= this.activated.snapshot.params.user;
    this.userChat.id= this.userChat.id+1;
    
    this.webService.emit(this.eventName, this.userChat );

    if(localStorage.getItem('actualComponent')!= undefined){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.id, this.userChat.likes,'propuestas');
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.id, this.userChat.likes,'aperturas');
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.id, this.userChat.likes,'proyectos');
      }
    }
    
    this.userChat.text='';
  }

  onEditForm(){

  }

}