var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
  .all(Verify.verifyOrdinaryUser)
  .get(function(req, res, next) {
    Favorites.find({
        favoriteBy: req.decoded._doc._id
      })
      .populate('dish')
      .populate('favoriteBy')
      .exec(function(err, favorites) {
        if (err) throw err;
        res.json(favorites);
      });
  })
  .post(function(req, res, next) {
    Favorites.find({
      favoriteBy: req.decoded._doc._id,
      dish: req.body._id
    }, function(err, docs) {
      if (!docs.length) {
        var newFavorite = {
          dish: req.body._id,
          favoriteBy: req.decoded._doc._id
        };
        Favorites.create(newFavorite, function(err2, favorite) {
          if (err2) throw err2;
          console.log('Favorite created!');

          res.writeHead(200, {
            'Content-Type': 'text/plain'
          });
          res.end('Added the favorite with dishId: ' + favorite.dish);
        });
      } else {
        var newErr = new Error('The favorite dish already existed!');
        newErr.status = 403;
        next(newErr);
      }
    });
  })
  .delete(function(req, res, next) {
    Favorites.find({
        favoriteBy: req.decoded._doc._id
      })
      .remove()
      .exec(function(err, favorites) {
        if (err) throw err;
        res.json(favorites);
      });
  });

favoriteRouter.route('/:dishId')
  .all(Verify.verifyOrdinaryUser)
  .delete(function(req, res, next) {
    Favorites.find({
        favoriteBy: req.decoded._doc._id,
        dish: req.params.dishId
      })
      .remove()
      .exec(function(err, favorites) {
        if (err) throw err;
        res.json(favorites);
      });
  });

module.exports = favoriteRouter;
