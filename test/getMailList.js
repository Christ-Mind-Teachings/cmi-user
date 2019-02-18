const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

user.getMailList("05399539cca9ac38db6db36f5c770ff1")
  .then((maillist) => {
    console.log("getMailList: %s", util.inspect(maillist, {depth: 6}));
  })
  .catch((err) => {
    console.error(`getMailList error: ${err}`);
  });

