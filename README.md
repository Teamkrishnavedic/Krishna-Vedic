# 🌿 Krishnavedic Oil & Masalas — Full-Stack E-Commerce Platform

A production-grade, full-stack e-commerce application built for **Krishnavedic Oil & Masalas**, an artisanal Indian brand specializing in pure, traditional cold-pressed oils (*Lakdi Ghani / Kolhu*) and slow stone-ground spices.

Designed and architected with a decoupled monorepo, robust database governance, immutable audit logging, live inventory control, and a rich, responsive Ayurvedic brand experience.

---

## 🏛️ Architecture & Tech Stack

| Tier | Technologies |
| :--- | :--- |
| **Storefront & Admin UI** | React 18, TypeScript, Vite, TailwindCSS, Framer Motion, TanStack Query (React Query), Lucide Icons, Radix UI primitives |
| **Backend API** | Node.js, Express.js, TypeScript, Express Session (HTTP-only secure cookies), Multer, Zod validation |
| **Database & ORM** | Prisma ORM with SQLite (Local Zero-Config Dev) / PostgreSQL (Production Ready) |
| **Shared Monorepo Package** | `@krishnavedic/shared` — Shared Zod schemas, TypeScript types, and currency/currency formatting utilities |
| **Security & Auth** | Bcrypt password hashing, CSRF/CORS protection, Helmet security headers, rate limiting, and role-based access control (Customer, Staff, Admin, Super Admin) |

---

## 📁 Repository Structure

```
Krishnavedic/
├── package.json              # Monorepo root with npm workspaces
├── README.md                 # Complete system guide & setup instructions
├── shared/                   # Shared types, Zod schemas, validation contracts
│   ├── package.json
│   └── src/index.ts
├── server/                   # Express.js REST API & Database layer
│   ├── package.json
│   ├── .env.example          # Sample environment variables
│   ├── prisma/
│   │   ├── schema.prisma     # Complete Prisma database models
│   │   └── seed.ts           # Development seed data (categories, products, variants, admin)
│   └── src/
│       ├── index.ts          # Server entry point
│       ├── lib/              # Prisma client & database connectors
│       ├── middleware/       # Auth guards, role checks, error handlers
│       ├── routes/           # Products, Checkout, Orders, Admin, Inventory, Coupons, etc.
│       └── scripts/          # Admin bootstrap scripts (createAdmin.ts)
└── client/                   # React + Vite Storefront & Admin Dashboard
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js    # Vedic brand design tokens (Forest, Ivory, Turmeric, Sage)
    └── src/
        ├── App.tsx           # Router (Storefront + Protected Customer + Admin Routes)
        ├── components/       # Header, Footer, ProductCard, CartDrawer, etc.
        ├── context/          # AuthContext, CartContext, ToastContext
        ├── layouts/          # StorefrontLayout, AdminLayout
        ├── pages/            # 19 Storefront pages (Home, Shop, Category, Product, Cart, Checkout, etc.)
        └── pages/admin/      # 16 Admin management pages (Dashboard, Inventory, Pricing, Shipping, etc.)
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher

### 2. Clone and Install Dependencies
In the root directory of the project, run:
```bash
npm install
```
This installs dependencies across the root, `client`, `server`, and `shared` workspaces automatically.

---

### 3. Setup Environment Variables

#### Backend (`server/.env`)
A `.env` file is already created in `server/.env`. Verify or update the following values:
```env
# Database (Default is local SQLite file)
DATABASE_URL="file:./dev.db"

# Server Port & URLs
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

# Session Secret (Random secure string)
SESSION_SECRET=krishnavedic_super_secure_session_secret_key_at_least_64_chars_long

# First Admin Bootstrap Credentials (Used during initial setup)
BOOTSTRAP_ADMIN_EMAIL=admin@krishnavedic.com
BOOTSTRAP_ADMIN_NAME="Store Owner"
BOOTSTRAP_ADMIN_PASSWORD=Admin@Krishnavedic2026
```

---

### 4. Initialize Database & Seed Sample Data

Run the database migration and development seed from the root directory:

```bash
# Generate Prisma Client & apply schema
npm run db:migrate

# Seed database with sample categories, products, variants, coupons, and admin
npm run db:seed
```

*(Alternatively, to run directly inside the `server` directory)*:
```bash
cd server
npx prisma db push
npx tsx prisma/seed.ts
cd ..
```

---

### 5. Start the Development Servers

To run both the **Backend API** and **Frontend Storefront** concurrently with hot-reloading:

```bash
npm run dev
```

- **Storefront URL**: [http://localhost:5173](http://localhost:5173)
- **Admin Portal URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔑 Default Credentials & Test Accounts

### 👑 Administrator Account
- **Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Email**: `admin@krishnavedic.com`
- **Password**: `Admin@Krishnavedic2026`
- **Role**: `SUPER_ADMIN` (Access to Dashboard, Products, Inventory, Price Audit, Shipping, Staff, Settings)

### 👤 Test Customer Account
- **Portal**: [http://localhost:5173/login](http://localhost:5173/login)
- **Email**: `customer@krishnavedic.com`
- **Password**: `Customer@123`
- *(Or register any new account instantly on the `/register` page)*

### 🏷️ Sample Promo Coupon
- **Code**: `VEDIC10` (Applies 10% discount on cart subtotal at checkout)

---

## 🛒 Storefront Features

1. **Brand Storytelling & Aesthetics**:
   - Rich Vedic earthen palette: Forest Green (`#1b3b2b`), Warm Ivory (`#faf8f5`), Turmeric Gold (`#d97706`), and Muted Sage.
   - Parallax hero banners, botanical trust badges, and interactive accordion tabs detailing cold-press wood churning, Ayurvedic dosha benefits, and lab purity certifications.

2. **Catalog & Filtering**:
   - Product categories: *Cold-Pressed Oils*, *Stone-Ground Masalas*, *Pure A2 Ghee*, and *Superfood Seeds*.
   - Filter by collection, search query, sorting (Newest, Name, Price).

3. **Product Page Experience**:
   - Multi-angle image gallery with high-resolution view.
   - Variant selector (e.g., 500ml, 1L, 5L tins or 100g, 250g, 500g pouches) with live price, MRP compare savings, and real-time inventory threshold badges.
   - 1-Click "Buy Now" and animated Cart Drawer integration.

4. **Cart & Secure Checkout**:
   - Quantity modifiers and promo code verification.
   - Saved shipping addresses manager with PIN code validation.
   - Cash on Delivery (COD) and Online Payment options.
   - Idempotent order placement to prevent double charging.
   - Immediate order confirmation with tracking number (`KV-XXXXXX`).

5. **Customer Dashboard**:
   - Complete order history with chronological status timeline.
   - Printable order invoices.
   - Address book management with default address selection.

---

## ⚙️ Admin Dashboard & Operations

The business owner can manage the entire store through the dedicated admin suite at `/admin`:

| Module | Features |
| :--- | :--- |
| **Overview Dashboard** | Real-time KPI counters (Today's revenue, order counts, pending fulfillment, customer base) and low-stock alert notifications. |
| **Catalog Management** | Add, edit, or archive products with SEO slugs, SKU codes, rich descriptions, and multiple packaging variants. |
| **Categories Organizer** | Organize products into collections with sort orders and slugs. |
| **Order Processing** | Filter orders by status (`PENDING`, `CONFIRMED`, `PROCESSING`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`). Update statuses with custom tracking notes and print packing slips. |
| **Inventory & Restocking** | Log stock inflow batches, record shrinkage/damage, and inspect historical stock movements. |
| **Price Governance** | Update variant prices with mandatory audit logging and reason recording. |
| **Shipping Rules** | Configure free delivery thresholds (default ₹500) and delivery charges per order bracket. |
| **Coupons & Discounts** | Create percentage or flat discounts, set expiry dates, minimum order values, and max usage limits. |
| **Sales Analytics** | 30-day revenue aggregate, average order value (AOV), and top 10 bestselling products. |
| **Immutable Audit Trail** | Detailed timestamped log of all staff actions, before/after state diffs, and IP addresses. |
| **Store Settings** | Modify announcement bar banner text, support contact numbers, mill address, and UPI ID without code changes. |

---

## 🛠️ Monorepo NPM Scripts Reference

From the root directory:

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `concurrently ...` | Runs both backend (port 5000) and client (port 5173) simultaneously. |
| `npm run build` | `npm run build --workspaces` | Compiles `shared`, builds `server`, and generates optimized production bundle for `client`. |
| `npm run db:migrate` | `prisma migrate dev` | Applies database migrations. |
| `npm run db:seed` | `tsx prisma/seed.ts` | Populates database with seed catalog and default admin. |
| `npm run db:studio` | `prisma studio` | Opens the visual Prisma database browser in your web browser. |
| `npm run create-admin` | `tsx src/scripts/createAdmin.ts` | Bootstraps a new administrator account using credentials in `.env`. |

---

## 🚢 Production Deployment

### Switching to PostgreSQL (Supabase, Neon, AWS RDS)
1. Open `server/prisma/schema.prisma` and change the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `server/.env` with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://username:password@hostname:5432/krishnavedic?schema=public"
   ```
3. Run `npm run db:migrate --workspace=server` to apply the tables to your cloud database.

### Deploying Frontend & Backend
- **Frontend (Vite client)**: Deploy to Vercel, Netlify, or Cloudflare Pages with build command `npm run build` and output directory `dist`.
- **Backend (Node.js API)**: Deploy to Render, Railway, DigitalOcean App Platform, or Docker container with start command `npm run start --workspace=server`.

---

## 📜 License & Copyright

© 2026 **Krishnavedic Oil & Masalas**. All rights reserved. Handcrafted with Vedic purity and modern engineering standards.
