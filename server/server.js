const express = require('express')
const bodyParser = require('body-parser')

const {ObjectID} = require('mongodb')

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

//GET /todos/12456789
app.get(`/todos/:id`, function(req, res) {
    const id = req.params.id        //get id from URL

    //Valid id using is Valid
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id not valid').send()
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
           return res.status(404).send('Id not found').send()
        }
        res.send({
            todo   
        })        
    }).catch((e)=>{
        console.log('dddddddddddd')
        res.status(400).send('Id not valid').send()
    })

})

app.listen(3000, () => {
    console.log('Started on port 3000')
})

module.exports = {
    app
}