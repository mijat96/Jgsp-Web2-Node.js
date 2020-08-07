import { Component, OnInit } from '@angular/core';
import { AuthHttpService } from 'src/app/services/auth.service';
import { NgForm, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-kontrolor',
  templateUrl: './kontrolor.component.html',
  styleUrls: ['./kontrolor.component.css']
})
export class KontrolorComponent implements OnInit {

  Odgovor : string;
  nesto : string;
  mejloviZaView: number[];
  selectedMejl: string;

  kontrolorGroup = this.fb.group({
  
  IdKorisnika :  ['', Validators.required],
  });
  constructor(private http: AuthHttpService, private fb: FormBuilder) { }

  ngOnInit() {
    this.http.GetMejloviSvi().subscribe((stanicesa) => {
      this.mejloviZaView = stanicesa;
      err => console.log(err);
    });
  }
 
  ProveriKartu(){
  

    this.http.GetProveriKartu(this.selectedMejl).subscribe((Odgovor)=>
    {
      console.log(Odgovor)
      this.Odgovor = Odgovor.message;
      err => console.log(err);
    });

  }

  
}
