const express = require("express");
const router = new express.Router();
const db = require("../db"); // import your pg Client

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query("SELECT code, name FROM companies");
        return res.json({ companies: result.rows }); // key part
      } catch (err) {
        return next(err);
      }
});

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query("SELECT code, name, description FROM companies WHERE code = $1", [code]);
    
    if ( result.rows.length === 0) {
        return res.status(404).json({ error: "Company not found" });
    }
    return res.json({ company: result.rows[0] });
    } catch (err) {
        return next(err);
    }

});

router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const result = await db.query(
            "INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description", 
            [code, name, description]);
        
        return res.status(201).json({ company: result.rows[0] });
   
    } catch (err) {
        return next(err);
    }
});



module.exports = router;