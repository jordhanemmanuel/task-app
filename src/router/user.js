const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const checkValidKeys = require('../others/checkValidKeys')

/* ---------- Tratamento de Users ------------------------------------------------------------ */



router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()   
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token }) 
    } catch (e) {
        res.status(400).send(e)
    }
})

//roteamento para o login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const success = 'O pai ta logado.'
        res.send({success, user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('Deslogado da MORDOX.')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => { 
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    if (!checkValidKeys(['name', 'email', 'password', 'age'], updates)) //nota para o curso: isso aqui substitui o 'isValidOperation'
        return res.status(400).send({error: 'Invalid updates keys'})

    try {
        //new:true faz com que retorne para user o novo body, nao o antigo antes do update
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        //const user = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    }catch (e){
        res.send(e)
    }
}) //patch = update

router.delete('/users/me', auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user._id)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.send(e)
    }
})

module.exports = router //router é o que faz o redirecionamento para os arquivos