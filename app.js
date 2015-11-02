var express = require('express');

// to get the post content
var bodyParser = require('body-parser')
var _ = require('lodash');

var app = express();
app.set('view engine', 'jade');
app.set('views', './views');

// create application/json parser 
var jsonParser = bodyParser.json()

var db = new Array();

// Helper functions
// from http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// list all todos
app.get('/', function (req, res) {
  res.render('index', { todos: db });
});

// get a single todo item by id
app.get('/todo/:id', function (req, res) {
  if (isNumeric(req.params.id)) {
    var id = req.params.id;
    var found = _.find(db, function(todo) {
      return todo.id == id;
    });
    res.render('todo', { todo: found });
  }
  console.log('no todo with id: ' + found.name + ', id: ' + found.id);
  res.status(404).end();
});

// add a single todo item
app.post('/todo', jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  console.log('Adding new todo ' + req.body.name);

  var newItem = {}
  var id = (+new Date() + Math.floor(Math.random() * 99));
  newItem["name"] = req.body.name;
  newItem["id"] = id;
  db.push(newItem);

  console.log('added todo item with name ' + newItem["name"] + ' and id ' + newItem["id"]);
  res.status(201).end();
});

// update a todo item
app.put('/todo/:id', function (req, res) {
  res.send('update todo item ' + req.params.id);
});

// remove a todo item
app.delete('/todo/:id', function (req, res) {
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