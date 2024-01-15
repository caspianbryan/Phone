const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

// app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "cass",
        "number": "25463125",
        "id": 5
      },
      {
        "name": "David Silva",
        "number": "50-56-25874",
        "id": 8
      },
      {
        "name": "Rachie",
        "number": "45-87-56890",
        "id": 5017
      },
      {
        "name": "Maxwell Dutch",
        "number": "70-85-85413",
        "id": 8568
      }
]

let notes = [
    {
        "id": 1,
        "content": "HTML is easy",
        "important": true
      },
      {
        "id": 2,
        "content": "Browser can execute only JavaScript",
        "important": false
      },
      {
        "id": 3,
        "content": "GET and POST are the most important methods of HTTP protocol",
        "important": true
      },
      {
        "content": "PUT and Delete are amazing CRID functionality",
        "important": false,
        "id": 4
    }
]

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'Content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        `Name: ${req.body.name || '-'}`,
        `Number: ${req.body.number || '-'}`
    ].join(' ')
}))


app.get('/info', (req,res) => {
    const numOfPersons = persons.length
    const timeChecked = new Date()

    res.send(
        `<p> Phonebook has info for ${numOfPersons} people </p> <br /> 
        <p>Time Checked: ${timeChecked}</p>
        `
    )
})

app.get('/api/persons', (req,res) => {
    res.json(persons)
})
app.get('/api/notes', (req,res) => {
    res.json(notes)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    console.log(id);
    const person = persons.find(per => per.id === id)
    console.log(person);
    if(person) {
        res.json(person)
    } else {
        res.send('Check address and try again').status(400).end()
    }
})

const createId = () => {
    return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req,res) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: "Name or Number missing And name must be unique"
        })
    }
    const personAdded = {
        id: createId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(personAdded)

    res.json(personAdded)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(per => per.id  !== id)

    res.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})