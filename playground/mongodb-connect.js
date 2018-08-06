//const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

//TodoApp => nome database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server')

    //insert method
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: 'false'
    // },(err, result) => {
    //     if (err) {
    //         return console.log('unable to insert todo')
    //     }

    //     console.log(JSON.stringify(result.ops, undefined,2))
    // })

    // db.collection('Users').insertOne({
    //         name: 'Manu3',
    //         age: 31,
    //         location:'London'            
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Errore insert Users')
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2))
    //     //ID
    //     console.log(JSON.stringify(result.ops[0]._id,undefined,2))
    //     //Timestamp preso dall id
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2))
    // })

    db.close()
})