import { Router } from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
// for fake products
// import faker from 'faker';

import config from '../config';
import checkJwt from '../middlewares/checkJwt';
import Product from '../models/product';

const router = Router();
const s3 = new aws.S3({
  accessKeyId: config.amazonSecretIdKey,
  secretAccessKey: config.amazonSecretAccessKey
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'amazonuhwebapplication',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    }
  })
});

router.route('/products')
  .get(checkJwt, (req, res, next) => {
    Product.find({ owner: req.decoded.user._id })
      .populate('owner')
      .populate('category')
      .exec((err, products) => {
        if (products) {
          res.json({
            success: true,
            message: 'Products',
            products
          });
        }
      });
  })
  .post([checkJwt, upload.single('product_picture')], (req, res, next) => {
    const product = new Product();
    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.image = req.file.location;

    product.save();

    res.json({
      success: true,
      message: 'Successfully added new product.'
    });
  });

// just for testing
// router.get('/faker/test', (req, res, next) => {
//   for (let i = 0; i < 20; i++) {
//     const product = new Product();
//     product.category = '5b20450a83692d1b68f1dcbe';
//     product.owner = '5b1cf31ba671f027fce94956';
//     product.image = faker.image.cats();
//     product.title = faker.commerce.productName();
//     product.description = faker.lorem.words();
//     product.price = faker.commerce.price();
//     product.save();
//   }
//
//   res.json({
//     message: 'Successfully added 20 pictures'
//   });
// });

export default router;

