const bcrypt = require('bcrypt');
const {user} = require("../models");

async function init(req, res, next) {
  try {
    let data = null
    const admin = await user.findOne({
      where: 
          { username: "admin" }
    })
    if(!admin){
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync("P455w0rd!!!", salt);
      data = await user.create({
        name :"ADMIN",
        username :"admin",
        password: hash,
        role :0,
      });
    }
    
    res.json({ data:data });
  } catch (err) {
      console.log(err);
  }
}
module.exports = { 
  init,
};