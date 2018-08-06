const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

//Todo.remove({query})
// Todo.remove({}).then((result) => {
//     console.log(result)
// })

//ritorna l elemento rimosso
//Todo.findOneAndRemove({_id:'5b62fadbff39a445cda60ce5'}).then((todo)=>{
//     console.log(todo)
// })
Todo.findByIdAndRemove('5b62fadbff39a445cda60ce5').then((todo)=>{
    console.log(todo)
})