const express = require('express')
const applicantController = require('../controllers/applicant.controller')
const router = express.Router({ mergeParams: true })

router
  .route('/')
  .post(applicantController.createApplicant)
  .get(applicantController.getAllApplicants)
router
  .route('/:id')
  .get(applicantController.getApplicant)
  .patch(applicantController.updateApplicant)
  .delete(applicantController.deleteApplicant)

module.exports = router
