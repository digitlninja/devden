const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateRegisterInput = (data) => {
  let errors = {};

  // force strings for falsey values, for validator.isEmpty checking empty strings
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

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

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
module.exports = validateRegisterInput;
