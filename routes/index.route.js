const express = require('express');
let router = express.Router();
const  { 
  init,
} = require('../controllers/index.controller')

router.get('/init', init);

module.exports = router;
