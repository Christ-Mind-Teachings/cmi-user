const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

const search = {
  userId: "rmercer33@gmail.com",
  query: "beloved brother",
  source: "WOM",
  count: 22
};

user.putSearchAuditInfo(search)
  .then((userInfo) => {
    console.log("putUserInfo: ", userInfo);
  })
  .catch((err) => {
    console.error(`putUserInfo error: ${err}`);
  });

