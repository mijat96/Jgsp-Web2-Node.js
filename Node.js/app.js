const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var mongoose = require("mongoose");
var User = require("../Node.js/models/userSchema");
var LineSchema = require("./models/lineSchema");

const app = express();
const url = 'mongodb://localhost:27017/JGSP';
mongoose.connect(url);
const dbName = 'JgspDatabase';

app.use(cors());

//presrece se svaki zahtev i parsiraju parametri u json format 
app.use(bodyParser.json());

//Import Routes
const postsRoute = require('./routes/posts');

app.use('/api', postsRoute);

var io = require('socket.io')(server);
var http = require('http');
var port = '3000';
app.set('port', port);
var server = http.createServer(app);
var http = require('http');
var io = require('socket.io')(server);

var stati = [];
var i = 0;

io.on('connection',

  function (socket) {

    socket.on('recive', message => {

      this.stati = [];

      this.stati = message;


      console.log(message);
      console.log(`Received message => ${message}`)
    });

    socket.on('disconnect', function () {
      console.log("user disconnected");
      this.stati = [];
      socket.disconnect();
    });

    socket.on('send', aa => {
      console.log("stati", this.stati.length);
      if (this.stati !== [] && this.stati.length > 0) {
        setInterval(() => {
          var value = [];
          if (i == this.stati.length) {
            i = 0;
          }
          value.push(this.stati[i].x);
          value.push(this.stati[i].y);
          i++;

          console.log('Emitting value: ' + value);
          socket.emit('data', { data: value });
        },
          4000);
      }
    })
  });

server.listen(port);

app.listen(52295, () => console.log('Server started on port 52295'));