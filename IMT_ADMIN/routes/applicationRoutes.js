const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');


router.get('/get', applicationController.getAllApplications);


router.post('/create', applicationController.createApplication);


router.post('/:id/approve', applicationController.approveApplication);


router.post('/:id/reject', applicationController.rejectApplication);

module.exports = router;
