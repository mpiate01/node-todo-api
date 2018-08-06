const {ObjectID} = require('mongodb') 
const jws = require('jsonwebtoken')

const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const userOneID = new ObjectID()
const userTwoID = new ObjectID()
const users = [{
    _id: userOneID,
    email: '1pi.at@ddd.com',
    password: 'userpass',
    tokens: [{
        access: 'auth',
        token: jws.sign({_id:userOneID, access:'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoID,
    email: '2pih.at@ddd.com',
    password: 'userpass2'
}]

const todos = [
    {
        _id: new ObjectID(),
        text:"One",
        completed:false,
        completedAt: null
    },
    {
        _id: new ObjectID(),
        text:"Two",
        completed:true,
        completedAt: 333
    }
]

const populateTodos = (done) => {
    Todo.remove({}) //rimuove tutti i dati nel database
        // .then(()=> done())      se volevo il db empty
        .then(()=>{
            return Todo.insertMany(todos)
        }).then(()=> done())
}

const populateUsers = (done) => {
    User.remove({}).then(()=>{

            const userOne = new User(users[0]).save()
            const userTwo = new User(users[1]).save()

            return Promise.all([userOne, userTwo]) //controlla che il salvataggio su db sia stato fatto
        }).then(()=> done())
}
module.exports = {todos,users, populateTodos, populateUsers}