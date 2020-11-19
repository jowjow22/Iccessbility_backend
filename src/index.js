const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const io = require('socket.io');

const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(http);

let connectedUsers = {};

io = io(server);

io.on('connection', socket =>{
    const { userID } = socket.handshake.query;
    connectedUsers[userID] = socket.id;

    socket.on('disconnect', () => {
        delete connectedUsers[userID];
    });
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    next();

});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(routes);

app.listen( process.env.PORT || 3333, ()=>{
    console.log('Back-end started...');
});