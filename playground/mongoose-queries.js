const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// const id = '5b61c12b909699b8365b074c'

// //To check if id is  valid before running queries
// if(!ObjectID.isValid(id)) {
//     console.log('Id not valid')
// }

// //query by id
// Todo.find({
//     _id: id    //no ObjectID come mongodb
// }).then((todos) => {
//     console.log('Todos:', todos)
// })

// Todo.findOne({
//     _id: id    //no ObjectID come mongodb
// }).then((todo) => {
//     console.log('Todo:', todo)
// })

// Todo.findById(id).then((todo) => {
//     if(!todo) {                             //per id valide ma nn presenti nel db
//         return console.log('Id not found')
//     }    
//     console.log('Todo by ID:', todo)
// }).catch((e)=> console.log(e))              //per id non valide


const user_id = '5b5705bf803a8f9040c58440'

User.findById(user_id).then((user)=>{
    if(!user) {
       return console.log('user id not found')
    }
    console.log('User by id', user)
}).catch((e)=>{
    console.log(e)
})