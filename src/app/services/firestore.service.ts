import { Injectable } from '@angular/core';
import { getDatabase, ref, child, get, set} from "firebase/database";
import { Firestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  dbRef:any;
  arregloUserLikes:any=[];
  arregloUserComments:any=[];
  constructor(firestore: Firestore) {
    this.dbRef= ref(getDatabase());
  }
  
  getUsers(){
    get(child(this.dbRef, `mensajes/`)).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  getUser(): Promise<any>{
    return get(child(this.dbRef, `users/`));
  }

  addUser(nombreUser:string, contrasena:number, section:string){
    const db = getDatabase();
    set(ref(db, 'users/' + section), {
      nombre: nombreUser,
      contrasena: contrasena
    });
  }

  saveMessage(nombreUser: string, userID:string, mensajeUser:string, flyerIMG:string, id:number, likess:number, section:string):any{

    try {
      const db = getDatabase();
      set(ref(db, `${section}/` + id), {
        id:id,
        user: nombreUser,
        userID: userID,
        flyer:flyerIMG,
        text: mensajeUser,
        likes: likess,
        userLikes: [],
        userComments: []
      });
      return true;
    } catch (error) {
      return false;
    }
    
  }

  updatePost(user:any,section:any){
    if(user.flyer==undefined || user.flyer==null || user.flyer=='undefined' || user.flyer=='null'){
      user.flyer='';
    }

    if(user.userLikes==undefined){
      user.userLikes=0;
    }

    if(user.userComments==undefined){
      user.userComments=[];
    }
    
    try {
      const db = getDatabase();
      set(ref(db, `${section}/` + user.id), {
        id:user.id,
        user: user.user,
        userID: user.userID,
        flyer:user.flyer,
        text: user.text,
        likes: user.likes,
        userLikes: user.userLikes,
        userComments: user.userComments
      });
    } catch (error) {
      console.log(error);
      
    }

  }

  getUserLikes(section:string,id:number): Promise<any>{
    return get(child(this.dbRef, `${section}/${id}/userLikes`));
  }

  getUserComments(section:string,id:number): Promise<any>{
    return get(child(this.dbRef, `${section}/${id}/userComments`));
  }

  sendLike(user: any,section:string,userIDLike:string,userLike:string):any {
    if(user.flyer==undefined || user.flyer==null || user.flyer=='undefined' || user.flyer=='null'){
      user.flyer='';
    }
    try {
      const db = getDatabase();

      this.getUserLikes(section, user.id).then( (data)=>{
        
        this.getUserComments(section, user.id).then((data)=>{
          if (data.exists()) {
            this.arregloUserComments= data.val();
            
          }
        });
        if(data.exists()){
          this.arregloUserLikes= data.val();
          this.arregloUserLikes.push({userID:userIDLike,user:userLike});
          set(ref(db, `${section}/` + user.id), {
            id:user.id,
            user: user.user,
            userID: user.userID,
            text: user.text,
            flyer:user.flyer,
            likes: user.likes + 1,
            userLikes: this.arregloUserLikes,
            userComments: this.arregloUserComments
          });
          
        }else{

          this.getUserComments(section, user.id).then((data)=>{
            if (data.exists()) {
              this.arregloUserComments= data.val();
            }
          });
          set(ref(db, `${section}/` + user.id), {
            id:user.id,
            user: user.user,
            userID: user.userID,
            text: user.text,
            flyer:user.flyer,
            likes: user.likes + 1,
            userLikes: [{userID:userIDLike,user: userLike}],
            userComments: this.arregloUserComments
          });
          
        }

      });
      return true;
    } catch (error) {
      return false;
    }

    

  }

  sendComment(user: any,section:string, userIDComment:number,nameUserComment:string,userComment:string){
    const db = getDatabase();

    if(user.flyer==undefined || user.flyer==null || user.flyer=='undefined' || user.flyer=='null'){
      user.flyer='';
    }

    try {
      this.getUserComments(section, user.id).then( (data)=>{

        this.getUserLikes(section, user.id).then( (data)=>{
          if(data.exists()){
            this.arregloUserLikes=data.val();
          }
        });
      
        if(data.exists()){
          this.arregloUserComments= data.val();
          this.arregloUserComments.push({commentID: this.arregloUserComments.length,userID:userIDComment, user:nameUserComment, comment:userComment});
          set(ref(db, `${section}/` + user.id), {
            id:user.id,
            user: user.user,
            userID: user.userID,
            text: user.text,
            flyer: user.flyer,
            likes: user.likes,
            userLikes: this.arregloUserLikes,
            userComments: this.arregloUserComments
          });
          
        }else{
          set(ref(db, `${section}/` + user.id), {
            id:user.id,
            user: user.user,
            userID: user.userID,
            text: user.text,
            flyer: user.flyer,
            likes: user.likes,
            userLikes: this.arregloUserLikes,
            userComments: [{commentID: this.arregloUserComments.length, userID:userIDComment, user:nameUserComment,comment:userComment}]
          });
          
        }
  
      });
      return true;
    } catch (error) {
      return false;
    }
    
    
  }

  getMessages(section:string): Promise<any>{
    return get(child(this.dbRef, `${section}/`));
  }

  deleteP(section:string, user:any):any{

    try {
      const db = getDatabase();

      set(ref(db, `${section}/` + user.id), null);
      return true;
    } catch (error) {
      return false;
    }
    
  }

  deleteC(section:string, user:any){

    try {
      const db = getDatabase();

      this.arregloUserComments= user.userComments;

      set(ref(db, `${section}/` + user.id), {
        id:user.id,
        user: user.user,
        userID: user.userID,
        text: user.text,
        likes: user.likes,
        userLikes: this.arregloUserLikes,
        userComments: this.arregloUserComments
      });
      return true;
    } catch (error) {
      return false;
    }
    
  }

  addBan(fechaFutura:Date, user:any){
    try {
      const db = getDatabase();
      get(child(this.dbRef, `users/${user.userID}`)).then( (data) =>{
        user= data.val();
        // console.log(fechaFutura.getDate()+'-'+(fechaFutura.getMonth()+1)+'-'+fechaFutura.getFullYear());
        
        set(ref(db, `users/${user.id}`), {
          contrasena:user.contrasena,
          correo: user.correo,
          id: user.id,
          isAdmin: user.isAdmin,
          nombre: user.nombre,
          isBanned: `${fechaFutura.getDate()}-${(fechaFutura.getMonth()+1)}-${fechaFutura.getFullYear()}`
        });
        
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
