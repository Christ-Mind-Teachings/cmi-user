const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

user.getTopicList("1234", "10")
  .then((userInfo) => {
    console.log("getTopicList: %s", util.inspect(userInfo, {depth: 6}));
  })
  .catch((err) => {
    console.error(`getTopicList error: ${err}`);
  });

