const request = require("supertest");
const app = require("../app"); 
const db = require("../db"); 
const { describe } = require("node:test");

beforeEach(async () => {
    await db.query("DELETE FROM companies");   
});

afterAll(async () => {
    await db.end();                            
});


describe('My Test Suite', () => {
    it('My Test Case', () => {
      expect(true).toEqual(true);
    });
  });

  describe("GET /companies", () => {
    test("responds with list of companies", async () => {
      const resp = await request(app).get("/companies");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        companies: expect.any(Array)
      });
    });
  });

  describe("POST /companies", () => {
    test("creates a new company", async () => {
      const resp = await request(app)
        .post("/companies")
        .send({ code: "apple", name: "Apple Computer", description: "Maker of OSX." });
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        company: { code: "apple", name: "Apple Computer", description: "Maker of OSX." }
      });
    });
  });

  describe("PUT /companies/:code", () => {
    test("updates a single company", async () => {

        await db.query(`
            INSERT INTO companies (code, name, description)
            VALUES ('apple', 'Apple Computer', 'Maker of OSX.')
        `);


      const resp = await request(app)
        .put("/companies/apple")
        .send({ name: "Apple Computer, Inc.", description: "Maker of iPhone, iPad, and Mac." });
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        company: { code: "apple", name: "Apple Computer, Inc.", description: "Maker of iPhone, iPad, and Mac." }
      });
    });

    test("responds with 404 if company cannot be found", async () => {
        const resp = await request(app).put("/companies/notreal").send({
            name: "Doesn't Matter",
            description: "No company"
        });
        expect(resp.statusCode).toBe(404);
    });
});

describe("DELETE /companies/:code", () => {
    test("deletes a single company", async () => {
        await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.')
        `);
        const resp = await request(app).delete("/companies/apple");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Company deleted" });
        ;
        });
    test("responds with 404 if company cannot be found", async () => {
        const resp = await request(app).delete("/companies/notreal");
        expect(resp.statusCode).toBe(404);
        });
 });

describe("GET /invoices", () => {
test("responds with list of invoices", async () => {
    const resp = await request(app).get("/invoices");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
    invoices: expect.any(Array)
    });
});
});

describe("POST /invoices", () => {
test("creates a new invoice", async () => {

    await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.')
    `);

    const resp = await request(app)
    .post("/invoices")
    .send({ comp_code: "apple", amt: 100 });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
    invoice: { id: expect.any(Number), comp_code: "apple", amt: 100, paid: false, add_date: expect.any(String), paid_date: null }
    });
});
});

describe("PUT /invoices/:id", () => {
test("updates a single invoice", async () => {
    
    // first seed the company 
    await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.')
    `);

    // second seed the invoice
    const result = await db.query(`
        INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
        VALUES ('apple', 100, false, '2023-06-01', null)
        RETURNING id
        `);
    const invoiceId = result.rows[0].id;

    // third update the invoice


    const resp = await request(app)
        .put(`/invoices/${invoiceId}`)
        .send({ amt: 200, paid: true });
    expect(resp.statusCode).toBe(200); 
    expect(resp.body).toEqual({
        invoice: { 
            id: invoiceId, 
            comp_code: "apple", 
            amt: 200, 
            paid: true,
            add_date: expect.any(String),
            paid_date: expect.any(String)
        }
    });
});
test("responds with 404 if invoice cannot be found", async () => {
    const resp = await request(app).put("/invoices/99999").send({ amt: 200, paid: true });
    expect(resp.statusCode).toBe(404);
});
});

describe("DELETE /invoices/:id", () => {
test("deletes a single invoice", async () => {

    await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.')
        `);
        const result = await db.query(`
            INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
            VALUES ('apple', 100, false, '2023-06-01', null)
            RETURNING id
            `);

    const invoiceId = result.rows[0].id;
    const resp = await request(app).delete(`/invoices/${invoiceId}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ status: "deleted",
        });
     });

test("responds with 404 if invoice cannot be found", async () => {
        const resp = await request(app).delete("/invoices/99999");
        expect(resp.statusCode).toBe(404);
    });
    });
