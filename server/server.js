var express = require("express");
var bodyParser = require("body-parser");
const {
    ObjectID
} = require("mongodb");
var {
    mongoose
} = require("./db/mongoose");
var {
    User
} = require('./models/user');
var {
    Todo
} = require('./models/todo')

const port= process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send(`Yours id: ${id} is incorrect`)
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e)=>{
      res.status(400).send();
    });

});

app.delete('/todos/:id', (req, res)=>{
  id=req.params.id;
  if(!ObjectID.isValid(id)){
    res.status(400).send(`Yours id: ${id} is incorrect`)

  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })

})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
module.exports = {
    app
}
