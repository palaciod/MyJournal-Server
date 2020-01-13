module.exports = {
  ensureAuthentication: function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log("Is authenticated");
      return next();
    } else {
      console.log("Not authenticated");
      res.send("Failed to authenticate");
    }
  }
};
