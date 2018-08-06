const bcrypt = require('bcryptjs')

let password = '123abc!'


//generates salt
bcrypt.genSalt(10, (err, salt)=>{
    //hashes password+salt
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash)
    })
})

const hashedpassword = "$2a$10$lAEHCVDFBZvf9fw3qUCduugEox5dfdG7B6LH5Za2XsM4Cm6GBQ1Rq"

bcrypt.compare('password presa da login form', hashedpassword, (err, res) => {
    console.log(res)
})

schema.pre('save', function() {
    return doStuff().
      then(() => doMoreStuff());
  });
  

