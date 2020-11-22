const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '100000000kb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100000000kb', extended: true}));
app.use(express.json());
app.use(routes);

app.listen( process.env.PORT || 3333, ()=>{
    console.log('Back-end started...');
});