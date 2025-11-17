# 🍽️ Food Ordering System — RBAC + Country Access Control

A full-stack Food Ordering Web Application built with **Next.js, NestJS, PostgreSQL, TypeORM, and Redux Toolkit**.

---

## 🚀 Features

- Role-Based Access Control (Admin, Manager, Member)
- Country-restricted access (India / America)
- Restaurants & Menu items with images + fallback
- Orders (create, place, cancel)
- Admin-only payment method management
- JWT Authentication
- Responsive UI + Framer Motion animations
- Database seeding with demo data

---

## 👥 User Roles

| Role   | Country Scope     | Access Summary                              |
|--------|--------------------|----------------------------------------------|
| Admin  | Global             | Full access including payments               |
| Manager| Own country only   | View restaurants, create/place/cancel orders |
| Member | Own country only   | View restaurants, create orders              |

---

## 🏗️ Tech Stack

### Frontend
- Next.js 14  
- TypeScript  
- Redux Toolkit  
- Axios  
- CSS Modules  
- Framer Motion  

### Backend
- NestJS  
- TypeORM  
- PostgreSQL  
- JWT Authentication  
- bcrypt, class-validator  
- Role Guards + Country Guards

---

# ⚙️ Local Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Goutamsahu23/food-ordering-app
cd food-ordering-app
```

---

## 🗄️ Backend Setup

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

---

## 🛢️ Create PostgreSQL Database (Required)

You can create the database using **pgAdmin** or **psql**.

---

### ➊ Create Database using pgAdmin (GUI Method)

#### Step 1: Open pgAdmin

### Step 2: Create the Database

1. Right-click **Databases → Create → Database**  
2. Set:  
   - Database Name: `food_db`  
   - Owner: `postgres`  
3. Click **Save**

---

### ✅ Done!

Your PostgreSQL database is ready.

---

## Use these in your `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password_here
DB_NAME=food_db
```

---

## ➋ Create Database using SQL (psql)

```sql
CREATE USER food_user WITH PASSWORD 'your_password_here';
CREATE DATABASE food_db OWNER food_user;
GRANT ALL PRIVILEGES ON DATABASE food_db TO food_user;
```

---

## 🔐 .env Configuration (Backend)

Create a `.env` file inside **backend/**(use this for local setup):

```env
PORT=3001
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password_here
DB_NAME=food_db

FRONTEND_URL=http://localhost:3000
```

 For Production setup:
 ```env
PORT=3001
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600

FRONTEND_URL= Deployed link
DATABASE_URL= use the external DB pgSql URL 
```

---

## 🧪 Seed Database

```bash
npm run seed
```

---

## ▶️ Start Backend

```bash
npm run start:dev
```

Backend runs at:  
**http://localhost:3001**

---

## 🌐 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

## 🔐 .env Configuration (Frontend)

Create a `.env` file inside **FRONTEND/**(use this for local setup):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

 For Production setup:
 ```env
NEXT_PUBLIC_API_URL= Use Deployed Backend URL
```

Frontend runs at:  
**http://localhost:3000**

---

## 🔢 Demo Users (Seeded)

✔ All passwords have been changed to **password** as requested.

| Email                      | Password | Role    | Country |
|----------------------------|----------|---------|---------|
| nick@shield.com            | password | admin   | India   |
| captain.marvel@shield.com  | password | manager | India   |
| captain.america@shield.com | password | manager | America |
| thanos@shield.com          | password | member  | India   |
| thor@shield.com            | password | member  | India   |
| travis@shield.com          | password | member  | America |

---

## 🎯 RBAC Summary

| Action           | Admin | Manager | Member |
|------------------|:-----:|:-------:|:------:|
| View restaurants | ✔     | ✔       | ✔      |
| Create order     | ✔     | ✔       | ✔      |
| Place order      | ✔     | ✔       | ❌     |
| Cancel order     | ✔     | ✔       | ❌     |
| Update payment   | ✔     | ❌      | ❌     |

---

## 🌍 Country Access Summary

### **Manager & Member**
- Can view restaurants, menus, orders, and payments **only for their own country.**

### **Admin**
- Has **global access** across all countries.
