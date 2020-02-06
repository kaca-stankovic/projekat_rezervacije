var express = require("express");
var router = express.Router();
var sql = require("../db.js");


router.get("/", function(req, res, next) {
  sql.query("SELECT * FROM movies", function(err, result) {
    if (err) {
      console.log("error", err);
    } else {
      res.render("movies", { result: result });
    }
  });
});

module.exports = router;

