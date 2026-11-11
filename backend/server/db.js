const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db:', err);
    return {
      settings: {},
      leads: [],
      customers: [],
      products: [],
      siteVisits: [],
      installations: [],
      invoices: [],
      subsidies: [],
      supportTickets: [],
      generationMetrics: {}
    };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

module.exports = {
  getDb: readDb,
  saveDb: writeDb,

  // Leads
  getLeads: () => readDb().leads,
  addLead: (leadData) => {
    const db = readDb();
    const newId = 'LEAD-' + (100 + db.leads.length + 1);
    const newLead = {
      id: newId,
      fullName: leadData.fullName || 'Anonymous Lead',
      phone: leadData.phone || '',
      pincode: leadData.pincode || '',
      city: leadData.city || 'Delhi NCR',
      state: leadData.state || 'India',
      monthlyBill: leadData.monthlyBill || '2500-4000',
      monthlyBillAmount: Number(leadData.monthlyBillAmount) || 3000,
      recommendedKw: Number(leadData.recommendedKw) || 3,
      status: 'New',
      notes: leadData.notes || 'Captured via website consultation form',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.leads.unshift(newLead);
    writeDb(db);
    return newLead;
  },
  updateLead: (id, updates) => {
    const db = readDb();
    const idx = db.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;
    db.leads[idx] = { ...db.leads[idx], ...updates, updatedAt: new Date().toISOString() };
    writeDb(db);
    return db.leads[idx];
  },
  deleteLead: (id) => {
    const db = readDb();
    db.leads = db.leads.filter(l => l.id !== id);
    writeDb(db);
    return true;
  },

  // Convert Lead to Customer
  convertLeadToCustomer: (leadId, details = {}) => {
    const db = readDb();
    const lead = db.leads.find(l => l.id === leadId);
    if (!lead) return null;

    lead.status = 'Converted';
    lead.updatedAt = new Date().toISOString();

    const custId = 'CUST-' + (100 + db.customers.length + 1);
    const instId = 'INST-' + (100 + db.installations.length + 1);
    const invId = 'INV-2026-' + (100 + db.invoices.length + 1);

    const capacityKw = details.systemCapacityKw || lead.recommendedKw || 3;
    const matchingProduct = db.products.find(p => p.capacityKw === capacityKw) || db.products[2];
    const totalAmount = matchingProduct.grossPrice;
    const subsidyAmount = matchingProduct.subsidyAmount;
    const netPayable = matchingProduct.netPrice;

    const newCustomer = {
      id: custId,
      fullName: lead.fullName,
      phone: lead.phone,
      email: details.email || `${lead.fullName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
      address: details.address || `${lead.city}, PIN ${lead.pincode}`,
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode,
      systemCapacityKw: capacityKw,
      packageTitle: matchingProduct.title,
      discom: details.discom || 'State Electricity Board',
      consumerNumber: details.consumerNumber || `DISCOM-${Math.floor(10000000 + Math.random() * 90000000)}`,
      installationId: instId,
      totalAmount: totalAmount,
      subsidyAmount: subsidyAmount,
      netPayable: netPayable,
      paidAmount: details.paidAmount || 25000,
      balanceAmount: netPayable - (details.paidAmount || 25000),
      commissioningDate: null,
      status: 'Installing'
    };
    db.customers.unshift(newCustomer);

    // Create Installation tracker
    const newInstallation = {
      id: instId,
      customerId: custId,
      customerName: lead.fullName,
      phone: lead.phone,
      city: lead.city,
      capacityKw: capacityKw,
      currentStageIndex: 1,
      stages: [
        { name: "Site Feasibility & Shadow Analysis", status: "In Progress", date: new Date().toISOString().slice(0, 10) },
        { name: "DISCOM Sanction & Design Approval", status: "Pending", date: "" },
        { name: "Structure Mounting & Civil Work", status: "Pending", date: "" },
        { name: "Panel Installation & DC/AC Wiring", status: "Pending", date: "" },
        { name: "DISCOM Net Meter Testing & Inspection", status: "Pending", date: "" },
        { name: "System Commissioning & Grid Synchronization", status: "Pending", date: "" }
      ],
      progressPercent: 15,
      assignedLead: "Er. Rajesh Sharma (+91 98119 44332)",
      estimatedCompletion: new Date(Date.now() + 25 * 86400000).toISOString().slice(0, 10),
      notes: "Lead converted. Engineer assigned for detailed site survey."
    };
    db.installations.unshift(newInstallation);

    // Create Initial Invoice
    const newInvoice = {
      id: invId,
      invoiceNumber: `SRPS/2026/${110 + db.invoices.length}`,
      customerId: custId,
      customerName: lead.fullName,
      phone: lead.phone,
      address: newCustomer.address,
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      items: [
        { description: `${capacityKw} kW High-Efficiency Rooftop Solar System (Turnkey EPC)`, qty: 1, rate: totalAmount, amount: totalAmount },
        { description: "PM Surya Ghar Govt Subsidy (Direct Benefit to Customer Account)", qty: 1, rate: -subsidyAmount, amount: -subsidyAmount }
      ],
      grossTotal: totalAmount,
      subsidyDeduction: subsidyAmount,
      netPayable: netPayable,
      paidAmount: newCustomer.paidAmount,
      dueAmount: newCustomer.balanceAmount,
      paymentMode: "Booking Advance (UPI / Bank)",
      status: newCustomer.balanceAmount === 0 ? "Paid" : "Partial"
    };
    db.invoices.unshift(newInvoice);

    // Create Subsidy application record
    const newSubsidy = {
      id: 'SUB-' + (100 + db.subsidies.length + 1),
      customerId: custId,
      customerName: lead.fullName,
      phone: lead.phone,
      discom: newCustomer.discom,
      consumerNumber: newCustomer.consumerNumber,
      portalApplicationId: `PMSG-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      systemCapacityKw: capacityKw,
      centralSubsidy: subsidyAmount,
      stateSubsidy: capacityKw >= 3 ? 15000 : 0,
      totalSubsidy: subsidyAmount + (capacityKw >= 3 ? 15000 : 0),
      stage: "Application Submitted to Portal",
      submissionDate: new Date().toISOString().slice(0, 10),
      creditedDate: null,
      bankAccountMasked: "Pending Verification",
      status: "Processing"
    };
    db.subsidies.unshift(newSubsidy);

    writeDb(db);
    return { customer: newCustomer, installation: newInstallation, invoice: newInvoice, subsidy: newSubsidy };
  },

  // Customers
  getCustomers: () => readDb().customers,
  addCustomer: (cust) => {
    const db = readDb();
    const newId = 'CUST-' + (100 + db.customers.length + 1);
    const newCust = { id: newId, ...cust };
    db.customers.unshift(newCust);
    writeDb(db);
    return newCust;
  },
  updateCustomer: (id, updates) => {
    const db = readDb();
    const idx = db.customers.findIndex(c => c.id === id);
    if (idx === -1) return null;
    db.customers[idx] = { ...db.customers[idx], ...updates };
    writeDb(db);
    return db.customers[idx];
  },

  // Products
  getProducts: () => readDb().products,
  addProduct: (product) => {
    const db = readDb();
    const newId = 'PROD-' + (product.capacityKw ? `${product.capacityKw}KW` : (100 + db.products.length + 1));
    const newProd = { id: newId, inStock: true, ...product };
    db.products.push(newProd);
    writeDb(db);
    return newProd;
  },
  updateProduct: (id, updates) => {
    const db = readDb();
    const idx = db.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...updates };
    writeDb(db);
    return db.products[idx];
  },
  deleteProduct: (id) => {
    const db = readDb();
    db.products = db.products.filter(p => p.id !== id);
    writeDb(db);
    return true;
  },

  // Site Visits
  getSiteVisits: () => readDb().siteVisits,
  addSiteVisit: (visit) => {
    const db = readDb();
    const newId = 'SV-' + (1000 + db.siteVisits.length + 1);
    const newVisit = { id: newId, status: 'Scheduled', ...visit };
    db.siteVisits.unshift(newVisit);
    writeDb(db);
    return newVisit;
  },
  updateSiteVisit: (id, updates) => {
    const db = readDb();
    const idx = db.siteVisits.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.siteVisits[idx] = { ...db.siteVisits[idx], ...updates };
    writeDb(db);
    return db.siteVisits[idx];
  },

  // Installations
  getInstallations: () => readDb().installations,
  updateInstallation: (id, updates) => {
    const db = readDb();
    const idx = db.installations.findIndex(i => i.id === id);
    if (idx === -1) return null;
    db.installations[idx] = { ...db.installations[idx], ...updates };
    writeDb(db);
    return db.installations[idx];
  },

  // Invoices
  getInvoices: () => readDb().invoices,
  addInvoice: (invoice) => {
    const db = readDb();
    const newId = 'INV-2026-' + (100 + db.invoices.length + 1);
    const newInv = {
      id: newId,
      invoiceNumber: `SRPS/2026/${110 + db.invoices.length}`,
      date: new Date().toISOString().slice(0, 10),
      ...invoice
    };
    db.invoices.unshift(newInv);
    writeDb(db);
    return newInv;
  },
  updateInvoice: (id, updates) => {
    const db = readDb();
    const idx = db.invoices.findIndex(i => i.id === id);
    if (idx === -1) return null;
    db.invoices[idx] = { ...db.invoices[idx], ...updates };
    writeDb(db);
    return db.invoices[idx];
  },

  // Subsidies
  getSubsidies: () => readDb().subsidies,
  updateSubsidy: (id, updates) => {
    const db = readDb();
    const idx = db.subsidies.findIndex(s => s.id === id);
    if (idx === -1) return null;
    db.subsidies[idx] = { ...db.subsidies[idx], ...updates };
    writeDb(db);
    return db.subsidies[idx];
  },

  // Support Tickets
  getTickets: () => readDb().supportTickets,
  addTicket: (ticket) => {
    const db = readDb();
    const newId = 'TICK-' + (100 + db.supportTickets.length + 1);
    const newTicket = {
      id: newId,
      status: 'Open',
      createdAt: new Date().toISOString(),
      messages: [
        {
          sender: 'customer',
          name: ticket.customerName,
          text: ticket.description || ticket.subject,
          time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        }
      ],
      ...ticket
    };
    db.supportTickets.unshift(newTicket);
    writeDb(db);
    return newTicket;
  },
  replyTicket: (id, reply) => {
    const db = readDb();
    const ticket = db.supportTickets.find(t => t.id === id);
    if (!ticket) return null;
    ticket.messages.push({
      sender: reply.sender || 'admin',
      name: reply.name || (reply.sender === 'admin' ? 'Shree Rudra Support' : ticket.customerName),
      text: reply.text,
      time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    });
    if (reply.status) ticket.status = reply.status;
    writeDb(db);
    return ticket;
  },
  updateTicket: (id, updates) => {
    const db = readDb();
    const idx = db.supportTickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    db.supportTickets[idx] = { ...db.supportTickets[idx], ...updates };
    writeDb(db);
    return db.supportTickets[idx];
  },

  // Generation Metrics
  getGeneration: (customerId) => {
    const db = readDb();
    if (db.generationMetrics && db.generationMetrics[customerId]) {
      return db.generationMetrics[customerId];
    }
    // Return realistic generated data for any customer based on their capacity
    const cust = db.customers.find(c => c.id === customerId);
    const kw = cust ? cust.systemCapacityKw : 4;
    return {
      todayUnitsKwh: +(kw * 4.2).toFixed(1),
      currentPowerKw: +(kw * 0.76).toFixed(2),
      peakPowerKw: +(kw * 0.98).toFixed(2),
      monthUnitsKwh: +(kw * 125).toFixed(0),
      lifetimeUnitsKwh: +(kw * 2800).toFixed(0),
      lifetimeSavingsInr: +(kw * 2800 * 8).toFixed(0),
      co2OffsetTons: +(kw * 2.8).toFixed(1),
      treesPlanted: +(kw * 45).toFixed(0),
      coalSavedTons: +(kw * 1.3).toFixed(1),
      hourlyToday: [
        { time: "06:00", kw: +(kw * 0.02).toFixed(2) },
        { time: "07:00", kw: +(kw * 0.16).toFixed(2) },
        { time: "08:00", kw: +(kw * 0.38).toFixed(2) },
        { time: "09:00", kw: +(kw * 0.58).toFixed(2) },
        { time: "10:00", kw: +(kw * 0.74).toFixed(2) },
        { time: "11:00", kw: +(kw * 0.89).toFixed(2) },
        { time: "12:00", kw: +(kw * 0.97).toFixed(2) },
        { time: "13:00", kw: +(kw * 0.95).toFixed(2) },
        { time: "14:00", kw: +(kw * 0.83).toFixed(2) },
        { time: "15:00", kw: +(kw * 0.65).toFixed(2) },
        { time: "16:00", kw: +(kw * 0.42).toFixed(2) },
        { time: "17:00", kw: +(kw * 0.18).toFixed(2) },
        { time: "18:00", kw: +(kw * 0.03).toFixed(2) }
      ],
      monthlyHistory: [
        { month: "Jun", units: +(kw * 120), savings: +(kw * 120 * 8) },
        { month: "Jul", units: +(kw * 105), savings: +(kw * 105 * 8) },
        { month: "Aug", units: +(kw * 110), savings: +(kw * 110 * 8) },
        { month: "Sep", units: +(kw * 118), savings: +(kw * 118 * 8) },
        { month: "Oct", units: +(kw * 128), savings: +(kw * 128 * 8) },
        { month: "Nov", units: +(kw * 125), savings: +(kw * 125 * 8) }
      ]
    };
  },

  // Reports & Analytics Summary
  getAnalyticsSummary: () => {
    const db = readDb();
    const totalLeads = db.leads.length;
    const newLeads = db.leads.filter(l => l.status === 'New').length;
    const pendingLeads = db.leads.filter(l => l.status === 'Pending' || l.status === 'Site Visit Scheduled').length;
    const convertedLeads = db.leads.filter(l => l.status === 'Converted').length;

    const totalCustomers = db.customers.length;
    const activeInstallations = db.installations.filter(i => i.progressPercent < 100).length;
    const completedInstallations = db.installations.filter(i => i.progressPercent === 100).length;

    const totalKwInstalled = db.customers.reduce((acc, c) => acc + (c.systemCapacityKw || 0), 0);
    const totalRevenue = db.invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
    const totalDue = db.invoices.reduce((acc, inv) => acc + (inv.dueAmount || 0), 0);
    const totalSubsidyDisbursed = db.subsidies
      .filter(s => s.status === 'Disbursed')
      .reduce((acc, s) => acc + (s.totalSubsidy || 0), 0);

    return {
      kpi: {
        totalLeads,
        newLeads,
        pendingLeads,
        convertedLeads,
        conversionRate: totalLeads ? +((convertedLeads / totalLeads) * 100).toFixed(1) : 0,
        totalCustomers,
        activeInstallations,
        completedInstallations,
        totalKwInstalled,
        totalRevenue,
        totalDue,
        totalSubsidyDisbursed
      },
      recentLeads: db.leads.slice(0, 5),
      recentInstallations: db.installations.slice(0, 5),
      recentInvoices: db.invoices.slice(0, 5)
    };
  }
};

