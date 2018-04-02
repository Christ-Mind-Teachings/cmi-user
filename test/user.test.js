const user = require("../src/module/user");

beforeAll(() => {
  user.initialize(true);
});

test("putUserInfo", () => {
  expect.assertions(1);
  return user.putUserInfo("123", {topics: {"10": {topics: ["Rick", "Mercer"]}}})
    .then((userInfo) => {
      expect(userInfo.message).toBe("ok");
    });
});

