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

  saveMessage(nombreUser: string, mensajeUser:string, flyerIMG:string, id:number, likess:number, section:string):any{

    try {
      const db = getDatabase();
      set(ref(db, `${section}/` + id), {
        id:id,
        user: nombreUser,
        flyer:flyerIMG,
        text: mensajeUser,
        likes: likess,
        userLikes: []
      });
      return true;
    } catch (error) {
      return false;
    }
    
  }

  getUserLikes(section:string,id:number): Promise<any>{
    return get(child(this.dbRef, `${section}/${id}/userLikes`));
  }

  getUserComments(section:string,id:number): Promise<any>{
    return get(child(this.dbRef, `${section}/${id}/userComments`));
  }

  sendLike(user: any,section:string,userLike:string):any {
    if(user.flyer==undefined || user.flyer==null || user.flyer=='undefined' || user.flyer=='null'){
      user.flyer='';
    }
    try {
      const db = getDatabase();

      this.getUserLikes(section, user.id).then( (data)=>{
        
        if(data.exists()){
          this.arregloUserLikes= data.val();
          this.arregloUserLikes.push({user:userLike});
          set(ref(db, `${section}/` + user.id), {
            id:user.id,
            user: user.user,
            text: user.text,
            flyer:user.flyer,
            likes: user.likes + 1,
            userLikes: this.arregloUserLikes,
            userComments: this.arregloUserComments
          });
          
        }else{
          set(ref(db, `${section}/` + user.id), {
            id:user.id,
            user: user.user,
            text: user.text,
            flyer:user.flyer,
            likes: user.likes + 1,
            userLikes: [{user: userLike}],
            userComments: this.arregloUserComments
          });
          
        }

      });
      return true;
    } catch (error) {
      return false;
    }

    

  }

  sendComment(user: any,section:string,nameUserComment:string,userComment:string){
    const db = getDatabase();

    try {
      this.getUserComments(section, user.id).then( (data)=>{
      
        if(data.exists()){
          this.arregloUserComments= data.val();
          this.arregloUserComments.push({commentID: this.arregloUserComments.length, user:nameUserComment, comment:userComment});
          set(ref(db, `${section}/` + user.id), {
            id:user.id,
            user: user.user,
            text: user.text,
            likes: user.likes,
            userLikes: this.arregloUserLikes,
            userComments: this.arregloUserComments
          });
          
        }else{
          set(ref(db, `${section}/` + user.id), {
            id:user.id,
            user: user.user,
            text: user.text,
            likes: user.likes,
            userLikes: this.arregloUserLikes,
            userComments: [{commentID: this.arregloUserComments.length, user:nameUserComment,comment:userComment}]
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
}
