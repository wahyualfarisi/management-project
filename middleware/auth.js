const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token')

    //check if no token
    if(!token){
        return res.status(404).json({ msg: 'No Token, Authorization denied' })
    }

    //verifiy token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        //take to object
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'No Token, Authorization not valid' })
    }

}