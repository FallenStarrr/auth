const User = require('./models/User')
const  Role = require('./models/Role')
var bcrypt = require('bcryptjs');
const { validationResult }  = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')
function generateAccessToken(id, roles) {
  const payload = {
    id,
    roles
  }
  return jwt.sign(payload, secret, {expiresIn: "24h"} )
}
class authController {
  async registration(req, res) {
    try {
                  const errors = validationResult(req)
                  if(!errors.isEmpty()) {
                    return res.status(400).json({message: 'Ошибка в запросе'})
                  }
                  const {username, password} = req.body
                  const candidate = await User.findOne({username})
                  if (candidate) {
                    return res.status(400).json({message: "Пользователь с таким именем уже существует"})
                  }
                  var hashPass =  bcrypt.hashSync(password, 7);
                  const userRole = await Role.findOne({value: 'USER'})
                  const user = new User({username, password: hashPass, roles: [userRole.value]  })
                  await user.save()
                  return res.json({message: "Пользователь успешно зареган"})
    } catch (e) {
      console.log(e)
      res.status(400).json({message:  'Registration error'})
    }
  }

  async login(req, res) {
    try {
      const {username, password} = req.body
      const user = await User.findOne({username})
      if (!user) {
        return res.status(400).json({message: `Пользователь ${username} не найден`})
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json(`Введен неверный пароль`)
      }
      const token = generateAccessToken(user._id, user.roles)
      return res.json({token})
    } catch (e) {
      console.log(e)
      res.status(400).json({message:  'Login error'})
    }
  }

  async getUsers(req, res) {
    try {
          const users = await User.find()
          res.json(users)
    } catch (e) {
      console.log(e)
    }
  }
}


module.exports = new authController()
