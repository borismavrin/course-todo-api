const {
   ObjectID
} = require("mongodb");
const {
   Todo
} = require("./../../models/todo");
const {
   User
} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
   _id: userOneId,
   email: 'boris@example.com',
   password: 'user1pass',
   tokens: [{
      access: 'auth',
      token: jwt.sign({
         _id: userOneId,
         access: "auth"
      }, process.env.JWT_SECRET).toString()
}]
}, {
   _id: userTwoId,
   email: 'natasha@example.com',
   password: 'user2pass',
   tokens: [{
      access: 'auth',
      token: jwt.sign({
         _id: userTwoId,
         access: "auth"
      }, process.env.JWT_SECRET).toString()
}]
}];

const todos = [{
   _id: new ObjectID(),
   text: "1st todo",
   _creator: userOneId
}, {
   _id: new ObjectID(),
   text: "2nd todo",
   completed: true,
   completedAt: 123,
   _creator: userTwoId

}, {
   _id: new ObjectID(),
   text: "3d todo",
   _creator: userTwoId

}];
const populateTodos = (done) => {
   Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
   }).then(() => done(), (e)=>done(e));
};

const populateUsers = (done) => {
   User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo])
   }).then(() => done(), (e)=>done(e));
};
module.exports = {
   todos,
   populateTodos,
   users,
   populateUsers
}
