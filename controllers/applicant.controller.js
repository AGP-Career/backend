const Applicant = require('../models/applicant')
const catchAsync = require('../utils/catch.async')
const appError = require('../utils/app.error')

exports.getAllApplicants = catchAsync(async (req, res, next) => {
  let filter = {}
  if (req.params.jobId) filter = { job_ad_id: req.params.jobId }
  const applicants = await Applicant.find(filter)

  res.status(200).json({
    results: applicants.length,
    status: 'success',
    data: {
      applicants,
    },
  })
})

exports.createApplicant = catchAsync(async (req, res, next) => {
  const newApplicant = await Applicant.create({
    
    gender: req.body.gender,
    user: req.body.user,
    location: req.body.location,
    linkedin_profile: req.body.linkedin_profile,
    resume: req.body.resume,
    portfolio: req.body.portfolio,
    job_ad_id: req.body.job_ad_id,
  })

  res.status(201).json({
    status: 'success',
    data: {
      newApplicant,
    },
  })
})

exports.getApplicant = catchAsync(async (req, res, next) => {
  const applicant = await Applicant.findById(req.params.id)
  if (!applicant) {
    return next(new appError('No applicant found with this Id', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      applicant,
    },
  })
})

exports.updateApplicant = catchAsync(async (req, res, next) => {
  const applicant = await Applicant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!applicant) {
    return next(new appError('No applicant found with this Id', 404))
  }

  res.status(204).json({
    status: 'success',
    data: {
      applicant,
    },
  })
})

exports.deleteApplicant = catchAsync(async (req, res, next) => {
  const applicant = await Applicant.findByIdAndDelete(req.params.id)
  if (!applicant) {
    return next(new appError('No applicant found with this Id', 404))
  }
  res.status(200).json({
    status: 'success',
    data: null,
  })
})
