const jwt = require('jsonwebtoken')
const env = require('../config/config')

const generateToken = (user) => {
    console.log (user)
    console.log (env.JWT_SECRET)
    const token = jwt.sign({
        data: user
      }, env.JWT_SECRET, { expiresIn: '1h' });

    /* return jwt.sign(user, env.JWT_SECRET,  {expiresIn: '3600s'}) */
    return token
}

const authToken = (token) => {
    try {
        jwt.verify(token, env.JWT_SECRET)
        return true
    } catch (e) {
        return false
    }
}

module.exports = { generateToken, authToken }


