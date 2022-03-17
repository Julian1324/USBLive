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
    flyer:'',
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
  onlineUser:String;
  reader:FileReader;

  constructor(private activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {
    this.onlineUser= activated.snapshot.params.user;
    this.reader= new FileReader();
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
    console.log(this.reader.result);
    this.userChat.flyer= this.reader.result+'';
    var preV:any= document.querySelector('.previsualizacionIMG');
    preV.src='';
    
    this.webService.emit(this.eventName, this.userChat );

    if(localStorage.getItem('actualComponent')!= undefined){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.flyer, this.userChat.id, this.userChat.likes,'propuestas');
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.flyer, this.userChat.id, this.userChat.likes,'aperturas');
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.flyer, this.userChat.id, this.userChat.likes,'proyectos');
      }
    }
    
    this.userChat.text='';
  }

  masDocs(){
    // alert("Agrega algo pues soplapollas")
  }

  photoManager(e:any){

    var cajaPrev:any= document.querySelector('.cajaPrev');
    cajaPrev.style.transition='all 2s ease';
    cajaPrev.style.backgroundColor='rgba(0, 0, 0, 0.1)';
    
    // reader = new FileReader();
    this.reader.readAsDataURL(e.target.files[0]);
    // this.userChat.flyer=e.target.files[0];
    // console.log(e.target.files[0]);
    
    this.reader.onload = function () {
      var preV:any= document.querySelector('.previsualizacionIMG');
      preV.style.transition='all 2s ease';
      preV.src=this.result;
      preV.style.width='8%';
    };
    
  }

  onEditForm(){

  }

}