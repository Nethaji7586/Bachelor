const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");

// CREATE JOB
router.post("/create", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      location,
      phone,
      duration,
      membersNeeded,
      hours // 👈 how many hours job should exist
    } = req.body;

    // Validation
    if (!title || !salary || !location || !phone || !duration || !membersNeeded || !hours) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const job = new Job({
      title,
      description,
      salary,
      location,
      phone,
      duration,
      membersNeeded,
      userId: req.user.id,
      expiresAt
    });

    await job.save();

    res.json({ msg: "Job posted successfully", job });

  } catch (err) {
    res.status(500).send("Server error");
  }
});
// GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name phone");

    res.json(jobs);
  } catch {
    res.status(500).send("Server error");
  }
});


// APPLY JOB
router.post("/apply/:jobId", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // ❌ Already applied check
    if (job.appliedUsers.includes(req.user.id)) {
      return res.status(400).json({ msg: "Already applied" });
    }

    // ❌ Limit check
    if (job.membersApplied >= job.membersNeeded) {
      return res.status(400).json({ msg: "Job full" });
    }

    // ✅ Apply
    job.appliedUsers.push(req.user.id);
    job.membersApplied += 1;

    await job.save();

    res.json({ msg: "Applied successfully" });

  } catch {
    res.status(500).send("Server error");
  }
});




// LOCATION SEARCH + SUGGESTION
router.get("/search", async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ msg: "Location query required" });
    }

    // 🔍 Find matching jobs
    const jobs = await Job.find({
      location: { $regex: location, $options: "i" }
    }).limit(10);

    // 🎯 Extract unique location suggestions
    const suggestions = await Job.distinct("location", {
      location: { $regex: location, $options: "i" }
    });

    res.json({
      suggestions,
      jobs
    });

  } catch {
    res.status(500).send("Server error");
  }
});


router.delete("/delete/:jobId", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // 🔐 Check owner
    if (job.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await job.deleteOne();

    res.json({ msg: "Job deleted successfully" });

  } catch (err) {
    res.status(500).send("Server error");
  }
});



// GET MY JOBS WITH APPLICANTS
router.get("/my-jobs", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("appliedUsers", "name email phone");

    res.json(jobs);

  } catch (err) {
    res.status(500).send("Server error");
  }
});
module.exports = router;