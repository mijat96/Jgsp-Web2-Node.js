// var io = require('socket.io')(server);

// io.on('connection',
//   (socket) => {
//     setInterval(() => {
//         var value = Math.floor(Math.random() * 50);
//         socket.emit('data', { data: value });
//       },
//       2000);
//   });

const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
    client.on('event', data => {
        var value = Math.floor(Math.random() * 50);
        console.log(value);
        socket.emit('data', { data: value });
    });
    client.on('disconnect', () => { /* … */ });
});
server.listen(3000);

module.exports = socket;