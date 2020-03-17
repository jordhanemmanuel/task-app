const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//mongoose.set('useFindAndModify', false)
const userSchema = new mongoose.Schema({ //criar um Schema permite que voce tenha acesso a metodos adicionais
    name: {
        type: String,
        required:true,
        trim: true
    },
    email: {
        type: String,
        unique: true, //nao pode duplicado
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value))
                throw new Error('E-mail invalido!')
        }
    },
    password: {
        type: String,
        minlength: 7,
        required: true,
        trim: true,
        validate(value){
            if ((value.toLowerCase().search('password')) > -1)
                throw new Error('Senha insegura, tente outra combinação!')
        }
    },
    age: {
        type: Number,
        default: 18,  
        validate(value) {
            if (value < 0)
                throw new Error('Idade não pode ser negativa.')
        }     
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//mongoose.set('useNewUrlParser', true)
//mongoose.set('useCreateIndex', true);
//mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')

//--------------------------------------------------------------------------//

//Autentica o usuario
//schema.statics.metodo serve para criar uma função
//static são acessados pelos models (User)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if (!user)
        throw new Error('Não existe usuário com o e-mail cadastrado.')

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch)
        throw new Error('Credenciais incorretas.')

    return user
}

//methods podem ser acessados pelas instancias (user)
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'assinatura')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//sceham.pre permite que ele faça algo antes de um evento, enquanto schema.post após um evento acontecer
userSchema.pre('save', async function (next) { //nesse caso especifico, arrow function nao funciona
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()//no caso dessa função (schema.pre), é necessario chamar o next pois se não ele fica rodando pra sempre
})

const User = mongoose.model('User', userSchema) //pase o schema no lugar do body


//--------------------------------------------------------------------------//

module.exports = User

/* --- Alimentar os valores a serem inseridos no model Users -----------------------------------*/

// var name = 'Test Password'
// var age = 5
// var password = 'asdpaswa'
// var email = name + '@email.com'
// email = email.split(" ").join("")
// const me = new User({
//     name,
//     age,
//     password,
//     email
// })

//--------------------------------------------------------------------------//

// if (false) {
//     User.updateOne ({
//         name: 'NoAge'
//     }, {
//         $set: { name, age }
//     }, (err, res) => {
//         if (err)
//             return console.log('Nao foi dado Update ' + err)
//         console.log('Update com sucesso! \n' + res)
//     })
// }

// if(false){ 
//     User.updateMany( {
//         password: undefined,
//     }, {
//         $set: { password: (name+''+age),
//                 email: (name+'@email.com')
//         }
//     }, (err, res) => {
//         if (err)
//             return console.log ('Nao foi possivel dar Updates: \n' + err)
//         console.log('Updates realizados com sucesso: ' + res)
//     })
// }

// if (false) {
//     me.save().then(() => {
//         console.log(me)
//     }).catch((e) => {
//         console.log('Deu ruim! ' + e)
//     })
// }