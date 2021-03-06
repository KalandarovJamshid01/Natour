const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require('morgan');

app.use(express.json()); // Middleware qorovulcha

app.use(morgan('common'));

app.use((req, res, next) => {
  req.time = Date.now();
  next();
});

// 200 -> OK GET
// 201 -> Create POST
// 404 -> Not FOUND
// 200 -> Update
// 204 -> Empty

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, {
    encoding: 'utf-8',
  })
);

const getToursAll = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      tours,
    },
  });
};
const addTour = (req, res) => {
  const data = req.body;
  console.log(data);
  const newId = tours[tours.length - 1].id + 1;
  const completeObj = Object.assign({ id: newId }, data);

  tours.push(completeObj);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    'utf-8',
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: completeObj,
        },
      });
    }
  );
};

const getTourItem = (req, res) => {
  console.log(req.time);
  const id = +req.params.id;
  const data = tours.find((val) => val.id === id);

  if (data) {
    res.status(200).json({
      status: 'success',
      timeReq: req.time,
      timeRes: res.time,
      data: {
        data,
      },
    });
  } else {
    res.status(404).json({
      status: 'Failed',
      message: 'Invalid id',
    });
  }
};

const updateTour = (req, res) => {
  const id = +req.params.id;
  const data = tours.find((val) => val.id === id);
};

const deleteTour = (req, res) => {
  const id = +req.params.id;
  const arr = tours.filter((val) => val.id != id);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(arr),
    'utf-8',
    (err) => {
      res.status(204).json({
        status: 'success',
        data: 'Malumot uchirildi',
      });
    }
  );
};

// App tour

app.route('/api/v1/tours').get(getToursAll).post(addTour);

app
  .route('/api/v1/tours/:id')
  .delete(deleteTour)
  .get(getTourItem)
  .patch(updateTour);

const port = 8000;
app.listen(port, '127.0.0.1');
