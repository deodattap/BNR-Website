const { validationResult } = require('express-validator');

/**
 * Shared validation error handler middleware.
 * Place after express-validator rule arrays in route definitions.
 * Returns 422 with an array of error messages on failure.
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array().map(e => e.msg)
    });
  }
  next();
};
