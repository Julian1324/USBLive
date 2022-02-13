import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fireService: FirestoreService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onLogin(user:any, userPassword:any):any{
    
    this.fireService.getUser().then( (snapshot) =>{
      if (snapshot.exists()){
        snapshot.forEach( (data:any) => {
          if(data.val().nombre==user){
            if(data.val().contrasena== userPassword){
              this.router.navigate([`/home/${user}`], { relativeTo: this.route });
              return true;
            }else{
              alert('Datos incorrectos');
              return false;
            } 
                    
          }else{
            alert('Datos incorrectos');
            return false;
          }
        }); 
      }
    } );
    
    
  }

}
