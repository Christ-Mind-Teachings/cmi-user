const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

let topics = [
  {value: "HolySpirit", topic: "Holy Spirit"},
  "Atonement",
  "Awakening"
];

user.addToTopicList("05399539cca9ac38db6db36f5c770ff1", "10", topics)
  .then((userInfo) => {
    console.log("addToTopicList: %s", userInfo);
  })
  .catch((err) => {
    console.error(`addToTopicList error: ${err}`);
  });




