# 🍽️ Food Ordering System — RBAC + Country Access Control

A full-stack **Food Ordering Web Application** built with **Next.js, NestJS, PostgreSQL, TypeORM, and Redux Toolkit**.

## 🚀 Features

- ✅ **Role-Based Access Control** (Admin, Manager, Member)
- 🌍 **Country-restricted access** (India / America)
- 🍽 **Restaurants & Menus** with images, country scope, and fallback images
- 🛒 **Orders** with cart, payment flow, cancelation
- 💳 **Admin-only payment method management**
- 🔐 **JWT Authentication**
- 🎨 **Modern, animated UI** with CSS + Framer Motion
- 🧲 **Database seeding** with demo data

---

## 👥 User Roles

| Role      | Country Scope   | Access                                                                         |
| --------- | --------------- | ------------------------------------------------------------------------------ |
| **Admin**   | Global           | Full access (payments, cancel/place orders, manage everything)                 |
| **Manager** | Own country only | View restaurants, create/place/cancel orders                                  |
| **Member**  | Own country only | View restaurants, create orders                                               |

---

## 🌐 Restaurants & Menu

- View all restaurants in your country  
- Menu items with images  
- Images link stored in DB (seeded)  
- Fallback images on frontend  

---

## 🛒 Orders

- Add to cart
- Create order (Member only) 
- Place order (Admin/Manager only)  
- Cancel order (Admin/Manager only)  


---

## 💳 Payments (Admin Only)

- Add payment method  
- Update payment method  
- Card, UPI, COD, Wallet, etc.

---

## 🔐 Authentication System

- Login with email + password  
- JWT assigned on login  
- Frontend auto-decodes token  
- Protected routes for role-specific pages  

---

## 🎨 UI / UX Features

- Clean CSS-based UI  
- Framer Motion animations  
- Responsive restaurant grid  
- Image fallback system  
- Modern card-based layout  

---

# 🏗️ Tech Stack

### Frontend

- Next.js 14  
- TypeScript  
- Redux Toolkit  
- Axios  
- Framer Motion  
- CSS Modules  

### Backend

- NestJS  
- TypeORM  
- PostgreSQL  
- JWT Auth  
- Class Validator / Transformer  
- bcrypt  
- Role Guards + Country Guards  

---

---

# 🛠️ Setup

## 1️⃣ Clone Repo

git clone [**https://github.com/Goutamsahu23/food-ordering-app**](https://github.com/Goutamsahu23/food-ordering-app)
cd food-ordering-app

text

### 🗄️ Backend Setup

2️⃣ **Install dependencies**
cd backend
npm install

text

3️⃣ **Environment Variables**  
Create a `.env` file:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=foodApp
JWT_SECRET=supersecret

text

5️⃣ **Seed Database**
npm run seed

text

### Demo Users

| Email                         | Password     | Role    | Country  |
|-------------------------------|-------------|---------|----------|
| nick@shield.com               | nickpass    | admin   | India    |
| captain.marvel@shield.com     | capmarvel   | manager | India    |
| captain.america@shield.com    | capamerica  | manager | America  |
| thanos@shield.com             | thanos      | member  | India    |
| thor@shield.com               | thor        | member  | India    |
| travis@shield.com             | travis      | member  | America  |

6️⃣ **Start Backend**
npm run start:dev

text
- Backend at: [**http://localhost:3001**](http://localhost:3001)

---

### 🌐 Frontend Setup

1️⃣ **Install dependencies**
cd frontend
npm install

text

2️⃣ **Run frontend**
npm run dev

text
- Frontend at: [**http://localhost:3000**](http://localhost:3000)

---

## 🎯 RBAC Summary

| Action            | Admin | Manager | Member |
|-------------------|-------|---------|--------|
| View restaurants  | ✔     | ✔       | ✔      |
| Create order      | ✔     | ✔       | ✔      |
| Place order       | ✔     | ✔       | ❌     |
| Cancel order      | ✔     | ✔       | ❌     |
| Update payment    | ✔     | ❌      | ❌     |

---

## 🌍 Country Access Summary

- **Managers & Members:** See only restaurants, menu items, orders, and payment methods for *their own* country.
- **Admins:** Unrestricted access.

---

## 💡 Notes

- Images are seeded, with frontend fallback images for missing ones.
- Payments are managed by Admins only .
- Role/country guards are enforced both on API and frontend routing.