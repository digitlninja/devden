const createPost = (user, data) => {
  const model = {};

  if (data.text) model.text = data.text;
  if (data.name) model.name = data.name;
  if (data.avatar) model.name = data.name;
  if (user) model.user = user.id;

  return model;
};

module.exports = createPost;
