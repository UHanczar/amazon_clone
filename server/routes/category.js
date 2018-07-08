import { Router } from 'express';
import async from 'async';

import Category from '../models/category';
import Product from '../models/product';

const router = Router();

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

export default router;
