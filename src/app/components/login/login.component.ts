import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Swal = require('sweetalert2');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ingreso:boolean=false;
  auth:any;

  constructor(private fireService: FirestoreService, private router: Router, private route: ActivatedRoute) {
    this.auth = getAuth();
  }

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

    signInWithEmailAndPassword(this.auth,user,userPassword).then( (userCredential)=>{
      userCredential.user.email;
      console.log(userCredential.user.uid);
      let nombre;

      if(userCredential.user.email== 'felipe@correo.usbcali.edu.co'){
        nombre="Felipe Ortiz";
      }else{
        nombre="Carlos";
      }
      this.ingreso=true;
      localStorage.setItem('correo',`${userCredential.user.email}`);
      localStorage.setItem('CanIn',`${nombre}-${userCredential.user.uid}`);
      this.router.navigate([`/home/${nombre}`], { relativeTo: this.route });
      return true;
    } );
    
    // this.fireService.getUser().then( (snapshot) =>{
    //   if (snapshot.exists()){
    //     snapshot.forEach( (data:any) => {
    //       if(data.val().correo==user){
    //         if(data.val().contrasena== userPassword){
    //           this.ingreso=true;
    //           localStorage.setItem('correo',`${data.val().correo}`);
    //           localStorage.setItem('CanIn',`${data.val().nombre}-${data.val().id}`);
    //           this.router.navigate([`/home/${data.val().nombre}`], { relativeTo: this.route });
    //           return true;
    //         }else{
    //           localStorage.setItem('CanIn',`${data.val().nombre}`);
    //           return false;
    //         } 
                    
    //       }else{
    //         return false;
    //       }
    //     }); 
    //   }
    //   if(!this.ingreso){
    //     Swal.fire('Datos incorrectos');
    //   }
    // } );
    
  }

}
