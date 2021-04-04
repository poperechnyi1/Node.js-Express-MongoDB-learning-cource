const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();

router.get('/overview', viewController.getOverview);
router.get('/tour', viewController.getTour);

module.exports = router;
