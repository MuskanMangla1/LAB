// routes/patient.route.js
import express from "express";
import Patient from "../models/patient.model.js";

const router = express.Router();

// Create new patient
router.post("/", async (req, res) => {
  try {
    const { name, age, sex, mobile, tests, totalAmount, paidAmount, paymentMode, date } = req.body;

    if (!name || !age || !sex || !mobile) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Validate tests array
    let testsList = [];
    if (Array.isArray(tests) && tests.length > 0) {
      testsList = tests.map(t => ({
        testName: t.testName,
        price: Number(t.price) || 0
      }));
    }

    // Calculate totals
    const calculatedTotal = testsList.reduce((sum, t) => sum + (t.price || 0), 0);
    const finalTotal = typeof totalAmount === "number" && totalAmount >= 0 ? totalAmount : calculatedTotal;
    const finalPaid = typeof paidAmount === "number" && paidAmount >= 0 ? paidAmount : 0;
    const pendingAmount = Math.max(0, finalTotal - finalPaid);

    const patient = new Patient({
      name,
      age,
      sex,
      mobile,
      tests: testsList,
      totalAmount: finalTotal,
      paidAmount: finalPaid,
      pendingAmount,
      paymentMode: paymentMode || "Cash",
      // If client provides date, use it, otherwise current datetime
      date: date ? new Date(date) : new Date()
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helpers: compute totals from patient list
const computeStats = (patients) => {
  const totalRevenue = patients.reduce((s, p) => s + (p.totalAmount || 0), 0);
  const totalPaid = patients.reduce((s, p) => s + (p.paidAmount || 0), 0);
  const totalPending = patients.reduce((s, p) => s + ((p.totalAmount || 0) - (p.paidAmount || 0)), 0);
  const totalTestsCount = patients.reduce((s, p) => s + (p.tests?.length || 0), 0);
  return { totalRevenue, totalPaid, totalPending, totalTestsCount, count: patients.length };
};

// backend /daily route
// Daily report (current day)
router.get("/daily", async (req, res) => {
  try {
    const now = new Date();

    // Local timezone ke hisaab se start and end of day
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const patients = await Patient.find({ date: { $gte: startOfDay, $lte: endOfDay } });
    const stats = computeStats(patients);

    res.json({ 
      date: startOfDay.toISOString().slice(0, 10), 
      stats, 
      patients 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update patient by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Normalize date if provided
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    const patient = await Patient.findByIdAndUpdate(id, updates, { new: true });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Monthly report (current calendar month)
router.get("/monthly", async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const patients = await Patient.find({ date: { $gte: firstDay, $lt: nextMonthFirst } });
    const stats = computeStats(patients);
    res.json({ month: now.getMonth() + 1, year: now.getFullYear(), stats, patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Range report: /api/patients/range?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: "start and end query params required (YYYY-MM-DD)" });
    }

    const startDate = new Date(start);
    startDate.setHours(0,0,0,0);
    const endDate = new Date(end);
    endDate.setHours(23,59,59,999);

    const patients = await Patient.find({ date: { $gte: startDate, $lte: endDate } });
    const stats = computeStats(patients);
    res.json({ start: startDate.toISOString().slice(0,10), end: endDate.toISOString().slice(0,10), stats, patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
