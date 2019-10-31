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

function getSearchAuditParms(parms, userRequest) {

  //search query
  if (!userRequest.query) {
    parms.message.push("Error: body.query missing");
    parms.error = true;
  }
  else {
    parms.query = userRequest.query;
  }

  //query source
  if (!userRequest.source) {
    parms.message.push("Error: body.source missing");
    parms.error = true;
  }
  else {
    parms.source = userRequest.source;
  }

  //query result count
  if (!userRequest.count) {
    parms.message.push("Error: body.count missing");
    parms.error = true;
  }
  else {
    parms.count = userRequest.count;
  }

  //indicates error in running query
  if (userRequest.error) {
    parms.error = userRequest.error;
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

/*
 * email address list
 * addressList: [{first,last,address}]
 */
function getUserAddressListParms(parms, userRequest) {

  //addressList: array of one or more email addresses
  // - {first: "string", last: "string", address: "string"}
  if (!userRequest.addressList) {
    parms.message.push("Error: body.addressList missing");
    parms.error = true;
  }
  else {
    parms.addressList = userRequest.addressList;
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
  //=> email address for searchAudit requestType
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
    case "addAddresses":
      parms = getUserAddressListParms(parms, userRequest);
      break;
    case "searchAudit":
      parms = getSearchAuditParms(parms, userRequest);
      break;
  }

  return parms;
}

module.exports = {
  parse: parseRequest
};

