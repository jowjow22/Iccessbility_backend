const { Router } = require('express');

const routes = Router();

const UserController = require('./controllers/Users');
const eTypeController = require('./controllers/EstablishmentType');
const Auth = require('./middleware/auth');
const EstablishmentType = require('./controllers/EstablishmentType');
const auth = new Auth();
const user = new UserController();
const eType = new EstablishmentType();


routes.get('/', (req,res)=>{
    res.status(200).json({
        "Message" : "Welcome to Iccessbility API"
    });
});

// USER ROUTES
routes.post('/user', user.create);
routes.delete('/user/:cd', auth.auth, user.delete);
routes.get('/user/:cd', user.show);
routes.get('/user', user.showAll);
routes.patch('/user/:cd_usuario', auth.auth, user.update);
routes.post('/login', user.login);

// ETYPE ROUTES

routes.post('/eType', auth.auth, eType.create);
routes.delete('/eType/:cd', auth.auth, eType.delete);
routes.get('/eType/:cd', eType.show);
routes.get('/eType', eType.showAll);
routes.patch('/eType/:cd_tp_estabelecimento', auth.auth, eType.update)


module.exports = routes;