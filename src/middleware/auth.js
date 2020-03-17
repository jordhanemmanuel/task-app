const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') //pega o valor do parametro no endereço
        const decoded = jwt.verify(token, 'assinatura')
        //console.log(token, decoded)
        //console.log(decoded)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token}) //pegando o parametro por string é como se fosse um metodo magico do php, duh
        //console.log(user)
        if (!user) 
            throw new Error()

        req.token = token
        req.user = user
        //console.log(user)
        next()
    } catch(e) {
        res.status(401).send({ error: 'Não autenticado.'})
    }
    next()
}

module.exports = auth