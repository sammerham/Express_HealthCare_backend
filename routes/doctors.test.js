"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const Appointment = require("../models/appointment");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testDocIds,
  testApptsIds,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");
const req = require("express/lib/request");
const res = require("express/lib/response");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

id: expect.any(Number),
/************************************** GET /doctors */
describe("GET /doctors", () => {
  const doctors = [
    {
      id: expect.any(Number),
      first_name: 'd1',
      last_name: 'test1',
      email: 'd1@test.com'
    },
    {
      id: expect.any(Number),
      first_name: 'd2',
      last_name: 'test2',
      email: 'd2@test.com'
    },
    {
      id: expect.any(Number),
      first_name: 'd3',
      last_name: 'test3',
      email: 'd3@test.com'
    }
  ];
  test("works for logged in user", async () => {
    const resp = await request(app)
      .get("/doctors")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ doctors });
  });

  test("works for admins", async () => {
    const resp = await request(app)
      .get("/doctors")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({doctors});
  });
  
  test("unauth for a none user", async () => {
    const resp = await request(app)
        .get("/doctors");
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /doctors/name */
describe("GET /doctors/name", () => {
  test("works for logged in user", async () => {
    const doctor = {
      id: expect.any(Number),
      first_name: 'd1',
      last_name: 'test1',
      email: 'd1@test.com'
    };
    const resp = await request(app)
      .get("/doctors/name")
      .send({
        fName: 'd1',
        lName: 'test1'
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({doctor});
  });

  test("works for logged in admin", async () => {
    const doctor = {
      id: expect.any(Number),
      first_name: 'd1',
      last_name: 'test1',
      email: 'd1@test.com'
    };
    const resp = await request(app)
      .get("/doctors/name")
      .send({
        fName: 'd1',
        lName: 'test1'
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({doctor});
  });

  test("unauth for a none user", async () => {
    const resp = await request(app)
      .get("/doctors/name")
      .send({
        fName: 'd1',
        lName: 'test1'
      })
    expect(resp.statusCode).toEqual(401);
  });
  
  test("not found if doctor not found", async () => {
    const resp = await request(app)
      .get("/doctors/name")
      .send({
        fName: 'nope',
        lName: 'nope'
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** GET /doctors/name/appts */
describe("GET /doctors/name/appts", () => { 
  const appts = [
      {
        id: expect.any(Number),
        patient_first_name: 'ptest1',
        patient_last_name: 'test1',
        appt_date: '2022-01-09T08:00:00.000Z',
        appt_time: '10:00:00',
        kind: 'Follow-up',
        doctorfname: 'd1',
        doctorlname: 'test1'
      },
    ];
  test("works for logged in user", async () => {
    const resp = await request(app)
      .get("/doctors/name/appts")
      .send({
        fName: 'd1',
        lName: 'test1'
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ appts});
  });
  test("works for Admin ", async () => {
    const resp = await request(app)
      .get("/doctors/name/appts")
      .send({
        fName: 'd1',
        lName: 'test1'
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ appts});
  });
  
  test("unauth for a none user", async () => {
    const resp = await request(app)
      .get("/doctors/name/appts")
      .send({
        fName: 'd1',
        lName: 'test1'
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async () => {
    const resp = await request(app)
      .get("/doctors/name/appts")
      .send({
        doctor_First_Name: "d1",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
});
});

/************************************** GET /doctors/name/appts/date */
describe("GET /doctors/name/appts/date", () => { 
  const appts = [
      {
        id: expect.any(Number),
        patient_first_name: 'ptest1',
        patient_last_name: 'test1',
        appt_date: '2022-01-09T08:00:00.000Z',
        appt_time: '10:00:00',
        kind: 'Follow-up',
        doctorfname: 'd1',
        doctorlname: 'test1'
      },
    ];
  test("works for logged in user", async () => {
    const resp = await request(app)
      .get("/doctors/name/appts")
      .send({
        fName: 'd1',
        lName: 'test1',
        date:'2022-01-09'
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ appts});
  });
  test("works for Admin ", async () => {
    const resp = await request(app)
      .get("/doctors/name/appts")
      .send({
        fName: 'd1',
        lName: 'test1',
        date:'2022-01-09'
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ appts});
  });
  
  test("unauth for a none user", async () => {
    const resp = await request(app)
      .get("/doctors/name/appts")
      .send({
        fName: 'd1',
        lName: 'test1',
        date:'2022-01-09'
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async () => {
    const resp = await request(app)
      .get("/doctors/name/appts")
      .send({
        doctor_First_Name: "d1",
        date:'2022-01-09'
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /doctors/:id */
describe("GET /doctors/:id", () => {
    const doctor = {
    id: expect.any(Number),
    first_name: 'd1',
    last_name: 'test1',
    email: 'd1@test.com'
  };
  test("works for logged in user", async () => {
    const resp = await request(app)
        .get(`/doctors/${testDocIds[0]}`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({doctor});
  });

  test("works for logged in user", async () => {
    const resp = await request(app)
        .get(`/doctors/${testDocIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({doctor});
  });
  
  test("unauth for a none user", async () => {
    const resp = await request(app)
        .get(`/doctors/${testDocIds[0]}`)
    expect(resp.statusCode).toEqual(401);
  });
  
  test("not found if doctor not found", async () => {
    const resp = await request(app)
        .get(`/doctors/99`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** GET /doctors/:id/appts */
describe("GET /doctors/:id/appts", () => { 
  
  
  test("works for logged in user", async () => {
    const appts = [
      {
      id: expect.any(Number),
      doctor_id:testDocIds[0],
      patient_first_name: 'ptest1',
      patient_last_name: 'test1',
      appt_date: '2022-01-09T08:00:00.000Z',
      appt_time: '10:00:00',
      kind: 'Follow-up',
      },
  ];
    const resp = await request(app)
      .get(`/doctors/${testDocIds[0]}/appts`)
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({appts} );
  });

 test("works for Admin", async () => {
    const appts = [
      {
      id: expect.any(Number),
      doctor_id:testDocIds[0],
      patient_first_name: 'ptest1',
      patient_last_name: 'test1',
      appt_date: '2022-01-09T08:00:00.000Z',
      appt_time: '10:00:00',
      kind: 'Follow-up',
      },
  ];
    const resp = await request(app)
      .get(`/doctors/${testDocIds[0]}/appts`)
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.body).toEqual({appts} );
  });
  
  test("unauth for a none user", async () => {
    const resp = await request(app)
      .get(`/doctors/${testDocIds[0]}/appts`)
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if doctor not found", async () => {
    const resp = await request(app)
        .get(`/doctors/99/appts`)
        .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});



/************************************** GET /doctors/:id/appts/date */
describe("GET /doctors/:id/appts/date", () => { 
  
  
  test("works for logged in user", async () => {
    const appts = [
      {
      id: expect.any(Number),
      doctor_id:testDocIds[0],
      patient_first_name: 'ptest1',
      patient_last_name: 'test1',
      appt_date: '2022-01-09T08:00:00.000Z',
      appt_time: '10:00:00',
      kind: 'Follow-up',
      },
  ];
    const resp = await request(app)
      .get(`/doctors/${testDocIds[0]}/appts`)
      .send({date:'2022-01-09'})
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.body).toEqual({appts} );
  });

  
  test("works for Admin", async () => {
    const appts = [
      {
      id: expect.any(Number),
      doctor_id:testDocIds[0],
      patient_first_name: 'ptest1',
      patient_last_name: 'test1',
      appt_date: '2022-01-09T08:00:00.000Z',
      appt_time: '10:00:00',
      kind: 'Follow-up',
      },
  ];
    const resp = await request(app)
      .get(`/doctors/${testDocIds[0]}/appts`)
      .send({date:'2022-01-09'})
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.body).toEqual({appts} );
  });
  
  test("unauth for a none user", async () => {
    const resp = await request(app)
      .get(`/doctors/${testDocIds[0]}/appts`)
      .send({date:'2022-01-09'})
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if doctor not found", async () => {
    const resp = await request(app)
      .get(`/doctors/99/appts`)
      .send({date:'2022-01-09'})
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** POST / doctor */
describe("POST /appts", () => {
  test("works for logged in users ", async () => {
    const resp = await request(app)
        .post("/doctors")
        .send({
    fName: "newDoctor",
    lName: "test1New",
    email:'new@new.com'
    })
    .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      doctor: {
        id: expect.any(Number),
        first_name: "newDoctor",
        last_name: "test1New",
        email:'new@new.com'
      }
    });
  });

    test("works for logged in users ", async () => {
    const resp = await request(app)
        .post("/doctors")
        .send({
    fName: "newDoctor",
    lName: "test1New",
    email:'new@new.com'
    })
    .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      doctor: {
        id: expect.any(Number),
        first_name: "newDoctor",
        last_name: "test1New",
        email:'new@new.com'
      }
    });
    });
  test("unauth for a none user", async () => {
      const resp = await request(app)
        .post("/doctors")
        .send({
          fName: "newDoctor",
          lName: "test1New",
          email: 'new@new.com'
        });
    expect(resp.statusCode).toEqual(401);
  });
  
  test("bad request if missing data", async () => {
    const resp = await request(app)
      .post("/doctors")
      .send({
        fName: "newDoctor",
        lName: "test1New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
  
test("bad request if invalid data", async () => {
  const resp = await request(app)
      .post("/doctors")
        .send({
          fName: "newDoctor",
          lName: "test1New",
          email: 'invalid email'
        })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
});
  
  
  test("bad request if duplicate doc", async () => {
    await request(app)
        .post("/doctors")
        .send({
          fName: "newDoctor",
          lName: "test1New",
          email: 'invalid email'
        })
        .set("authorization", `Bearer ${u1Token}`);
    const resp = await request(app)
        .post("/doctors")
        .send({
          fName: "newDoctor",
          lName: "test1New",
          email: 'invalid email'
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /doctor/:id */

describe("DELETE /doctors/:id", () => {
  
  test("works for logged in users", async () => {
    const resp = await request(app)
        .delete(`/doctors/${testDocIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({  message: "Doctor deleted" });
  });

  test("works for logged in users", async () => {
    const resp = await request(app)
        .delete(`/doctors/${testDocIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({  message: "Doctor deleted" });
  });

  test("unauth for a none user", async () => {
    const resp = await request(app)
      .delete(`/doctors/${testDocIds[0]}`)
    expect(resp.statusCode).toEqual(401);
  });

   test("not found if doctor doesn't exist", async () => {
    const resp = await request(app)
      .delete(`/doctors/99`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /doctors/:id */

describe("PATCH /doctors/:id", () => {
  test("works for Admin", async () => {
    const doctor = {
      id: expect.any(Number),
      first_name: 'updated first Name',
      last_name: 'updated last Name',
      email: 'updated@updated.com'
    };
    const resp = await request(app)
      .patch(`/doctors/${testDocIds[0]}`)
      .send({
        fName: "updated first Name",
        lName: "updated last Name",
        email:"updated@updated.com"
        })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ doctor });
  });

  test("unauth for none admin", async () => {
    const doctor = {
      id: expect.any(Number),
      first_name: 'updated first Name',
      last_name: 'updated last Name',
      email: 'updated@updated.com'
    };
    const resp = await request(app)
      .patch(`/doctors/${testDocIds[0]}`)
      .send({
        fName: "updated first Name",
        lName: "updated last Name",
        email:"updated@updated.com"
        })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for a none user", async () => {
    const resp = await request(app)
      .patch(`/doctors/${testDocIds[0]}`)
      .send({
        fName: "updated first Name",
        lName: "updated last Name",
        email: "updated@updated.com"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such doctor", async () => {
    const resp = await request(app)
      .patch(`/doctors/99`)
      .send({
        fName: "updated first Name",
        lName: "updated last Name",
        email: "updated@updated.com"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
  
  test("bad request if invalid data", async () => {
    const resp = await request(app)
      .patch(`/doctors/${testDocIds[1]}`)
      .send({
        fName: "updated first Name",
        lName: "updated last Name",
        email: "in valid email"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});