const express = require('express')
const app = express()
var morgan = require('morgan')
var colors = require('colors');
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

// app.use(morgan((tokens, req, res) => {
//   return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'Content-length'), '-',
//       tokens['response-time'](req, res), 'ms'
//   ].join(' ')
// }))

// ,
//       `Name: ${req.body.name || '-'}`,
//       `Number: ${req.body.number || '-'}`



app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

const password = process.argv[2]

app.get('/info', async (req,res) => {
    try {
        const numOfPersons = await Person.countDocuments({});
        const timeChecked = new Date()

        res.send(
            `<p> Phonebook has info for ${numOfPersons} people </p> <br /> 
            <p>Time Checked: ${timeChecked}</p>
            `
        )
    } catch (err) {
        next(err)
    }
})

app.get('/api/persons', (req,res) => {
    Person.find({}).then(per => {
      res.json(per)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(per => {
        if (per) {
            res.json(per)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.post('/api/persons', (req,res) => {
    const body = req.body
    console.log(body);

    if(!body.name || !body.number ) {
        return res.status(400).json({
            error: "Name and Number are required"
        })
    }
  
    const person =new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (req,res, next) => {
    const { name, number} = req.body

    const person = {
        name: name,
        number: number
    }
    
    Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => { 
        res.json(updatedPerson)
    }).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(people => {
        res.status(204).end()
    }).catch(err => next(err))
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message);

    if (error.message === 'CastError') {
        return res.status(400).send({ error: 'Malformed ID'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message})
    }
    next(error)
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'Unknown Endpoint'})
}


app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})