const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

user.addToTopicList("1234", "10", ["Jim", {value: "robert", topic: "Bob"}, {value: "nasty", topic: "Tits and Ass"}])
  .then((userInfo) => {
    console.log("addToTopicList: %s", userInfo);
  })
  .catch((err) => {
    console.error(`addToTopicList error: ${err}`);
  });




