const express = require('express')
const router = new express.Router()
const User = require('../models/user')
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
    
    
    // user.save().then(() => {
    //     res.status(201).send(user)
    //     //res.send(user) //também pode ser criado tudo em uma linha: res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400)
    //     res.send(e.errors.password)
    // })
})

//roteamento para o login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => { 
    try {
        const users = await User.find({})
        res.status(200).send(users)
    }catch (e){
        res.status(500).send(e)
    }
 
    /*
    if (req.query.id) {
        User.findOne({ _id: mongoose.Types.ObjectId(req.query.id)}, (err, obj) => {
            if (!err)
                return res.status(200).send(obj)
            notFound = true;
        })
    } else if (req.query.name) {
        User.findOne({ name: new RegExp('^'+req.query.name+'$', "i")}, (err, obj) => {
            console.log('Entrou no query name: ' + req.query.name)
            console.log(obj)
            console.log(err)
            if (!err && obj)
                return res.status(200).send(obj)
            notFound = true;
            console.log(notFound)
        })
    } else if (req.query.email) {
        User.find({email: req.query.email}).then((doc) => {
            res.send(doc)
        }).catch((e) => {
            res.status(500).send(e)
        })
        
    } else {
        return res.status(400).send({
            error: 'Erro: Não foi informado parâmetros corretos para busca.', 
            queryValue: req.query
        })
    }*/
})

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user)
            return res.status(404).send()
        
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    if (!checkValidKeys(['name', 'email', 'password', 'age'], updates)) //nota para o curso: isso aqui subdtitui o 'isValidOperation'
        return res.status(400).send({error: 'Invalid updates keys'})

    try {
        //new:true faz com que retorne para user o novo body, nao o antigo antes do update
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user)
            return res.status(404).send()

        res.send(user)
    }catch (e){
        res.send(e)
    }
}) //patch = update

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user)
            return res.status(404).send()

        res.send(user)
    } catch (e) {
        res.send(e)
    }
})

module.exports = router //router é o que faz o redirecionamento para os arquivos