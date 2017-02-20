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

    db.collection('Users').find({name: "Boris"}).count().then((count) => {
        console.log("Users");
        console.log(`in Users with name Boris there are ${count} person(s)`);
    }, (err) => {
        console.log("Unable to fetch todos", err);
    });

    // db.close();
});
