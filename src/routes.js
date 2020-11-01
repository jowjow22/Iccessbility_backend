const { Router } = require('express');

const routes = Router();

const UserController = require('./controllers/Users');
const Auth = require('./middleware/auth');
const auth = new Auth();
const user = new UserController();


routes.post('/user', user.create);
routes.delete('/user/:cd', auth.auth, user.deleteUser);
routes.get('/user/:cd', user.show);
routes.patch('/user/:cd_usuario', auth.auth, user.update);
routes.post('/login', user.login);

module.exports = routes;