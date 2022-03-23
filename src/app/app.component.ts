import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @Input() entrada:string;
  mostrar=false;
  
  title = 'USBLive';

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
      for (let i = 0; i < click.length; i++) {
        
        if(localStorage.getItem('actualComponent') != null && localStorage.getItem('actualComponent') == click[i].innerText ){
          
          click[i].click();
          // console.log(click[i].innerText);
          
        }
        
      }
      
      
      // console.log(localStorage.getItem('actualComponent'));
      
    }
  }

  toOtherSection(comp:any, cont:any ){
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
    this.webService.emit('init-app', this.userChat);

    this.fireService.getMessages(section).then( (snapshot) => {
      
      if (snapshot.exists()) {
        snapshot.forEach((data:any) => {
          this.userChat= data.val();
          // this.myMessages= this.userChat;
          
          this.webService.emit(this.eventName, this.userChat );
        });
        // console.log(this.myMessages);
        
        
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
    this.router.navigate([`/`], { relativeTo: this.route });
  }
}
