import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ingreso:boolean=false;

  constructor(private fireService: FirestoreService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // var animation= setInterval(() => {
    //   var login:any= document.querySelector('.loginBackground');

    //   login.animate([
    //       {backgroundPosition: "bottom"}
    //   ],{
    //         duration: 3500
    //   });


    //   if(login.getAnimations()!=null){
    //     login.getAnimations()[0].finished.then( () => login.style.backgroundPosition="top" );
    //   }
            
    // }, 3500);
        
  }

  onLogin(user:any, userPassword:any):any{
    
    this.fireService.getUser().then( (snapshot) =>{
      if (snapshot.exists()){
        snapshot.forEach( (data:any) => {
          if(data.val().correo==user){
            if(data.val().contrasena== userPassword){
              this.ingreso=true;
              localStorage.setItem('correo',`${data.val().correo}`);
              this.router.navigate([`/home/${data.val().nombre}`], { relativeTo: this.route });
              return true;
            }else{
              return false;
            } 
                    
          }else{
            return false;
          }
        }); 
      }
      if(!this.ingreso){
        alert('Datos incorrectos');
      }
    } );
    
  }

}
