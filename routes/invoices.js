const express = require("express");
const router = new express.Router();
const db = require("../db"); // import your pg Client



router.get('/', async (req, res, next) => {
    try {
        const result = await db.query("SELECT id, comp_code FROM invoices");
        return res.json({ invoices: result.rows }); // key part
      } catch (err) {
        return next(err);
      }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await db.query("SELECT * FROM invoices WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Invoice not found" });
        }
        return res.json({ invoice: result.rows[0] });
      } catch (err) {
        return next(err);
      }
});

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const result = await db.query(
            "INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date",
            [comp_code, amt]);

        return res.status(201).json({ invoice: result.rows[0] });

    } catch (err) {
        return next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const result = await db.query(
            "UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING id, comp_code, amt, paid, add_date, paid_date",
            [amt, id]);
            if (result.rows.length === 0) {
            return res.status(404).json({ error: "Invoice not found" });
          }
          return res.json({ invoice: result.rows[0] });
         } catch (err) {
        return next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query("DELETE FROM invoices WHERE id = $1 RETURNING id", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Invoice not found" });
          }
          return res.json({ status: "deleted" });
    } catch (err) {
        return next(err);
    }
});
module.exports = router;