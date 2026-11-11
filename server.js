const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./server/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Frontend Home Route - Serve the rebranded website directly at '/'
const solarWebRoot = path.join(__dirname, 'SolarWebsite', 'www.solarsquare.in');
const solarRoot = path.join(__dirname, 'SolarWebsite');

app.get('/', (req, res) => {
  const homeFile = path.join(solarWebRoot, 'index.html');
  res.sendFile(homeFile);
});

// Serve static assets
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Serve Admin Panel from dedicated 'admin' folder
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve Customer Dashboard from dedicated 'customer' folder
app.use('/customer', express.static(path.join(__dirname, 'customer')));

// Serve Solar Website Assets
app.use(express.static(solarWebRoot));
app.use(express.static(solarRoot));

// ========================
// REST API ENDPOINTS
// ========================

// 1. Settings & Branding
app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: db.getDb().settings });
});

// 2. Solar Calculator
app.post('/api/calculate', (req, res) => {
  const { monthlyBill, pincode } = req.body;
  const billNum = Number(monthlyBill) || 3500;

  // Estimation logic based on standard Indian solar tariffs (~₹7.50 / kWh unit)
  // 1 kW generates approx 4 units/day = 120 units/month = saves ~₹900/month
  let kw = +(billNum / 900).toFixed(1);
  if (kw < 1) kw = 1;
  if (kw > 15) kw = 15;
  kw = Math.round(kw * 2) / 2; // round to nearest 0.5 kW

  const dailyUnits = +(kw * 4.2).toFixed(1);
  const monthlyUnits = Math.round(dailyUnits * 30);
  const monthlySavings = Math.round(monthlyUnits * 7.5);
  const roofSpaceSqFt = Math.round(kw * 80);

  // PM Surya Ghar Muft Bijli Yojana Central Subsidies:
  // 1 kW: ₹30,000
  // 2 kW: ₹60,000
  // 3 kW and above: ₹78,000
  let centralSubsidy = 0;
  if (kw <= 1) {
    centralSubsidy = 30000;
  } else if (kw <= 2) {
    centralSubsidy = 60000;
  } else {
    centralSubsidy = 78000;
  }

  // Estimated gross price: ~₹55,000 - ₹60,000 / kW
  const grossPrice = Math.round(kw * 55000);
  const netPrice = Math.max(25000, grossPrice - centralSubsidy);
  const annualSavings = monthlySavings * 12;
  const paybackYears = +(netPrice / annualSavings).toFixed(1);

  res.json({
    success: true,
    data: {
      inputBill: billNum,
      pincode: pincode || '201301',
      recommendedCapacityKw: kw,
      dailyGenerationUnits: dailyUnits,
      monthlyGenerationUnits: monthlyUnits,
      monthlySavings: monthlySavings,
      annualSavings: annualSavings,
      roofSpaceSqFt: roofSpaceSqFt,
      grossPrice: grossPrice,
      centralSubsidy: centralSubsidy,
      netPrice: netPrice,
      paybackYears: paybackYears,
      warrantyYears: 25
    }
  });
});

// 3. Leads Management
app.get('/api/leads', (req, res) => {
  const leads = db.getLeads();
  const { status, search } = req.query;
  let filtered = [...leads];
  if (status && status !== 'All') {
    filtered = filtered.filter(l => l.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(l =>
      (l.fullName && l.fullName.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q)) ||
      (l.city && l.city.toLowerCase().includes(q)) ||
      (l.pincode && l.pincode.includes(q))
    );
  }
  res.json({ success: true, count: filtered.length, data: filtered });
});

app.post('/api/leads', (req, res) => {
  try {
    const lead = db.addLead(req.body);
    res.status(201).json({
      success: true,
      message: 'Consultation request booked successfully with Shree Rudra Power Systems!',
      data: lead
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/leads/:id', (req, res) => {
  const updated = db.updateLead(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, data: updated });
});

app.delete('/api/leads/:id', (req, res) => {
  db.deleteLead(req.params.id);
  res.json({ success: true, message: 'Lead deleted successfully' });
});

app.post('/api/leads/:id/convert', (req, res) => {
  const result = db.convertLeadToCustomer(req.params.id, req.body);
  if (!result) return res.status(404).json({ success: false, error: 'Lead not found' });
  res.json({ success: true, message: 'Lead converted into customer successfully', data: result });
});

// 4. Customers Management
app.get('/api/customers', (req, res) => {
  res.json({ success: true, data: db.getCustomers() });
});

app.get('/api/customers/:id', (req, res) => {
  const cust = db.getCustomers().find(c => c.id === req.params.id || c.phone === req.params.id);
  if (!cust) return res.status(404).json({ success: false, error: 'Customer not found' });
  
  // Attach installation, generation and subsidy data
  const installation = db.getInstallations().find(i => i.customerId === cust.id);
  const subsidy = db.getSubsidies().find(s => s.customerId === cust.id);
  const generation = db.getGeneration(cust.id);
  const tickets = db.getTickets().filter(t => t.customerId === cust.id);
  const invoices = db.getInvoices().filter(inv => inv.customerId === cust.id);

  res.json({
    success: true,
    data: {
      ...cust,
      installation,
      subsidy,
      generation,
      tickets,
      invoices
    }
  });
});

app.post('/api/customers', (req, res) => {
  const newCust = db.addCustomer(req.body);
  res.status(201).json({ success: true, data: newCust });
});

app.put('/api/customers/:id', (req, res) => {
  const updated = db.updateCustomer(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Customer not found' });
  res.json({ success: true, data: updated });
});

// 5. Products & Pricing
app.get('/api/products', (req, res) => {
  res.json({ success: true, data: db.getProducts() });
});

app.post('/api/products', (req, res) => {
  const newProd = db.addProduct(req.body);
  res.status(201).json({ success: true, data: newProd });
});

app.put('/api/products/:id', (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: updated });
});

app.delete('/api/products/:id', (req, res) => {
  db.deleteProduct(req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

// 6. Site Visits
app.get('/api/site-visits', (req, res) => {
  res.json({ success: true, data: db.getSiteVisits() });
});

app.post('/api/site-visits', (req, res) => {
  const newVisit = db.addSiteVisit(req.body);
  res.status(201).json({ success: true, data: newVisit });
});

app.put('/api/site-visits/:id', (req, res) => {
  const updated = db.updateSiteVisit(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Site visit not found' });
  res.json({ success: true, data: updated });
});

// 7. Installation Tracker
app.get('/api/installations', (req, res) => {
  res.json({ success: true, data: db.getInstallations() });
});

app.put('/api/installations/:id', (req, res) => {
  const updated = db.updateInstallation(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Installation not found' });
  res.json({ success: true, data: updated });
});

// 8. Invoices & Payments
app.get('/api/invoices', (req, res) => {
  res.json({ success: true, data: db.getInvoices() });
});

app.post('/api/invoices', (req, res) => {
  const newInv = db.addInvoice(req.body);
  res.status(201).json({ success: true, data: newInv });
});

app.put('/api/invoices/:id', (req, res) => {
  const updated = db.updateInvoice(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Invoice not found' });
  res.json({ success: true, data: updated });
});

// 9. Subsidy Tracking
app.get('/api/subsidies', (req, res) => {
  res.json({ success: true, data: db.getSubsidies() });
});

app.put('/api/subsidies/:id', (req, res) => {
  const updated = db.updateSubsidy(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Subsidy record not found' });
  res.json({ success: true, data: updated });
});

// 10. Customer Support Tickets
app.get('/api/tickets', (req, res) => {
  res.json({ success: true, data: db.getTickets() });
});

app.post('/api/tickets', (req, res) => {
  const newTicket = db.addTicket(req.body);
  res.status(201).json({ success: true, data: newTicket });
});

app.post('/api/tickets/:id/reply', (req, res) => {
  const updated = db.replyTicket(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Ticket not found' });
  res.json({ success: true, data: updated });
});

app.put('/api/tickets/:id', (req, res) => {
  const updated = db.updateTicket(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, error: 'Ticket not found' });
  res.json({ success: true, data: updated });
});

// 11. Solar Generation Monitoring
app.get('/api/generation/:customerId', (req, res) => {
  const data = db.getGeneration(req.params.customerId);
  res.json({ success: true, data });
});

// 12. Reports & Analytics
app.get('/api/analytics', (req, res) => {
  res.json({ success: true, data: db.getAnalyticsSummary() });
});

// Frontend Home Route
app.get('/', (req, res) => {
  const homeFile = path.join(solarWebRoot, 'index.html');
  if (fs.existsSync(homeFile)) {
    res.sendFile(homeFile);
  } else {
    res.send('<h1>Shree Rudra Power Systems</h1><p><a href="/admin">Admin Panel</a> | <a href="/customer">Customer Dashboard</a></p>');
  }
});

// Fallback for SPA routing or pages
app.use((req, res, next) => {
  if (req.path.startsWith('/admin')) {
    return res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  }
  if (req.path.startsWith('/customer')) {
    return res.sendFile(path.join(__dirname, 'customer', 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ SHREE RUDRA POWER SYSTEMS Server Running!`);
  console.log(`🌐 Website Frontend:     http://localhost:${PORT}`);
  console.log(`🛠️ Admin Panel:          http://localhost:${PORT}/admin`);
  console.log(`👤 Customer Dashboard:    http://localhost:${PORT}/customer`);
  console.log(`⚡ REST API:              http://localhost:${PORT}/api/analytics`);
  console.log(`=======================================================`);
});
