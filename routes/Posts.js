const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthentication } = require("../helpers/Auth");
// Load Post Model
require("../models/Post");

const Post = mongoose.model("Posts");

// Body Parser middleware
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

router.post("/create/:id", ensureAuthentication, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.entry) {
    errors.push({ text: "Please add some details" });
  }
  if (errors.length > 0) {
    console.log("Fill in fields");
  } else {
    const newUser = {
      title: req.body.title,
      entry: req.body.entry,
      user: req.params.id
    };
    new Post(newUser).save().then(post => {
      res.send(post);
      console.log("completed Post");
    });
  }
});

// Get ALl posts
router.get("/:id", ensureAuthentication, (req, res) => {
  Post.find({ user: req.params.id })
    .sort({ date: -1 }) // 1 is acsending
    .then(posts => {
      var postJson = posts;
      res.json(postJson);
      console.log(posts);
    });
});

router.get("/", ensureAuthentication, (req, res) => {
  res.send(req.session);
  console.log(req.session);
});

//Edit Post Process

router.put("/edit/:id", ensureAuthentication, (req, res) => {
  Post.findOne({
    _id: req.params.id
  }).then(post => {
    post.title = req.body.title;
    post.entry = req.body.entry;
    post.save();
    res.json(post);
    console.log("Edited Post");
  });
});

// Delete Post Process
router.delete("/delete/:id", ensureAuthentication, (req, res) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.send("Deleted");
    console.log("Deleted Post");
  });
});

module.exports = router;
