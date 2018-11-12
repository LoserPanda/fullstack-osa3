const mongoose = require('mongoose')

// TODO: .env below
const url = 

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person
