/*eslint no-console: "warn"*/

var ApiBuilder = require("claudia-api-builder");
var api = new ApiBuilder();
var db = require("./module/user");

module.exports = api;

api.post("/request", function(request) {
  return request;
});

//create or update userInfo
api.post("/user", function(request) {
  var handleRequest = require("./module/handleRequest");

  var parms = handleRequest.parse("userInfo", request);

  var result = {
    message: "OK"
  };

  if (parms.error) {
    result.message = parms.message;
    return result;
  }

  console.log("putUserInfo(): %o", parms);

  db.initialize(false);

  return db.putUserInfo(parms.userId, parms.userData)
    .then((response) => {
      result.response = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

//add to user/topics
api.post("/user/topics", function(request) {
  var handleRequest = require("./module/handleRequest");

  var result = {
    message: "OK"
  };

  var parms = handleRequest.parse("addTopics", request);

  if (parms.error) {
    result.message = parms.message;
    return result;
  }

  console.log("addToTopicList(): %o", parms);

  db.initialize(false);

  return db.addToTopicList(parms.userId, parms.sourceId, parms.topicList)
    .then((response) => {
      result.response = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

//add to user/maillist
api.post("/user/maillist", function(request) {
  var handleRequest = require("./module/handleRequest");

  var result = {
    message: "OK"
  };

  var parms = handleRequest.parse("addAddresses", request);

  if (parms.error) {
    result.message = parms.message;
    return result;
  }

  console.log("addToMailList(): %o", parms);

  db.initialize(false);

  return db.addToMailList(parms.userId, parms.addressList)
    .then((response) => {
      result.response = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

//get user info
api.get("/user/{uid}", function(request) {
  let userId = request.pathParams.uid;

  var result = {
    message: "ok"
  };

  console.log("getUserInfo(): %s", userId);

  db.initialize(false);

  return db.getUserInfo(userId)
    .then((response) => {
      result.response = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});


//get bookmark with bid for user with uid
api.get("/user/{uid}/topics/{sid}", function(request) {
  let userId = request.pathParams.uid;
  let sourceId = request.pathParams.sid;

  var result = {
    message: "ok"
  };

  console.log("getTopicList(): %s/%s", userId, sourceId);

  db.initialize(false);

  return db.getTopicList(userId, sourceId)
    .then((response) => {
      result.topics = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});

//get maillist
api.get("/user/{uid}/maillist", function(request) {
  let userId = request.pathParams.uid;

  var result = {
    message: "ok"
  };

  console.log("getMailList(): %s", userId);

  db.initialize(false);

  return db.getMailList(userId)
    .then((response) => {
      result.maillist = response;
      return result;
    })
    .catch((err) => {
      result.message = err.message;
      return result;
    });
});
