const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require('socket.io');

const http = require('http');

const routes = require('./routes');

const app = express();

app.use('*', cors());

const server = http.createServer(http);


io = io(server, {transports: ['websocket', 'polling', 'flashsocket']});
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(routes);

io.on('connection', socket =>{
    console.log('new Connection');
});

app.listen( process.env.PORT || 3333, ()=>{
    console.log('Back-end started...');
});