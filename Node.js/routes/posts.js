const express = require('express');
const router = express.Router();
var User = require("../models/userSchema");
var jwt = require('jsonwebtoken');
var PricelistSchema = require("../models/pricelistSchema");
var TicketPriceSchema = require("../models/ticketPriceSchema");
var kartaSchema = require("../models/kartaSchema");
var LineSchema = require("../models/lineSchema");
var TimetableSchema = require("../models/timetableSchema");
var StationSchema = require("../models/stationSchema");
var StationLineSchema = require("../models/statio-lineSchema");

//Registracija korisnika
router.post('/Account/Register', (req, res) => {
    //console.log(req.body);
    var newUser = {
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        email: req.body.email,
        date: req.body.date,
        tip: req.body.tip,
        role: 'obican',
        approved: false
    }
    if (newUser.password == newUser.confirmPassword) {
        User.create(newUser, (err, newlyCreatedUser) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(newlyCreatedUser);
                res.send('OK');
            }
        });
    } else {
        res.send(404);
    }
});

//Login, prijava korisnika
router.post('/Account/login', (req, res) => {
    //console.log(req.body.username);

    User.findOne({ username: req.body.username }, (err, user1) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(user1.role);

            if (user1.password == req.body.password) {
                jwt.sign({ user: user1.username, role: user1.role }, 'secretkey', (err, token) => {
                    res.json({
                        token
                    });
                });
            } else {
                res.send(404);
            }
        }
    });
});

//Provera korisnika da li je verifikovana registracija
router.get('/Values/Verifikovan/:id', (req, res) => {
    //console.log(req.params);

    var verifikovan;
    User.findOne({ username: req.params.id }, (err, user1) => {
        if (err) {
            console.log(err);
        } else {
            console.log(user1)
            verifikovan = user1.approved;
            if (verifikovan) {
                res.send({ message: 'Verifikovan' });
            } else {
                res.send({ message: 'Nije Verifikovan' });
            }
        }
    });
});

//Dobavljanje podataka trenutnog korisnika za izmenu profila
router.get('/Kartas/DobaviUsera/:user', (req, res) => {
    //console.log(req.params);

    User.findOne({ username: req.params.user }, (err, user1) => {
        if (err) {
            console.log(err);
        } else {
            console.log(user1)
            res.send(user1);
        }
    });
});

//Izmena profila
router.post('/Kartas/PromeniProfil', (req, res) => {
    //console.log(req.body);

    User.findOneAndUpdate({ username: req.body.username },
        {
            $set: {
                name: req.body.name, surname: req.body.surname, username: req.body.username,
                password: req.body.password, confirmPassword: req.body.confirmPassword, email: req.body.email, date:
                    req.body.date, tip: req.body.tip
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                console.log(user1)
            }
        });
});

//Kupovina karte
router.get('/Kartas/GetKartaKupi2/:tipKarte/:mejl/:user', async (req, res) => { //TREBA SLATI MEJL JOS
    //console.log(req.params.user);

    var user;
    await User.findOne({ username: req.params.user }, function (err, pro) {
        user = pro;
    });

    var tp;
    await TicketPriceSchema.findOne({ customerType: user.tip, ticketType: req.params.tipKarte }, function (err, tpro) {
        tp = tpro;
    });
    //console.log(tp);

    var newTicket = {
        checked: false,
        validUntil: Date.now(),
        type: req.params.tipKarte,
        userId: user.id,
        ticketPriceId: tp.id,
        transaction: ''
    }

    kartaSchema.create(newTicket, (err, newlyCreatedTicket) => {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreatedTicket);
            res.send({ message: "Uspesno ste kupili " + req.params.tipKarte + "-u kartu, po ceni od |" + tp.price + "| rsd, hvala vam, vas gsp!" });
        }
    });

    // var findUser;
    // User.findOne({ username: req.params.user }).populate('ticketpriceschemas', 'tipcustomerType').exec(function(err, story){
    //     console.log(story);
    // });

    // TicketPriceSchema.findOne({ ticketType: req.params.tipKarte }).populate('users', req.params.user  ).exec(function(err, story){
    //     console.log(story);
    // });
});

//Dobavljanje autobuskih linija
router.get('/Linijas', (req, res) => {
    //console.log(req.params);

    LineSchema.find({}, (err, lines) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(lines)
            var naziviLinija = [];
            lines.forEach(function (entry) {
                naziviLinija.push(entry.name);
            });
            res.send(naziviLinija);
        }
    });
});

//Dobavljanje rasporeda voznje
router.get('/Linijas/GetLinija/:selectedLine/:day', async (req, res) => {
    console.log(req.params);


    //DODAVANJE U BAZU 
    // TimetableSchema.create([
    //     {day: "Nedelja", departures: "11:00 11:30 12:00", lineId: "5d71948e9f66874b0cd761a5"},
    //     {day: "Subota", departures: "11:00 11:30 12:00", lineId: "5d71948e9f66874b0cd761a5"},
    //     {day: "Radni", departures: "11:00 11:30 12:00", lineId: "5d71948e9f66874b0cd761a5"},
    //     {day: "Nedelja", departures: "11:05 11:25 12:08", lineId: "5d719500da950721d8f6a457"},
    //     {day: "Subota", departures: "11:10 11:37 12:12", lineId: "5d719500da950721d8f6a457"},
    //     {day: "Radni", departures: "11:20 11:35 12:22", lineId: "5d719500da950721d8f6a457"}           
    // ], (err, newlyCreatedTicket) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(newlyCreatedTicket);
    //     }
    // }
    // );

    var line;
    await LineSchema.findOne({ name: req.params.selectedLine }, function (err, pro) {
        line = pro;
    });

    TimetableSchema.find({ lineId: line.id, day: req.params.day }, (err, times) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(lines)
            var timesToList = [];
            times.forEach(function (entry) {
                timesToList.push(entry.departures);
            });
            res.send(timesToList);
        }
    });
});

//Dobavljanje cene karte
router.get('/Kartas/GetKarta/:tipKarte/:tipPutnika', async (req, res) => {
    console.log(req.params);

    var cena;
    await TicketPriceSchema.findOne({ ticketType: req.params.tipKarte, customerType: req.params.tipPutnika }, function (err, pro) {
        cena = pro.price;
    });
    console.log(cena);
    res.send(cena);
});

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//Dobavljanje kordinata stanice
//KAKO PROCI KROZ LISTU SA STANICAMA I NACI ODGOVARAJUCE STANICE!!! 
//----ODGOVOR---- 
//SACUVATI U BAZI POLJE TIPA LISTA SA KORDINATAMA JEBENIM
router.get('/Stanicas/GetStanica/:oznakaLinije', async (req, res) => {
    //console.log(req.params);

    await LineSchema.findOne({ name: req.params.oznakaLinije }, (err, pro) => {
        res.send(pro);
    });
});

//Izmena cenovnika
router.post('/PromeniCenovnik', (req, res) => {
    console.log(req.body);

    PricelistSchema.findOneAndUpdate({ topical: 'true' },
        {
            $set: {
                validFrom: req.body.vaziOd, validUntil: req.body.vaziDo
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    //OBICAN KORISNIK
    TicketPriceSchema.findOneAndUpdate({ ticketType: "Mesecna", customerType: "Obican" },
        {
            $set: {
                price: req.body.mesecna
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Godisnja", customerType: "Obican" },
        {
            $set: {
                price: req.body.godisnja
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Vremenska", customerType: "Obican" },
        {
            $set: {
                price: req.body.vremenska
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Dnevna", customerType: "Obican" },
        {
            $set: {
                price: req.body.dnevna
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    //PENZIONER
    var cenaPenzionerskeDnevne = req.body.dnevna * (req.body.popustPenzija / 100);
    var cenaPenzionerskeVremenske = req.body.vremenska * (req.body.popustPenzija / 100);
    var cenaPenzionerskeGodisnje = req.body.godisnja * (req.body.popustPenzija / 100);
    var cenaSPenzionerskeMesecne = req.body.mesecna * (req.body.popustPenzija / 100);

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Mesecna", customerType: "Penzioner" },
        {
            $set: {
                price: cenaSPenzionerskeMesecne
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Godisnja", customerType: "Penzioner" },
        {
            $set: {
                price: cenaPenzionerskeGodisnje
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Vremenska", customerType: "Penzioner" },
        {
            $set: {
                price: cenaPenzionerskeVremenske
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Dnevna", customerType: "Penzioner" },
        {
            $set: {
                price: cenaPenzionerskeDnevne
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    //STUDENT
    var cenaStudentskeDnevne = req.body.dnevna * (req.body.popustStudent / 100);
    var cenaStudentskeVremenske = req.body.vremenska * (req.body.popustStudent / 100);
    var cenaStudentskeGodisnje = req.body.godisnja * (req.body.popustStudent / 100);
    var cenaStudentskeMesecne = req.body.mesecna * (req.body.popustStudent / 100);

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Mesecna", customerType: "Student" },
        {
            $set: {
                price: cenaStudentskeMesecne
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Godisnja", customerType: "Student" },
        {
            $set: {
                price: cenaStudentskeGodisnje
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Vremenska", customerType: "Student" },
        {
            $set: {
                price: cenaStudentskeVremenske
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    TicketPriceSchema.findOneAndUpdate({ ticketType: "Dnevna", customerType: "Student" },
        {
            $set: {
                price: cenaStudentskeDnevne
            }
        },
        (err, user1) => {
            if (err) {
                console.log(err);
            } else {
                //console.log(user1)
            }
        });

    res.send("OK");

});

//Brisanje cenovnika
router.delete('/Cenovniks/:id', (req, res) => {
    console.log(req.params);
    //5d72aed34c893498c063b821
    PricelistSchema.deleteOne({_id: req.params.id }, function(err){});
});

//Dodavanje novog reda voznje 
router.post('/Redovi/dodajRed', async (req, res) => {
    //console.log(req.body);

    var line;
    await LineSchema.findOne({ name: req.body.linija }, function (err, pro) {
        line = pro;
    });
    //console.log(line);

    newTiimetable = {
        day: req.body.dan,
        departures: req.body.red,
        lineId: line.id
    }

    TimetableSchema.create(newTiimetable, (err, newlyT) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(newlyT);
            res.send("OK");
        }
    });
});

//Brisanje reda voznje
router.delete('/RedVoznjes/:id', (req, res) => {
    console.log(req.params);
    //5d72aed34c893498c063b821
    TimetableSchema.deleteOne({_id: req.params.id }, function(err){});
});

//Dodavanje nove linije
router.get('/Linijas/GetLinijaDodaj/:oznakaLinije', (req, res) => {
    console.log(req.params);

    var newLine = { name: req.params.oznakaLinije };

    LineSchema.create(newLine, (err, pro) => {
        if(err){
            console.log(err);
        } else {
            res.send("OK");
        }
    });
});

//Dodavanje nove stanice 
router.post('/Stanicas', (req, res) => {
    console.log(req.body);
    newStation = {
        name: req.body.naziv,
        x: req.body.x,
        y: req.body.y
    }

    StationSchema.create(newStation, (err, newlyT) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(newlyT);
            res.send({ message: "Uspresno ste dodali novu stanicu!" });
        }
    });
});

//Dobavljanje autobuskih stanica
router.get('/Stanicas/GetStanicee', (req, res) => {
    //console.log(req.params);

    StationSchema.find({}, (err, lines) => {
        if (err) {
            console.log(err);
        } else {
            //console.log("pronadjene stanice" + lines)
            var naziviLinija = [];
            lines.forEach(function (entry) {
                naziviLinija.push(entry.name);
            });
            res.send(naziviLinija);
        }
    });
});

//Spajanje autobuskih stanica sa linijom //NE RADI DODAVANJE U LISTU 
router.get('/Stanicas/Spoji/:linija/:stanica', async (req, res) => {
    console.log(req.params);

    var Pronadjenastanica;
    var c = await StationSchema.findOne({name: req.params.stanica}, (err, lines) => {
        if (err) {
            console.log(err);
        } else {
            Pronadjenastanica = lines;
        }
    });

    var kord = {
        x: Pronadjenastanica.x,
        y: Pronadjenastanica.y
    }

    await LineSchema.findOneAndUpdate({name: req.params.linija}, { $push: { stations: {"x": Pronadjenastanica.x, "y": Pronadjenastanica.y} } },
    (err, user1) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(user1)
            res.send({message: "Uspesno ste spojili liniju " + req.params.linija + " sa stanicom " + req.params.linija});
        }
    });
    
});

//Brisanje stanice
router.get('/Stanicas/IzbrisiStanicu/:stanica/:param/:param2',  (req, res) => {
    StationSchema.deleteOne({name: req.params.stanica }, function(err){
        if(err){
            console.log(err);
        }
    });
});

//Brisanje linije
router.delete('/Linijas/:lineName',  (req, res) => {
    LineSchema.deleteOne({name: req.params.lineName }, function(err){
        if(err){
            console.log(err);
        }
    });
});

//Promena cene karte
router.get('/Kartas/GetKartaPromenaCene/:tip/:tipPutnika/:cena', (req, res) =>{
    console.log(req.params);
    TicketPriceSchema.findOneAndUpdate({ticketType: req.params.tip, customerType: req.params.tipPutnika},{
        $set: {
            price: req.params.cena
        }
    },
    (err, user1) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(user1)
        }
    });
});

//Dobavaljanje mejlova korisnika koji nisu potvrdjeni
router.get('/Values/GetZahtevi', async (req, res) =>{
    //console.log(req.params);
    
    var listaKorisnika;
    var listaMejlova = [];
    await User.find({approved: false}, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            listaKorisnika = user;
            //console.log(user1)
        }
    });

    listaKorisnika.forEach(function (entry) {
        listaMejlova.push(entry.email);
    });

    res.send(listaMejlova);
    //console.log(listaMejlova);
});

//Dobavaljanje mejlova svih korisnika
router.get('/Values/GetZahteviSvi', async (req, res) =>{
    //console.log(req.params);
    
    var listaKorisnika;
    var listaMejlova = [];
    await User.find({}, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            listaKorisnika = user;
            //console.log(user1)
        }
    });

    listaKorisnika.forEach(function (entry) {
        listaMejlova.push(entry.email);
    });

    res.send(listaMejlova);
    //console.log(listaMejlova);
});


//Potvrda registracije
router.get('/Values/Odobri/:mejl', async (req, res) =>{
    //console.log(req.params);
    
    var listaKorisnika;
    var listaMejlova = [];
    await User.findOneAndUpdate({email: req.params.mejl}, {
        $set: {
            approved: "true"
        }
    },
    (err, user1) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(user1)
            res.send({ message: "Uspesno ste odobrili registraciju korisnika sa mejlom " + req.params.mejl });
        }
    });

    //console.log(listaMejlova);
});

//Provera karte putnika 
router.get('/Kartas/GetProveri/:mejl', async (req, res) =>{
    //console.log(req.params);
    
    var korisnik;
    var listaKarata = [];
    await User.findOne({email: req.params.mejl}, (err, user1) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(user1)
            korisnik = user1;
        }
    });

    await kartaSchema.find({userId: korisnik.id}, (err, k) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(k)
            listaKarata = k;
        }
    });
    //console.log(listaKarata);
    //console.log(korisnik);
    
    var poslednjaKarta;
    if(listaKarata.length != 0){
        poslednjaKarta = listaKarata[0];
        listaKarata.forEach(function(entry) {
            if(poslednjaKarta.validUntil < entry.validUntil){
                poslednjaKarta = entry;
            }
        });
        if(poslednjaKarta.type == "Godisnja"){
            var datumKarte = poslednjaKarta.validUntil;
            var date = new Date();
            var pocetakSledeceGodine = new Date(datumKarte.getFullYear() + 1, 0, 1);
            //console.log(pocetakSledeceGodine.toDateString());

            if(pocetakSledeceGodine < date){
                res.send({message: "Korisniku je istekla karta!"});
            } else {
                res.send({message: "Korisniku ima validnu kartu!"});
            }
        } else if(poslednjaKarta.type == "Mesecna"){
            var datumKarte = poslednjaKarta.validUntil;
            var date = new Date();
            var firstDay = new Date(datumKarte.getFullYear(), datumKarte.getMonth() + 1, 1);
            console.log(firstDay.toDateString());
            
            if(firstDay < date){
                res.send({message: "Korisniku je istekla karta!"});
            } else {
                res.send({message: "Korisniku ima validnu kartu!"});
            }
        } else if(poslednjaKarta.type == "Dnevna"){
            var datumKarte = poslednjaKarta.validUntil;
            var date = new Date();
            var pocetakSledecegDana = new Date(datumKarte.getTime() + (24 * 60 * 60 * 1000));
            console.log(datumKarte.toDateString());

            if(pocetakSledecegDana < date){
                res.send({message: "Korisniku je istekla karta!"});
            } else {
                res.send({message: "Korisniku ima validnu kartu!"});
            }
        } else if(poslednjaKarta.type == "Vremenska"){  //NE NALAZI SE VREME U DATUMU
            var datumKarte = poslednjaKarta.validUntil;
            // console.log(poslednjaKarta.validUntil);
            var date = new Date();
            
            var hours = datumKarte.getHours();
            var minutes = datumKarte.getMinutes();
            datumKarte.setHours(Number(hours) - 1);
            hours = datumKarte.getHours();
            console.log('Time: ' + hours + ':' + minutes);


            if(datumKarte < date){
                res.send({message: "Korisniku je istekla karta!"});
            } else {
                res.send({message: "Korisniku ima validnu kartu!"});
            }
        }
    } else {
        res.send({message: "Korisnik nije kupio kartu!"})
    }
});

//Sve stanice linija LISTA IZ MONGO
router.get('/SveStaniceLista/:linija', async (req, res) =>{
    //console.log(req.params);

    await LineSchema.findOne({name: req.params.linija}, (err, user1) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(user1)
            res.send(user1.stations);
        }
    });

    //console.log(listaMejlova);
});

module.exports = router;