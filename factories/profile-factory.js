const createProfile = (user, data) => {
  const model = {};

  model.user = user.id;

  if (data.handle) model.handle = data.handle;
  if (data.company) model.company = data.company;
  if (data.website) model.website = data.website;
  if (data.status) model.status = data.status;
  if (data.location) model.location = data.location;
  if (data.bio) model.bio = data.bio;
  if (data.githubusername) model.githubusername = data.githubusername;
  if (typeof data.skills !== 'undefined') {
    model.skills = data.skills.split(','); // split comma sep, into array of skills
    model.skills = model.skills.map((item) => item.trim());
  }

  model.social = {};
  if (data.youtube) model.social.youtube = data.youtube;
  if (data.twitter) model.social.twitter = data.twitter;
  if (data.facebook) model.social.facebook = data.facebook;
  if (data.instagram) model.social.instagram = data.instagram;

  return model;
};

module.exports = createProfile;
