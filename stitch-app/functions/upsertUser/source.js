exports = function(authEvent) {
  const mongodb = context.services.get("mongodb-atlas");
  const users = mongodb.db('data').collection('users');
  
  const { user, time } = authEvent;
  
  const newUser = {
    user_id: user.id,
    last_login: time,
    full_name: user.data.name,
    first_name: user.data.first_name,
    last_name: user.data.last_name,
    email: user.data.email,
    picture: user.data.picture
  };
  
  return users.updateOne({user_id: user.id}, newUser, {upsert: true});
  /*
    An Authentication Trigger will always call a function with an authEvent.
    Documentation on Triggers: https://docs.mongodb.com/stitch/mongodb/triggers/#overview

    Access the user associated with the authEvent:
    var user = authEvent.user

    Access the time the authEvent happened:
    var time = authEvent.time

    Access the operation type for the authEvent:
    var operationType = authEvent.operationType

    Access the providers associated with the authEvent:
    var providers = authEvent.providers

    Functions run by Triggers are run as System users and have full access to Services, Functions, and MongoDB Data.

    Accessing a mongodb service:
    var collection = context.services.get("mongodb-atlas").db("db_name").collection("coll_name");
    var doc = collection.findOne({ name: "mongodb" });

    To call other named functions:
    var result = context.functions.execute("function_name", arg1, arg2);
  */
};
