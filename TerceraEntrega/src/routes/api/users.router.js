const { Router } = require('express');
const controller = require('../../controllers/users.controler');

const router = Router();

router.post('/', controller.createUser);

module.exports = router
