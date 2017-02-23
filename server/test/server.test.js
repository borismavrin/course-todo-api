const expect = require('expect');
const request = require('supertest');
const {
   ObjectID
} = require('mongodb');

const {
   app
} = require("./../server");
const {
   Todo
} = require('./../models/todo');
const {
   User
} = require('./../models/user');
const {
   todos,
   populateTodos,
   users,
   populateUsers
} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
   it("should create a new todo", (done) => {
      var text = 'testtodo';

      request(app)
         .post(
            "/todos")
         .send({
            text
         })
         .expect(200)
         .expect((res) => {
            expect(res.body.text).toBe(text)
         })
         .end((err, res) => {
            if (err) {
               return done(err)
            }
            Todo.find({
               text
            }).then((todos) => {
               expect(todos.length).toBe(1);
               expect(todos[0].text).toBe(text);
               done();
            }).catch((e) => done(e));
         });
   });

   it("shouldn't create todo with invalid body data", (done) => {
      request(app)
         .post("/todos")
         .send({})
         .expect(400)
         .end((err, res) => {
            if (err) {
               return done(err)
            }
            Todo.find().then((todos) => {
               expect(todos.length).toBe(3);
               done();
            }).catch((e) => done(e));
         });
   });
});
describe("GET /todos", () => {
   it('should get all todos', (done) => {
      request(app)
         .get('/todos')
         .expect(200)
         .expect((res) => {
            expect(res.body.todos.length).toBe(3);
         })
         .end(done);
   });
});
describe('GET /todos/:id', () => {
   it('should return todo doc', (done) => {
      request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
         })
         .end(done);
   });
   it('should return 404 if todo not found', (done) => {
      newid = new ObjectID().toHexString();
      request(app)
         .get(`/todos/${newid}`)
         .expect(404)
         .end(done);
   });
   it('should return 404 if nonobject id', (done) => {
      newid = 123;
      request(app)
         .get(`/todos/${newid}`)
         .expect(400)
         .end(done);
   });
});

describe('DELETE /todos/:id', () => {
   it('should remove a todo', (done) => {
      var hexId = todos[1]._id.toHexString();
      request(app)
         .delete(`/todos/${hexId}`)
         .expect(200)
         .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            Todo.findById(hexId).then((res) => {
               expect(res).toNotExist();
               done();
            }).catch((e) => {
               done(e);
            });
         });
   });

   it("should return 404 if todo not found", (done) => {
      newid = new ObjectID();
      request(app)
         .delete(`/todos/${newid}`)
         .expect(404)
         .end(done);
   });
   it("should return 404 if object if is invalid", (done) => {
      newid = 123;
      request(app)
         .get(`/todos/${newid}`)
         .expect(400)
         .end(done);
   });

});
describe("PATCH /todos/:id", () => {
   it("should update the todo", (done) => {
      id = todos[0]._id.toHexString();
      text = "new text";
      request(app)
         .patch(`/todos/${id}`)
         .send({
            text,
            completed: true
         })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA("number");
         })
         .end(done);
   });
   it("should clear completedAt when todo is not completed", (done) => {
      id = todos[1]._id.toHexString();
      request(app)
         .patch(`/todos/${id}`)
         .send({
            text,
            completed: false
         })
         .expect(200)
         .expect((res) => {
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
         })
         .end(done);
   });
});
describe('GET /users/me', () => {
   it('should return if user auth', (done) => {
      request(app)
         .get('/users/me')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
         })
         .end(done);
   });
   it('should return 401 if not auth', (done) => {
      request(app)
         .get('/users/me')
         .expect(401)
         .expect((res) => {
            expect(res.body).toEqual({});
         })
         .end(done);
   });
});
describe("Post /users", () => {
   it('should create a user', (done) => {
      var email = "aaaaaa@aaa.aa";
      var password = "adfgbx#";

      request(app)
         .post('/users')
         .send({
            email,
            password
         })
         .expect(200)
         .expect((res) => {
            expect(res.headers["x-auth"]).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
         })
         .end((err) => {
            if (err) {
               return done(err);
            }
            User.findOne({
               email
            }).then((user) => {
               expect(user).toExist();
               expect(user.password).toNotBe(password);
               done();
            });
         });
   });

   it('should return validation errors if requst invalid', (done) => {
      email = "";
      password = "";
      request(app)
         .post('/users')
         .send({
            email,
            password
         })
         .expect(400)
         .expect((res) => {
            expect(res.headers["x-auth"]).toNotExist();
         })
         .end(done);
   });

   it("should not create user if email in use", (done) => {
      request(app)
         .post('/users')
         .send({
            email: users[0].email,
            password: "afadff"
         })
         .expect(400)
         .expect((res) => {
            expect(res.headers["x-auth"]).toNotExist();
         })
         .end(done);
   });

});
