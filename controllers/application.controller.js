const Application = require('../models/application')
const catchAsync = require('../utils/catch.async')
const appError = require('../utils/app.error')

// functions that will filter out fields tha we dont want to update
const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getAllApplications = catchAsync(async (req, res, next) => {
  let filter = {}
  if (req.params.jobId) filter = { job_ad_id: req.params.jobId }
  const applications = await Application.find(filter)

  res.status(200).json({
    results: applications.length,
    status: 'success',
    data: {
      applications,
    },
  })
})

exports.createApplication = catchAsync(async (req, res, next) => {
  const newApplication = await Application.create({
    gender: req.body.gender,
    user: req.body.user,
    location: req.body.location,
    linkedinProfile: req.body.linkedinProfile,
    resume: req.body.resume,
    portfolio: req.body.portfolio,
    jobAdId: req.body.jobAdId,
  })

  res.status(201).json({
    status: 'success',
    data: {
      newApplication,
    },
  })
})

exports.getApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findById(req.params.id)
  if (!application) {
    return next(new appError('No application found with this Id', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      application,
    },
  })
})

exports.updateApplication = catchAsync(async (req, res, next) => {
  if (req.body.applicatioStatus) {
    return next(
      new appError(
        'this route is not for applicationStatus update please use  updateapplicationStatus route',
        400,
      ),
    )
  }
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
  if (!application) {
    return next(new appError('No applicant found with this Id', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      application,
    },
  })
})

exports.deleteApplication = catchAsync(async (req, res, next) => {
  const application = await Application.findByIdAndDelete(req.params.id)
  if (!application) {
    return next(new appError('No applicant found with this Id', 404))
  }
  res.status(200).json({
    status: 'success',
    data: null,
  })
})

exports.getTotalApplications = catchAsync(async (req, res, next) => {
  const applications = await Application.aggregate([
    {
      $group: {
        _id: null,
        numberOfApplications: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ])
  res.status(200).json({
    status: 'success',
    data: {
      applications,
    },
  })
})

exports.getTotalApplicationStatus = catchAsync(async (req, res, next) => {
  const types = await Application.aggregate([
    {
      $group: {
        _id: '$applicationStatus',
        numberOfJobs: { $sum: 1 },
      },
    },
  ])
  res.status(200).json({
    status: 'success',
    data: {
      types,
    },
  })
})

exports.updateApplicationStatus = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'applicationStatus')
  // if (req.file) filteredBody.photo = req.file.filename; //saving the name of the newly updated image to photo filed and also add photo field to the fields that will be update which is not initially in the selected field that will be updated updated
  // 3)update the user document
  const application = await Application.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  )
  res.status(200).json({
    status: 'success',
    data: {
      application,
    },
  })
})