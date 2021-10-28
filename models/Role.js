const {
  Schema,
  model
} = require('mongoose'

)


const User = new Schema({
        value:  {type: String, unique: true, default: 'USER' }
})

module.exports = model('User', User)
