export class Osoba {
    name: string
    surname: string

}

export class User {
    username: string
    password: string
}

export class RegUser {
    name: string
    surname: string
    username: string
    password: string
    confirmPassword: string
    email: string
    date: string
}

export class RegUserImg {
    name: string
    surname: string
    username: string
    password: string
    confirmPassword: string
    email: string
    date: string
    img: File
}

export class raspored {
    polasci: string

}
export class linja {

    linije: number[]
}
export class klasaPodaci {
    id: number
    dan: string
}
export class Profil {
    tip: string
    date: string
    password: string
    name: string
    surname: string
    confirmPassword: string
    username: string
    email: string
}
export class CenovnikBindingModel {
    mesecna: number
    godisnja: number
    vremenska: number
    dnevna: number
    vaziDo: string
    vaziOd: string
    popustPenzija: number
    popustStudent: number
    id: number
}
export class RedVoznje {
    dan: string
    polasci: string
    linija: string
}
export class Stanica {
    naziv: string
    adresa: string
    linija: string
    x: number
    y: number
}

export class LinijaZaHub {
    imeLinije: string
    constructor(i: string) {
        this.imeLinije = i;
    }
}

export class StationModel{
    Id: number;
    Name: string;
    
    Address: string;
    Longitude: number;
    Latitude: number;
    Version: number;
    
    
    constructor( name: string,  address:string, lon: number,lat: number,id: number, ver?: number ){
        this.Id = id;
        this.Name = name;
        this.Address = address
       
        this.Longitude = lon
        this.Latitude = lat
        this.Version = ver;
      
    }
}