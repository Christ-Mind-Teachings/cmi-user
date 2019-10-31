/*eslint no-console: "warn"*/

/*
 * User
 *
 */
const AWS = require("aws-sdk");
const differenceWith = require("lodash/differenceWith");
const md5 = require("md5");

let table = "users";
let dbInitialized = false;
let db;

function initDB(dev = false, endpoint = "local") {

  // --------- DEVELOPMENT ONLY ------------------
  if (dev) {
    var local = "http://localhost:8000";
    var remote = "https://dynamodb.us-east-1.amazonaws.com";

    var awsConfig = {
      region: "us-east-1"
    };

    if (endpoint === "remote") {
      awsConfig.endpoint = remote;
    }
    else {
      awsConfig.endpoint = local;
    }

    AWS.config.update(awsConfig);
  }
  // --------- DEVELOPMENT ONLY ------------------

  if (!dbInitialized) {
    db = new AWS.DynamoDB.DocumentClient();
    dbInitialized = true;
  }
}

/*
 * insert or update user info
 *
 * userData is an object that can contain whatever structure you want
 * other than for 'topics'.
 *
 * Topics must be like this:
 *
 * userData = {topics: {[sourceId]: [array of topics], ...}}
 *
 *  where sourceId is a string value representing the source, for
 *    WOM the value is "10"
 *
 *  There is probably a different topic list for each source.
 *
 * It's better to use addToTopicList() to add topics to userData
 */
function putUserInfo(userId, userData) {

  return new Promise((resolve, reject) => {

    let putParams = {
      TableName: table,
      Item: {
        "userId": userId,
        "userData": userData
      }
    };

    db.put(putParams, function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

/*
 * Get the specified userInfo
 */
function getUserInfo(userId) {
  return new Promise((resolve, reject) => {

    //query parms
    let getParams = {
      TableName: table,
      Key: {
        "userId": userId
      }
    };

    db.get(getParams, function(err, data) {
      if (err) {
        reject(err.message);
      }
      else {
        resolve(data);
      }
    });
  });
}

/*
 * Get topic list: The topic list is source specific.
 */
function getTopicList(userId, sourceId) {
  return new Promise((resolve, reject) => {

    getUserInfo(userId)
      .then((response) => {
        if (response.Item) {

          let topics = response.Item.userData.topics;
          if (topics) {
            if (topics[sourceId]) {
              resolve(topics[sourceId]);
            }
            else {
              resolve([]);
            }
          }
        }
        else {
          resolve([]);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/*
 * Removes duplicates and concats the new list with the old. Then
 * sorts the result.
 *
 * If the oldList is empty, just sort the new list.
 *
 * Return the concatenated list or [] if no topics to add.
 */
function addTopics(newList, oldList) {
  let newUniqueTopics = newList;

  //check for duplicates
  if (oldList.length > 0) {
    newUniqueTopics = differenceWith(newList, oldList, (n, old) => {
      let oldValue;
      let newValue;

      if (typeof old === "object") {
        oldValue = old.value;
      }
      else {
        oldValue = old;
      }

      if (typeof n === "object") {
        newValue = n.value;
      }
      else {
        newValue = n;
      }

      return oldValue.toLowerCase() === newValue.toLowerCase();
    });
  }

  if (newUniqueTopics.length > 0) {
    let concatTopics = oldList.concat(newUniqueTopics);

    concatTopics.sort((a, b) => {
      let aValue, bValue;

      //objects have value and topic keys, sort them by topic
      if (typeof a === "object") {
        aValue = a.topic.toLowerCase();
      }
      else {
        aValue = a.toLowerCase();
      }

      if (typeof b === "object") {
        bValue = b.topic.toLowerCase();
      }
      else {
        bValue = b.toLowerCase();
      }

      if (aValue < bValue) {
        return -1;
      }

      if (aValue > bValue) {
        return 1;
      }

      return 0;
    });

    return concatTopics;
  }
  else {
    return [];
  }
}

/*
 * Add topics to the topicList
 *
 * We create the topicList if it doesn't exist and
 * create the userData object if that doesn't exist either.
 */
function addToTopicList(userId, sourceId, newTopicList) {
  return new Promise((resolve, reject) => {

    if (newTopicList.length === "undefined" || newTopicList.length === 0) {
      reject("Expecting an array of topics to add, none received.");
    }

    let userData = {};
    let updatedTopicList;
    let topicsAdded;

    getUserInfo(userId)
      .then((response) => {
        if (response.Item) {
          //we have userData
          userData = response.Item.userData;
          let topics = response.Item.userData.topics;

          if (topics) {
            //we have topics

            if (topics[sourceId]) {
              //add topics to the source topicList
              updatedTopicList = addTopics(newTopicList, topics[sourceId]);

              if (updatedTopicList.length > 0) {
                topicsAdded = updatedTopicList.length - topics[sourceId].length;
                userData.topics[sourceId] = updatedTopicList;
              }
              else {
                //no unique topics to add
                resolve("No topics added");
                return;
              }
            }
            else {
              //new topicList for new source
              updatedTopicList = addTopics(newTopicList, []);
              topicsAdded = updatedTopicList.length;
              userData.topics[sourceId] = updatedTopicList;
            }
          }
          else {
            //add topics to userData
            updatedTopicList = addTopics(newTopicList, []);
            topicsAdded = updatedTopicList.length;
            userData.topics = {};
            userData.topics[sourceId] = updatedTopicList;
          }
        }
        else {
          //create userData object
          userData.topics = {};
          updatedTopicList = addTopics(newTopicList, []);
          userData.topics[sourceId] = updatedTopicList;
          topicsAdded = updatedTopicList.length;
        }

        //topics have been updated or promise resolved and then() exited
        //- write changes to the database
        putUserInfo(userId, userData)
          .then(() => {
            resolve(`${topicsAdded} topics added.`);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
        return;
      });

  });
}

/*
 * Add email addresses to the addressList
 *
 * We create the addressList if it doesn't exist and
 * create the userData object if that doesn't exist either.
 * 
 * This is an update operation, the "newAddressList" replaces the existing one.
 */
function addToMailList(userId, newAddressList) {
  return new Promise((resolve, reject) => {

    if (newAddressList.length === "undefined" || newAddressList.length === 0) {
      newAddressList = [];
    }

    let userData = {};
    let addressesAdded;

    getUserInfo(userId)
      .then((response) => {
        if (response.Item) {
          //we have userData
          userData = response.Item.userData;
          userData.maillist = newAddressList;
          addressesAdded = userData.maillist.length;
        }
        else {
          //create userData object
          userData.maillist = newAddressList;
          addressesAdded = userData.maillist.length;
        }

        //addresses have been updated or promise resolved and then() exited
        //- write changes to the database
        putUserInfo(userId, userData)
          .then(() => {
            resolve(`Maillist has ${addressesAdded} addresses.`);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
        return;
      });

  });
}

/*
 * Get maillist, return empty array if not present
 */
function getMailList(userId) {
  return new Promise((resolve, reject) => {

    getUserInfo(userId)
      .then((response) => {
        if (response.Item) {

          let maillist = response.Item.userData.maillist;
          if (maillist) {
            resolve(maillist);
          }
          else {
            resolve([]);
          }
        }
        else {
          resolve([]);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function initAuditRecord(userEvent) {
  let audit = {};
  audit.email = userEvent.user.email;
  audit.md5 = md5(audit.email);
  audit.name = userEvent.user.user_metadata.full_name;
  audit.created = userEvent.user.created_at;
  audit.updated = userEvent.user.updated_at;
  audit.login = [];
  audit.login.push(Date());

  return audit;
}

function initSearchAuditRecord(searchAudit) {
  let audit = {};
  audit.email = searchAudit.userId;
  audit.md5 = md5(audit.email);
  audit.search = [];

  return audit;
}

function updateAuditRecord(userEvent, audit) {
  audit.name = userEvent.user.user_metadata.full_name;
  audit.created = userEvent.user.created_at;
  audit.updated = userEvent.user.updated_at;
  audit.login = [];
  audit.login.push(Date());

  return audit;
}

function putAuditInfo(userEvent) {
  return new Promise((resolve, reject) => {

    let putParams = {
      TableName: "audit"
    };

    if (userEvent.event === "signup") {
      console.log("signup event");
      putParams.Item = initAuditRecord(userEvent);

      //save to db
      db.put(putParams, function(err, data) {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    }
    else {
      //console.log("login event");
      const email = userEvent.user.email;
      getAuditInfo(email).then((audit) => {
        //console.log("return from getAuditInfo: %o", audit);
        if (!audit) {
          //console.log("no audit record for: %s", email);
          audit = initAuditRecord(userEvent);
        }
        //if search record added before login event
        else if (!audit.name) {
          updateAuditRecord(userEvent, audit);
        }
        else {
          audit.login.push(Date());
        }
        putParams.Item = audit;

        //save to db
        //console.log("updated audit: %o", audit);
        db.put(putParams, function(err, data) {
          if (err) {
            reject(err);
          }
          else {
            resolve(data);
          }
        });
      }).catch((err) => {
        reject(err);
      });
    }
  });
}

function getAuditInfo(email) {
  return new Promise((resolve, reject) => {

    //query parms
    let getParams = {
      TableName: "audit",
      Key: {
        "email": email
      }
    };

    console.log("getAuditInfo email:%s", email);

    db.get(getParams, function(err, data) {
      if (err) {
        reject(err.message);
      }
      else {
        //console.log("getAuditInfo found: %o", data);
        resolve(data.Item);
      }
    });
  });
}

/*
 * Add search record to audit table
 */
function putSearchAuditInfo(searchAudit) {
  return new Promise((resolve, reject) => {

    let putParams = {
      TableName: "audit"
    };

    console.log("search audit");
    const email = searchAudit.userId;
    getAuditInfo(email).then((audit) => {
      console.log("return from getAuditInfo: %o", audit);
      if (!audit) {
        audit = initSearchAuditRecord(searchAudit);
      }
      //first search record
      else if (!audit.search) {
        audit.search = [];
      }

      searchAudit.searchTime = Date();
      delete searchAudit.userId;
      audit.search.push(searchAudit);
      putParams.Item = audit;

      //save to db
      console.log("updated audit: %o", audit);
      db.put(putParams, function(err, data) {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = {
  initialize: function(dev, endpoint) {
    initDB(dev, endpoint);
  },
  getUserInfo: getUserInfo,
  putUserInfo: putUserInfo,
  getTopicList: getTopicList,
  getMailList: getMailList,
  addToTopicList: addToTopicList,
  addToMailList: addToMailList,
  putAuditInfo: putAuditInfo,
  getAuditInfo: getAuditInfo,
  putSearchAuditInfo: putSearchAuditInfo
};


