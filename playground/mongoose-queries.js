const {ObjectID}=require("mongodb");

const {mongoose}= require("./../server/db/mongoose");
const {Todo}=require("./../server/models/todo");
const {User}=require("./../server/models/user");
// var id= "58ac7c939e0b4f04fa6bc3db";
// if(!ObjectID.isValid(is)){
//   return console.log("bad id");
// }

// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log("Id not found");
//   }
//   console.log("Todo by Id", todo);
// }).catch((e)=>console.log(e));

var id="58ab921ea20d803a38345d81";
User.findById(id).then((user)=>{
  if(!user){
    return console.log("id without user");
  }
  console.log("user:", user);
}).catch((e)=>console.log(e));
