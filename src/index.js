require('./db/mongoose')
const express = require ('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 3000 //dinamismo para Heroku e LocalServer
const userRouter = require('./router/user')
const taskRouter = require('./router/task')


// app.use((req, res, next) => {
//     if (req.method)
//         res.status(503).send('O SITE ATUALMENTE ESTÁ EM MANUTENÇÃO, VOLTA DEPOIS')
// })

//app.use pode servir para chamar os middlewares
app.use(express.json()) //com esse comando, todos os JSONs que vierem e sairem terão o tratamento parse automatico
//com o Express(app), você configura as respostas que ele dará a depender de cada chamada
app.use(userRouter)
app.use(taskRouter)

//
// Without middleware:      new request -> run router handler
// With middleware:         new request -> do something -> run router handler
//

//o express().listen tem que ficar por último
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const myFunction = async () => {
    const token = jwt.sign({_id: 'abc123'}, 'thisismynewcourse', { expiresIn: '1 second'})
    //console.log(token)
    console.log(token, 'thisismynewcourse')
    //const data = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmMxMjMiLCJpYXQiOjE1ODQzODU3MTN9.TMmwpTQfl6jVKfIMi6tQjH1OKB6oP1H6w3lyh2rHypI', 'thisismynewcourse')
    //console.log(data)
}

//myFunction()