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
        const paid = req.body.paid === true || req.body.paid === "true";

        const currResult = await db.query(
            "SELECT paid, paid_date FROM invoices WHERE id = $1",
            [id]
        );
        if (currResult.rows.length === 0) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        let paidDate;
        const currPaid = currResult.rows[0].paid;

        if (!currPaid && paid) {
            paidDate = new Date();
        } else if (currPaid && !paid) {
            paidDate = null;
        } else {
            paidDate = currResult.rows[0].paid_date;
        }

        const result = await db.query(
            `UPDATE invoices 
             SET amt = $1, paid = $2, paid_date = $3
             WHERE id = $4
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, paid, paidDate, id]
        );

        return res.json({ invoice: result.rows[0] });

    } catch (err) {
        console.error("PUT /invoices ERROR:", err);
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