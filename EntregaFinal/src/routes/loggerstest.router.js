const express = require('express');
const { Router } = require('express');


const logController = require('../controllers/logger.controller');

const app = express();
const router = Router();


//GET /loggerstest/logtype 
router.get('/loggerstest/:logtype',  logController.dataLogger);



module.exports = router