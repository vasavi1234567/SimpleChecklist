const express = require('express');
const app = express();

app.use(express.json());

// API endpoint for evaluation of checklist
app.post('/checklist', (req, res) => {
    const { valuationFeePaid, ukResident, riskRatingMedium, loanRequired, purchasePrice } = req.body;

    if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ error: "Invalid data" });
    }
    if (!loanRequired || !purchasePrice || purchasePrice === 0) {
        return res.status(400).json({ error: "loanRequired and purchasePrice cannot be zero." });
    }

    // LTV (Loan To Value) Calculation
    const LTV = (loanRequired / purchasePrice) * 100;

    // Checklist conditions
    const checklist = [
        { id: 1, name: "Valuation Fee Paid", condition: valuationFeePaid === true },
        { id: 2, name: "UK Resident", condition: ukResident === true },
        { id: 3, name: "Risk Rating Medium", condition: riskRatingMedium === "Medium" },
        { id: 4, name: "LTV Below 60%", condition: LTV < 60 }
    ];

    const results = checklist.map((item) => ({
        id: item.id,
        name: item.name,
        valid: item.condition
    }));

    res.json({ data: req.body, results });
});

app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});

app.get('/', (req, res) => {
    res.send("I'm the Checklist API!");
});
