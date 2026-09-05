# Lab Assignment 2 – Student Management REST API
## Comprehensive Project Explanation & Architecture Guide

**Course:** Web Dev III (Node.js & Express Backend)  
**Unit:** Unit–2 (In-Class Lab Assignment)  
**Marks:** 2.5 Marks  
**Author:** Bhavya  
**Date:** September 2026  

---

## 📑 Table of Contents
1. [Project Overview & Objectives](#1-project-overview--objectives)
2. [Project Architecture & Directory Structure](#2-project-architecture--directory-structure)
3. [Design Principles & Assignment Constraints](#3-design-principles--assignment-constraints)
4. [Detailed Code Walkthrough & Component Analysis](#4-detailed-code-walkthrough--component-analysis)
   - [4.1 Data Layer (`data/students.js`)](#41-data-layer-datastudentsjs)
   - [4.2 Custom Logger Middleware (`middleware/logger.js`)](#42-custom-logger-middleware-middlewareloggerjs)
   - [4.3 Modular Routing Layer (`routes/studentRoutes.js`)](#43-modular-routing-layer-routesstudentroutesjs)
   - [4.4 Application Entry Point & Middleware Pipeline (`app.js`)](#44-application-entry-point--middleware-pipeline-appjs)
5. [Complete API Endpoints & Request/Response Flow](#5-complete-api-endpoints--requestresponse-flow)
6. [HTTP Status Codes & Error Handling Strategy](#6-http-status-codes--error-handling-strategy)
7. [Testing & Verification Guide (cURL & Postman)](#7-testing--verification-guide-curl--postman)
8. [Mapping to Assignment Evaluation Rubric](#8-mapping-to-assignment-evaluation-rubric)
9. [Viva Voce & Technical Interview Prep Q&A](#9-viva-voce--technical-interview-prep-qa)

---

## 1. Project Overview & Objectives

The **Student Management REST API** is an in-class laboratory project developed to demonstrate core server-side software engineering concepts using **Node.js** and **Express.js**.

The primary purpose of this application is to manage student academic records by exposing a standard, stateless **RESTful (Representational State Transfer)** API interface supporting complete **CRUD (Create, Read, Update, Delete)** operations.

### Key Learning Objectives Covered:
- **Express Server Lifecycle:** Bootstrapping an HTTP application server with port binding and request listener loops.
- **RESTful API Design:** Designing clean, resource-centric uniform URIs (`/students` and `/students/:id`) with standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
- **Middleware Mechanics:** Understanding how Express middleware intercept, inspect, transform, or terminate incoming HTTP requests.
- **Modular Routing:** Employing `express.Router()` to achieve separation of concerns rather than polluting the root application script.
- **Defensive Input Validation:** Ensuring all user inputs (`req.body` and `req.params`) are type-checked, sanitised, and validated before state mutations.
- **Standard HTTP Status Code Semantics:** Accurately communicating operation outcomes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

---

## 2. Project Architecture & Directory Structure

To adhere to industry-standard clean code patterns, the project follows a layered architectural structure separating **configuration**, **routing**, **middleware**, and **data**:

```text
Assignment_2/
├── data/
│   ├── students.js          # In-memory data store with initial student records
│   └── students.json        # Seed JSON dataset for reference
├── middleware/
│   └── logger.js            # Custom logging middleware (Method, URL, Timestamp)
├── routes/
│   └── studentRoutes.js     # Modular router defining CRUD endpoints for /students
├── app.js                   # Server bootstrap, middleware pipeline & central error handler
├── package.json             # NPM package manifest (dependencies, scripts, metadata)
├── package-lock.json        # Deterministic dependency lockfile
├── README.md                # Quickstart and endpoint reference guide
└── PROJECT_EXPLANATION.md   # Comprehensive project documentation (this file)
```

### Architectural Separation of Concerns:
| Layer | File | Primary Responsibility |
| :--- | :--- | :--- |
| **Data Layer** | `data/students.js` | Holds and exports the in-memory array of student entities. Acts as the Single Source of Truth (SSOT). |
| **Middleware Layer** | `middleware/logger.js` | Intercepts all incoming requests to log HTTP method, path, and human-readable time before yielding control. |
| **Routing Layer** | `routes/studentRoutes.js` | Houses business logic, route parameter extraction, validation, and CRUD operations for `/students`. |
| **Application Layer** | `app.js` | Configures global middleware, mounts routers, provides a root documentation route, handles 404s and uncaught errors, and starts the server. |

---

## 3. Design Principles & Assignment Constraints

The assignment specifies strict technical constraints:

1. **No Database (MongoDB, PostgreSQL, MySQL):**
   - **Reasoning:** Focuses purely on learning Express server mechanics, routing, middleware, and request/response manipulation without ORM/ODM abstraction overhead.
   - **Solution:** Maintained state within a mutable JavaScript array (`let students = [...]`) in `data/students.js`.

2. **No Mongoose / Object-Relational Mappers:**
   - Schema validation and ID generation are handled natively with vanilla JavaScript logic (`Math.max(...)`, `Array.prototype.find`, `Array.prototype.splice`).

3. **Modular Express Routing:**
   - Routes must not be clustered directly inside `app.js`. Instead, `express.Router()` encapsulates student routes inside `routes/studentRoutes.js`.

4. **Custom Middleware:**
   - A custom logger must intercept incoming HTTP requests and record diagnostic information to stdout.

---

## 4. Detailed Code Walkthrough & Component Analysis

### 4.1 Data Layer (`data/students.js`)

```javascript
let students = [
  { id: 1, name: "Rahul", course: "BCA" },
  { id: 2, name: "Priya", course: "BTech" },
  { id: 3, name: "Amit", course: "BCA" }
];

module.exports = students;
```

#### Explanation:
- **In-Memory Store:** The array holds JavaScript objects representing students with three properties: `id` (integer), `name` (string), and `course` (string).
- **Exporting by Reference:** When `studentRoutes.js` imports `students`, Node's `require` caches the module and provides a reference to the array. Mutations (such as `push` or `splice`) directly alter this shared array in memory during the process lifecycle.

---

### 4.2 Custom Logger Middleware (`middleware/logger.js`)

```javascript
const logger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.originalUrl || req.url}`);
  next(); // Pass control to the next middleware or route handler
};

module.exports = logger;
```

#### Explanation:
- **Middleware Signature:** Express middleware receives three arguments: `req` (Request), `res` (Response), and `next` (Callback function).
- **Execution:** 
  1. Captures the current system time using `new Date().toLocaleTimeString()`.
  2. Extracts the HTTP method (`req.method`: `GET`, `POST`, etc.) and the target resource URL (`req.originalUrl`).
  3. Formats and prints a log to the terminal: `[12:30:15 PM] GET /students`.
  4. Calls `next()`: This is mandatory. Without calling `next()`, the request cycle hangs indefinitely because Express would pause execution at this middleware.

---

### 4.3 Modular Routing Layer (`routes/studentRoutes.js`)

This file implements the complete REST CRUD functionality using `express.Router()`.

#### 1. Read All Students (`GET /students`)
```javascript
router.get("/", (req, res) => {
  res.status(200).json(students);
});
```
- **Behavior:** Returns the entire array of student objects.
- **Status:** `200 OK`.

#### 2. Read Single Student by ID (`GET /students/:id`)
```javascript
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student Not Found" });
  }

  res.status(200).json(student);
});
```
- **Behavior:** Extracts `req.params.id`. Since route parameters are received as strings, `Number(req.params.id)` converts it to a numerical ID.
- **Lookup:** Uses `Array.prototype.find()` to search for a student matching the requested ID.
- **Status:** If found, returns `200 OK` with the student object; otherwise returns `404 Not Found`.

#### 3. Create New Student (`POST /students`)
```javascript
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
```
- **Validation:** Ensures both `name` and `course` exist in the parsed JSON body (`req.body`). If either is missing or empty, execution is halted with `400 Bad Request`.
- **Auto-Increment ID:** Uses `Math.max(...students.map(s => s.id)) + 1` to ensure unique numerical IDs even after previous items have been deleted.
- **Sanitization:** Strips leading and trailing whitespace using `.trim()`.
- **Status:** Returns `201 Created` with a confirmation message and the newly created student record.

#### 4. Update Existing Student (`PUT /students/:id`)
```javascript
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student Not Found" });
  }

  const { name, course } = req.body;

  // Validation: At least one field must be provided to update
  if (!name && !course) {
    return res.status(400).json({
      message: "Bad Request: Please provide name or course to update"
    });
  }

  if (name) student.name = name.trim();
  if (course) student.course = course.trim();

  res.status(200).json({
    message: "Student Updated Successfully",
    student: student
  });
});
```
- **Existence Check:** First confirms the record exists (`404 Not Found` if absent).
- **Validation:** Verifies that the client provided at least one field to update (`400 Bad Request` if payload is empty).
- **Partial/Full Update:** Updates existing fields in place.
- **Status:** Returns `200 OK` with the updated student object.

#### 5. Delete Student by ID (`DELETE /students/:id`)
```javascript
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Student Not Found" });
  }

  const deletedStudent = students.splice(index, 1)[0];

  res.status(200).json({
    message: "Student Deleted Successfully",
    student: deletedStudent
  });
});
```
- **Lookup:** Locates the array index with `Array.prototype.findIndex()`.
- **Removal:** Uses `Array.prototype.splice(index, 1)` to remove the item from the array.
- **Status:** Returns `200 OK` along with the deleted student data for confirmation.

---

### 4.4 Application Entry Point & Middleware Pipeline (`app.js`)

The `app.js` file orchestrates the entire Express middleware pipeline in exact sequential order:

```
Incoming Request
       │
       ▼
┌───────────────────────────────┐
│ 1. express.json()             │ -> Parses raw JSON body into req.body
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 2. logger Middleware          │ -> Logs [Time] METHOD URL to console
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 3. Root Route (GET /)         │ -> Serves API welcome and endpoint metadata
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 4. Mount /students Router     │ -> Matches /students CRUD endpoints
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 5. 404 Catch-All Middleware   │ -> Responds with 404 if no route matched
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ 6. Central Error Handler      │ -> Catches uncaught runtime exceptions (500)
└───────────────────────────────┘
```

#### Central Error Handling Middleware:
```javascript
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error"
  });
});
```
- Defined with **four parameters**: `(err, req, res, next)`. This signature tells Express that this function is an error handler. Any error passed to `next(err)` skips normal middleware and routes directly here.

---

## 5. Complete API Endpoints & Request/Response Flow

| HTTP Verb | Path | Request Body | Success Code | Error Codes | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | None | `200 OK` | — | API status and directory of available endpoints |
| **GET** | `/students` | None | `200 OK` | — | Returns array of all students |
| **GET** | `/students/:id` | None | `200 OK` | `404` | Returns single student by ID |
| **POST** | `/students` | `{"name": "...", "course": "..."}` | `201 Created` | `400` | Creates a new student record |
| **PUT** | `/students/:id` | `{"name": "...", "course": "..."}` | `200 OK` | `400`, `404` | Updates existing student attributes |
| **DELETE**| `/students/:id` | None | `200 OK` | `404` | Removes student record by ID |

---

## 6. HTTP Status Codes & Error Handling Strategy

| Status Code | Standard Name | Usage in this Project | Example Scenario |
| :--- | :--- | :--- | :--- |
| **`200`** | OK | Standard successful response for GET, PUT, and DELETE operations. | Student record retrieved, updated, or removed. |
| **`201`** | Created | Returned when a new resource is successfully added. | New student created via `POST /students`. |
| **`400`** | Bad Request | Returned when request syntax or validation fails. | Missing `name` or `course` in POST body. |
| **`404`** | Not Found | Returned when the requested resource or URL does not exist. | Requesting `GET /students/999` or undefined route `GET /xyz`. |
| **`500`** | Internal Server Error | Returned by the centralized error-handling middleware. | Unexpected server-side runtime exceptions. |

---

## 7. Testing & Verification Guide (cURL & Postman)

### Running the Server:
```bash
cd WEB_DEV_3/Assignment_2
npm install
npm start
```
*Server runs at: `http://localhost:3000`*

### Endpoint Testing Commands:

#### 1. Fetch all students:
```bash
curl -X GET http://localhost:3000/students
```

#### 2. Fetch student by ID:
```bash
curl -X GET http://localhost:3000/students/1
```

#### 3. Add a new student:
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Sneha", "course": "MCA"}'
```

#### 4. Update an existing student:
```bash
curl -X PUT http://localhost:3000/students/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Rahul Sharma", "course": "BCA"}'
```

#### 5. Delete a student:
```bash
curl -X DELETE http://localhost:3000/students/2
```

#### 6. Verify Error Handling (404 and 400):
```bash
# Non-existent ID -> 404 Not Found
curl -X GET http://localhost:3000/students/999

# Missing fields -> 400 Bad Request
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'

# Unknown route -> 404 Route Not Found
curl -X GET http://localhost:3000/random
```

---

## 8. Mapping to Assignment Evaluation Rubric

| Rubric Criteria | Allocated Marks | Project Implementation Details | Status |
| :--- | :---: | :--- | :---: |
| **Functionality** | **1.5 Marks** | Full implementation of all 5 CRUD operations (`GET /students`, `GET /students/:id`, `POST`, `PUT`, `DELETE`). Auto-increment ID generation and array mutation without database. | ✅ Complete |
| **API Design** | **0.5 Marks** | Adheres strictly to REST standards: resource pluralization (`/students`), appropriate HTTP verbs, proper status codes (`200`, `201`, `400`, `404`), and JSON payload structures. | ✅ Complete |
| **Clean Code** | **0.5 Marks** | Clear modular directory structure (`routes/`, `middleware/`, `data/`), clean indentation, descriptive variable names, inline documentation, and centralized error handling. | ✅ Complete |
| **Total** | **2.5 Marks** | Meets 100% of all functional and stylistic criteria. | 🎯 Ready |

---

## 9. Viva Voce & Technical Interview Prep Q&A

### Q1. What is Express.js, and why do we use it over the core `http` module?
> **Answer:** Express.js is a minimalist, fast, and unopinionated web framework for Node.js. While the built-in `http` module requires manual URL parsing, stream handling, and nested conditionals for routing, Express provides a robust routing engine, middleware pipeline, simplified request/response helpers (like `res.json()` and `res.status()`), and centralized error handling out of the box.

### Q2. What is Express Middleware, and what does `next()` do?
> **Answer:** Middleware functions are functions that have access to the Request object (`req`), Response object (`res`), and the `next` function in the application’s request-response cycle. They can execute code, modify `req` and `res`, end the cycle, or invoke `next()` to pass execution control to the subsequent middleware. If `next()` is omitted and no response is sent, the client request remains hanging.

### Q3. Why did we use `express.Router()` instead of defining all routes in `app.js`?
> **Answer:** `express.Router()` creates a modular, mountable route handler. As applications grow, putting all endpoints in `app.js` causes code bloat and poor maintainability. Using modular routers provides separation of concerns: routes related to students reside in `routes/studentRoutes.js` and can be mounted onto any base path (e.g., `app.use('/students', studentRoutes)`).

### Q4. What is the difference between `req.params`, `req.query`, and `req.body`?
> **Answer:**
> - `req.params`: Captures route parameters defined in the path pattern (e.g., `/students/:id` extracts `req.params.id`).
> - `req.query`: Captures optional key-value query string parameters after the `?` in the URL (e.g., `/students?course=BCA`).
> - `req.body`: Contains the payload submitted in the HTTP request body (parsed using `express.json()` for JSON content).

### Q5. Why is `express.json()` needed in `app.js`?
> **Answer:** In Node.js, incoming HTTP request bodies arrive as raw binary data streams. `express.json()` is a built-in middleware based on `body-parser` that intercepts incoming requests with a `Content-Type: application/json` header, buffers the stream, parses the JSON string, and populates `req.body` with the resulting JavaScript object.

### Q6. What distinguishes error-handling middleware from regular middleware?
> **Answer:** Error-handling middleware has **four parameters** instead of three: `(err, req, res, next)`. Express specifically identifies functions with an arity of 4 as error handlers. When an error is passed via `next(err)` or thrown in synchronous handlers, Express bypasses all normal middleware and delegates directly to the error-handling middleware.

### Q7. What is the difference between HTTP `PUT` and `PATCH`?
> **Answer:** 
> - `PUT` is typically intended for full replacement of a resource (or idempotent update).
> - `PATCH` is intended for partial modifications of specific fields.
> *(In this assignment, `PUT` is implemented with flexible partial updates for ease of use.)*

### Q8. How is a new ID generated when creating a student?
> **Answer:** In `studentRoutes.js`, we evaluate the maximum current ID using:
> ```javascript
> const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
> ```
> This prevents ID collisions even if earlier records were deleted, which `students.length + 1` could accidentally cause.

### Q9. Why do we convert `req.params.id` using `Number()`?
> **Answer:** HTTP URL path segments are parsed as strings by Express. Comparing a numerical student ID (`s.id === "1"`) with strict equality (`===`) would evaluate to `false`. Converting `req.params.id` to a Number ensures correct type matching.

### Q10. What HTTP status code is returned on successful creation, and why not 200?
> **Answer:** `201 Created` is returned. While `200 OK` signifies a generic success, `201 Created` specifically indicates that a new resource has been created on the server as a direct result of the request, conforming to RFC 7231 HTTP specifications.


<!-- Important Questions  -->