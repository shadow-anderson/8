// Request validation middleware
// const { validationResult } = require('express-validator');

// Validate request data
exports.validate = (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  next();
};

// Example validation rules
// const { body } = require('express-validator');
// exports.userValidationRules = [
//   body('email').isEmail().normalizeEmail(),
//   body('password').isLength({ min: 6 }),
//   body('name').notEmpty().trim()
// ];
