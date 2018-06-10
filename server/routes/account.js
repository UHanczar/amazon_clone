import { Router } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import User from '../models/user';

const router = Router();

router.post('/signup', (req, res, next) => {
  const user = new User();

  user.email = req.body.email;
  user.password = req.body.password;
  user.name = req.body.name;
  user.picture = user.gravatar();
  user.isSeller = req.body.isSeller;

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (existingUser) {
      res.json({
        success: false,
        message: 'Account with that email is already exist.'
      });
    } else {
      user.save();

      const token = jwt.sign({ user }, config.secretKey, { expiresIn: '7d' });

      res.json({
        success: true,
        message: 'Enjoy your token',
        token
      });
    }
  });
});

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) console.log('ERROR', err);

    if (!existingUser) {
      res.json({
        success: false,
        message: 'Authentication failed. Account with that email is not exist.'
      });
    } else if (existingUser) {
      const validatedPassword = existingUser.comparePasswords(req.body.password);

      if (!validatedPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong passwords'
        });
      } else {
        const token = jwt.sign({ user: existingUser }, config.secretKey, { expiresIn: '7d' });

        res.json({
          success: true,
          message: 'Enjoy your token.',
          token
        });
      }
    }
  });
});

export default router;
