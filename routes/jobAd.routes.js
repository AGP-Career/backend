const express = require('express')
const jobController = require('../controllers/job.controller')

const applicantRouter = require('./application.routes')
const router = express.Router()

router.use('/:jobId/applications', applicantRouter)

router.route('/').post(jobController.createJob).get(jobController.getAllJobs)
router
  .route('/:id')
  .get(jobController.getJob)
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob)

router.get('/get-employer-jobs/:employerId', jobController.getJobByEmployer)

module.exports = router
