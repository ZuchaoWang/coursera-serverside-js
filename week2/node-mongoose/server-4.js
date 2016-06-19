var mongoose = require('mongoose'),
  assert = require('assert');

var Dishes = require('./models/dishes-4'),
  Promotions = require('./models/promotions-4'),
  Leadership = require('./models/leadership-4');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected correctly to server");

  testDishes(function () {
    testPromotions(function () {
      testLeadership(function () {
        db.close();
      })
    })
  });

  function testDishes(doAfter) {
    // create a new dish
    Dishes.create({
      "name": "Uthapizza",
      "image": "images/uthapizza.png",
      "category": "mains",
      "price": "4.99",
      "description": "A unique . . .",
      "comments": [
        {
          "rating": 5,
          "comment": "Imagine all the eatables, living in conFusion!",
          "author": "John Lemon"
      },
        {
          "rating": 4,
          "comment": "Sends anyone to heaven, I wish I could get my mother-in-law to eat it!",
          "author": "Paul McVites"
      }
    ]
    }, function (err, dish) {
      if (err) throw err;
      console.log('Dish created!');
      console.log(dish);

      var id = dish._id;

      // get all the dishes
      setTimeout(function () {
        Dishes.findByIdAndUpdate(id, {
            $set: {
              "label": "Hot"
            }
          }, {
            new: true
          })
          .exec(function (err, dish) {
            if (err) throw err;
            console.log('Dish updated!');
            console.log(dish);

            dish.comments.push({
              rating: 5,
              comment: 'I\'m getting a sinking feeling!',
              author: 'Leonardo di Carpaccio'
            });

            dish.save(function (err, dish) {
              console.log('Dish Comments updated!');
              console.log(dish);

              db.collection('dishes').drop(function () {
                console.log('Dish dropped!');
                doAfter();
              });
            });
          });
      }, 1000);
    });
  }

  function testPromotions(doAfter) {
    // create a new promotion
    Promotions.create({
      "name": "Weekend Grand Buffet",
      "image": "images/buffet.png",
      "price": "19.99",
      "description": "Featuring . . ."
    }, function (err, promotion) {
      if (err) throw err;
      console.log('Promotion created!');
      console.log(promotion);

      var id = promotion._id;

      // get all the promotions
      setTimeout(function () {
        Promotions.findByIdAndUpdate(id, {
            $set: {
              "label": "New"
            }
          }, {
            new: true
          })
          .exec(function (err, promotion) {
            if (err) throw err;
            console.log('Promotion updated!');
            console.log(promotion);

            db.collection('promotions').drop(function () {
              console.log('Promotion dropped!');
              doAfter();
            });
          });
      }, 1000);
    });
  }

  function testLeadership(doAfter) {
    // create a new leader
    Leadership.create({
      "name": "Peter Pan",
      "image": "images/alberto.png",
      "designation": "Chief Epicurious Officer",
      "abbr": "CEO",
      "description": "Our CEO, Peter, . . ."
    }, function (err, leader) {
      if (err) throw err;
      console.log('Leader created!');
      console.log(leader);

      var id = leader._id;

      // get all the leaderes
      setTimeout(function () {
        Leadership.findByIdAndUpdate(id, {
            $set: {
              "abbr": "CTO"
            }
          }, {
            new: true
          })
          .exec(function (err, leader) {
            if (err) throw err;
            console.log('Leader updated!');
            console.log(leader);

            db.collection('leadership').drop(function () {
              console.log('Leader dropped!');
              doAfter();
            });
          });
      }, 1000);
    });
  }
});
