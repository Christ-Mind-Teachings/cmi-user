const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

user.getUserInfo("1234")
  .then((userInfo) => {
    console.log("getUserInfo: %s", util.inspect(userInfo, {depth: 6}));
  })
  .catch((err) => {
    console.error(`getUserInfo error: ${err}`);
  });

