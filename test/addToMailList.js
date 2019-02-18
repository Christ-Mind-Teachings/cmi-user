
const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

let emailList = [
  {first: "Robert", last: "Palmer", address: "rob@palmer.com"},
  {first: "Jeffrey", last: "Danner", address: "jeffdanner@gmail.com"},
  {first: "Kate", last: "MacNamara", address: "kate@jesmry.com.au"},
  {first: "Julie", last: "Franklin", address: "julief8@yahoo.com"},
  {first: "Sue", last: "Perchik", address: "perchikb@aol.com"}
];

user.addToMailList("05399539cca9ac38db6db36f5c770ff1",emailList)
  .then((userInfo) => {
    console.log("addToMailList: %s", userInfo);
  })
  .catch((err) => {
    console.error(`addToMailList error: ${err}`);
  });




