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

  saveMessage(nombreUser: string, mensajeUser:string, id:number, likess:number, section:string){
    const db = getDatabase();
    set(ref(db, `${section}/` + id), {
      id:id,
      user: nombreUser,
      text: mensajeUser,
      likes: likess,
      userLikes: []
    });

  }

  getUserLikes(section:string,id:number): Promise<any>{
    return get(child(this.dbRef, `${section}/${id}/userLikes`));
  }

  getUserComments(section:string,id:number): Promise<any>{
    return get(child(this.dbRef, `${section}/${id}/userComments`));
  }

  sendLike(user: any,section:string,userLike:string){
    const db = getDatabase();

    this.getUserLikes(section, user.id).then( (data)=>{
      // console.log(data.val());
      
      if(data.exists()){
        this.arregloUserLikes= data.val();
        this.arregloUserLikes.push({user:userLike});
        // console.log(data.val());
        set(ref(db, `${section}/` + user.id), {
          id:user.id,
          user: user.user,
          text: user.text,
          likes: user.likes + 1,
          userLikes: this.arregloUserLikes,
          userComments: this.arregloUserComments
        });
        
      }else{
        set(ref(db, `${section}/` + user.id), {
          id:user.id,
          user: user.user,
          text: user.text,
          likes: user.likes + 1,
          userLikes: [{user: userLike}],
          userComments: this.arregloUserComments
        });
        
      }

    });

  }

  sendComment(user: any,section:string,nameUserComment:string,userComment:string){
    const db = getDatabase();
    
    // this.arregloUserComments.push({user:nameUserComment,comment:userComment});

    this.getUserComments(section, user.id).then( (data)=>{
      // console.log(data.val());
      
      if(data.exists()){
        this.arregloUserComments= data.val();
        this.arregloUserComments.push({commentID: this.arregloUserComments.length, user:nameUserComment, comment:userComment});
        // console.log(data.val());
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
    
  }

  getMessages(section:string): Promise<any>{
    return get(child(this.dbRef, `${section}/`));
  }

  deleteP(section:string, user:any){
    const db = getDatabase();

    set(ref(db, `${section}/` + user.id), null);
    
  }

  deleteC(section:string, user:any){
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
    
  }
}
