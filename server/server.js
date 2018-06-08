import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';

const app = express();

mongoose.connect(config.database, (err) => {
  if (err) {
    console.log(`Error: ${err}`);
  } else {
    console.log('Connected to the Databese');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res, next) => {
  res.json({
    user: 'Uladzimir Hanchar'
  });
});

app.listen(config.port, () => console.log(`Server runs on port ${config.port}`));
