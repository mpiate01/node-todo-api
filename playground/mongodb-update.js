//const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

//TodoApp => nome database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server')

    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result)
    // })

    // ---------------

    // db.collection('Todos').findOneAndUpdate(
    //     {
    //     _id: new ObjectID("5b55b40bff39a445cda4f807")
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result)
    // })

    // ---------------

    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID('5b55962793c52d3740ae2aaa')
        },
        {
            $set: {
                name:'Manu'
            },
            $inc: {
                age: 1
            }
        },
        {
            returnOriginal: false
        }
    ).then((result)=> {
        console.log(result)
    })


    //db.close()
})