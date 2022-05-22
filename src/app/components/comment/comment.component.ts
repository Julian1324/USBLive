import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() userComments:any;
  @Input() userChat:any;
  @Input() isAdmin:any;
  myComments:any=[];

  constructor(private router: Router, public activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {
    this.userComments={};
  }

  ngOnInit(): void {
    
  }

  onEditComment(actualComponent:any){

    for (let i = 0; i < actualComponent.userChat.userComments.length; i++) {
      
      if(actualComponent.userChat.userComments[i].user== this.activated.snapshot.params.user){

        Swal.fire({
          title: 'Editar comentario',
          inputValue:`${actualComponent.userChat.userComments[i].comment}`,
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Guardar cambios',
          denyButtonText: `No guardar cambios`
        }).then((result:any) => {
          if (result.isConfirmed) {
            // this.userChat.text=result.value;
            // this.userChat.id=i;
            // console.log(this.userChat);
            this.userChat.userComments[i].comment=result.value;
    
            if(localStorage.getItem('actualComponent')!= undefined){
              if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
                this.webService.emit('update-comment-propuestas',this.userChat);
                this.fireService.updatePost(this.userChat,'propuestas');
                Swal.fire('Actualizado correctamente!');
              }
        
              if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
                this.webService.emit('update-comment-aperturas',this.userChat);
                this.fireService.updatePost(this.userChat,'aperturas');
                Swal.fire('Actualizado correctamente!');
              }
        
              if(localStorage.getItem('actualComponent')=='Proyectos'){
                this.webService.emit('update-comment-proyectos',this.userChat);
                this.fireService.updatePost(this.userChat,'proyectos');
                Swal.fire('Actualizado correctamente!');
              }
            }
            
          }
        })
        
      }
    }
    
  }

  onDeleteComment(component:any){

    Swal.fire({
      title: 'Eliminar comentario?',
      text: "Esto no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar'
    }).then((result:any) => {

      if (result.isConfirmed) {
        for (let i = 0; i < this.userChat.userComments.length; i++) {
          if(this.userChat.userComments[i].commentID==component.userComments.commentID){
            this.userChat.userComments.splice(i,1);
          }
          
        }
    
        if(localStorage.getItem('actualComponent')!= undefined){
          if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
            this.webService.emit('delete-comment-propuestas', this.userChat);
            this.fireService.deleteC('propuestas',this.userChat);
          }
    
          if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
            this.webService.emit('delete-comment-aperturas', this.userChat);
            this.fireService.deleteC('aperturas',this.userChat);
          }
    
          if(localStorage.getItem('actualComponent')=='Proyectos'){
            this.webService.emit('delete-comment-proyectos', this.userChat);
            this.fireService.deleteC('proyectos',this.userChat);
          }
        }

      }


    });
    

    // this.webService.emit('delete-comment', this.userChat);
    
    
  }

  showName(userComment:any){
    Swal.fire(userComment.user);
  }

}
