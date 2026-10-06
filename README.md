# 🏋️ FlexFit - Fitness Class Booking Backend API

A robust, scalable, and secure RESTful backend API for a boutique fitness class booking platform, built using **Node.js**, **Express.js**, **MongoDB**, and **Firebase Storage**.

---

## 📌 1. Project Description

**FlexFit** is a full-featured backend API designed to power modern fitness studio platforms (similar to ClassPass or Mindbody). It handles user authentication, role-based access control (`member` vs `studio`), class scheduling, multi-field search, atomic booking management, a pre-paid credits system, image uploads via Firebase Storage, request validation, and centralized error handling.

---

## 🎯 2. Problem Statement

Traditional fitness booking systems often suffer from:
* **Overbooking & Race Conditions:** Concurrent user bookings exceeding studio capacity.
* **Complex Payment Gateway Delays:** High transaction fees and friction for small recurring class bookings.
* **Coupling & Maintainability Issues:** Monolithic logic mixing validation, database queries, and routing.
* **Lack of Role Segregation:** Unrestricted resource modification leading to security vulnerabilities.

**FlexFit Solves This By:**
1. Implementing **Atomic MongoDB Queries** (`$expr: { $lt: ['$bookedCount', '$capacity'] }`) to prevent overbooking.
2. Introducing an **Abbreviated Credits System** (10 default credits upon registration, 1 credit per booking, instant refund on cancellation).
3. Utilizing **MVC Architecture** with modular middleware for JWT Auth, Role Authorization, express-validator schemas, and centralized error handling.

---

## ✨ 3. Features

* 🔐 **Authentication & Authorization:** Secure JWT token authentication, password hashing using `bcryptjs`, and Role-Based Access Control (`member` vs `studio`).
* 📅 **Class Management:** Studio users can create, update, and manage fitness classes (title, category, date, time, capacity, images).
* 🔍 **Multi-Field Search:** Case-insensitive search across class title, description, instructor, and category with partial keyword matching and optional date filters.
* 🎟️ **Atomic Booking System:** Safe booking engine preventing double-booking and capacity overbooking under concurrent requests.
* 💳 **Credits Ledger System:** Pre-paid credit tracking with automatic credit deduction on booking and credit refund upon cancellation.
* ☁️ **Firebase Storage Integration:** Streamed image upload using `Multer` memory storage to Firebase Storage buckets.
* 🛡️ **Robust Validation & Error Handling:** Clean validation using `express-validator` and centralized error middleware catching Mongoose CastErrors, Duplicate Keys (11000), and JWT expiration.

---

## 🛠️ 4. Technology Stack

* **Runtime:** Node.js (v18+)
* **Framework:** Express.js (v5)
* **Database:** MongoDB & Mongoose ODM (v8)
* **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
* **File Upload & Cloud Storage:** Multer & Firebase Admin SDK
* **Validation:** `express-validator` (v7)
* **Configuration & Utilities:** `dotenv`, `cors`

---

## 🏗️ 5. System Architecture

The application follows the **Model-View-Controller (MVC)** architectural pattern:

```text
                               ┌──────────────────────────┐
                               │     Client / Postman     │
                               └────────────┬─────────────┘
                                            │ HTTP Request
                                            ▼
                               ┌──────────────────────────┐
                               │  Express Router Stack    │
                               └────────────┬─────────────┘
                                            │
                  ┌─────────────────────────┼─────────────────────────┐
                  │ Middleware Pipeline     │                         │
                  ▼                         ▼                         ▼
         ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
         │ JWT Protection  │       │ Role Auth       │       │ Express-Valid.  │
         └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
                  └─────────────────────────┼─────────────────────────┘
                                            │ Passed Validated Request
                                            ▼
                               ┌──────────────────────────┐
                               │   Controller Layer       │ (Business Logic)
                               └────────────┬─────────────┘
                                            │ Mongoose ODM Operations
                                            ▼
                               ┌──────────────────────────┐
                               │  MongoDB Database &      │
                               │  Firebase Storage Cloud  │
                               └──────────────────────────┘
```

---

## 📂 6. Folder Structure

```text
BACKEND/
├── .env                  # Environment variables configuration
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore specification
├── package.json          # Node.js dependencies and npm scripts
├── README.md             # Project documentation
└── src/
    ├── config/           # Database & Firebase configuration
    │   ├── db.js         # MongoDB Mongoose connection handler
    │   └── firebase.js   # Firebase Admin SDK initialization
    ├── controllers/      # Route controllers (business logic)
    │   ├── authController.js
    │   ├── bookingController.js
    │   ├── classController.js
    │   ├── creditController.js
    │   └── healthController.js
    ├── middleware/       # Custom Express middleware
    │   ├── authMiddleware.js       # JWT & Role authorization
    │   ├── errorHandler.js         # Centralized error handler
    │   ├── uploadMiddleware.js       # Multer & Firebase stream upload
    │   └── validationMiddleware.js   # express-validator schemas
    ├── models/           # Mongoose Data Models
    │   ├── Booking.js
    │   ├── Class.js
    │   └── User.js
    ├── routes/           # API routes definitions
    │   ├── authRoutes.js
    │   ├── bookingRoutes.js
    │   ├── classRoutes.js
    │   ├── creditRoutes.js
    │   └── healthRoutes.js
    ├── utils/            # Helper utilities & custom ErrorResponse
    │   ├── ErrorResponse.js
    │   └── responseHandler.js
    └── server.js         # Express app entry point
```

---

## 🛢️ 7. MongoDB Setup

Ensure MongoDB is running locally or provide a MongoDB Atlas cloud connection URI.

**Local MongoDB Connection String:**
```text
mongodb://127.0.0.1:27017/flexfit
```

**MongoDB Atlas Connection String:**
```text
mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/flexfit?retryWrites=true&w=majority
```

---

## 🔑 8. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Port
PORT=5001

# MongoDB Connection URI
MONGODB_URI=mongodb://127.0.0.1:27017/flexfit

# JWT Secret Key
JWT_SECRET=flexfit_super_secret_key_12345

# Firebase Admin SDK Configuration (Optional / For Cloud Image Upload)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
```

---

## ⚙️ 9. Installation Steps

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/your-username/flexfit-backend.git
   cd BACKEND
   ```

2. **Install Project Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```

---

## 🚀 10. How to Run the Project

* **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```

* **Production Mode:**
  ```bash
  npm start
  ```

Once started, the server listens on `http://localhost:5001`.

---

## 📋 11. API Endpoints Table

| HTTP Method | Route Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server health status check |
| `POST` | `/api/auth/register` | Public | Register new user (`member` or `studio`) |
| `POST` | `/api/auth/login` | Public | Login user & receive JWT Bearer token |
| `GET` | `/api/auth/me` | Protected | Get authenticated user profile |
| `GET` | `/api/classes` | Public | Get all fitness classes sorted by date |
| `GET` | `/api/classes/search?keyword=yoga` | Public | Case-insensitive multi-field class search |
| `GET` | `/api/classes/:id` | Public | Get single class by ID |
| `POST` | `/api/classes` | Private (`studio`) | Create fitness class (supports `image` upload) |
| `PUT` | `/api/classes/:id` | Private (`studio`) | Update fitness class owned by studio |
| `POST` | `/api/bookings` | Private (`member`) | Book a class (costs 1 credit) |
| `GET` | `/api/bookings/user/:id` | Private (Owner/Studio) | Get user's bookings |
| `DELETE` | `/api/bookings/:id` | Private (Owner/Studio) | Cancel booking (refunds 1 credit) |
| `GET` | `/api/credits/user/:id` | Private (Owner/Studio) | Get user credit balance |

---

## 🔐 12. Authentication & Authorization

* **JWT Verification:** Authorization header requires `Bearer <token>`.
* **Password Security:** Salted hashing via `bcrypt.hash(password, 10)` with `select: false` on Mongoose schema.
* **Role-Based Access Control (RBAC):**
  * `member`: Search classes, view classes, book classes, view/cancel own bookings, check own credits.
  * `studio`: Create classes, update owned classes, view user bookings/credits.

---

## 🎟️ 13. Booking Workflow

1. Member submits `POST /api/bookings` with `classId`.
2. Middleware verifies JWT token and `member` role.
3. Controller checks if member has `credits >= 1`.
4. Atomic `Class.findOneAndUpdate()` increments `bookedCount` **only if** `bookedCount < capacity`.
5. Deducts 1 credit from user balance (`$inc: { credits: -1 }`).
6. Creates or re-activates booking record with status `'confirmed'`.
7. Cancellation (`DELETE /api/bookings/:id`) soft-updates status to `'cancelled'`, decrements `bookedCount`, and refunds 1 credit (`$inc: { credits: 1 }`).

---

## 💳 14. Credits System

* Users receive **10 free credits** upon registration.
* Each class booking consumes **1 credit**.
* Cancellations immediately **refund 1 credit**.
* Credits are queried securely via `GET /api/credits/user/:id`.

---

## ☁️ 15. Firebase Storage Integration

* Image uploads use `Multer` configured with `memoryStorage()`.
* Accepts JPG, JPEG, PNG, WEBP, and GIF images up to **5MB**.
* Uploads image buffer stream to Firebase Cloud Storage, sets public read access, and saves downloadable URL (`imageUrl`) in the MongoDB `Class` document.

---

## 🧪 16. Postman Testing

Execute requests in the following sequence:

1. `GET /api/health`
2. `POST /api/auth/register` (Member)
3. `POST /api/auth/register` (Studio)
4. `POST /api/auth/login` (Member - saves token)
5. `POST /api/auth/login` (Studio - saves token)
6. `POST /api/classes` (Studio token)
7. `GET /api/classes`
8. `GET /api/classes/:id`
9. `GET /api/classes/search?keyword=yoga`
10. `PUT /api/classes/:id` (Studio token)
11. `POST /api/bookings` (Member token)
12. `GET /api/bookings/user/:id` (Member token)
13. `GET /api/credits/user/:id` (Member token)
14. `DELETE /api/bookings/:id` (Member token)
15. `POST /api/classes` (form-data image upload)

---

## 📝 17. Example API Requests

### Register Member (`POST /api/auth/register`)
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "password123",
  "role": "member"
}
```

### Create Class (`POST /api/classes`)
```json
{
  "title": "Sunrise Vinyasa Yoga",
  "description": "Energizing morning flow yoga for flexibility.",
  "instructor": "Elena Rostova",
  "category": "Yoga",
  "date": "2026-10-15",
  "startTime": "07:00 AM",
  "endTime": "08:00 AM",
  "capacity": 20
}
```

### Book Class (`POST /api/bookings`)
```json
{
  "classId": "66fbe777888999000aaa1111"
}
```

---

## ⚠️ 18. Error Handling

Centralized global error handling returns consistent JSON error payloads:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": [
    "Please enter a valid email address",
    "Password must be at least 6 characters long"
  ]
}
```

* **`400 Bad Request`:** Validation errors, Mongoose `CastError`, MongoDB `11000 Duplicate Key`.
* **`401 Unauthorized`:** Invalid or expired JWT token.
* **`403 Forbidden`:** Role permission or resource ownership violation.
* **`404 Not Found`:** Resource or route not found.

---

## 🔮 19. Future Enhancements

* 💳 Stripe Payment Gateway integration for purchasing credit packages.
* 📧 Email notifications via Nodemailer for booking confirmations.
* ⌛ Waitlist functionality when class capacity reaches maximum.
* 📊 Studio analytics dashboard for revenue and attendance tracking.

---

## 👨‍💻 20. Author

* **Developer:** B.Tech Computer Science & Engineering Student
* **Project Name:** FlexFit Fitness Class Booking Platform Backend
* **Academic Context:** Major/Minor Computer Science Project
