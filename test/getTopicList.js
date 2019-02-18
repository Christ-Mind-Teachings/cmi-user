const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

user.getTopicList("05399539cca9ac38db6db36f5c770ff1", "10")
  .then((userInfo) => {
    console.log("getTopicList: %s", util.inspect(userInfo, {depth: 6}));
  })
  .catch((err) => {
    console.error(`getTopicList error: ${err}`);
  });

