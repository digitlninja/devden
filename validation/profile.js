const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  const errors = {};

  // force strings for falsey values, for validator.isEmpty checking empty strings
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // The order of these validators matter. If one fails, and the following also fails,
  // it will re assign the last error message to the errors array.

  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status is required';
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills is required';
  }

  if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
    errors.website = 'Not a valid URL';
  }

  if (!isEmpty(data.youtube) && !Validator.isURL(data.youtube)) {
    errors.youtube = 'Not a valid URL';
  }

  if (!isEmpty(data.twitter) && !Validator.isURL(data.twitter)) {
    errors.twitter = 'Not a valid URL';
  }

  if (!isEmpty(data.facebook) && !Validator.isURL(data.facebook)) {
    errors.facebook = 'Not a valid URL';
  }

  if (!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)) {
    errors.linkedin = 'Not a valid URL';
  }

  if (!isEmpty(data.instagram) && !Validator.isURL(data.instagram)) {
    errors.instagram = 'Not a valid URL';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
