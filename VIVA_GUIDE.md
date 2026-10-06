# 🎓 FlexFit Backend - Comprehensive Viva & Presentation Master Guide

This guide is tailored specifically to your **FlexFit Fitness Class Booking Backend** codebase for your B.Tech college project presentation and viva examination.

---

## 🎤 Part 1: 2-Minute Project Presentation Script

> *"Good morning/afternoon Sir/Madam. Today I am presenting **FlexFit**, a modern, scalable RESTful backend API for a boutique fitness class booking platform built using **Node.js, Express.js, MongoDB, and Firebase Storage**.*
>
> *In traditional fitness booking systems, platforms often face race conditions during high-demand class bookings leading to overbooking, high payment processing friction for single session bookings, and weak access controls.*
>
> *To solve these challenges, I built FlexFit following the **Model-View-Controller (MVC)** design pattern:*
> 
> 1. *First, **Security & Access Control:** I implemented JWT authentication with Role-Based Access Control distinguishing **Members** and **Studios**. Passwords are encrypted using `bcryptjs` with 10 salt rounds.*
> 2. *Second, **Atomic Booking & Credits Ledger:** To prevent race conditions and eliminate payment gateway friction, members are assigned 10 pre-paid credits upon registration. Booking a class consumes 1 credit and uses an **atomic MongoDB update query** to ensure class capacity is never exceeded even under concurrent requests. Cancelling a booking instantly refunds 1 credit.*
> 3. *Third, **Media & Search Integration:** Studios can upload class banner images streamed directly to **Firebase Storage** via Multer memory storage. Members can perform case-insensitive multi-field search across titles, instructors, and categories.*
> 4. *Finally, **Architecture & Quality:** The project features input validation using `express-validator` schemas and a **Centralized Global Error Handler** that handles database errors, invalid ObjectIds, duplicate keys, and expired JWT tokens cleanly.*
>
> *Thank you, and I am now ready for your questions."*

---

## 🏛️ Part 2: Core Architecture & Systems Explanations

### 11. Explain the Complete Project Architecture
FlexFit uses the **Model-View-Controller (MVC)** architectural pattern:
* **Model Layer (`src/models/`):** Defines data schemas and database rules using Mongoose (`User.js`, `Class.js`, `Booking.js`).
* **View Layer:** Returns structured JSON API responses (`{ success: true, data: [...] }`).
* **Controller Layer (`src/controllers/`):** Contains core business logic (e.g., deducting credits, checking class capacity, atomic updates).
* **Router & Middleware Layer (`src/routes/` & `src/middleware/`):** Intercepts requests, validates inputs via `express-validator`, verifies JWT tokens, enforces role authorization, handles uploads, and catches errors globally.

---

### 12. Explain the Complete Request Flow
When a user calls `POST /api/bookings`:
1. **Express Router (`bookingRoutes.js`):** Receives the HTTP POST request.
2. **`protect` Middleware:** Extracts `Bearer <token>` from Authorization header, verifies JWT, and attaches user document to `req.user`.
3. **`authorizeRoles('member')` Middleware:** Verifies that `req.user.role === 'member'`. If not, returns `403 Forbidden`.
4. **`createBookingValidation` Middleware:** Validates that `classId` is a valid MongoDB ObjectId.
5. **`createBooking` Controller:**
   * Finds fitness class by ID.
   * Checks if member has `credits >= 1`.
   * Performs atomic MongoDB update: `Class.findOneAndUpdate({ _id: classId, $expr: { $lt: ['$bookedCount', '$capacity'] } }, { $inc: { bookedCount: 1 } })`.
   * Deducts 1 credit from user (`$inc: { credits: -1 }`).
   * Creates or updates the booking record (`status = 'confirmed'`).
6. **Response / Global Error Handler:** Returns `201 Created` JSON or passes any database error to `globalErrorHandler`.

---

### 13. Explain User-Class-Booking Relationships
* **User to Class (1-to-Many):** One `studio` user creates and owns multiple `Class` documents (`createdBy` ref to `User`).
* **User to Booking (1-to-Many):** One `member` user makes multiple `Booking` records (`user` ref to `User`).
* **Class to Booking (1-to-Many):** One `Class` has multiple `Booking` records (`class` ref to `Class`).
* **Booking Junction Entity:** `Booking` acts as a many-to-many relationship junction connecting `User` and `Class` with extra state (`status: 'confirmed' | 'cancelled'`, `bookingDate`).

---

### 14. Explain Why MongoDB Was Used
1. **Schema Flexibility & JSON Alignment:** Stores data directly as JSON-like BSON documents, which naturally matches JavaScript Node.js objects.
2. **Atomic In-Place Updates:** Supports `$inc` and `$expr` operators for safe atomic increment/decrement of credits and class seats without requiring heavy SQL table locks.
3. **Mongoose ODM Support:** Provides strong typing, virtual fields (`availableSlots`), hooks, and validation.

---

### 15. Explain Why JWT Was Used
1. **Stateless Authentication:** Server does not store session IDs in memory or database; all user identity data (`id`, `role`) is stored inside the cryptographically signed JWT string.
2. **Scalability:** Easily scales across microservices or serverless instances without sharing session databases.
3. **Mobile & Cross-Platform Friendly:** Sent cleanly in HTTP `Authorization: Bearer <token>` headers.

---

### 16. Explain Authentication vs Authorization
* **Authentication (AuthN - "Who are you?"):** Verifies user credentials during login and generates a signed JWT token. Unauthenticated requests return **`401 Unauthorized`**.
* **Authorization (AuthZ - "What can you do?"):** Checks whether an authenticated user has permission for an endpoint based on their role (`member` vs `studio`) or resource ownership. Requests without permission return **`403 Forbidden`**.

---

### 17. Explain How Credits Work
* New users receive **10 default credits** upon registration (`credits: { type: Number, default: 10 }`).
* Booking a class checks `user.credits >= 1`, then deducts 1 credit (`User.findByIdAndUpdate(userId, { $inc: { credits: -1 } })`).
* Cancelling a booking restores 1 credit (`User.findByIdAndUpdate(userId, { $inc: { credits: 1 } })`).

---

### 18. Explain How Capacity Checking Works
To prevent overbooking when two users book simultaneously:
```javascript
const updatedClass = await Class.findOneAndUpdate(
  {
    _id: classId,
    $expr: { $lt: ['$bookedCount', '$capacity'] }
  },
  { $inc: { bookedCount: 1 } },
  { new: true }
);
```
MongoDB checks inside the database engine if `bookedCount < capacity` before executing the increment in a single atomic step. If the class is full, `updatedClass` returns `null`, rejecting the booking with `400 Bad Request`.

---

### 19. Explain What Happens When a User Cancels a Booking
When `DELETE /api/bookings/:id` is called:
1. Verifies user ownership (`booking.user === req.user._id` or `role === 'studio'`).
2. Checks if booking is already cancelled (`status === 'cancelled'`).
3. Updates status to `'cancelled'` (Soft delete preserving history).
4. Refunds 1 credit to member balance (`$inc: { credits: 1 }`).
5. Decrements class booked count (`$inc: { bookedCount: -1 }` where `bookedCount > 0`).

---

## ❓ Part 3: 30 Basic Viva Questions & Answers

1. **Q: What is Node.js?**  
   *A:* Node.js is an open-source, cross-platform JavaScript runtime built on Chrome's V8 engine that allows executing JavaScript on the server.
2. **Q: What is Express.js?**  
   *A:* Express.js is a minimal and flexible Node.js web application framework providing routing and middleware features for building REST APIs.
3. **Q: What is MongoDB?**  
   *A:* MongoDB is a NoSQL document-oriented database that stores data in flexible, JSON-like BSON documents.
4. **Q: What is Mongoose?**  
   *A:* Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js that manages relationships, schemas, and data validation.
5. **Q: What is a REST API?**  
   *A:* REST (Representational State Transfer) is an architectural style for Web APIs using standard HTTP methods (GET, POST, PUT, DELETE).
6. **Q: What port does the server run on?**  
   *A:* Port 5001 by default (configured via `process.env.PORT || 5001`).
7. **Q: What is JSON Web Token (JWT)?**  
   *A:* JWT is a compact, URL-safe token standard used to securely transmit information between client and server as a JSON object.
8. **Q: How are passwords secured in your application?**  
   *A:* Using `bcryptjs` hashing with 10 salt rounds before saving to MongoDB.
9. **Q: How many user roles exist in FlexFit?**  
   *A:* Two roles: `member` and `studio`.
10. **Q: What is the default credit balance for new users?**  
    *A:* 10 credits upon registration.
11. **Q: What is middleware in Express?**  
    *A:* A function with access to `(req, res, next)` that can execute code, modify request objects, end requests, or call `next()`.
12. **Q: What does `next()` do in Express?**  
    *A:* It passes execution control to the next middleware or route handler in the stack.
13. **Q: How do studio users upload images?**  
    *A:* Via `multipart/form-data` with field `image`, processed by Multer and streamed to Firebase Storage.
14. **Q: Where are environment variables stored?**  
    *A:* In the `.env` file, loaded using the `dotenv` package.
15. **Q: What is `express.json()` used for?**  
    *A:* Built-in Express middleware that parses incoming JSON request payloads into `req.body`.
16. **Q: What is CORS?**  
    *A:* Cross-Origin Resource Sharing middleware that allows or restricts API requests from different domains/origins.
17. **Q: What HTTP status code is returned for successful resource creation?**  
    *A:* `201 Created`.
18. **Q: What HTTP status code is returned when authentication fails?**  
    *A:* `401 Unauthorized`.
19. **Q: What HTTP status code is returned when a user lacks permission?**  
    *A:* `403 Forbidden`.
20. **Q: What HTTP status code is returned for bad inputs or validation errors?**  
    *A:* `400 Bad Request`.
21. **Q: What is an ObjectId in MongoDB?**  
    *A:* A unique 12-byte hexadecimal identifier generated automatically by MongoDB for every document (`_id`).
22. **Q: What is Mongoose `.populate()`?**  
    *A:* A method used to automatically replace document ID references with actual data from another collection (like joining tables).
23. **Q: What is a Mongoose virtual field?**  
    *A:* A property defined on a schema that is computed dynamically and not persisted to MongoDB (e.g., `availableSlots = capacity - bookedCount`).
24. **Q: What tool is used for request input validation?**  
    *A:* `express-validator`.
25. **Q: How are non-existent endpoints handled?**  
    *A:* By `notFoundHandler` middleware returning a `404 Not Found` JSON response.
26. **Q: How are uncaught server errors handled?**  
    *A:* By a centralized `globalErrorHandler` middleware with 4 parameters `(err, req, res, next)`.
27. **Q: What happens when a user books a class?**  
    *A:* 1 credit is deducted, class `bookedCount` increments by 1, and a `Booking` record is created.
28. **Q: What happens when a user cancels a booking?**  
    *A:* Booking status becomes `'cancelled'`, 1 credit is refunded, and class `bookedCount` decrements by 1.
29. **Q: How does search work in FlexFit?**  
    *A:* Case-insensitive multi-field MongoDB `$or` regex search across `title`, `description`, `instructor`, and `category`.
30. **Q: Is raw sensitive data returned in API responses?**  
    *A:* No, password fields are stripped via `select: false` and `toJSON` schema transforms.

---

## 💻 Part 4: 20 Technical Viva Questions & Answers

1. **Q: Explain how `bcrypt.hash()` works.**  
   *A:* It generates a cryptographically secure random salt and hashes the plain text password multiple times (10 rounds) to produce a secure one-way hash string.
2. **Q: What is the purpose of `select: false` in User model?**  
   *A:* It excludes the `password` field by default from all Mongoose query results unless explicitly requested using `.select('+password')`.
3. **Q: Explain Multer `memoryStorage()` vs `diskStorage()`.**  
   *A:* `memoryStorage()` keeps uploaded files in RAM as a Buffer (`req.file.buffer`), allowing direct stream upload to Firebase without writing temporary files to server disk.
4. **Q: How do you prevent MongoDB Injection attacks?**  
   *A:* By using Mongoose schemas that strictly cast inputs and sanitizing search keywords with `cleanKeyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')`.
5. **Q: What is a compound index in MongoDB?**  
   *A:* An index built on multiple fields. In `Booking.js`, `bookingSchema.index({ user: 1, class: 1, status: 1 })` optimizes booking lookups.
6. **Q: Why use `resumable: false` in Firebase Storage upload streams?**  
   *A:* For small images (<5MB), single-chunk direct stream uploads complete faster than chunked resumable uploads.
7. **Q: How does Express recognize an Error-Handling middleware?**  
   *A:* By checking the function signature length: it must accept **four parameters** `(err, req, res, next)`.
8. **Q: What is MongoDB code `11000`?**  
   *A:* It indicates a Duplicate Key Error thrown when violating a unique index constraint (e.g. duplicate email).
9. **Q: What is Mongoose `CastError`?**  
   *A:* Thrown when Mongoose fails to convert an input string into a target schema data type (e.g. passing `"123"` as a 24-character ObjectId).
10. **Q: What is the difference between `PUT` and `PATCH`?**  
    *A:* `PUT` updates or replaces an entire resource, while `PATCH` applies partial modifications. In FlexFit, `PUT /api/classes/:id` accepts partial fields for class updates.
11. **Q: How does `jwt.sign()` create a token?**  
    *A:* It encodes header, payload (user `id` and `role`), and signs them with a secret key (`process.env.JWT_SECRET`) using HMAC-SHA256 algorithm.
12. **Q: How is asynchronous error handling achieved in controllers?**  
    *A:* Controller functions wrap logic in `try...catch` blocks and pass uncaught exceptions to `next(error)`, which triggers `globalErrorHandler`.
13. **Q: Explain how `express-validator` chains work.**  
    *A:* Rules are chained together (e.g., `body('email').trim().isEmail().normalizeEmail()`), and results are checked by `validationResult(req)` inside a `validate` middleware.
14. **Q: What is atomic operation safety?**  
    *A:* Operations that complete entirely or not at all without interference from concurrent requests, preventing dirty reads or race conditions.
15. **Q: How does Mongoose virtual field getter work?**  
    *A:* `classSchema.virtual('availableSlots').get(function() { return Math.max(0, this.capacity - this.bookedCount); })` computes remaining seats dynamically whenever converted to JSON.
16. **Q: Why is `dotenv.config()` called at the top of `server.js`?**  
    *A:* To inject environment variables from `.env` into `process.env` before any module needing them (like DB connection or Firebase) is initialized.
17. **Q: What is the purpose of `process.exit(1)` in database connection failure?**  
    *A:* It immediately terminates the Node.js process with a non-zero failure code if MongoDB cannot be reached, preventing the server from running in a broken state.
18. **Q: How do you format validation error arrays for clean client responses?**  
    *A:* By mapping `errors.array()` to clean objects: `errors.array().map(err => ({ field: err.path, message: err.msg }))`.
19. **Q: Why is Firebase private key string manipulated with `.replace(/\\n/g, '\n')`?**  
    *A:* Environment variable parsers escape newline characters as literal `\n` strings; replacing them restores actual multiline RSA private key formatting.
20. **Q: How does FlexFit prevent a studio user from modifying another studio's class?**  
    *A:* By checking `fitnessClass.createdBy.toString() !== req.user._id.toString()` inside `updateClass` controller and returning `403 Forbidden` if they don't match.

---

## ⚡ Technology-Specific Viva Questions

### ⚙️ Node.js & Express.js
* **Q: Is Node.js single-threaded?**  
  *A:* Yes, Node.js runs on a single-threaded event loop, but uses libuv for thread pool operations handling async I/O.
* **Q: What is Express Router?**  
  *A:* An isolated instance of middleware and routes that behaves like a mini-application, used to modularize routing.

### 🍃 MongoDB & Mongoose
* **Q: Why use Mongoose schema when MongoDB is schema-less?**  
  *A:* Schema enforcement provides application-level data integrity, type checking, default values, and lifecycle hooks.

### 🔑 JWT & Security
* **Q: Can JWT tokens be invalidated before expiry without a database blacklist?**  
  *A:* No, standard JWTs are stateless. To invalidate immediately, server password secret can be changed or token blacklisting must be added.

### ☁️ Firebase Storage
* **Q: Why store image URLs in MongoDB instead of storing image binary data directly in database?**  
  *A:* Storing binaries (blobs) bloats MongoDB database size and slows queries; storing cloud URLs is efficient and optimized for CDN distribution.
