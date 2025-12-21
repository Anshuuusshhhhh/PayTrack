# Real-time Transaction & Audit Log System

## Project Overview
This project is a secure peer-to-peer fund transfer system. It ensures financial integrity using **ACID-compliant database transactions** to guarantee that money is never lost during transfers. It includes an immutable Audit Log for history tracking.

**Tech Stack:**
- **Backend:** Python (Flask), SQLAlchemy (ORM)
- **Database:** MySQL
- **Frontend:** React
- **Authentication:** JWT (JSON Web Tokens)

## Setup & Run Instructions

### Backend (Python/Flask)
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `pip install flask flask-sqlalchemy flask-jwt-extended pymysql cryptography`
3. Configure MySQL connection in `app.py`.
4. Run the server: `python app.py`

### Frontend (React)
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the app: `npm start`

## API Documentation

1. **POST /login**
   - Body: `{ "username": "alice", "password": "password123" }`
   - Returns: `{ "access_token": "..." }`

2. **POST /transfer** (Protected)
   - Header: `Authorization: Bearer <token>`
   - Body: `{ "receiver_id": 2, "amount": 50 }`
   - Description: Atomically transfers funds and creates an audit log.

3. **GET /history** (Protected)
   - Header: `Authorization: Bearer <token>`
   - Description: Fetches transaction history for the logged-in user.

## Database Schema
*(You can paste a screenshot of your DB here later, or use this text)*
- **User Table:** `id (PK)`, `username`, `password_hash`, `balance`
- **AuditLog Table:** `id (PK)`, `sender_id (FK)`, `receiver_id (FK)`, `amount`, `timestamp`

---

## AI Tool Usage Log (MANDATORY)

| Task | Detail |
| :--- | :--- |
| **Backend Boilerplate** | Used AI to generate the **transaction atomicity logic** using SQLAlchemy. The AI provided the `try/except/rollback` block to ensure both the balance update and audit log creation happen simultaneously or not at all. |
| **Frontend Component** | Used AI to generate the **Sortable Table** React component to display transaction history, saving time on UI logic. |
| **Input Validation** | Used AI to write a Python helper function to validate that transfer amounts are positive and the sender has sufficient funds. |

**Effectiveness Score: 5/5**
*Justification:* The AI was highly effective in generating the complex SQLAlchemy transaction code. Writing the row-locking and rollback logic manually would have taken significantly longer and been prone to errors. It acted as a senior engineer guiding the architectural structure.