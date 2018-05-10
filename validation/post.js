const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  const errors = {};

  // force strings for falsey values, for validator.isEmpty checking empty strings
  data.text = !isEmpty(data.text) ? data.text : '';

  // The order of these validators matter. If one fails, and the following also fails,
  // it will re assign the last error message to the errors array.

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Post text is required';
  }

  if (!Validator.isLength(data.text, { min: 2, max: 300 })) {
    errors.text = 'Text needs to be between 2 and 300 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
