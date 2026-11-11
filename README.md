# Shree Rudra Power Systems - Rooftop Solar Platform

A complete Next.js + Express.js full-stack platform for Shree Rudra Power Systems featuring the Main Solar Website, Dedicated Admin Panel, Customer Solar Monitoring Portal, and REST API.

---

## 📁 Project Architecture

- **`frontend/`** - Next.js 14 Application (React, App Router)
  - `/` - Main Solar Website (Hero, Solar Calculator, Packages, Consultation Form)
  - `/admin` - Next.js Admin Panel (Leads, Customers, Products, Site Visits, Installations, Invoices, Subsidies, Support, Reports)
  - `/customer` - Next.js Customer Dashboard (Live Solar Generation, Savings, 6-Stage Installation Tracker, Service Tickets)
- **`backend/`** - Express.js REST API Server
  - `server.js` - Runs on port 5000 with CORS & full REST endpoints
  - `data/db.json` - Persistent database for leads, customers, subsidies, and installations
  - `server/db.js` - Database controller and helper methods
- **`public/`** - Logo and shared brand assets

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (Terminal 1)
```bash
cd backend
npm install
npm start
```
*Backend runs on: `http://localhost:5000`*

### 2. Start the Next.js Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 🌐 Application URLs

| Interface | URL | Description |
| :--- | :--- | :--- |
| **Main Website** | [http://localhost:3000](http://localhost:3000) | Full customer-facing solar website with dynamic calculator & consultation booking |
| **Admin Panel** | [http://localhost:3000/admin](http://localhost:3000/admin) | Operations control center (Leads, Revenue, GST Invoices, PM Surya Ghar Subsidies) |
| **Customer Portal** | [http://localhost:3000/customer](http://localhost:3000/customer) | Homeowner portal for live generation monitoring, ROI savings, and service requests |
| **Backend REST API** | [http://localhost:5000/api/analytics](http://localhost:5000/api/analytics) | Express.js REST API endpoints |

---

## 🌟 Key Features

1. **Company Branding:** Rebranded to **SHREE RUDRA POWER SYSTEMS** with official logo.
2. **Solar Estimation Engine:** Real-time rooftop capacity recommendation, unit harvest calculation, and PM Surya Ghar subsidy computation.
3. **Leads & Pipeline:** Real-time lead capture, status workflows, and 1-click lead-to-customer conversion.
4. **GST Tax Invoices:** Official printable and downloadable GST Tax Invoices on company letterhead.
5. **PM Surya Ghar Subsidy Tracker:** Tracks central subsidy (up to ₹78,000) and state top-up through the national portal pipeline.
6. **Live Generation & Savings:** Hourly generation curve simulation, lifetime bill savings, and environmental CO₂ offset statistics.

