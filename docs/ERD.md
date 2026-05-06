# FinSight AI — Entity Relationship Diagram (ERD)

## 1. Database Overview

FinSight AI uses PostgreSQL as the primary relational database management system.

The database is designed to manage:
- User accounts
- Financial transactions
- Budget tracking
- AI-generated financial insights

---

# 2. Database Tables

## 2.1 users

Stores user account information.

| Column Name | Data Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Unique user ID |
| username | VARCHAR(100) | Username |
| email | VARCHAR(255) | User email |
| password | VARCHAR(255) | Encrypted password |
| created_at | TIMESTAMP | Account creation date |

---

## 2.2 transactions

Stores user financial transactions.

| Column Name | Data Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Transaction ID |
| user_id | INTEGER | Linked user ID |
| type | VARCHAR(20) | income or expense |
| category | VARCHAR(100) | Transaction category |
| amount | DECIMAL(10,2) | Transaction amount |
| description | TEXT | Transaction notes |
| transaction_date | DATE | Transaction date |
| created_at | TIMESTAMP | Record creation date |

---

## 2.3 budgets

Stores monthly budgeting goals.

| Column Name | Data Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Budget ID |
| user_id | INTEGER | Linked user ID |
| category | VARCHAR(100) | Budget category |
| budget_limit | DECIMAL(10,2) | Monthly budget limit |
| month | VARCHAR(20) | Budget month |
| created_at | TIMESTAMP | Record creation date |

---

## 2.4 ai_insights

Stores AI-generated financial insights.

| Column Name | Data Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Insight ID |
| user_id | INTEGER | Linked user ID |
| insight_text | TEXT | AI-generated insight |
| generated_at | TIMESTAMP | Insight generation date |

---

# 3. Table Relationships

## users → transactions
Relationship:
- One user can have many transactions.

Relationship Type:
- One-to-Many

---

## users → budgets
Relationship:
- One user can have multiple budgets.

Relationship Type:
- One-to-Many

---

## users → ai_insights
Relationship:
- One user can receive multiple AI insights.

Relationship Type:
- One-to-Many

---

# 4. Foreign Keys

## transactions.user_id
References:
- users.id

---

## budgets.user_id
References:
- users.id

---

## ai_insights.user_id
References:
- users.id

---

# 5. Future Database Expansion

Possible future tables:
- notifications
- recurring_transactions
- savings_goals
- financial_reports
- AI_predictions