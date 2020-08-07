import { Component, OnInit } from '@angular/core';
import { AuthHttpService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthHttpService]
})
export class HomeComponent implements OnInit {
  verifikovan: string;
  role : any;
  bul :boolean
  constructor(private service: AuthHttpService, private ruter: Router) { }

  jwtIsUndefined() : boolean{
    return localStorage.getItem('jwt') != "null" && localStorage.getItem('jwt') != "undefined" && localStorage.getItem('jwt') != "";
  }
 
  LogOut(){
    
        localStorage.setItem('jwt', undefined);
        this.ruter.navigate(['home']);
    
 
  }
  daLiJeKontrolor(){
    //console.log(localStorage);
    if(this.role== "kontrolor"){
     return true;
    }
    else{
      return false;
    }
  }
  DaLiJeAdmin(){
    if(this.role == "admin"){
      return true;
     }
     else{
       return false;
     }
  }
  DaLiJeVerifikovan(){
    this.service.Verifikovan().subscribe((response) =>{
      this.verifikovan = response.message;
    });
  }
  ngOnInit() {
    if(localStorage.getItem('jwt') != "null" && localStorage.getItem('jwt') != "undefined" && localStorage.getItem('jwt') != ""){
      let jwtData = localStorage.jwt.split('.')[1]
      let decodedJwtJsonData = window.atob(jwtData)
      let decodedJwtData = JSON.parse(decodedJwtJsonData)
      console.log(decodedJwtData)


        //this.role = decodedJwtData.nameid
        //console.log(decodedJwtData.role)
        this.role = decodedJwtData.role
  }
  this.verifikovan = null;
}

}
