function getUserInfoParms(parms, userRequest) {

  //user info
  if (!userRequest.userData) {
    parms.message.push("Error: body.userData missing");
    parms.error = true;
  }
  else {
    parms.userData = userRequest.userData;
  }

  return parms;
}

function getUserTopicsParms(parms, userRequest) {

  //source Id: a 2 digit string
  if (!userRequest.sourceId) {
    parms.message.push("Error: body.sourceId missing");
    parms.error = true;
  }
  else {
    parms.sourceId = userRequest.sourceId;
  }

  //topicList: array of one or more topics
  // - can be either a "string" or an object {value: "string", topic: "string"}
  if (!userRequest.topicList) {
    parms.message.push("Error: body.topicList missing");
    parms.error = true;
  }
  else {
    parms.topicList = userRequest.topicList;
  }

  return parms;
}

function parseRequest(requestType, request) {
  var parms = {message: []};

  //if no parms given set error indicator and return
  if (request.body === null || typeof request.body === "undefined") {
    parms.message.push("request body missing");
    parms.error = true;
    return parms;
  }

  var userRequest = request.body;

  //md5 of email address
  if (!userRequest.userId) {
    parms.message.push("Error: body.userId missing");
  }
  else {
    parms.userId = userRequest.userId;
  }

  switch(requestType) {
    case "userInfo":
      parms = getUserInfoParms(parms, userRequest);
      break;
    case "addTopics":
      parms = getUserTopicsParms(parms, userRequest);
      break;
  }

  return parms;
}

module.exports = {
  parse: parseRequest
};

