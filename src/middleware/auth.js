const config = require('../config/config');
const jwt = require('jsonwebtoken');
class Auth{
    async auth(req, res, next){
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                Error: 'Token Required'
            });
        }
        if(authHeader === 'Bearer'){
            return res.status(401).json({
                Error: "Token Required"
            });
        }
        const [, token] = authHeader.split(' ');
        try {
            const decoded = jwt.verify(token, config.md5HashKey);
            next();
        } catch (err) {
            return res.status(401).json({
                Error: 'Token Invalid'
            });
        }
    }

}

module.exports = Auth;