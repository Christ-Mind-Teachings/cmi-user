const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");
const email = "rmercer33@gmail.com";

user.getAuditInfo(email)
  .then((auditInfo) => {
    if (!auditInfo) {
      console.log("getAuditInfo: no audit record for %s", email);
    }
    else {
      console.log("getAuditInfo: %s", util.inspect(auditInfo, {depth: 6}));
    }
  })
  .catch((err) => {
    console.error(`getAuditInfo error: ${err}`);
  });

