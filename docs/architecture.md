# FinSight AI — System Architecture

## 1. Architecture Overview

FinSight AI follows a full-stack client-server architecture consisting of:

- Frontend Client (React)
- Backend API Server (Node.js + Express)
- PostgreSQL Database
- OpenAI API Integration

The frontend communicates with the backend through REST APIs. The backend processes business logic, interacts with the database, and integrates AI-generated financial insights using OpenAI API.

---

## 2. System Components

### 2.1 Frontend Layer
The frontend is built using React and Tailwind CSS.

Responsibilities:
- User interface rendering
- Dashboard visualization
- Form handling
- API communication
- Authentication state management

Technologies:
- React
- Tailwind CSS
- Axios
- Framer Motion
- Recharts

---

### 2.2 Backend Layer
The backend is built using Node.js and Express.js.

Responsibilities:
- REST API handling
- Authentication and authorization
- Database operations
- Financial data processing
- AI insight generation

Technologies:
- Node.js
- Express.js
- JWT
- bcrypt

---

### 2.3 Database Layer
PostgreSQL is used for structured relational data storage.

Responsibilities:
- User data storage
- Transaction records
- Budget tracking
- AI insights history

---

### 2.4 AI Integration Layer
OpenAI API is used to generate intelligent financial insights and recommendations.

Responsibilities:
- Spending analysis
- Budget recommendations
- Financial habit observations
- Personalized financial suggestions

---

## 3. Data Flow

### User Authentication Flow
1. User submits login credentials
2. Frontend sends request to backend API
3. Backend validates credentials
4. JWT token generated
5. Token returned to frontend
6. Frontend stores authentication token

---

### Transaction Flow
1. User adds transaction
2. Frontend sends API request
3. Backend validates data
4. Data stored in PostgreSQL
5. Dashboard analytics updated

---

### AI Insight Flow
1. User transaction data collected
2. Backend formats financial summary
3. OpenAI API processes financial data
4. AI-generated insights returned
5. Insights displayed on dashboard

---

## 4. API Architecture

The backend follows REST API architecture.

Example API routes:

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Transactions
- GET /api/transactions
- POST /api/transactions
- PUT /api/transactions/:id
- DELETE /api/transactions/:id

### AI Insights
- GET /api/ai/insights

---

## 5. Security Architecture

Security measures include:
- Password hashing using bcrypt
- JWT authentication
- Protected API routes
- Environment variables using dotenv
- Input validation

---

## 6. Deployment Architecture

### Frontend Deployment
- Vercel

### Backend Deployment
- Railway

### Database Hosting
- Supabase PostgreSQL

---

## 7. Future Scalability

Future improvements may include:
- AI forecasting
- OCR receipt scanning
- Multi-user collaboration
- Mobile application support
- Advanced financial prediction