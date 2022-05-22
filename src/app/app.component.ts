import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { FirestoreService } from 'src/app/services/firestore.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @Input() entrada:string;
  mostrar=false;
  
  title = 'USBLive';
  actualSection='';

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

  constructor(private activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService, private router: Router, private route: ActivatedRoute) {
    this.entrada='';
  }

  ngOnInit() {
    this.webService.listen('connection').subscribe( (data)=>{
      // console.log('keke');
      
      // console.log(data);
      
    } );
  }

  ngOnChanges(): void{
    if(this.entrada=='true'){
      this.mostrar=true;
    }else{
      this.mostrar=false;
    }
  }

  ngAfterViewInit(): void{

    if(this.mostrar){
      let click:any= document.querySelectorAll('.headerOption');

      if(localStorage.getItem('actualComponent')==null){
        click[0].click();
      }else{
        for (let i = 0; i < click.length; i++) {
          
          if(localStorage.getItem('actualComponent') != null && localStorage.getItem('actualComponent') == click[i].innerText ){
            
            click[i].click();
          }
        }
      }
      
    }
  }

  toOtherSection(comp:any, cont:any ){

    // if(localStorage.getItem('WlcomUsr')==null){
    //   setTimeout(() => {
    //     Swal.fire('¡Bienvenido a USBLive, una plataforma en donde podrás expresar tus ideas!. A continuación tienes 3 secciones en donde podrás hacerlo...');
    //   }, 70);
    //   localStorage.setItem('WlcomUsr','true');
    // }
    for (let i = 0; i < cont.children.length; i++) {

      cont.children[i].style.boxShadow='0px 0px';
      cont.children[i].style.backgroundColor='#f2f2f2';
      
    }

    comp.style.borderRadius= '26px 26px 0px 0px';
    comp.style.backgroundColor= 'white';

    if(comp.innerText=='Propuestas estudiantiles'){
      this.refreshMessages('propuestas');
      this.actualComponent=comp.innerText;
      localStorage.setItem('actualComponent',this.actualComponent);
    }

    if(comp.innerText=='Apertura de cursos'){
      this.refreshMessages('aperturas');
      this.actualComponent=comp.innerText;
      localStorage.setItem('actualComponent',this.actualComponent);
    }

    if(comp.innerText=='Proyectos'){
      this.refreshMessages('proyectos');
      this.actualComponent=comp.innerText;
      localStorage.setItem('actualComponent',this.actualComponent);
    }
  }

  refreshMessages(section:string){
    // this.webService.emit('init-app', this.userChat);
    this.webService.emit(`init-${section}`, this.userChat);

    this.fireService.getMessages(section).then( (snapshot) => {
      
      if (snapshot.exists()) {
        var contador=0;
        snapshot.forEach((data:any) => {
          this.userChat= data.val();
          this.userChat.id= contador+1;
          contador++;
          // console.log(this.userChat);
          
          
          this.webService.emit(`send-${section}`, this.userChat );
          
          // if(snapshot.val()[snapshot.val().length-1].id== this.userChat.id){
          if(true){
            // alert('termino');
            if(section=='propuestas'){
              if(localStorage.getItem('nwUsr')==null){
                setTimeout(() => {
                  Swal.fire('¡Esta es la sección de Propuestas estudiantiles, donde podrás proponer aquellas ideas que ayuden al campus y a la comunidad bonaventuriana!');
                  // alert('¡Esta es la sección de Propuestas estudiantiles, donde podrás proponer aquellas ideas que ayuden al campus y a la comunidad bonaventuriana!');
                }, 600);
              }
            }
            
            if(section=='proyectos'){
              if(localStorage.getItem('nwUsr')==null){
                setTimeout(() => {
                  Swal.fire('¡Esta es la sección de Proyectos, donde podrás proponer aquellos proyectos en los que necesitas apoyo!');
                  // alert('¡Esta es la sección de Proyectos, donde podrás proponer aquellos proyectos en los que necesitas apoyo!');
                }, 600);
              }
            }

            if(section=='aperturas'){
              if(localStorage.getItem('nwUsr')==null){
                setTimeout(() => {
                  Swal.fire('¡Esta es la sección de Apertura de cursos, donde podrás fomentar la apertura de cursos en los que necesitas estudiantes para abrirlo!');
                  // alert('¡Esta es la sección de Apertura de cursos, donde podrás fomentar la apertura de cursos en los que necesitas estudiantes para abrirlo!');
                }, 600);
              }
            }

          }
        });

        


        
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

  }

  toHome(){
    console.log('To home coñño');
  }

  onLogOut(){
    localStorage.setItem('CanIn','');
    this.router.navigate([`/`], { relativeTo: this.route });
  }
}
