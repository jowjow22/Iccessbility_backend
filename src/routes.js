const { Router } = require('express');

const routes = Router();

const User = require('./controllers/Users');
const Follow = require('./controllers/Follow');
const EstablishmentType = require('./controllers/EstablishmentType');
const Establishment = require('./controllers/Establishment');
const Rating = require('./controllers/Rating');
const Accessbility = require('./controllers/AccessbiltyType');
const EAccessbility = require('./controllers/EstablishmentAccessbility');
const TypePS = require('./controllers/TypeProdServ');
const Post = require('./controllers/Posts');
const Interest = require('./controllers/Interested');
const Likes = require('./controllers/Likes');
const Chat = require('./controllers/Chat');
const Auth = require('./middleware/auth');

const auth = new Auth();
const user = new User();
const eType = new EstablishmentType();
const follow = new Follow();
const establishment = new Establishment();
const accessbility = new Accessbility();
const rating = new Rating();
const eAccessbility = new EAccessbility();
const typePS = new TypePS();
const post = new Post();
const like = new Likes();
const interest = new Interest();
const chat = new Chat();


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

routes.post('/eType', eType.create);
routes.delete('/eType/:cd', auth.auth, eType.delete);
routes.get('/eType/:cd', eType.show);
routes.get('/eType', eType.showAll);
routes.patch('/eType/:cd', auth.auth, eType.update);

// FOLLOW ROUTES

routes.post('/follow/:uFollowID/:uFollowingID', follow.create);
routes.get('/following/:userID', follow.showFollowing);
routes.get('/followers/:userID', follow.showFollowers);
routes.delete('/unfollow/:uFollowID/:uFollowingID', follow.unfollow);

// ESTABLISHMENT ROUTES

routes.post('/establishment', establishment.create);
routes.get('/establishment', establishment.showInCity);
routes.delete('/establishment/:uID/:eID',auth.auth, establishment.delete);
routes.patch('/establishment/:uID/:eID',auth.auth, establishment.update);

// RATING ROUTES

routes.post('/rating/:uID/:eID/:stars', rating.giveRating);
routes.get('/rating/establishment/:eId', rating.showInEstablishment);
routes.get('/rating/your/:eId/:uId', rating.showYourRating);
routes.patch('/rating/:eId/:uId/:stars', rating.update);
routes.delete('/rating/:eId/:uId', rating.delete);

// ACCESSBILITY TYPE ROUTES

routes.post('/accessbility', accessbility.create);
routes.get('/accessbility', accessbility.showAll);
routes.get('/accessbility/:cd', accessbility.show);
routes.delete('/accessbility/:cd', accessbility.delete);
routes.patch('/accessbility/:cd', accessbility.update);

// ESTABLISHMENT ACCESSIBILITY ROUTES

routes.post('/eAccessbility', eAccessbility.create);
routes.delete('/eAccessbility/:establishmentId/:aTypesId', eAccessbility.delete);
routes.get('/eAccessbility/one/:eId', eAccessbility.showOne);
routes.get('/eAccessbility/inAccess/:aId', eAccessbility.showInAccessbility);

// TYPEPS ROUTES
routes.post('/typePS', typePS.create);
routes.delete('/typePS/:typePSID', typePS.delete);
routes.get('/typePS', typePS.showAll);
routes.patch('/typePS/:typePSID', typePS.update);

// POST ROUTES
routes.post('/post', post.create);


// INTEREST ROUTES
routes.post('/interest/:postID/:userID', interest.create);
routes.delete('/interest/:postID/:userID', interest.delete);
routes.get('/interest/:postID', interest.showInteresteds);

// LIKES ROUTES

routes.post('/likes/:postID/:userID', like.giveLike);
routes.delete('/likes/:postID/:userID', like.removeLike);
routes.get('/likes/:postID', like.showLikes);

// CHAT ROUTES
routes.post('/chat/:rem/:dest', chat.sendMessage);
routes.get('/chat/:rem/:dest', chat.listChatMessages);


module.exports = routes;