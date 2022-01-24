import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

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

  constructor(private router: Router, private activated: ActivatedRoute, private webService: WebSocketService, private fireService: FirestoreService) {
    this.userComments={};
  }

  ngOnInit(): void {
    
  }

  onDeleteComment(component:any){

    console.log(component.userComments.commentID);
    console.log(this.userChat.userComments);
    
    for (let i = 0; i < this.userChat.userComments.length; i++) {
      if(this.userChat.userComments[i].commentID==component.userComments.commentID){
        this.userChat.userComments.splice(i,1);
      }
      
    }

    if(localStorage.getItem('actualComponent')!= undefined){
      if(localStorage.getItem('actualComponent')=='Propuestas estudiantiles'){
        this.fireService.deleteC('propuestas',this.userChat);
      }

      if(localStorage.getItem('actualComponent')=='Apertura de cursos'){
        this.fireService.deleteC('aperturas',this.userChat);
      }

      if(localStorage.getItem('actualComponent')=='Proyectos'){
        this.fireService.deleteC('proyectos',this.userChat);
      }
    }

    // this.fireService.deleteC('propuestas',this.userChat);
    this.webService.emit('delete-comment', this.userChat);
    
  }

}
