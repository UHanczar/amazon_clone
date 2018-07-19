import { Router } from 'express';
import async from 'async';
// import stripe from 'stripe';

import Category from '../models/category';
import Product from '../models/product';
import Review from '../models/review';
import Order from '../models/order';

import checkJwt from '../middlewares/checkJwt';

const router = Router();
const stripe = require('stripe')('sk_test_i5btf5gjEIOCD159UBtlqJkc');

router.route('/categories')
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: 'Successfully find all product categories',
        categories
      });
    });
  })
  .post((req, res, next) => {
    const category = new Category();

    category.name = req.body.name;
    category.save();

    res.json({
      success: true,
      message: 'Successfully created new category'
    });
  });

router.get('/categories/:id', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;

  async.parallel([
    callback => {
      Product.count({ category: req.params.id }, (err, count) => callback(err, count));
    },
    callback => {
      Product.find({ category: req.params.id })
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .deepPopulate('reviews.owner')
        .exec((err, products) => {
          if (err) {
            return next(err);
          }

          callback(err, products);
        });
    },
    callback => {
      Category.findOne({ _id: req.params.id }, (err, category) => callback(err, category));
    }
  ], (err, results) => {
    const [count, products, category] = results;

    res.json({
      success: true,
      message: 'category',
      categoryName: category.name,
      pages: Math.ceil(count / perPage),
      products,
      count
    });
  });
});

router.get('/products', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;

  async.parallel([
    callback => {
      Product.count({}, (err, count) => callback(err, count));
    },
    callback => {
      Product.find({})
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .exec((err, products) => {
          if (err) {
            return next(err);
          }

          callback(err, products);
        });
    }
  ], (err, results) => {
    const [count, products] = results;

    res.json({
      success: true,
      message: 'products',
      pages: Math.ceil(count / perPage),
      products,
      count
    });
  });
});

router.get('/product/:id', (req, res, next) => {
  Product.findById({ _id: req.params.id })
    .populate('category')
    .populate('owner')
    .deepPopulate('reviews.owner')
    .exec((err, product) => {
      if (err) {
        res.json({
          success: false,
          message: 'Product not found'
        });
      } else {
        res.json({
          success: true,
          product
        });
      }
    });
});

router.post('/product/review', checkJwt, (req, res, next) => {
  async.waterfall([
    callback => Product.findOne({ _id: req.body.productId }, (err, product) => {
      if (product) {
        callback(err, product);
      }
    }),
    product => {
      let review = new Review();

      review.owner = req.decoded.user._id;
      review.rating = req.body.rating;

      if (req.body.title) {
        review.title = req.body.title;
      }

      if (req.body.description) {
        review.description = req.body.description;
      }

      product.reviews.push(review._id);
      product.save();
      review.save();

      res.json({
        success: true,
        message: 'Successfully added new review.'
      })
    }
  ]);
});

router.post('/payment', checkJwt, (req, res, next) => {
  const stripeToken = req.body.stripeToken;
  const currentCharges = Math.round(req.body.totalPrice * 100);
  stripe.customers
    .create({
      source: stripeToken.id
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: currentCharges,
        currency: 'usd',
        customer: customer.id
      });
    })
    .then((charge) => {
      const products = req.body.products;

      let order = new Order();
      order.owner = req.decoded.user._id;
      order.totalPrice = currentCharges;

      products.map(product => {
        order.products.push({
          product: product.product,
          quantity: product.quantity
        });
      });

      order.save();
      res.json({
        success: true,
        message: "Successfully made a payment"
      });
    });
});

export default router;
