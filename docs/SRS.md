# FinSight AI — Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Project Overview
FinSight AI is an AI-powered personal finance analytics platform designed to help users manage expenses, track financial activities, visualize spending behavior, and receive intelligent financial insights through AI analysis.

### 1.2 Objectives
The objectives of FinSight AI are:
- Help users track income and expenses efficiently
- Provide financial analytics through interactive dashboards
- Generate AI-powered spending insights and recommendations
- Improve financial awareness and budgeting habits
- Deliver a modern and responsive user experience

### 1.3 Target Users
- Students
- Young professionals
- Individuals managing personal finances

---

## 2. System Features

### 2.1 Authentication
- User registration
- User login
- JWT authentication
- Password encryption using bcrypt

### 2.2 Transaction Management
- Add transactions
- Edit transactions
- Delete transactions
- Categorize expenses and income

### 2.3 Financial Dashboard
- Total balance overview
- Monthly spending charts
- Income vs expense analytics
- Spending by category visualization

### 2.4 AI Insights
- AI-generated spending analysis
- Budget recommendations
- Financial habit observations
- Smart financial suggestions

### 2.5 Budget Tracking
- Monthly budget setting
- Spending limit alerts
- Savings goal tracking

---

## 3. Functional Requirements

### 3.1 User Authentication
The system shall allow users to securely register and log into the platform.

### 3.2 Transaction Management
The system shall allow users to create, update, delete, and view financial transactions.

### 3.3 Analytics Dashboard
The system shall generate charts and analytics based on user transaction data.

### 3.4 AI Recommendation System
The system shall analyze financial data and generate AI-powered insights using OpenAI API.

---

## 4. Non-Functional Requirements

### 4.1 Performance
The platform should respond quickly and handle multiple requests efficiently.

### 4.2 Security
Passwords must be encrypted and protected using secure authentication methods.

### 4.3 Usability
The system should provide a clean, responsive, and user-friendly interface.

### 4.4 Scalability
The system architecture should support future feature expansion.

---

## 5. Technology Stack

### Frontend
- React
- Tailwind CSS
- Axios
- Framer Motion
- Recharts

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### AI Integration
- OpenAI API

### Deployment
- Vercel
- Railway