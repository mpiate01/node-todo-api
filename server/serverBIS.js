const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')

//Create new model - puoi assegnare multipli attributi, tipo required, type
// const Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         minlength: 2,
//         trim: true,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// })

// //create Todo
// const newTodo = new Todo({
//     text: 'Study'
// })
// //save todo
// newTodo.save().then( (doc) => {
//     console.log('Saved todo', doc)
// }, (e) => {
//     console.log('Unable to save todo')
// })


const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    }
})

const newUser = new User({
    email: 'man@gmail.com'
})

newUser.save().then( (doc) => {
    console.log('Saved User', doc)
}, (e) => {
    console.log('Unable to save User', e)
})