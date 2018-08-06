const {SHA256} = require('crypto-js')

const message = 'I am user number 3'
const hash = SHA256(message).toString()   //SHA256() ritorna un object
console.log(message)
console.log(hash)

const data = {
    id: 4
}

const token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'salt').toString()
}

token.data.id = 5
token.hash = SHA256(JSON.stringify(token.data)).toString()

const resultHash = SHA256(JSON.stringify(token.data) + 'salt').toString()

if(resultHash === token.hash) {
    console.log('data not changed')
} else {
    console.log('changed')
}