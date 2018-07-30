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
    }
})


module.exports = {
    Todo
}