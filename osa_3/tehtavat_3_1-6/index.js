const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())

morgan.token('tinyextension', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :tinyextension :status :res[content-length] - :response-time ms'))

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(people => {
            res.json(people.map(formatPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(404).end()
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(formatPerson(person))
            } else {
                res.status(404).send({ error: 'not found' })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(404).send({ error: 'bad id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'bad id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'name or number missing!!' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            res.json(formatPerson(savedPerson))
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// CODE AS IT WAS BEFORE 3.13

// const express = require('express')
// const app = express()
// const bodyParser = require('body-parser')
// const morgan = require('morgan')
// const cors = require('cors')

// app.use(express.static('build'))

// app.use(cors())

// app.use(bodyParser.json())

// // kommenteissa osan 3 tehtavan 3.7 ratkaisu alla
// // koodissa osan 3 tehtavan 3.8 ratkaisu alla niin ikaan
// // app.use(morgan('tiny'))
// morgan.token('tinyextension', (req, res) => JSON.stringify(req.body))
// app.use(morgan(':method :url :tinyextension :status :res[content-length] - :response-time ms'))

// let persons = [
//     {
//         name: "Keijo",
//         number: "123456",
//         id: 1
//     },
//     {
//         name: "Kikka Kolmonen",
//         number: "123456",
//         id: 2
//     }
// ]

// app.get('/api/persons', (req, res) => {
//     res.json(persons)
// })

// app.get('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     const person = persons.find(person => person.id === id)

//     if (person) {
//         res.json(person)
//     } else {
//         res.status(404).end()
//     }
// })

// app.delete('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     persons = persons.filter(person => person.id !== id)

//     res.status(204).end()
// })

// const generateId = () => {
//     return Math.floor(Math.random() * (59000 - 2 + 1) + 2)
// }

// app.post('/api/persons', (req, res) => {
//     const body = req.body

//     if (body.name === undefined || body.number === undefined) {
//         return res.status(400).json({ error: 'name or number missing!!' })
//     }

//     if (persons.find(person => person.name == body.name)) {
//         return res.status(400).json({ error: 'name must be unique!!' })
//     }

//     const person = {
//         name: body.name,
//         number: body.number,
//         id: generateId()
//     }

//     persons = persons.concat(person)

//     res.json(person)
// })

// app.get('/info', (req, res) => {
//     res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
// })

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })
