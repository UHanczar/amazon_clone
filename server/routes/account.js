import { Router } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import User from '../models/user';
import Order from '../models/order';
import checkJwt from '../middlewares/checkJwt';

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

router.route('/profile')
  .get(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) {
        res.json({
          success: false,
          message: 'There is some error in fenching data from database.'
        });
      } else {
        res.json({
          success: true,
          message: 'Sending user data',
          user
        });
      }
    });
  })
  .post(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) {
        res.json({
          success: false,
          message: 'There is some error in fenching data from database.'
        });
      } else {
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;

        user.isSeller = req.body.isSeller;

        user.save();

        res.json({
          success: true,
          message: 'Sucessfully updated your profile.'
        });
      }
    });
  });

router.route('/address')
  .get(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) {
        res.json({
          success: false,
          message: 'There is some error in fenching data from database.'
        });
      } else {
        res.json({
          success: true,
          message: 'Sending user data',
          address: user.address
        });
      }
    });
  })
  .post(checkJwt, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) {
        res.json({
          success: false,
          message: 'There is some error in fenching data from database.'
        });
      } else {
        if (req.body.addr1) user.address.addr1 = req.body.addr1;
        if (req.body.addr2) user.address.addr2 = req.body.addr2;
        if (req.body.city) user.address.city = req.body.city;
        if (req.body.state) user.address.state = req.body.state;
        if (req.body.country) user.address.country = req.body.country;
        if (req.body.postalCode) user.address.postalCode = req.body.postalCode;

        user.save();

        res.json({
          success: true,
          message: 'Sucessfully updated your address.'
        });
      }
    });
  });

router.get('/orders', checkJwt, (req, res, next) => {
  Order.find({ owner: req.decoded.user._id })
    .populate('products.product')
    .populate('owner')
    .exec((err, orders) => {
      if (err) {
        res.json({
          success: false,
          message: "Couldn't find your order"
        });
      } else {
        res.json({
          success: true,
          message: 'Found your order',
          orders: orders
        });
      }
    });
});

router.get('/orders/:id', checkJwt, (req, res, next) => {
  Order.findOne({ _id: req.params.id })
    .deepPopulate('products.product.owner')
    .populate('owner')
    .exec((err, order) => {
      if (err) {
        res.json({
          success: false,
          message: "Couldn't find your order"
        });
      } else {
        res.json({
          success: true,
          message: 'Found your order',
          order: order
        });
      }
    });
});

export default router;
