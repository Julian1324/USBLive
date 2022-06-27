import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
const Swal = require('sweetalert2');

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

  @Output() eventoProp = new EventEmitter<{}>();
  @Output() eventoAp = new EventEmitter<{}>();
  @Output() eventoProy = new EventEmitter<{}>();
  @Output() eventoCProp = new EventEmitter<{}>();
  @Output() eventoCAp = new EventEmitter<{}>();
  @Output() eventoCProy = new EventEmitter<{}>();
  @Output() eventoDeleteCProp = new EventEmitter<{}>();
  @Output() eventoDeleteCProy = new EventEmitter<{}>();
  @Output() eventoDeleteCAp = new EventEmitter<{}>();

  constructor(private router: Router, public activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {
    this.userChat={};
  }

  ngOnInit(): void {
    // console.log('Hola');

    this.actualComponent=localStorage.getItem('actualComponent');

    this.webService.listen('updated-propuestas').subscribe((data:any) =>{
      this.propuestas=data;
      this.eventoProp.emit(this.propuestas);
    });

    this.webService.listen('updated-proyectos').subscribe((data:any) =>{
      this.proyectos=data;
      this.eventoProp.emit(this.proyectos);
    });

    this.webService.listen('updated-aperturas').subscribe((data:any) =>{
      this.aperturas=data;
      this.eventoProp.emit(this.aperturas);
    });

    this.webService.listen('email-sent').subscribe((data:any) =>{
      Swal.fire('La propuesta se ha enviado con éxito');
    });

    this.webService.listen('like-propuestas').subscribe((data:any) =>{
      this.propuestas=data;
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

    this.webService.listen('updated-comment-propuestas').subscribe((data:any) =>{
      this.propuestas=data;
      this.eventoProp.emit(this.propuestas);
    });

    this.webService.listen('updated-comment-aperturas').subscribe((data:any) =>{
      this.aperturas=data;
      this.eventoAp.emit(this.aperturas);
    });

    this.webService.listen('updated-comment-proyectos').subscribe((data:any) =>{
      this.proyectos=data;
      this.eventoProy.emit(this.proyectos);
    });

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

  onEnviarCorreo(actualComponent:any){

    Swal.fire({
      title: 'Enviar publicación por correo?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar'
    }).then((result:any) => {
      if (result.isConfirmed) {
        if(localStorage.getItem('actualComponent')!= undefined){
          if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
            this.webService.emit('send-correo-propuestas', actualComponent.userChat);
          }
    
          if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
            this.webService.emit('send-correo-aperturas', actualComponent.userChat);
          }
    
          if(localStorage.getItem('actualComponent')=='Proyectos'){
            this.webService.emit('send-correo-proyectos', actualComponent.userChat);
          }
        }

      }
    });

  }

  like(actualComponent:any){

    var userID:any= localStorage.getItem('CanIn');
    userID= userID.split('-')[1];
    
    if(localStorage.getItem('actualComponent')!= undefined){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        if(this.userChat.userLikes!= undefined){
          if(this.userChat.userLikes.length==0){
            this.userChat.userLikes=[{user: this.activated.snapshot.params.user, userID:userID}]
          }else{
            this.userChat.userLikes.push({user: this.activated.snapshot.params.user, userID:userID});
          }
        }else{
          this.userChat.userLikes=[{user: this.activated.snapshot.params.user, userID:userID}]
        }
        this.webService.emit('send-like-propuestas', this.userChat);
        this.fireService.sendLike(actualComponent.userChat,'propuestas',userID,this.activated.snapshot.params.user);
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        if(this.userChat.userLikes!= undefined){
          if(this.userChat.userLikes.length==0){
            this.userChat.userLikes=[{user: this.activated.snapshot.params.user, userID:userID}]
          }else{
            this.userChat.userLikes.push({user: this.activated.snapshot.params.user, userID:userID});
          }
        }else{
          this.userChat.userLikes=[{user: this.activated.snapshot.params.user, userID:userID}]
        }
        this.webService.emit('send-like-aperturas', this.userChat);
        this.fireService.sendLike(actualComponent.userChat,'aperturas',userID,this.activated.snapshot.params.user);
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        if(this.userChat.userLikes!= undefined){
          if(this.userChat.userLikes.length==0){
            this.userChat.userLikes=[{user: this.activated.snapshot.params.user, userID:userID}]
          }else{
            this.userChat.userLikes.push({user: this.activated.snapshot.params.user, userID:userID});
          }
        }else{
          this.userChat.userLikes=[{user: this.activated.snapshot.params.user, userID:userID}]
        }
        this.webService.emit('send-like-proyectos', this.userChat);
        this.fireService.sendLike(actualComponent.userChat,'proyectos',userID,this.activated.snapshot.params.user);
      }
    }

  }

  verLikesAdmin(actualComponent:any){
    console.log(actualComponent.userChat);
    
    if(actualComponent.userChat.likes==0 || actualComponent.userChat.likes==undefined || actualComponent.userChat.userLikes==undefined){
      Swal.fire('Todavía nadie le ha dado like');
    }else{
      var nombres:any=[];
      actualComponent.userChat.userLikes.forEach((element:any) => {
        nombres.push(element.user);
      });
      Swal.fire('Personas que apoyan: '+nombres);
    }
    
  }

  makeAComment(actualComponent:any,mensaje:any){

    var userID:any = localStorage.getItem('CanIn');
    userID= userID.split('-')[1];

    for(var i = 0; i < this.malasPalabras.length;i++){
      var regex = new RegExp("(^|\\s)"+this.malasPalabras[i]+"($|(?=\\s))","gi")
      mensaje.value = mensaje.value.replace(regex, function($0:any, $1:any){return $1 + "*****"});
    }

    if(mensaje.value!=''){
      if(localStorage.getItem('actualComponent')!= undefined){
        if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
          this.webService.emit('comment-propuestas', {user: this.activated.snapshot.params.user, comment: mensaje.value, commentID: this.userChat.id});
          this.fireService.sendComment(actualComponent.userChat,'propuestas',userID,this.activated.snapshot.params.user,mensaje.value);
        }
  
        if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
          this.webService.emit('comment-aperturas', {user: this.activated.snapshot.params.user, comment: mensaje.value, commentID: this.userChat.id});
          this.fireService.sendComment(actualComponent.userChat,'aperturas',userID,this.activated.snapshot.params.user,mensaje.value);
        }
  
        if(localStorage.getItem('actualComponent')=='Proyectos'){
          this.webService.emit('comment-proyectos', {user: this.activated.snapshot.params.user, comment: mensaje.value, commentID: this.userChat.id});
          this.fireService.sendComment(actualComponent.userChat,'proyectos',userID,this.activated.snapshot.params.user,mensaje.value);
        }
      }

      mensaje.value='';
    }else{
      console.log('no hay nada');
      
    }
    
  }

  onEditarPost(actualComponent:any){
    Swal.fire({
      title: 'Editar publicación.',
      inputValue:`${actualComponent.userChat.text}`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      denyButtonText: `No guardar cambios`
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.userChat.text=result.value;

        if(localStorage.getItem('actualComponent')!= undefined){
          if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
            this.webService.emit('update-propuestas',this.userChat);
            this.fireService.updatePost(this.userChat,'propuestas');
            Swal.fire('Actualizado correctamente!');
          }
    
          if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
            this.webService.emit('update-aperturas',this.userChat);
            this.fireService.updatePost(this.userChat,'aperturas');
            Swal.fire('Actualizado correctamente!');
          }
    
          if(localStorage.getItem('actualComponent')=='Proyectos'){
            this.webService.emit('update-proyectos',this.userChat);
            this.fireService.updatePost(this.userChat,'proyectos');
            Swal.fire('Actualizado correctamente!');
          }
        }
        
      }
    })
    
  }

  onEliminarPost(actualComponent:any){

    Swal.fire({
      title: 'Eliminar publicación?',
      text: "Esto no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar'
    }).then((result:any) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado correctamente!'
        )
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



      }else{

      }
    })
    


    // this.webService.emit('delete-post',actualComponent.userChat);
  }

  onBan(actualComponent:any){
    Swal.fire({
      title: '¿Deseas suspender a este usuario? (Indica el número de días que deseas suspenderlo)',
      inputValue:`1`,
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      denyButtonText: `No guardar cambios`
    }).then((result:any) => {
      if (result.isConfirmed) {
        var date= new Date();
        result.value= parseInt(result.value);
        if(result.value> 0){
          date.setDate(date.getDate()+result.value);
          this.fireService.addBan(date,actualComponent.userChat);
        }else{
          result.value= result.value*-1;
          date.setDate(date.getDate()+result.value);
          this.fireService.addBan(date,actualComponent.userChat);
        }
        
      }
    })
    
  }

  showName(){
    Swal.fire('Usuario: '+this.userChat.user);
  }

}
