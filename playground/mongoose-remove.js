const {
    ObjectID
} = require("mongodb");

const {
    mongoose
} = require("./../server/db/mongoose");
const {
    Todo
} = require("./../server/models/todo");
const {
    User
} = require("./../server/models/user");

// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

//.findOneAndRemove .findByIdAndRemove
Todo.findByIdAndRemove("58acb8accc13d43128428bcc").then((doc) => {
    console.log(doc);
}, (e) => console.log(e));
