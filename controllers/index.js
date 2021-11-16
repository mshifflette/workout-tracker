const express = require("express");
const router = express.Router();
const db = require("../models/exerciseModel");



router.get("/api/workouts", (req, res) => {
  db.find({}, (err, data) =>{
      if (err) {
          res.send(error);
      } else {
          if (data) {
              for (let i = 0; i < data.length; i++) {
                  const exercisesArr = data[i].exercises;
                  let totalDuration = 0;
                  for (let i = 0; i < exercisesArr.length; i++) {
                      totalDuration += exercisesArr[i].duration;
                  }
                  data[i].totalDuration = totalDuration;
              }
              res.send(data);
          }
      }
  });
});

router.post("/api/workouts", (req, res) => {
  db.create({
    day: new Date(new Date().setDate(new Date().getDate())),
    exercises: [],
  })
    .then((created) => {
      res.json(created);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/api/workouts/:id", (req, res) => {
  db.updateOne(
    { _id: req.params.id },
    { $push: { exercises: req.body } },
    (error, success) => {
      if (error) {
        res.json(error);
      } else {
        res.json(success);
      }
    }).then(() => {
      db.findOne({_id: req.params.id}, (err, data) =>{
          let totalDuration = 0;
          for (let i = 0; i < data.exercises.length; i++) {
              totalDuration += data.exercises[i].duration;
          }
          const TD = totalDuration;
          db.updateOne({_id: req.params.id},{$set:{totalDuration:TD}}, (err,data) => {
              if (err) {
                  console.log(err);
              } else {
                  console.log(data);
              }
            });
      });
    });
});


router.get("/api/workouts/range", (req, res) => {
  db.find({},
    (err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    }
  ).limit(7);
});


router.get("/stats", (req, res) => {
  res.redirect("/stats.html");
});

module.exports = router;