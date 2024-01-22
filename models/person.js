const mongoose = require('mongoose')
var colors = require('colors');

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

mongoose.connect(url).then(res => {
   console.log('connected to MongoDB'.brightCyan);
}).catch((err) => {
   console.log('Error connecting ot DB', err.message);
})

const personSchema = new mongoose.Schema({
   name: {
      type: String,
      minLength: 3
   },
   number: {
      type: String,
      validate: {
         validator: function (v) {
            // Regular expression to match the specified format
            return /^\d{2,3}-\d{7,}$/.test(v);
         },
         message: props => `${props.value} is not a valid phone number! The format should be XX-XXXXXXXX.`
      }
   }
});

personSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
   }
})

module.exports = mongoose.model('Person', personSchema)