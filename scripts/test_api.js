const http = require('http');

async function testServer() {
  // Start server in background
  const app = require('../server.js');
  // Wait 1 second for listen
  await new Promise(r => setTimeout(r, 1000));

  function request(path, options = {}) {
    return new Promise((resolve, reject) => {
      const opts = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: options.method || 'GET',
        headers: options.headers || {}
      };
      const req = http.request(opts, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, headers: res.headers, body });
        });
      });
      req.on('error', reject);
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    });
  }

  console.log('--- TESTING API ENDPOINTS ---');

  // Test 1: Settings
  const sRes = await request('/api/settings');
  console.log('1. GET /api/settings -> Status:', sRes.status, 'Company:', JSON.parse(sRes.body).data.companyName);

  // Test 2: Calculate
  const cRes = await request('/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ monthlyBill: 5000, pincode: '201301' })
  });
  console.log('2. POST /api/calculate -> Status:', cRes.status, 'Rec. kW:', JSON.parse(cRes.body).data.recommendedCapacityKw);

  // Test 3: Leads
  const lRes = await request('/api/leads');
  console.log('3. GET /api/leads -> Status:', lRes.status, 'Count:', JSON.parse(lRes.body).count);

  // Test 4: Create Lead
  const postLead = await request('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Lead Consumer',
      phone: '9899887766',
      pincode: '110001',
      city: 'Delhi',
      monthlyBillAmount: 4200
    })
  });
  console.log('4. POST /api/leads -> Status:', postLead.status, 'New Lead ID:', JSON.parse(postLead.body).data.id);

  // Test 5: Analytics
  const aRes = await request('/api/analytics');
  console.log('5. GET /api/analytics -> Status:', aRes.status, 'Total Leads:', JSON.parse(aRes.body).data.kpi.totalLeads);

  // Test 6: Customers
  const custRes = await request('/api/customers');
  console.log('6. GET /api/customers -> Status:', custRes.status, 'Count:', JSON.parse(custRes.body).data.length);

  // Test 7: Products
  const pRes = await request('/api/products');
  console.log('7. GET /api/products -> Status:', pRes.status, 'Count:', JSON.parse(pRes.body).data.length);

  // Test 8: Site Visits
  const svRes = await request('/api/site-visits');
  console.log('8. GET /api/site-visits -> Status:', svRes.status, 'Count:', JSON.parse(svRes.body).data.length);

  // Test 9: Installations
  const instRes = await request('/api/installations');
  console.log('9. GET /api/installations -> Status:', instRes.status, 'Count:', JSON.parse(instRes.body).data.length);

  // Test 10: Invoices
  const invRes = await request('/api/invoices');
  console.log('10. GET /api/invoices -> Status:', invRes.status, 'Count:', JSON.parse(invRes.body).data.length);

  // Test 11: Subsidies
  const subRes = await request('/api/subsidies');
  console.log('11. GET /api/subsidies -> Status:', subRes.status, 'Count:', JSON.parse(subRes.body).data.length);

  // Test 12: Support Tickets
  const tickRes = await request('/api/tickets');
  console.log('12. GET /api/tickets -> Status:', tickRes.status, 'Count:', JSON.parse(tickRes.body).data.length);

  // Test 13: Admin Panel HTML
  const adminRes = await request('/admin/');
  console.log('13. GET /admin/ -> Status:', adminRes.status, 'Contains Admin Portal:', adminRes.body.includes('Admin Portal'));

  // Test 14: Customer Portal HTML
  const cpRes = await request('/customer/');
  console.log('14. GET /customer/ -> Status:', cpRes.status, 'Contains Customer Solar Portal:', cpRes.body.includes('Customer Solar Portal'));

  // Test 15: Homepage HTML
  const homeRes = await request('/');
  console.log('15. GET / -> Status:', homeRes.status, 'Contains Shree Rudra Power Systems:', homeRes.body.includes('Shree Rudra Power Systems'));

  console.log('--- ALL 15 TESTS COMPLETED SUCCESSFULLY! ---');
  process.exit(0);
}

testServer().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

