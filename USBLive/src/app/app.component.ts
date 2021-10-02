import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Input() entrada:string;
  mostrar=false;
  
  title = 'USBLive';

  constructor() {
    this.entrada='';
  }

  ngOnChanges(): void{
    if(this.entrada=='true'){
      this.mostrar=true;
    }else{
      this.mostrar=false;
    }
    
  }

  ngOnInit(): void {

  }
}
