const { Router } = require('express');
const controller = require('../../controllers/mail.controller');
const isValidToken = require('../../middlewares/validation_token.middleware')
const tokensEmailManager = require('../../dao/managers/tokensemails/tokens.emails.db.manager')

const router = Router();

router.get('/mail',  controller.mailSender);



module.exports = router;