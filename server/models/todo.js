const mongoose = require('mongoose')

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        minlength: 2,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    //aggiunto per unire todo con users
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})


module.exports = {
    Todo
}