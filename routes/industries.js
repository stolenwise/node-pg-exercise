const express = require("express");
const router = new express.Router();
const db = require("../db"); // import your pg Client


router.get('/', async (req, res, next) => {
    try {
        const result = await db.query("SELECT * FROM industries");
        return res.json({ industries: result.rows }); // key part
      } catch (err) {
        return next(err);
      }
});

router.post('/', async (req, res, next) => {
    try {
        const { code, industry } = req.body;
        const result = await db.query(
            "INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry",
            [code, industry]); 
            return res.status(201).json({ industry: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;

router.post('/industries/:industry_code/companies', async (req, res, next) => {
    try {
        const { industry_code, company_code } = req.body;
        await db.query(
            "INSERT INTO companies_industries (industry_code, company_code) VALUES ($1, $2) RETURNING industry_code, company_code",
            [company_code, industry_code]);
            return res.json({ message: `Added ${company_code} to ${industry_code}` })
    } catch (err) {
        return next(err);
    }
});