const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('whers the password');
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phone:${password}@phonebook.zvjja34.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
})

const Person = mongoose.model('Person', phoneSchema)

const person = new Person ({
    name: 'Anna',
    number: "040-1234556",
    date: new Date(),
})

person.save().then(res => {
    console.log(`added ${person.name} number: ${person.number} to phonebook`);
    mongoose.connection.close()
}).catch(err => {
    console.log('Errr saving phone', err);
    mongoose.connection.close()
})

Person.find({}).then(res => {
    res.forEach(person => {
        console.log(person);
    })
    mongoose.connection.close()
}).catch(err => {
    console.log('Errr getting phone', err);
    mongoose.connection.close()
})