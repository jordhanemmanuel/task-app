const mongoose = require('mongoose')

const Task = mongoose.model('Tasks', {
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
})

//--------------------------------------------------------------------------//

module.exports = Task

// /* --- Alimentar os valores a serem inseridos no model tasks -----------------------------------*/
// var description = 'DefaultTrueConstFalse'
// var completed = false
// const nodeJS = new Tasks({
//     description,
//     completed
// })

// /* --- Alimentar os valores a serem inseridos na tabela tasks -----------------------------------*/
// const saveTask = false

// if (saveTask) {
//     nodeJS.save().then(() => {
//         console.log(nodeJS)
//     }).catch((e) => {
//         console.log('Deu ruim! ' + e)
//     }) 
// }