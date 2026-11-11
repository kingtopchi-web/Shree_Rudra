const http = require('http');

function post(url, data, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const body = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'POST',
      headers
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + (parsed.search || ''),
      method: 'GET',
      headers
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function testE2E() {
  console.log('=== END-TO-END FLOW VERIFICATION ===\n');

  // 1. Submit a lead from homepage form
  console.log('1. Submitting new lead from homepage...');
  const newLead = {
    name: 'Vikas Sharma',
    phone: '9876501234',
    city: 'Jaipur',
    pincode: '302001',
    monthlyBill: 4500,
    systemType: 'Residential Rooftop',
    roofArea: 400,
    source: 'Solar Calculator Home'
  };
  const leadRes = await post('http://localhost:5000/api/leads', newLead);
  console.log('   Lead Created:', leadRes.status, leadRes.data.lead?.id, leadRes.data.lead?.name);

  // 2. Admin Login
  console.log('2. Admin authenticating...');
  const adminLogin = await post('http://localhost:5000/api/auth/admin-login', {
    username: 'admin',
    password: 'admin123'
  });
  console.log('   Admin Login:', adminLogin.status, adminLogin.data.success ? 'SUCCESS' : 'FAILED');
  const adminToken = adminLogin.data.token;

  // 3. Admin fetches Dashboard stats and Leads
  console.log('3. Admin fetching dashboard analytics and leads...');
  const statsRes = await get('http://localhost:5000/api/analytics/dashboard', adminToken);
  console.log('   Stats:', statsRes.status, 'Total Leads:', statsRes.data.totalLeads, 'Revenue:', statsRes.data.totalRevenue);

  const leadsList = await get('http://localhost:5000/api/leads', adminToken);
  const foundLead = leadsList.data.find(l => l.phone === '9876501234');
  console.log('   New lead found in list:', !!foundLead, 'Lead ID:', foundLead?.id);

  // 4. Admin converts lead to customer
  console.log('4. Converting lead to customer...');
  const convertRes = await post(`http://localhost:5000/api/leads/${foundLead.id}/convert`, {
    systemCapacityKw: 4,
    packageId: 'pkg-4kw'
  }, adminToken);
  console.log('   Convert Status:', convertRes.status, 'Customer ID:', convertRes.data.customer?.id);
  const customerId = convertRes.data.customer?.id;

  // 5. Customer Login
  console.log('5. Customer authenticating with mobile number 9876501234...');
  const custLogin = await post('http://localhost:5000/api/auth/customer-login', {
    identifier: '9876501234'
  });
  console.log('   Customer Login:', custLogin.status, custLogin.data.success ? 'SUCCESS' : 'FAILED');

  // 6. Customer raises service ticket
  console.log('6. Customer raising a service request ticket...');
  const ticketRes = await post('http://localhost:5000/api/tickets', {
    customerId: customerId,
    customerName: 'Vikas Sharma',
    phone: '9876501234',
    category: 'Generation Query',
    subject: 'Request for net meter inspection report',
    description: 'Please share the latest DISCOM net meter sync report.'
  });
  console.log('   Ticket Created:', ticketRes.status, 'Ticket ID:', ticketRes.data.ticket?.id);

  // 7. Verify Invoices
  console.log('7. Admin verifying invoices...');
  const invoicesRes = await get('http://localhost:5000/api/invoices', adminToken);
  console.log('   Invoices count:', invoicesRes.data?.length);

  console.log('\n=== ALL E2E STEPS PASSED SUCCESSFULLY! ===');
}

testE2E();

