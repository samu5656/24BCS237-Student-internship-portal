
const express = require("express");
const Application = require("../models/todo");

const router = express.Router();

// Available internships
const internships = [
  {
    id: "web-dev",
    title: "Frontend Web Development Intern",
    company: "TechNova Solutions",
    location: "Remote",
    duration: "3 months",
    stipend: "₹8,000/month",
    description:
      "Build responsive web interfaces using React, JavaScript, HTML and CSS.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    id: "backend",
    title: "Backend Development Intern",
    company: "CloudBridge Technologies",
    location: "Coimbatore",
    duration: "4 months",
    stipend: "₹10,000/month",
    description:
      "Develop REST APIs, implement authentication and work with databases.",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
  },
  {
    id: "ai-ml",
    title: "AI/ML Intern",
    company: "InnovateAI Labs",
    location: "Hybrid",
    duration: "3 months",
    stipend: "₹12,000/month",
    description:
      "Explore machine learning, data processing and practical AI applications.",
    skills: ["Python", "Machine Learning", "Data Analysis"],
  },
  {
    id: "fullstack",
    title: "Full Stack Developer Intern",
    company: "NextGen Digital",
    location: "Remote",
    duration: "6 months",
    stipend: "₹15,000/month",
    description:
      "Build end-to-end web applications using React, Express and MongoDB.",
    skills: ["React", "Node.js", "Express", "MongoDB"],
  },
];

// GET all internships
router.get("/internships", (req, res) => {
  res.json({ success: true, internships });
});

// GET a single internship
router.get("/internships/:id", (req, res) => {
  const internship = internships.find(
    (item) => item.id === req.params.id
  );

  if (!internship) {
    return res.status(404).json({
      success: false,
      message: "Internship not found",
    });
  }

  res.json({ success: true, internship });
});

// POST a new application
router.post("/applications", async (req, res, next) => {
  try {
    const { studentName, email, rollNumber, internshipId } = req.body;

    if (
      !studentName?.trim() ||
      !email?.trim() ||
      !rollNumber?.trim() ||
      !internshipId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const internship = internships.find(
      (item) => item.id === internshipId
    );

    if (!internship) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid internship",
      });
    }

    const application = await Application.create({
      studentName,
      email,
      rollNumber,
      internshipId: internship.id,
      internshipTitle: internship.title,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    next(error);
  }
});

// GET all submitted applications
router.get("/applications", async (req, res, next) => {
  try {
    const applications = await Application.find().sort({
      createdAt: -1,
    });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
