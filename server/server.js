require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')
const bcrypt = require('bcryptjs')

const app = express()
const port = process.env.PORT

//middleware
app.use(bodyParser.json())

//TODO----------------------------------------------------------
 
//save
app.post('/todos', function (req, res) {
    const todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos', function (req, res) {
    Todo.find().then((todos)=>{  //get all todos
        res.send({
            todos   //todos: todos
        })
    },(e)=>{
        res.status(400).send(e)
    })
})

//GET /todos/12456789
app.get(`/todos/:id`, function(req, res) {
    const id = req.params.id        //get id from URL

    //Valid id using is Valid
    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
           return res.status(404).send()
        }
        res.send({
            todo   
        })        
    }).catch((e)=>{
        res.status(400).send()
    })

})

app.delete('/todos/:id', (req,res) => {
    const id = req.params.id

    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo) {
           return res.status(404).send()
        }
        
        res.status(200).send({
            todo   
        }) 

    }).catch((e)=>{
        res.status(400).send()
    })
})

//update
app.patch('/todos/:id', (req,res) => {
    const id = req.params.id
    const body = _.pick(req.body, ['text','completed']) //pick prende solo le proprieta' specificate dal body

    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    if(_.isBoolean(body.completed) && body.completed) {
        //se boolean e completato, allora aggiorniamo la data del complete
        body.completedAt = new Date().getTime() 
    } else {
        body.completed = false
        body.completedAt = null
    }

    //update DB
    Todo.findByIdAndUpdate(id, {
        $set:body
    }, {
        new: true   //per ritornare quello cambiato
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch((e)=>{
        res.status(400).send()
    })
})



//USER------------------------

//save
app.post('/users', function (req, res) {
    const body = _.pick(req.body, ['email', 'password'])
    // const user = new User({
    //     email:body.email,
    //     password: body.password
    // })   altrimenti
    const user = new User(body)



    user.save().then(()=>{
        return user.generateAuthToken()
    }).then((token) => {
        //qui si usa header() per dare dettagli riguardo il token returned che poi verra'
        // utilizzato per controllare che il token sia originale al momento in cui si 
        //faranno modifiche ai todo presenti nel database
        res.header('x-auth', token).send({user}) 
    }).catch( (e) => {
        res.status(400).send(e)
    })
})

//POST /users/login {email, password}
app.post('/users/login', function (req, res) {
    const body = _.pick(req.body, ['email', 'password'])
    const user = new User(body)
    
    User.findByCredentials(body.email, body.password).then((user) => {
        //if found, create a token
        return user.generateAuthToken()
    }).then((token) => {
            res.header('x-auth', token).send({user}) 
    }).catch((err)=> {
            res.status(400).send(err)
    })
})

app.delete('/users/me/token', authenticate, function(req, res){
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send()
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

// User.findOne({email: body.email}).then((user) => {
//     if (!bcrypt.compare(body.password, user.password, (err, res) => res)) {
//         console.log(bcrypt.compare(body.password, user.password, (err, res) => res))
//         return res.status(400).send(err)
//     }
//     res.send({user})
// }).catch((err)=> {
//     res.status(400).send(err)
// })

//get
app.get('/users', function (req, res) {
    User.find().then((users)=>{  //get all todos
        res.send({
            users  //todos: todos
        })
    },(e)=>{
        res.status(400).send(e)
    })
})



app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user)
})



app.listen(port, () => {
    console.log(`Started on port ${port}`)
})

module.exports = {
    app
}