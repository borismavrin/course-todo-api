const {
    MongoClient,
    ObjectID
} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log("Connected to mongodb server");

  // db.collection("Todos").findOneAndUpdate({
  //   _id: new ObjectID("58aa2a7f68830c7d31991e7e")
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });
  db.collection("Users").findOneAndUpdate({
    _id: new ObjectID("58aafe28185bc3ca5a1d1463")
  }, {
    $set: {
      name: "Boris"
    },
    $inc:{age: 2}
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });
    // db.close();
});
