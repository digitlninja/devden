const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileCreation(data) {
  let errors = {};

  // force strings for falsey values, for validator.isEmpty checking empty strings
  data.user = !isEmpty(data.user) ? data.user : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';
  data.experience.title = !isEmpty(data.experience.title) ? data.experience.title : '';
  data.experience.from = !isEmpty(data.experience.from) ? data.experience.from : '';
  data.education.school = !isEmpty(data.education.school) ? data.education.school : '';
  data.education.from = !isEmpty(data.education.from) ? data.education.from : '';

  // @user
  if (Validator.isEmpty(data.user)) {
    errors.user = 'User required';
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status required';
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills required';
  }
  if (Validator.isEmpty(data.experience.title)) {
    errors.experience.title = 'Experience title required';
  }
  if (Validator.isEmpty(data.experience.from)) {
    errors.experience.from = 'Experience start date required';
  }

  if (Validator.isEmpty(data.education.school)) {
    errors.education.school = 'School required';
  }

  if (Validator.isEmpty(data.education.from)) {
    errors.education.from = 'Start date required';
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
