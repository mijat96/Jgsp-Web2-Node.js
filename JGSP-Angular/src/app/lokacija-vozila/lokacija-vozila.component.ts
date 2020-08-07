import { Component, OnInit, Input, NgZone } from '@angular/core';
import { GeoLocation } from '../map/map-model/geolocation';
import { MarkerInfo } from '../map/map-model/marker-info.model';
import { AuthHttpService } from '../services/auth.service';
import { Polyline } from '../map/map-model/polyline';
import { raspored, klasaPodaci, linja, LinijaZaHub } from 'src/app/osoba';
import { LokacijaVozilaService } from '../services/lokacija.vozila.service';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { Observer, Subscription } from 'rxjs';
import { StationModel } from 'src/app/osoba';

@Component({
  selector: 'app-lokacija-vozila',
  templateUrl: './lokacija-vozila.component.html',
  styleUrls: ['./lokacija-vozila.component.css'],
  styles: ['agm-map {height: 500px; width: 700px;}']
})
export class LokacijaVozilaComponent implements OnInit {
  // isConnected: Boolean;
  // locations: string[];
  // polasci: string;
  // ras: raspored = new raspored();
  // linija: linja = new linja();
  // klasa: klasaPodaci = new klasaPodaci();
  // selectedLine: number;
  // linijeZaView: number[];
  // dani: string[] = ["Radni", "Subota", "Nedelja"];
  // dan: string;
  // text: string = "Klisa";
  // markeri: MarkerInfo[] = [];
  // busKordinate: string[];
  // autobusMarker: MarkerInfo;
  // public polylineMoje: Polyline;
  // promena: boolean = false;
  // observer: Observer<number>;

  currentNumber: number;
  currNmr: any;
  sub: Subscription;

  public polyline: Polyline;
  public polylineRT: Polyline;  
  public zoom: number = 15;
  startLat : number = 45.242268;
  startLon : number = 19.842954;
  stati: any = [];
  options : string[];
  options1: any;
  stations : any = [];
  buses : any[];
  busImgIcon : any = {url:"assets/busicon.png", scaledSize: {width: 50, height: 50}};
  autobusImgIcon : any = {url:"assets/autobus.png", scaledSize: {width: 50, height: 50}};

  isConnected: boolean;
  notifications: string[];
  time: number[] = [];

  latitude : number ;
  longitude : number;
  marker: MarkerInfo = new MarkerInfo(new GeoLocation(this.startLat,this.startLon),"","","","");

  isChanged : boolean = false;

  stanice: any = [];
  selectedLine: string = "1A";
  
  constructor(private lokacijaServis: LokacijaVozilaService, private http: AuthHttpService, private ngZone: NgZone, private router: Router) { }

  ngOnInit() {
  

    
    this.sub = new Subscription();
    this.http.GetStanice().subscribe(data => {
      this.stati = data;  //sve stanice
      //console.log(data)
      });

    this.http.GetLinije().subscribe(
      data =>{
        //console.log(data)
        this.options = [];
        this.options1 = data; //sve linije
        this.options1.forEach(element => {
          
          this.options.push(element);
        });

      });
    this.polyline = new Polyline([], 'blue', { url:"assets/busicon.png", scaledSize: {width: 50, height: 50}});

    this.stations = [];
    
  }

  findStations(e : any[]) : StationModel[]
  {
    let ret :StationModel[] = [];
      e.forEach(element => {
        console.log(e)
       ret.push(this.stati.find(x => x._id == element));
      });

    return ret;
  }


  getStationsByLineNumber(lineNumber : string){
    this.options1.forEach(element => {
      if(element == lineNumber)
      {
        console.log(element)

        this.lokacijaServis.sendStations(this.stanice);
        this.lokacijaServis.readyToReceive();
        
        this.sub = this.lokacijaServis.getMessages().subscribe(q => {
          //console.log(q)
            this.ngZone.run(() => { 
            this.currentNumber = q;
            this.currNmr = q;

            this.latitude = q[1];
            this.longitude = q[0];
            this.polyline.addLocation(new GeoLocation(this.latitude, this.longitude));
            console.log("pos: ", this.latitude, this.longitude);

          });
         });
      }
    });

  }

  onSelectionChangeNumber(event){
    this.isChanged = true;
    this.stations = [];
    this.polyline.path = [];
    if(event.target.value == "")
    {
      this.isChanged = false;
      this.stations = [];
      this.polyline.path = [];
    }else
    {
      this.http.GetSstationsList(event.target.value).subscribe(s =>{
        this.stanice = s;
      });
      this.getStationsByLineNumber(event.target.value);   

    }

  }

  Diskonektuje(){
    this.isChanged = false;
      this.stations = [];
      this.polyline.path = [];
    this.lokacijaServis.Reset();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
//   private checkConnection() {
//     this.lokacijaServis.startConnection().subscribe(e => {
//     this.isConnected = e;
//       console.log(e);
//       if (e) {
    
//       }
//     });
//   }

//   private subscribeForLocations() {
//     this.lokacijaServis.registerForLocation().subscribe(l => this.onNotification(l));
//   }

//   public onNotification(notification: number[]) {

//     this.ngZone.run(() => {
//       console.log(notification);
//       if(this.promena){

      
//       let kord1;
//       let kord2;
//       this.socket.on('data',
//       (res) => {
//         this.observer.next(res.data);
//         console.log(res.data)
//          kord1 = res.data[0];
//          kord2 = res.data[1];
//       });

//       if (kord1 != undefined && kord2 != undefined) {
  

//         this.autobusMarker = new MarkerInfo(new GeoLocation(kord2, kord1), "assets/lasta.jpg", "", "", "");
//         this.polylineMoje.addLocation(new GeoLocation(+kord2, +kord1));
//         this.markeri.push(this.autobusMarker);
//       }
//     }
//     });
//   }

//   onSelectionChangeNumber(event) {
//     this.promena = true;
    
//     this.polylineMoje.path = [];
//     if (event.target.value == "") {
//       this.promena = false;
      

//     } else {
//       this.socket = io.connect(this.url);
//     this.socket.emit('recive', "1ZA");
//     console.log(event.target.value);
      

//     }

//   }

//   OnGetPolasci(s: any) {
 
//     this.socket = io.connect(this.url);
//     this.socket.emit('recive', "1ZA");
//     this.socket.emit('send',"send");
//   }

//   stopTimer() {
//     this.lokacijaServis.StopTimer();
//   }

//   public startTimer() {
//     this.lokacijaServis.StartTimer();
//   }

//   Stop(){
//     this.lokacijaServis.StopTimer();
//     this.polylineMoje = new Polyline([], 'blue', null);
//     this.markeri = [];
//   }

// }

