var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
var util = require('util');

var app = express();
//app.set('view engine', 'jade');
//app.set('views', './views');
app.use('/', express.static(path.join(__dirname, 'public')));

// create application/json parser 
var jsonParser = bodyParser.json()

var db = new Array();

// list all todos
app.get('/api/todos', function (req, res) {
  res.json(db);
  // res.render('index', { todos: db });
});

// get a single todo item by id
app.get('/api/todos/:id', function (req, res) {
  var id = req.params.id;
  if (_.isFinite(id)) {
    var found = _.find(db, function(todo) {
      return todo.id == id;
    });
    res.render('todo', { todo: found });
  }
  console.log('no todo with id: ' + found.name + ', id: ' + found.id);
  res.status(404).end();
});

// add a single todo item
app.post('/api/todos', jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(400)
  
  console.log('Adding new todo ' + req.body.name);
  var newItem = {}
  var id = (+new Date() + Math.floor(Math.random() * 99));
  newItem["name"] = req.body.name;
  newItem["id"] = id;
  db.push(newItem);

  console.log('added todo item with name ' + newItem["name"] + ' and id ' + newItem["id"]);
  // res.status(201).end();
  res.json(db);
});

// update a todo item
app.put('/api/todos/:id', function (req, res) {
  res.send('update todo item ' + req.params.id);
});

// remove a todo item
app.delete('/api/todos/:id', function (req, res) {
  _.remove(db, function(todo) {
     return todo.id == req.params.id;
  });
  console.log('removed todo item ' + req.params.id);
  res.status(204).end();
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('ToDo app listening at http://%s:%s', host, port);
});

