const { Router } = require('express');

const routes = Router();

const UserController = require('./controllers/Users');
const FollowController = require('./controllers/Follow');
const EstablishmentType = require('./controllers/EstablishmentType');
const Establishment = require('./controllers/Establishment');
const Auth = require('./middleware/auth');

const auth = new Auth();
const user = new UserController();
const eType = new EstablishmentType();
const follow = new FollowController();
const establishment = new Establishment();


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
routes.patch('/eType/:cd_tp_estabelecimento', auth.auth, eType.update);

// FOLLOW ROUTES

routes.post('/follow/:uFollowID/:uFollowingID', follow.create);
routes.get('/following/:userID', follow.showFollowing);
routes.get('/followers/:userID', follow.showFollowers);
routes.delete('/unfollow/:uFollowID/:uFollowingID', follow.unfollow);

// ESTABLISHMENT ROUTES

routes.post('/establishment',auth.auth, establishment.create);
routes.get('/establishment',auth.auth, establishment.showInCity);
routes.delete('/establishment/:uID/:eID',auth.auth, establishment.delete);
routes.patch('/establishment/:uID/:eID',auth.auth, establishment.update);


module.exports = routes;