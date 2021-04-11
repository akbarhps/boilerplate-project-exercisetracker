require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log("Connected to Database"));

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const exerciseRoute = require('./routes/exercise');

app.use('/api/exercise', exerciseRoute);

app.use((err, _req, res, _next) => {
  console.error(err.message);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});