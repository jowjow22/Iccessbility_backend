const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const io = require('socket.io');

const http = require('http');

const routes = require('./routes');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use(cors())
const server = http.createServer(http);


io = io(server);


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