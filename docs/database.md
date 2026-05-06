# FinSight AI — Database Setup

## Database Name
finsight_ai

---

## Tables Created

### users
Stores user authentication data.

### transactions
Stores financial transaction records.

### budgets
Stores monthly budgeting information.

### ai_insights
Stores AI-generated financial insights.

---

## Database Relationships

- users → transactions
- users → budgets
- users → ai_insights

All relationships use foreign keys with cascade deletion.

---

## Database Technology
- PostgreSQL
- pgAdmin 4