const mongoose = require('mongoose')
const url = require('./config')

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv.length <= 2) {
    Person.find({}, (err, people) => {
        console.log('puhelinluettelo:');
        people.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        })
    })
        .then(response => {
            mongoose.connection.close()
        })

} else {

    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(response => {
            console.log('lisätään henkilö ' + process.argv[2] + " numero " + process.argv[3] + " luetteloon");
            mongoose.connection.close()
        })
}