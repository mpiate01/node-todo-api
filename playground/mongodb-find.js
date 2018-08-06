//const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

//TodoApp => nome database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server')

    // db.collection('Todos').find({
    //     _id: new ObjectID('5b559ac8ff39a445cda4f3f1')
    // }/*query*/).toArray().then((docs) => {
    //     console.log.apply('Todos')
    //     console.log(JSON.stringify(docs, undefined,2))
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    // --------------------

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`)
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // }) 
    
    // --------------------

    db.collection('Users').find({name: 'Manu'}).toArray().then((docs) => {
        console.log(`Manu count: ${docs.length}`)
    }).catch((err) => {
        console.log('Error')
    })

    //db.close()
})