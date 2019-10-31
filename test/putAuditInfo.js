const user = require("../src/module/user");
const util = require("util");

user.initialize(true, "local");

const signup = {
  "event": "signup",
  "instance_id": "fdb3dc30-d264-4c65-9e2c-274ce3a5dd3c",
  "user": {
      "id": "701f73de-1052-4683-959c-baedc3cb2917",
      "aud": "",
      "role": "",
      "email": "hcmercer33@gmail.com",
      "confirmation_sent_at": "2019-10-25T15:22:41Z",
      "app_metadata": {
          "provider": "email"
      },
      "user_metadata": {
          "full_name": "Hettie Mercer"
      },
      "created_at": "2019-10-25T15:22:41Z",
      "updated_at": "2019-10-25T15:22:41Z"
  }
};

const login = {
  "event": "login",
  "instance_id": "fdb3dc30-d264-4c65-9e2c-274ce3a5dd3c",
  "user": {
      "id": "5e03320e-e418-43d6-afd3-e2741612e533",
      "aud": "",
      "role": "",
      "email": "rmercer33@gmail.com",
      "confirmed_at": "2019-02-09T11:47:15Z",
      "confirmation_sent_at": "2019-02-09T11:46:59Z",
      "app_metadata": {
          "provider": "email",
          "roles": [
              "acol"
          ]
      },
      "user_metadata": {
          "full_name": "Rick Mercer"
      },
      "created_at": "2019-02-09T11:46:59Z",
      "updated_at": "2019-02-09T11:46:59Z"
  }
};

user.putAuditInfo(login)
  .then((userInfo) => {
    console.log("putUserInfo: ", userInfo);
  })
  .catch((err) => {
    console.error(`putUserInfo error: ${err}`);
  });

