process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");


// test("GET /", async function () {
//   const resp = await request(app).get(`/`);
//   expect(resp.text).toEqual("Hello World!");
// });

// test("GET /staff/:fname", async function () {
//   const resp = await request(app).get(`/staff/joel`);
//   expect(resp.text).toEqual("This instructor is joel");
// });

// test("GET /api/staff/:fname", async function () {
//   const resp = await request(app).get(`/api/staff/joel`);
//   expect(resp.body).toEqual({ fname: "joel" });
// });

// test("POST /api/staff", async function () {
//   const resp = await request(app).post(`/api/staff`).send({ fname: "ezra" });
//   expect(resp.body).toEqual({ fname: "ezra" });
// });

// test("GET /whoops", async function () {
//   const resp = await request(app).get(`/whoops`);
//   expect(resp.status).toEqual(404);
//   expect(resp.body).toEqual({ oops: "Nothing here!" });
// });

describe("GET /dogs/:name", function () {
  
  //   const resp = await request(app).get(`/dogs/Whiskey`);
  //   expect(resp.body).toEqual({ greeting: "Hello Whiskey!" });
  // });

  // test("invalid", async function () {
  //   const resp = await request(app).get(`/dogs/Bowser`);
  //   expect(resp.status).toEqual(403);
  //   expect(resp.body).toEqual({ err: "Only Whiskey is Allowed." });
  // });
})
