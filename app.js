const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const bodyParser = require("body-parser");
// Load Routes
const posts = require("./routes/Posts");
const users = require("./routes/User");

const db = require("./config/database");
const session = require("express-session");
const passport = require("passport");

require("./config/passport")(passport);

// Map Global promise, to get rid of warning
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch(err => console.log(err));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride("_method"));

// Express middleware
app.use(
  session({
    secret: "Secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
// Get Redirect Pass for authentication
app.get("/users/pass", (req, res) => {
  res.send(req.isAuthenticated);
  console.log(req.isAuthenticated);
});
// Get Redirect Fail for authentication
app.get("/fail", (req, res) => {
  res.send("fail");
});

app.use("/posts", posts);
app.use("/users", users);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
