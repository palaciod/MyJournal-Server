const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const PostSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  entry: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("Posts", PostSchema);
