const createEducation = (data) => {
  const model = {};

  model.school = data.school;
  model.degree = data.degree;
  model.fieldofstudy = data.fieldofstudy;
  model.from = data.from;
  model.to = data.to;
  model.current = data.current;
  model.description = data.description;

  return model;
};

module.exports = createEducation;
