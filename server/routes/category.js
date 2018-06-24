import { Router } from 'express';

import Category from '../models/category';

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

export default router;
