const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users' // referring to users collection
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    // userId's of likes
    {
      user: {
        type: Schema.Types.ObjectId, // users id
        ref: 'users' // users collection
      }
    }
  ],
  comments: [
    // userId's of likes
    {
      user: {
        type: Schema.Types.ObjectId, // users id
        ref: 'users' // users collection
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

// Convert Schema to model (assign entity to model)
const Post = mongoose.model('post', PostSchema);
module.exports = Post;
