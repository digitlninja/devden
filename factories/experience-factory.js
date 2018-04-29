const createExperience = (data) => {
  const model = {};
  model.title = data.title;
  model.company = data.company;
  model.location = data.location;
  model.from = data.from;
  model.to = data.to;
  model.current = data.current;
  model.description = data.description;

  return model;
};

module.exports = createExperience;
