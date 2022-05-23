import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { FirestoreService } from 'src/app/services/firestore.service';
var deepai = require('deepai');
const Swal = require('sweetalert2');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userChat={
    id:0,
    user:'',
    userID:'',
    flyer:'',
    text: '',
    likes:0,
    userLikes:[],
    userComments:[]
  }
  myMessages:any=[];
  propuestas:any=[];
  proyectos:any=[];
  aperturas:any=[];
  eventName='send-message';
  mensajeHijo={};
  actualComponent:any;
  isAdmin:boolean=false;
  onlineUser:String;
  correoUserOnline:any;
  reader:FileReader;
  botonSearch=0;
  malasPalabras=[
    'puta','put4','perra','asesinato','bastardo','cabron','concha','picha','pene','p3ne','p3n3','chupa','chupar',
    'chupame','chupamela','bobo','boba','pendejo','pendeja','culo','culiar','culeo','culear','poronga','mierda',
    'mi3rda','m13rda','coño','sapa','sapo','baboso','babosa','hijueputa','ijueputa','ijoputa','hijoputa',
    'idiota','imbecil','imbécil','infierno','lambeculo','lambeculos','lameculo','lambeculos','maldito','mamada',
    'mamamela','mamar','marica','maricon','gay','pervertido','pervertida','teta','tetas','tet4','tet4s','seno','senos',
    'puchecas','pezon','pezón','pezones','prostituta','prostituto','prostitut4','racista','ramera','semen',
    'sexo','sex0','s3x0','ano','anal','an0','4n0','sexo oral','sex0 oral','s3x0 oral','verga','cretino',
    'huevon','guevon','guevón','huevón','malparido','malparid0','malpar1do','balurdo','sonso','soplapicha',
    'soplaverga','malnacido','negro de mierda','negro de','hijueputa negro','diablo','satanás','satanas',
    'culona','tetona','sarnosa','sarnoso'
  ];

  constructor(private activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {
    this.onlineUser= activated.snapshot.params.user;
    this.correoUserOnline= localStorage.getItem('correo');
    this.reader= new FileReader();
    //d4392f4f-e1f2-4226-81bc-1690035447fe
    deepai.setApiKey('d4392f4f-e1f2-4226-81bc-1690035447fe');
  }

  ngOnInit(): void {
    this.actualComponent=localStorage.getItem('actualComponent');
    // this.mifuncion();
    
    // this.webService.listen('text-event').subscribe((data) =>{
    //   this.myMessages=data;

    // });

    this.webService.listen('text-propuestas').subscribe((data) =>{
      this.actualComponent=localStorage.getItem('actualComponent');
      this.propuestas=data;
    });

    this.webService.listen('text-aperturas').subscribe((data) =>{
      this.actualComponent=localStorage.getItem('actualComponent');
      this.aperturas=data;
    });

    this.webService.listen('text-proyectos').subscribe((data) =>{
      this.actualComponent=localStorage.getItem('actualComponent');
      this.proyectos=data;
    });

    this.webService.listen('deletePropuestas-event').subscribe((data) =>{
      this.propuestas=data;
    });

    this.webService.listen('deleteProyectos-event').subscribe((data) =>{
      this.proyectos=data;
    });
    
    this.webService.listen('deleteAperturas-event').subscribe((data) =>{
      this.aperturas=data;
    });

    this.isadminn();
  }

  isadminn(){
    this.fireService.getUser().then( (snapshot) =>{
      if (snapshot.exists()){
        snapshot.forEach( (data:any) => {
          
          if(data.val().nombre==this.activated.snapshot.params.user){
            this.isAdmin=data.val().isAdmin;
          }
        }); 
      }
      
      
    } );
  }

  onMensajeProp(mensaje:any) {
    this.propuestas=mensaje;
  }

  onMensajeAp(mensaje:any) {
    this.aperturas=mensaje;
  }

  onMensajeProy(mensaje:any) {
    this.proyectos=mensaje;
  }

  onCommentProp(userChatHijo:any) {
    this.propuestas=userChatHijo;
  }

  onCommentProy(userChatHijo:any) {
    this.proyectos=userChatHijo;
  }

  onDeleteCommentProp(userChatHijo:any) {
    this.propuestas=userChatHijo;
  }
  
  onDeleteCommentAp(userChatHijo:any) {
    this.aperturas=userChatHijo;
  }

  onDeleteCommentProy(userChatHijo:any) {
    this.proyectos=userChatHijo;
  }

  onCommentAp(userChatHijo:any) {
    this.aperturas=userChatHijo;
  }

  async myMessage(){
    this.userChat.user= this.activated.snapshot.params.user;
    this.userChat.text= this.userChat.text.trim();
    var actualID:any=localStorage.getItem('CanIn');
    this.userChat.userID= this.userChat.userID + actualID.split('-')[1];
    // this.userChat.id= this.myMessages.length+1;
    if(this.reader.result==null){
      this.userChat.flyer='';
    }else{
      var resp = await deepai.callStandardApi("nsfw-detector", {
        image: `${this.reader.result}`,
      });

      if(resp.output.nsfw_score>0.4){
        var preV:any= document.querySelector('.previsualizacionIMG');
        preV.src='';
        Swal.fire('Esta imagen no se puede publicar porque contiene desnudos. Tu comentario se publicará sin la imagen.');
      }else{
        this.userChat.flyer= this.reader.result+'';
        var preV:any= document.querySelector('.previsualizacionIMG');
        preV.src='';
      }

    }
    
    this.actualComponent=localStorage.getItem('actualComponent');

    for(var i = 0; i < this.malasPalabras.length;i++){
      var regex = new RegExp("(^|\\s)"+this.malasPalabras[i]+"($|(?=\\s))","gi")
      this.userChat.text = this.userChat.text.replace(regex, function($0:any, $1:any){return $1 + "*****"});
    }

    if(localStorage.getItem('actualComponent')!= undefined && this.userChat.text!=''){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        if(this.propuestas.length>0){
          this.userChat.id= this.propuestas[this.propuestas.length-1].id+1;
        }else{
          this.userChat.id= 1;
        }
        
        this.webService.emit('send-propuestas', this.userChat );
        this.fireService.saveMessage(this.userChat.user, this.userChat.userID, this.userChat.text, this.userChat.flyer, this.userChat.id, this.userChat.likes,'propuestas');
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        if(this.aperturas.length>0){
          this.userChat.id= this.aperturas[this.aperturas.length-1].id+1;
        }else{
          this.userChat.id= 1;
        }
        this.webService.emit('send-aperturas', this.userChat );
        this.fireService.saveMessage(this.userChat.user, this.userChat.userID, this.userChat.text, this.userChat.flyer, this.userChat.id, this.userChat.likes,'aperturas');
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        if(this.proyectos.length>0){
          this.userChat.id= this.proyectos[this.proyectos.length-1].id+1;
        }else{
          this.userChat.id= 1;
        }
        this.webService.emit('send-proyectos', this.userChat );
        this.fireService.saveMessage(this.userChat.user, this.userChat.userID, this.userChat.text, this.userChat.flyer, this.userChat.id, this.userChat.likes,'proyectos');
      }
    }
    
    this.userChat.text='';
  }

  toSearch(num:any){
    this.botonSearch= this.botonSearch + num;

    var queryBar:any=document.querySelector('.queryBar');

    if(this.botonSearch==1){
        queryBar.style.transition='all 0.5s ease-out';
        // this.document.querySelector('.hoptions').style.color = "white";
        queryBar.style.marginLeft='-30vw';
        queryBar.style.width='30vw';
        queryBar.style.border='2px solid #F68B20';
        queryBar.select();
    }else{
        // document.querySelector('.hoptions').style.color = "black";
        queryBar.style.marginLeft='0vw';
        queryBar.style.width='0vw';
        queryBar.style.border='0';
        this.botonSearch=0;
        var cajaProp:any=document.querySelectorAll('.commentCont');
        for (let i = 0; i < cajaProp.length; i++) {
          cajaProp[i].style.display='flex';
          cajaProp[i].style.opacity='1';
        }
    }
    
  }

  buscarProp(prop:any){
    this.actualComponent=localStorage.getItem('actualComponent');
    prop= prop.trim();
    if(prop!=''){

      if(this.actualComponent!= undefined){
        if(this.actualComponent=='Propuestas estudiantiles'){
          for (let i = 0; i < this.propuestas.length; i++) {
            var cajaProp:any=document.querySelectorAll('.commentCont')[i];
            cajaProp.style.transition='all 0.4s ease';
            prop= prop.toLowerCase();
            var propcoincidencia= this.propuestas[i].text.toLowerCase();
            
            if(!propcoincidencia.match(prop)){
              cajaProp.style.opacity='0';
    
              if(cajaProp.getAnimations()[0]!=undefined){
                cajaProp.getAnimations()[0].finished.then( (a:any)=>{
                  cajaProp= document.querySelectorAll('.commentCont')[i];
                  cajaProp.style.display='none';
                } );
              }
              
            }else{
              cajaProp.style.opacity='1';
              cajaProp.style.display='flex';
            }
          }
        }
  
        if(this.actualComponent=='Apertura de cursos'){
          for (let i = 0; i < this.aperturas.length; i++) {
            var cajaProp:any=document.querySelectorAll('.commentCont')[i];
            cajaProp.style.transition='all 0.4s ease';
            
            prop= prop.toLowerCase();
            var propcoincidencia= this.aperturas[i].text.toLowerCase();
            
            if(!propcoincidencia.match(prop)){
              cajaProp.style.opacity='0';
    
              if(cajaProp.getAnimations()[0]!=undefined){
                cajaProp.getAnimations()[0].finished.then( (a:any)=>{
                  cajaProp= document.querySelectorAll('.commentCont')[i];
                  cajaProp.style.display='none';
                } );
              }
              
            }else{
              cajaProp.style.opacity='1';
              cajaProp.style.display='flex';
            }
          }
        }
  
        if(this.actualComponent=='Proyectos'){
          for (let i = 0; i < this.proyectos.length; i++) {
            var cajaProp:any=document.querySelectorAll('.commentCont')[i];
            cajaProp.style.transition='all 0.4s ease';
            prop= prop.toLowerCase();
            var propcoincidencia= this.proyectos[i].text.toLowerCase();
            
            if(!propcoincidencia.match(prop)){
              cajaProp.style.opacity='0';
    
              if(cajaProp.getAnimations()[0]!=undefined){
                cajaProp.getAnimations()[0].finished.then( (a:any)=>{
                  cajaProp= document.querySelectorAll('.commentCont')[i];
                  cajaProp.style.display='none';
                } );
              }
              
            }else{
              cajaProp.style.opacity='1';
              cajaProp.style.display='flex';
            }
          }
        }
      }

    }else{
      var cajaProp:any=document.querySelectorAll('.commentCont');
      for (let i = 0; i < cajaProp.length; i++) {
        cajaProp[i].style.display='flex';
        cajaProp[i].style.opacity='1';
      }
    }
    
  }

  async photoManager(e:any){
    var cajaPrev:any= document.querySelector('.cajaPrev');
    cajaPrev.style.transition='all 2s ease';
    cajaPrev.style.backgroundColor='rgba(0, 0, 0, 0.1)';
    
    this.reader.readAsDataURL(e.target.files[0]);
    this.reader.onload = async function() {
      
      var preV:any= document.querySelector('.previsualizacionIMG');
      preV.style.transition='all 2s ease';
      preV.src=this.result;
      preV.style.width='8%';
    };

  }
}