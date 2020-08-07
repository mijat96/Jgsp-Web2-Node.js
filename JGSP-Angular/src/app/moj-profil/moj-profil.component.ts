import { Component, OnInit } from '@angular/core';

import { RegUser } from 'src/app/osoba';
import { Profil } from 'src/app/osoba';
import { NgForm } from '@angular/forms';
import { AuthHttpService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-moj-profil',
  templateUrl: './moj-profil.component.html',
  styleUrls: ['./moj-profil.component.css']
})
export class MojProfilComponent implements OnInit {
  tipovi: string[] = ["Admin", "Student", "Penzioner", "Obican"];
  tip: string;
  profil1: Profil;
  constructor(private http: AuthHttpService, private fb: FormBuilder, private router: Router) { }
  registacijaForm = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    email: ['', Validators.required],
    date: ['', Validators.required],
    tip: ['', Validators.required]
  });

  ngOnInit() {
    this.http.GetKorisnika().subscribe((profil) => {
      this.profil1 = profil;
      err => console.log(err);
      console.log(profil)
      this.registacijaForm.patchValue({
        name: this.profil1.name,
        surname: this.profil1.surname,
        date: this.profil1.date,
        password: this.profil1.password,
        confirmPassword: this.profil1.confirmPassword,
        email: this.profil1.email,
        username: this.profil1.username,
        tip: this.profil1.tip
      });
    });
  }

  onSubmit() {
    let regModel: RegUser = this.registacijaForm.value;
    this.http.Promeni(regModel).subscribe(

    )

    this.router.navigate(["/home"])
    //form.reset();
  }
  DobaviUsera() {

  }
}
