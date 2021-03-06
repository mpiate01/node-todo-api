const mongoose = require('mongoose')
const validator = require('validator');
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true,
        validate: {
            // validator: (value) => {
            //     return validator.isEmail(value)
            // },       meglio=>
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength:6
    },
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

//Override method di mongoose per decidere quali dati saranno returned.
//  al momento, tutti i dati dell user sono returned
UserSchema.methods.toJSON = function() {
    const user = this
    userObject = user.toObject() //transforma in object

    // * facendo cosi ritorna:    
    //     {
    //         "_id": "5b64302ac3c85d004583514f",
    //         "email": "pggggdi@gmail.com"
    //     }
    
    // * senza toObject ritornerebbe:
    // {
    //     "user": {
    //         "_id": "5b64302ac3c85d004583514f",
    //         "email": "pggggdi@gmail.com"
    //     }
    // } 


    return _.pick(userObject, ['_id', 'email'])
}


//instance methods
UserSchema.methods.generateAuthToken = function() {
    const user = this
    const access = 'auth'
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString()

    //si potrebbe usare user.tokens.push()  ma potrebbe causare problemi
    user.tokens = user.tokens.concat([{access, token}])

    //save into db
    return user.save().then(()=>{
        return token
    })

    //Fatto cosi con 2 return perche' e' una Promise chain, infatti questo method viene utilizzato in server.js dentro ad un Promise
}

UserSchema.methods.removeToken = function (token) {
    //$pull   trova e rimuove 
    const user = this
    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    })
}

UserSchema.statics.findByToken = function(token) {
    const User = this
    let decoded

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        // return new Promise((resolve,reject) => {
        //     reject()
        // })    altrimenti
        return Promise.reject()
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,      // if there is a . (dot), quotes are required ''
        'tokens.access': 'auth'
    })
}

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this   
    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject()
        }
        
        return new Promise ((resolve, reject) => {  
            //bycrypt prende solo callbacks and not Promise          
            bcrypt.compare(password, user.password, (err, res) => {            
                if(res) {
                    resolve(user)
                } else {
                    reject()
                }
            })         
        })
    })
}


UserSchema.pre('save', function(next){
    const user = this

    if (user.isModified('password')) {  //isModified e' una property di mongoose
        bcrypt.genSalt(10, (err, salt)=>{
            //hashes password+salt
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
    
})

const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}