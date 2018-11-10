const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())

// kommenteissa osan 3 tehtavan 3.7 ratkaisu alla
// koodissa osan 3 tehtavan 3.8 ratkaisu alla niin ikaan
// app.use(morgan('tiny'))
morgan.token('tinyextension', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :tinyextension :status :res[content-length] - :response-time ms'))

let persons = [
    {
        name: "Keijo",
        number: "123456",
        id: 1
    },
    {
        name: "Kikka Kolmonen",
        number: "123456",
        id: 2
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * (59000 - 2 + 1) + 2)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'name or number missing!!' })
    }

    if (persons.find(person => person.name == body.name)) {
        return res.status(400).json({ error: 'name must be unique!!' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

app.get('/info', (req, res) => {
    res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
