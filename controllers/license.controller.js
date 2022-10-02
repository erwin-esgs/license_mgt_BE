const { Op } = require("sequelize");
const {license} = require("../models");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const e = require("express");

async function create(req, res, next) {
  // const token = req.get('authorization')?.split(' ')[1]
  // decoded = jwt.verify(token, process.env.SECRET_KEY)
  // req.body.user_id = decoded.id

  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    license_name: Joi.string().required(),
    qty: Joi.number().integer().required(),
    license_code: Joi.string().required(),
    status: Joi.number().integer().required(),
    type: Joi.number().integer().required(),
    info: Joi.string().required(),
  })
  const validate = schema.validate(req.body)
  if(!validate.error){
    let data = await license.create(validate.value);
    res.json({ success:true,data:data});
  }else{
    console.log(validate.error)
    res.json({ success:false });
  }  
}

async function read(req, res, next) {
  const token = req.get('authorization')?.split(' ')[1]
  decoded = jwt.verify(token, process.env.SECRET_KEY)
  let data = null
  if(decoded.role == 0){
    data = await license.findAll();
  }else{
    data = await license.findAll({
      where:{ user_id: decoded.id }
    })
  }
  res.json({ success:true,data:data});
}

async function detail(req, res, next) {
  let id = req.params['id']
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  })
  const validate = schema.validate({id})
  if(!validate.error){
    let data = await license.findOne({
      where:{ id: validate.value.id }
    })
    res.json({ success:true,data:data});
  }else{
    console.log(validate.error)
    res.json({ success:false });
  }  
}

async function update(req, res, next) {
  const token = req.get('authorization')?.split(' ')[1]
  decoded = jwt.verify(token, process.env.SECRET_KEY)
  req.body.user_id = decoded.id

  const schema = Joi.object({
    id: Joi.number().integer().required(),
    user_id: Joi.number().integer(),
    license_name: Joi.string(),
    qty: Joi.number().integer(),
    license_code: Joi.string(),
    status: Joi.number().integer(),
    type: Joi.number().integer(),
    info: Joi.string(),
  })
  req.body.id =req.params['id'];
  const validate = schema.validate(req.body)
  console.log(validate)
  if(!validate.error){
    let data = Object.fromEntries(Object.entries(validate.value).filter(([_, v]) => v != null));
    let result = await license.update(data, {
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
    let data = await license.destroy({ where: { id: validate.value.id } });
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