const express = require('express');
let router = express.Router();
const  { 
  create,
  read,
  detail,
  update,
  remove
} = require('../controllers/license.controller')

router.get('/', read);
router.get('/:id', detail);
router.post('/', create);
router.patch('/:id', update);
router.put('/', remove);

module.exports = router;
