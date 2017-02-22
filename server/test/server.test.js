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

const todos = [{
   _id: new ObjectID(),
   text: "1st todo"
}, {
   _id: new ObjectID(),
   text: "2nd todo"
}, {
   _id: new ObjectID(),
   text: "3d todo"
}]
beforeEach((done) => {
   Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
   }).then(() => done());
});

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
