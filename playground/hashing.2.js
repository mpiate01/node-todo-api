const {SHA256} = require('crypto-js')

const jwt = require('jsonwebtoken')


//creates
const data = {
    id: 10
}

const token = jwt.sign(data, 'salt')
console.log(token)
//checks
const decoded = jwt.verify(token, 'salt')
console.log(decoded)