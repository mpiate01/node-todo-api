const express = require('express')
const bodyParser = require('body-parser')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')

const app = express()

//middleware
app.use(bodyParser.json())

// app.post('/todos', (req, res) => {
//     console.log(req.body)
// })  
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

app.listen(3000, () => {
    console.log('Started on port 3000')
})

module.exports = {
    app
}