// Student Modular Routes (Express Router)
const express = require("express");
const router = express.Router();
// Import in-memory student data
const students = require("../data/students");
// 1. GET ALL STUDENTS
// GET /students
// Status: 200 OK
router.get("/", (req, res) => {
  res.status(200).json(students);
});
// 2. GET STUDENT BY ID
// GET /students/:id
// Status: 200 OK (Found) | 404 Not Found
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({
      message: "Student Not Found"
    });
  }
  res.status(200).json(student);
});
// 3. CREATE NEW STUDENT
// POST /students
// Status: 201 Created | 400 Bad Request
router.post("/", (req, res) => {
  const { name, course } = req.body;
  // Validation: Check if required fields are provided
  if (!name || !course) {
    return res.status(400).json({
      message: "Bad Request: Name and course are required"
    });
  }
  // Generate new ID based on current highest ID
  const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
  const newStudent = {
    id: newId,
    name: name.trim(),
    course: course.trim()
  };
  students.push(newStudent);
  res.status(201).json({
    message: "New Student Created Successfully",
    student: newStudent
  });
});
// 4. UPDATE STUDENT BY ID
// PUT /students/:id
// Status: 200 OK | 400 Bad Request | 404 Not Found
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  // Check if student exists
  if (!student) {
    return res.status(404).json({
      message: "Student Not Found"
    });
  }
  const { name, course } = req.body;
  // Validation: At least one field should be provided for update
  if (!name && !course) {
    return res.status(400).json({
      message: "Bad Request: Please provide name or course to update"
    });
  }
  // Update fields if provided
  if (name) student.name = name.trim();
  if (course) student.course = course.trim();
  res.status(200).json({
    message: "Student Updated Successfully",
    student: student
  });
});
// 5. DELETE STUDENT BY ID
// DELETE /students/:id
// Status: 200 OK | 404 Not Found
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);
  // Check if student exists
  if (index === -1) {
    return res.status(404).json({
      message: "Student Not Found"
    });
  }
  // Remove student from in-memory array using splice()
  const deletedStudent = students.splice(index, 1)[0];
  res.status(200).json({
    message: "Student Deleted Successfully",
    student: deletedStudent
  });
});
module.exports = router;
