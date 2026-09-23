# Lab Assignment 2 – Student Management REST API

**Course:** Web Dev III (Node.js & Express Backend)  
**Unit Covered:** Unit–2 | Marks: 2.5 | In-Class Lab  
**Author:** Bhavya

---

## 📌 Project Overview
The **Student Management REST API** is a modular backend application built with **Node.js** and **Express.js**. It performs complete CRUD (Create, Read, Update, Delete) operations on in-memory student records using JSON data, custom request logger middleware, modular Express Router, and centralized error handling with standard HTTP status codes.

---

## 📁 Project Structure
```text
Assignment_2/
├── data/
│   ├── students.js          # In-memory student array for CRUD operations
│   └── students.json        # Initial seed dataset (JSON)
├── middleware/
│   └── logger.js            # Custom Logger Middleware (Logs Method, URL, Time)
├── routes/
│   └── studentRoutes.js     # Modular Express Router for /students endpoints
├── app.js                   # Express server entry point & central error handler
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation and API testing guide
```

---

## 🛠️ Features & Restrictions Implemented
- ✅ **No Database & No Mongoose:** Purely in-memory array and JSON structure.
- ✅ **Modular Routing:** Using `express.Router()` separated in `routes/studentRoutes.js`.
- ✅ **Custom Middleware:** Centralized request logger in `middleware/logger.js` logging `[Time] [METHOD] [URL]`.
- ✅ **RESTful CRUD Operations:** GET all, GET by ID, POST (create), PUT (update), and DELETE (remove).
- ✅ **Proper Status Codes & Error Handling:**
  - `200 OK`: Successful retrieval, update, or deletion.
  - `201 Created`: Successful creation of a new student.
  - `400 Bad Request`: Validation failure (missing required fields).
  - `404 Not Found`: Non-existent student ID or undefined route.
  - `500 Internal Server Error`: Central error middleware.

---

## 🚀 How to Run the Server

1. Navigate to the project directory:
   ```bash
   cd WEB_DEV_3/Assignment_2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   *The server will start at: `http://localhost:3000`*

---

## 📡 REST API Reference

| Method | Endpoint | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | API Home / Welcome & Documentation | `200 OK` |
| **GET** | `/students` | Get all student records | `200 OK` |
| **GET** | `/students/:id` | Get student by ID | `200 OK` or `404 Not Found` |
| **POST** | `/students` | Create new student (`name`, `course`) | `201 Created` or `400 Bad Request` |
| **PUT** | `/students/:id` | Update existing student | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/students/:id` | Delete student by ID | `200 OK` or `404 Not Found` |

---

## 🧪 Postman & cURL Testing Guide

### 1. View All Students
- **Method:** `GET`
- **URL:** `http://localhost:3000/students`
- **cURL:**
  ```bash
  curl -X GET http://localhost:3000/students
  ```
- **Response (200 OK):**
  ```json
  [
    { "id": 1, "name": "Rahul", "course": "BCA" },
    { "id": 2, "name": "Priya", "course": "BTech" },
    { "id": 3, "name": "Amit", "course": "BCA" }
  ]
  ```

### 2. View Student by ID
- **Method:** `GET`
- **URL:** `http://localhost:3000/students/1`
- **cURL:**
  ```bash
  curl -X GET http://localhost:3000/students/1
  ```
- **Response (200 OK):**
  ```json
  { "id": 1, "name": "Rahul", "course": "BCA" }
  ```

### 3. Create a New Student
- **Method:** `POST`
- **URL:** `http://localhost:3000/students`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "Sneha",
    "course": "MCA"
  }
  ```
- **cURL:**
  ```bash
  curl -X POST http://localhost:3000/students \
    -H "Content-Type: application/json" \
    -d '{"name": "Sneha", "course": "MCA"}'
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "New Student Created Successfully",
    "student": {
      "id": 4,
      "name": "Sneha",
      "course": "MCA"
    }
  }
  ```

### 4. Update Student by ID
- **Method:** `PUT`
- **URL:** `http://localhost:3000/students/1`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "Rahul Sharma",
    "course": "BCA"
  }
  ```
- **cURL:**
  ```bash
  curl -X PUT http://localhost:3000/students/1 \
    -H "Content-Type: application/json" \
    -d '{"name": "Rahul Sharma", "course": "BCA"}'
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Student Updated Successfully",
    "student": {
      "id": 1,
      "name": "Rahul Sharma",
      "course": "BCA"
    }
  }
  ```

### 5. Delete Student by ID
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/students/2`
- **cURL:**
  ```bash
  curl -X DELETE http://localhost:3000/students/2
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Student Deleted Successfully",
    "student": {
      "id": 2,
      "name": "Priya",
      "course": "BTech"
    }
  }
  ```

### 6. Error Handling Tests
- **Invalid ID (404 Not Found):**
  ```bash
  curl -X GET http://localhost:3000/students/999
  # Response: {"message": "Student Not Found"}
  ```
- **Missing Required Fields (400 Bad Request):**
  ```bash
  curl -X POST http://localhost:3000/students \
    -H "Content-Type: application/json" \
    -d '{"name": ""}'
  # Response: {"message": "Bad Request: Name and course are required"}
  ```
- **Undefined Route (404 Not Found):**
  ```bash
  curl -X GET http://localhost:3000/unknown
  # Response: {"message": "Route Not Found"}
  ```

---

## ⚡ One-Line Automated Test Command
Run all endpoints and verification tests sequentially:
```bash
cd "/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Assignment_2" && node app.js
```
*(Open another terminal tab to run curls or test directly in Postman!)*
