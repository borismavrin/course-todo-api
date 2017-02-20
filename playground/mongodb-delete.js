const {
    MongoClient,
    ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log("Connected to mongodb server");

    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to fetch todos", err);
    // });

    //deleteMany, deleteOne, findOneAndDelete
db.collection('Users').deleteMany({name:"Boris"}).then((res)=>{
  console.log(res);
  console.log("____");
});
db.collection('Users').findOneAndDelete({_id: ObjectID("58aafe3d185bc3ca5a1d1467")}).then((res)=>{
  console.log(JSON.stringify(res, undefined, 2));
})


    // db.close();
});
