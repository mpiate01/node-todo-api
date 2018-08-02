const express = require('express')
const bodyParser = require('body-parser')

const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')



const app = express()
const port = process.env.PORT || 3000

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
        console.log('dddddddddddd')
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

app.listen(port, () => {
    console.log(`Started on port ${port}`)
})

module.exports = {
    app
}