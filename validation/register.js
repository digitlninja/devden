const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // force strings for falsey values, for validator.isEmpty checking empty strings
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';

  // name
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name is required.';
  }

  // email
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required.';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Valid email required.';
  }

  // password
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required.';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm Password field is required.';
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match.';
  }

  return {
    errors,
    isValid: isEmpty(errors) // if no errors -> isValid, if errors -> !isValid
  };
};
