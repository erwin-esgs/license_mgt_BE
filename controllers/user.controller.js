const { Op } = require("sequelize");
const {user} = require("../models");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function create(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().alphanum().required(),
    username: Joi.string().alphanum().required(),
    password: Joi.string().alphanum().required(),
    role: Joi.number().integer().required(),
  })
  const validate = schema.validate(req.body)
  if(!validate.error){
    const salt = bcrypt.genSaltSync(10);
    validate.value.password = bcrypt.hashSync(validate.value.password, salt);
    let data = await user.create(validate.value);
    res.json({ success:true,data:data});
  }else{
    console.log(validate.error)
    res.json({ success:false });
  }  
}

async function read(req, res, next) {
  let data = await user.findAll();
  res.json({ success:true,data:data});
}

async function detail(req, res, next) {
  let id = req.params['id']
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  })
  const validate = schema.validate({id})
  if(!validate.error){
    let data = await user.findOne({
      where:{ id: validate.value.id }
    })
    res.json({ success:true,data:data});
  }else{
    console.log(validate.error)
    res.json({ success:false });
  }  
}

async function update(req, res, next) {
  const schema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().alphanum(),
    username: Joi.string().alphanum(),
    password: Joi.string().alphanum(),
    role: Joi.number().integer(),
  })
  req.body.id = req.params['id'];
  const validate = schema.validate(req.body)
  if(!validate.error){
    let data = Object.fromEntries(Object.entries(validate.value).filter(([_, v]) => v != null));
    if(data.password){
      const salt = bcrypt.genSaltSync(10);
      data.password = bcrypt.hashSync(data.password, salt);
    }
    let result = await user.update(data, {
      where: { id: validate.value.id },
      returning: true,
      plain: true
    });
    res.json({ success:true,data:data,result:result});
  }else{
    console.log(validate.error)
    res.json({ success:false });
  }
}

async function remove(req, res, next) {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  })
  const validate = schema.validate(req.body)
  if(!validate.error){
    let data = await user.destroy({ where: { id: validate.value.id } });
    res.json({ success:true,data:data});
  }else{
    console.log(validate.error)
    res.json({ success:false });
  }  
}

module.exports = { 
  create,
  read,
  detail,
  update,
  remove
};