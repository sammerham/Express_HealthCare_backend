
const jwt = require("jsonwebtoken");
const { createToken } = require("./token");
const { SECRET_KEY } = require("../config");

describe("createToken", () => {
  test('Works on not admin', () => {
    const token = createToken({ username: 'test', is_admin: false });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: 'test',
      isAdmin: false,
      exp:expect.any(Number),
    });
  });

  test("works: admin", function () {
    const token = createToken({ username: "test", isAdmin: true });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: true,
      exp:expect.any(Number),
    });
  });

  test("works: default no admin", function () {
    // given the security risk if this didn't work, checking this specifically
    const token = createToken({ username: "test" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: false,
      exp:expect.any(Number),
    });
  });
});