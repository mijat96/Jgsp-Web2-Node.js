import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegUser, RegUserImg, LinijaZaHub } from 'src/app/osoba';
import { Stanica } from 'src/app/osoba';
import { RedVoznje } from 'src/app/osoba';
import { CenovnikBindingModel } from 'src/app/osoba';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class AuthHttpService {
    base_url = "http://localhost:52295"
    constructor(private http: HttpClient) {

    }
    user: string
    logIn(username: string, password: string): Observable<boolean> | boolean {
        let isDone: boolean = false;
        let data = `username=${username}&password=${password}&grant_type=password`;
        let httpOptions = {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }

        this.http.post<any>(this.base_url + "/oauth/token", data, httpOptions).subscribe(data => {
            localStorage.jwt = data.access_token;
            let jwtData = localStorage.jwt.split('.')[1]
            let decodedJwtJsonData = window.atob(jwtData)
            let decodedJwtData = JSON.parse(decodedJwtJsonData)


            let role = decodedJwtData.role
            this.user = decodedJwtData.unique_name;
        });

        if (localStorage.jwt != "undefined") {
            isDone = true;
        }
        else {
            isDone = false;
        }

        return isDone;

    }

    log(data: { username: string, password: string }): Observable<boolean> | boolean {
        let isDone: boolean = false;
        console.log(data);
        this.http.post<any>(this.base_url + "/api/Account/login", data).subscribe(data1 => {
            localStorage.jwt = data1.token;
            let jwtData = localStorage.jwt.split('.')[1]
            let decodedJwtJsonData = window.atob(jwtData)
            let decodedJwtData = JSON.parse(decodedJwtJsonData)


            let role = decodedJwtData.role
            this.user = decodedJwtData.unique_name;
        });

        if (localStorage.jwt != "undefined") {
            isDone = true;
        }
        else {
            isDone = false;
        }

        return isDone;
    }

    reg(data: RegUser): Observable<any> {
        return this.http.post<any>(this.base_url + "/api/Account/Register", data);
    }
    regImg(data: any, username: string): Observable<any> {
        return this.http.post<any>(this.base_url + "/api/Slikas/UploadImage/" + username, data);
    }
    GetMejlovi(): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Values/GetZahtevi");
    }
    GetMejloviSvi(): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Values/GetZahteviSvi");
    }
    Odobri(mejl: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Values/Odobri/" + mejl);
    }
    DodajRedVoznje1(red: RedVoznje): Observable<any> {
        return this.http.post<any>(this.base_url + "/api/Redovi/dodajRed", red);
    }
    DodajStanicu(stanica: Stanica): Observable<any> {
        return this.http.post<any>(this.base_url + "/api/Stanicas", stanica);
    }
    DodajLiniju(broj: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Linijas/GetLinijaDodaj/" + broj);
    }
    obrisiCenovnik(id: string): Observable<any> {
        return this.http.delete<any>(this.base_url + "/api/Cenovniks/" + id);
    }
    obrisiRedVoznje(id: number): Observable<any> {
        return this.http.delete<any>(this.base_url + "/api/RedVoznjes/" + id);
    }
    DeleteLinija(id: number): Observable<any> {
        return this.http.delete<any>(this.base_url + "/api/Linijas/" + id);
    }
    DeleteStanica(ime: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Stanicas/IzbrisiStanicu/" + ime + "/a" + "/a");
    }

    Promeni(data: RegUser): Observable<any> {
        return this.http.post<any>(this.base_url + "/api/Kartas/PromeniProfil", data);
    }
    DodajCenovnik(cenovnik: CenovnikBindingModel): Observable<any> {
        return this.http.post<any>(this.base_url + "/api/PromeniCenovnik", cenovnik);
    }
    GetPolasci(id: number, dan: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Linijas/GetLinija/" + id + "/" + dan);
    }

    GetLinije(): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Linijas/");
    }
    GetStanice(): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Stanicas/GetStanicee");
    }
    GetSpoji(linija: string, stanica: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Stanicas/Spoji/" + linija + "/" + stanica);
    }
    GetKorisnika(): Observable<any> {
        var user = this.Korisnik();
        return this.http.get<any>(this.base_url + "/api/Kartas/DobaviUsera/" + user);
    }
    //samo da se iscita json na serveru i popuni baza
    ParsiranjeJson(id: number, dan: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Linijas/GetLinija/" + id + "/" + dan + "/" + "str");
    }

    GetCenaKarte(tip: string, tipPutnika: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Kartas/GetKarta/" + tip + "/" + tipPutnika);
    }
    GetPromenaCene(tip: string, tipPutnika: string, cena: number): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Kartas/GetKartaPromenaCene/" + tip + "/" + tipPutnika + "/" + cena);
    }
    GetKupiKartu(tipKarte: string, mejl: string): Observable<any> {
        var user = this.Korisnik();
        console.log(user)
        return this.http.get<any>(this.base_url + "/api/Kartas/GetKartaKupi2/" + tipKarte + "/" + mejl + "/" + user);
    }
    GetKupiKartuNeregistrovan(tipKarte: string, mejl: string): Observable<any> {

        return this.http.get<any>(this.base_url + "/api/Kartas/GetKartaKupi2/" + tipKarte + "/" + mejl);
    }
    GetStanicaCord(idStanice: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Stanicas/GetStanica/" + idStanice);
    }
    GetProveriKartu(idKorisnika: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Kartas/GetProveri/" + idKorisnika);
    }
    GetSlika(idKorisnika: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/Slikas/GetSlika/" + idKorisnika);
    }
    Verifikovan(): Observable<any> {
        var korisnik = this.Korisnik();
        return this.http.get<any>(this.base_url + "/api/Values/Verifikovan/" + korisnik);
    }
    SacuvajTransakciju(idTransakcije: string): Observable<any> { //ili prosiriti kontroler za kupovinu karte pa i id transakcije staviti u istu tabelu Kartas
        return this.http.get<any>(this.base_url + "/api/Kartas/TransakcijaKarta?idTransakcije=" + idTransakcije);
        // let httpOptions = {
        //     headers:{
        //       "Content-type":"application/json"
        //     }
        //   } 
        //return this.http.post<any>(this.base_url + "/api/Kartas/PostTransakcijaID", idTransakcije, httpOptions); //nece da radi 
    }
    StanicaZaHub(lin: LinijaZaHub): Observable<any> {
        let httpOptions = {
            headers: {
                "Content-type": "application/json"
            }
        }
        return this.http.post<any>(this.base_url + "/api/Lokacija/StaniceZaHub", lin, httpOptions);
    }

    Korisnik() {
        let jwtData = localStorage.jwt.split('.')[1]
        let decodedJwtJsonData = window.atob(jwtData)
        let decodedJwtData = JSON.parse(decodedJwtJsonData)
        return decodedJwtData.user
    }

    GetSstationsList(idKorisnika: string): Observable<any> {
        return this.http.get<any>(this.base_url + "/api/SveStaniceLista/" + idKorisnika);
    }
}