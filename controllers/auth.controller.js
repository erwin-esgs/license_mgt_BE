const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const {user} = require("../models");
const Joi = require('joi');

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

async function login(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().alphanum().required(),
    password: Joi.string().required(),
  })
  const validate = schema.validate(req.body)
  if(!validate.error){
    const data = await user.findOne({
      where: {
        [Op.and]: [
          { username: validate.value.username }
        ]
      }
    });
  
    let token=null
    let tokenData=null
    if(data){
      if(bcrypt.compareSync(validate.value.password, data.password)){
        let now = new Date();
        tokenData = {
          iat: Math.floor(now.getTime() / 1000),
          // exp: Math.floor(now.addDays(1).getTime() / 1000),
          id: data.id,
          name: data.name,
          username: data.username,
          role: data.role,
        }
      token = jwt.sign(tokenData, process.env.SECRET_KEY,{ expiresIn: '1h' });
      }
    }
    res.json({ success:true,accessToken: token, data:tokenData });
  }else{
    console.log(validate.error)
    res.json({ success:false });
  }  
}

function register(req, res, next) {
  res.json({ user: 'geek' });
}

module.exports = { 
  login,
  register,
};