const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 404)
}

const handleDuplicatredFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
  console.log(10, value)
  const message = `Duplicate field value ${value}. Please use another value!`

  return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Ivalid input data. ${errors.join(', ')}`
  
  return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401)

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again', 401)

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json(
    {
      status: err.statusCode,
      error: err,
      message: err.message,
      stack: err.stack
    }
  );
}

const sendErrorProduction = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json(
      {
        status: err.statusCode,
        message: err.message
      }
    );
  
  //Programing or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR ',err)

    // 2) Send generic message
    res.status(500).json({
      status:'error',
      message: 'Something went very wrong!'
    })
  }
}

module.exports = (err, req, res, next) => {
    console.log(err.stack)
  
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (process.env.NODE_ENV === "development") {
      sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === "production") {
      let error = {...err}
      if (error.name === "CastError") error = handleCastErrorDB(error)
      if (error.code === 11000) error = handleDuplicatredFieldsDB(error)
      if (error.name === "ValidationError") error = handleValidationErrorDB(error)
      if (error.name === "JsonWebTokenError") error = handleJWTError()
      if (error.name === "TokenExpiredError") error = handleJWTExpiredError()

      sendErrorProduction(error, res)
    }
}