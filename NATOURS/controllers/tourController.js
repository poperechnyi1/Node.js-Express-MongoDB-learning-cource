const fs = require('fs');
const Tour = require('./../models/tourModel');

exports.checkBody = (req, res, next) => {
  console.log(`Tour name is ${req.body.name}`);
  console.log(`Tour price is ${req.body.price}`);
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid id',
  //   });
  // }

  // res.status(200).json({
  //   status: 'success',
  //   results: tours.length,
  //   data: {
  //     tours: tour,
  //   },
  // });
};

exports.createTour = (req, res) => {
  // console.log(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Update tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR: ', err);
//   });
