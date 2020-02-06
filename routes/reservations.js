var express = require("express");
var router = express.Router();
var sql = require("../db.js");

router.get("/:id", function(req, res, next) {
  sql.query(
    "SELECT s.id, s.seat_number, s.status, s.hall_id FROM movies AS m JOIN seats AS s ON m.hall_id = s.hall_id AND m.id = ?",
    req.params.id,
    function(err, result) {
      if (err) {
        console.log("error", err);
      } else {
        res.render("reservation", { data: result, resetUrl: req.originalUrl });
        
      }
    }
  );
});


router.post("/:id", function(req, res, next) {
  let seatArray = [];
  if (req.body["seat[]"]) {
    Array.isArray(req.body["seat[]"])
      ? (seatArray = req.body["seat[]"])
      : seatArray.push(req.body["seat[]"]);
  }
  if (req.body.name !== "" && seatArray.length !== 0) {
    let reservationId = null;
    let userId = null;
    let seatsNumbers = [];
   
    sql.query(
      "INSERT INTO users(user_name) VALUES (?)",
      req.body.name,
      function(err, result) {
        if (err) {
        } else {
          userId = result.insertId;
          for (var key in seatArray) {
           
            sql.query(
              "INSERT INTO reservations(movie_id, user_id, seat_id, price) VALUES (?, ?, ?, ?)",
              [req.params.id, userId, seatArray[key], req.body.price],
              function(err, result) {
                if (err) {
                  console.log("error: ", err);
                } else {
                }
              }
            );
            
            sql.query(
              "UPDATE seats SET status = 1 WHERE id = ?",
              seatArray[key],
              function(err, result) {
                if (err) {
                  console.log("error", err);
                  return;
                } else {
                }
              }
            );
            
            sql.query(
              "SELECT * FROM seats WHERE id = ?",
              seatArray[key],
              function(err, result) {
                if (err) {
                  console.log("error: ", err);
                } else {
                  seatsNumbers.push(result[0].seat_number);
                }
              }
            );
          }
         
          sql.query(
            "SELECT * FROM reservations JOIN movies ON reservations.movie_id = movies.id JOIN users ON reservations.user_id = users.id JOIN seats ON reservations.seat_id = seats.id WHERE user_id = ? GROUP BY user_id",
            userId,
            function(err, result1) {
              if (err) {
                console.log(err);
              } else {
                sql.query(
                  "SELECT * FROM halls WHERE id = ?",
                  result1[0].hall_id,
                  function(err, result2) {
                    if (err) {
                    } else {
                      let numbers = { seats: seatsNumbers };
                      let hallName = { hall_name: result2[0].name };
                      let obj = Object.assign(result1[0], numbers, hallName);
                      res.render("success", {
                        backUrl: req.originalUrl,
                        data: obj
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } else {
    
    res.render("error", {
      message: "Unesite ime i selektujte najmanje jedno sediste",
      backUrl: req.originalUrl
    });
  }
});



router.get("/:id/reset/:hall_id", function(req, res, next) {
  
  sql.query(
    "DELETE FROM reservations WHERE movie_id = ?",
    req.params.id,
    function(err, result) {
      if (err) {
        console.log("error: ", err);
      } else {
       
        sql.query(
          "UPDATE seats SET status = 0 WHERE hall_id = ?",
          req.params.hall_id,
          function(err, result) {
            if (err) {
              console.log("error", err);
            } else {
              res.redirect("/reservation/" + req.params.id);
            }
          }
        );
      }
    }
  );
});

module.exports = router;
