const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    console.log('auth middleware')
    next()
}

module.exports = auth