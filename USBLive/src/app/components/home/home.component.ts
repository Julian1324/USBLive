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
    userLikes:[]
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
    
    let click:any= document.querySelector('.categoria');
    click.click();
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

  toPropuestas(comp:any,container:any){
    comp.style.backgroundColor='#404040';
    container.childNodes.forEach((element:any) => {
      
      if(comp.innerText== element.innerText){

      }else{
        element.style.backgroundColor='rgba(0, 0, 0, 0)';
      }

    });

    if(comp.innerText=='Propuestas Estudiantiles'){
      this.refreshMessages('propuestas');
      this.actualComponent=comp.innerText;
    }

    if(comp.innerText=='Apertura de cursos'){
      this.refreshMessages('aperturas');
      this.actualComponent=comp.innerText;
    }

    if(comp.innerText=='Proyectos'){
      this.refreshMessages('proyectos');
      this.actualComponent=comp.innerText;
    }
    
  }

  refreshMessages(section:string){
    this.webService.emit('init-app', this.userChat );

    this.fireService.getMessages(section).then( (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((data:any) => {
          this.userChat= data.val();
          // this.myMessages.push(this.userChat);
          
          this.webService.emit(this.eventName, this.userChat );
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

  myMessage(){
    this.userChat.user= this.activated.snapshot.params.user;
    this.userChat.id= this.userChat.id+1;
    console.log(this.userChat);
    
    this.webService.emit(this.eventName, this.userChat );

    if(this.actualComponent=='Propuestas Estudiantiles'){
      this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.id, this.userChat.likes,'propuestas');
    }

    if(this.actualComponent=='Apertura de cursos'){
      this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.id, this.userChat.likes,'aperturas');
    }

    if(this.actualComponent=='Proyectos'){
      this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.id, this.userChat.likes,'proyectos');
    }
    // this.fireService.saveMessage(this.userChat.user, this.userChat.text, this.userChat.id, this.userChat.likes,this.actualComponent+'');
    this.userChat.text='';
  }

}