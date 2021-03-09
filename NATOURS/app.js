const express = require('express');
const morgan = require('morgan');
const app = express();
const rateLimit = require('express-rate-limit')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRoutes')
const helmet = require('helmet')
const mongooseSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

// 1 GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet())

// Development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 3,
  windowM: 69 * 60 * 10000,
  message: 'Too many requests from this IP, please try again in an hour!' 
})

app.use('/api', limiter)


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//DATA santization against NoSQL, query injections
app.use(mongooseSanitize())

// Data sanitization against XSS
app.use(xss())

//Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', 
    'ratingsQuantity', 
    'ratingsAverage',
    'maxGroupSize', 
    'difficulty', 
    'price'
  ]
}))

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next();
});

// 2) ROUTS
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next)=>{

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app;
