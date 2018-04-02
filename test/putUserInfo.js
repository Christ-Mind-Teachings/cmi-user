const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

user.putUserInfo("1234", {topics: {"10": ["Rick", "Mercer"]}})
  .then((userInfo) => {
    console.log("putUserInfo: ", userInfo);
  })
  .catch((err) => {
    console.error(`putUserInfo error: ${err}`);
  });

