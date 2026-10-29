
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Enter a valid email address",
      ],
    },

    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
      uppercase: true,
      maxlength: [30, "Roll number is too long"],
    },

    internshipId: {
      type: String,
      required: [true, "Please select an internship"],
    },

    internshipTitle: {
      type: String,
      required: [true, "Internship title is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
