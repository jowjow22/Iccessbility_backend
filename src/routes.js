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
routes.patch('/user/profile/:userID', auth.auth, user.imageUpdate);
routes.patch('/user/cover/:userID', auth.auth, user.coverImageUpdate);

// ETYPE ROUTES

routes.post('/eType', auth.auth, eType.create);
routes.delete('/eType/:cd', auth.auth, eType.delete);
routes.get('/eType/:cd', eType.show);
routes.get('/eType', auth.auth, eType.showAll);
routes.patch('/eType/:cd', auth.auth, eType.update);

// FOLLOW ROUTES

routes.post('/follow/:uFollowID/:uFollowingID', auth.auth, follow.create);
routes.get('/following/:userID', follow.showFollowing);
routes.get('/followers/:userID', follow.showFollowers);
routes.get('/notFollowing/:userID', follow.showNotFollowing);
routes.delete('/unfollow/:uFollowID/:uFollowingID', auth.auth, follow.unfollow);

// ESTABLISHMENT ROUTES

routes.post('/establishment', auth.auth, establishment.create);
routes.get('/establishment/:cityName', establishment.showInCity);
routes.get('/establishment/user/:userID', establishment.showInUser);
routes.get('/establishment/showOne/:eID', establishment.showOne);
routes.delete('/establishment/:uID/:eID',auth.auth, establishment.delete);
routes.patch('/establishment/:uID/:eID',auth.auth, establishment.update);
routes.patch('/establishment/image/:uID/:eID', auth.auth,establishment.EstablishmentImageUpdate);

// RATING ROUTES

routes.post('/rating/:uID/:eID/:stars', auth.auth, rating.giveRating);
routes.get('/rating/establishment/:eId', rating.showInEstablishment);
routes.get('/rating/your/:eId/:uId', auth.auth, rating.showYourRating);
routes.patch('/rating/:eId/:uId/:stars', auth.auth, rating.update);
routes.delete('/rating/:eId/:uId', auth.auth, rating.delete);

// ACCESSBILITY TYPE ROUTES

routes.post('/accessbility', auth.auth, accessbility.create);
routes.get('/accessbility', auth.auth, accessbility.showAll);
routes.get('/accessbility/:cd', auth.auth, accessbility.show);
routes.delete('/accessbility/:cd', auth.auth, accessbility.delete);
routes.patch('/accessbility/:cd', auth.auth, accessbility.update);

// ESTABLISHMENT ACCESSIBILITY ROUTES

routes.post('/eAccessbility', auth.auth, eAccessbility.create);
routes.delete('/eAccessbility/:establishmentId/:aTypesId', auth.auth, eAccessbility.delete);
routes.get('/eAccessbility/one/:eId', eAccessbility.showOne);
routes.get('/eAccessbility/inAccess/:aId', eAccessbility.showInAccessbility);

// TYPEPS ROUTES
routes.post('/typePS', auth.auth, typePS.create);
routes.delete('/typePS/:typePSID', auth.auth, typePS.delete);
routes.get('/typePS', auth.auth, typePS.showAll);
routes.patch('/typePS/:typePSID', auth.auth, typePS.update);

// POST ROUTES
routes.post('/post', auth.auth, post.create);
routes.delete('/post/:postID/:userID', auth.auth, post.delete);
routes.patch('/post/:postID/:userID', auth.auth, post.update);
routes.patch('/post/image/:pID/:uID', auth.auth, post.postImageUpdate);
routes.get('/post/:userID/:userCity', auth.auth, post.showPosts);
routes.get('/post/:userID', auth.auth, post.showUserPosts);


// INTEREST ROUTES
routes.post('/interest/:postID/:userID', auth.auth, interest.create);
routes.delete('/interest/:postID/:userID', auth.auth, interest.delete);
routes.get('/interest/:postID', auth.auth, interest.showInteresteds);

// LIKES ROUTES

routes.post('/likes/:postID/:userID', auth.auth, like.giveLike);
routes.delete('/likes/:postID/:userID', auth.auth, like.removeLike);
routes.get('/likes/:postID', auth.auth, like.showLikes);

// CHAT ROUTES
routes.post('/chat/:rem/:dest', auth.auth, chat.sendMessage);
routes.get('/chat/:rem/:dest', auth.auth, chat.listChatMessages);



module.exports = routes;