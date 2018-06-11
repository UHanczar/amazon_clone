import jwt from 'jsonwebtoken';

import config from '../config';

const checkJwt = (req, res, next) => {
  const token = req.headers['authorization'];

  if (token) {
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: 'Token is incorrect. Authentication failed.'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'No token was provided.'
    });
  }
};

export default checkJwt;
