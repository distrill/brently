const express = require('express');
const bodyParser = require('body-parser');
const { pick } = require('lodash');
const { Plot } = require('./models');

const plot = new Plot();

const app = express();

function wrapResponse(data) {
  return {
    apiVersion: '0.1.0',
    data,
  };
}
const success = wrapResponse('success');

app.use(bodyParser.json());

function getPlots(req, res, next) {
  return plot
    .fetchAll()
    .then(plots => plots.map(p => pick(p, ['name', 'id'])))
    .then(plots => res.json(wrapResponse(plots)))
    .catch(next);
}

function getPlot(req, res, next) {
  const { id } = req.params;
  return plot
    .fetchOne({ id })
    .then(p => res.json(wrapResponse(p)))
    .catch(next);
}

function postPlot(req, res, next) {
  const { name, config } = req.body;
  return plot
    .upsert({ name, config: JSON.stringify(config) })
    .then(() => res.json(success))
    .catch(next);
}

app.get('/plots', getPlots);
app.get('/plots/:id', getPlot);
app.post('/plots', postPlot);

app.use((req, res, next) => {
  const err = new Error('not found');
  err.status = 404;
  return next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'internal server error';
  return res.status(status).json({ error: message });
});

app.listen(3333, () => {
  console.log('listening on 3333');
});
