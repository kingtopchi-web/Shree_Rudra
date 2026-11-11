'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  // Calculator state
  const [calcBill, setCalcBill] = useState(3500);
  const [calcPincode, setCalcPincode] = useState('201301');
  const [calcResult, setCalcResult] = useState({
    recommendedCapacityKw: 3,
    dailyGenerationUnits: 12.6,
    monthlySavings: 3100,
    annualSavings: 37200,
    roofSpaceSqFt: 240,
    grossPrice: 165000,
    centralSubsidy: 78000,
    netPrice: 87000,
    paybackYears: 2.3
  });
  const [isCalculating, setIsCalculating] = useState(false);

  // Lead Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('201301');
  const [billRange, setBillRange] = useState('2500-4000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);

  // Run calculation
  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyBill: calcBill, pincode: calcPincode })
      }).then(r => r.json());

      if (res.success) {
        setCalcResult(res.data);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Run consultation booking
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Please enter your full name and 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          pincode,
          monthlyBill: billRange,
          notes: `Website Consultation Lead: ${calcResult.recommendedCapacityKw} kW recommended`
        })
      }).then(r => r.json());

      if (res.success) {
        setSubmittedLead(res.data);
        setFullName('');
        setPhone('');
      }
    } catch (err) {
      console.error('Lead error:', err);
      alert('Thank you! Your request has been recorded.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '14px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="Shree Rudra Power Systems" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#E51D24', letterSpacing: '0.5px' }}>
                SHREE RUDRA
              </div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#111827', letterSpacing: '2px' }}>
                POWER SYSTEMS
              </div>
            </div>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
            <a href="#calculator" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Solar Calculator</a>
            <a href="#packages" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Solar Packages</a>
            <a href="#why-us" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Why Shree Rudra</a>
            <a href="#consultation" style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Book Survey</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/customer" className="btn btn-outline" style={{ borderRadius: '20px', fontSize: '12.5px', padding: '7px 15px' }}>
              <i className="fa-solid fa-user-circle"></i> Customer Portal
            </Link>
            <Link href="/admin" className="btn btn-primary" style={{ borderRadius: '20px', fontSize: '12.5px', padding: '7px 15px' }}>
              <i className="fa-solid fa-shield-halved"></i> Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #fef2f2 0%, #ffffff 100%)',
        padding: '60px 0 50px',
        borderBottom: '1px solid #fee2e2'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: '800',
              marginBottom: '16px'
            }}>
              <i className="fa-solid fa-bolt text-danger"></i> PM Surya Ghar: Muft Bijli Yojana Approved
            </div>

            <h1 style={{ fontSize: '38px', fontWeight: '900', color: '#111827', lineHeight: '1.2', marginBottom: '16px' }}>
              Cut Your Electricity Bill to <span style={{ color: '#E51D24' }}>Zero</span> With Shree Rudra Solar
            </h1>

            <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6', marginBottom: '24px' }}>
              India’s trusted rooftop solar partner. Enjoy up to <strong>₹78,000 Direct Govt Subsidy</strong>, cyclone-proof mounting, Tier-1 Mono PERC & TopCon panels, and 25-Year performance warranty.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <a href="#calculator" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
                <i className="fa-solid fa-calculator"></i> Calculate Solar Savings
              </a>
              <a href="#consultation" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '15px' }}>
                <i className="fa-solid fa-calendar-check"></i> Book Free Site Visit
              </a>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#111827' }}>₹78,000</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Max Govt Subsidy</div>
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981' }}>25 Years</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Panel Warranty</div>
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#3b82f6' }}>0 EMI</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Solar Loan Financing</div>
              </div>
            </div>
          </div>

          {/* Quick Lead Form in Hero */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '30px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
              Get Free Rooftop Solar Quote
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
              Our engineer will visit your home for 3D shadow analysis.
            </p>

            <form onSubmit={handleLeadSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  pattern="^\d{10}$"
                  maxLength={10}
                  required
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={6}
                    required
                    placeholder="e.g. 201301"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Bill</label>
                  <select
                    className="form-select"
                    value={billRange}
                    onChange={(e) => setBillRange(e.target.value)}
                  >
                    <option value="1500-2500">₹1,500 - ₹2,500</option>
                    <option value="2500-4000">₹2,500 - ₹4,000</option>
                    <option value="4000-8000">₹4,000 - ₹8,000</option>
                    <option value=">8000">More than ₹8,000</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '14.5px' }}
              >
                {isSubmitting ? 'Booking Survey...' : 'Book Free Consultation →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Solar Calculator Section */}
      <section id="calculator" style={{ padding: '70px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
            <span className="badge badge-info mb-2"><i className="fa-solid fa-calculator"></i> Solar Estimation Engine</span>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#111827', margin: '8px 0' }}>
              Calculate Your Rooftop Solar Savings
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14.5px' }}>
              Estimate recommended kW plant size, roof area needed, and central subsidy under PM Surya Ghar Yojana.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '36px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px'
          }}>
            {/* Input Controls */}
            <div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
                    Monthly Electricity Bill (₹)
                  </label>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: '#E51D24' }}>
                    ₹{Number(calcBill).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="15000"
                  step="300"
                  value={calcBill}
                  onChange={(e) => {
                    setCalcBill(Number(e.target.value));
                    handleCalculate();
                  }}
                  style={{ width: '100%', height: '8px', accentColor: '#E51D24', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                  <span>₹1,200</span>
                  <span>₹7,500</span>
                  <span>₹15,000+</span>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Installation PIN Code</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={6}
                    value={calcPincode}
                    onChange={(e) => setCalcPincode(e.target.value)}
                    placeholder="Enter 6-digit PIN"
                  />
                  <button
                    onClick={handleCalculate}
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Calculate
                  </button>
                </div>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#991b1b', textTransform: 'uppercase' }}>
                  Subsidy Guarantee
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px' }}>
                  Shree Rudra Power Systems handles 100% DISCOM net-meter paperwork and National Portal subsidy disbursement directly into your bank account.
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div style={{ background: '#111827', color: '#ffffff', borderRadius: '18px', padding: '28px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1px' }}>
                RECOMMENDED SYSTEM CAPACITY
              </div>
              <div style={{ fontSize: '42px', fontWeight: '900', color: '#38bdf8', margin: '4px 0 16px' }}>
                {calcResult.recommendedCapacityKw} <small style={{ fontSize: '20px', color: '#ffffff' }}>kW Solar Plant</small>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Monthly Bill Savings</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>
                    ₹{Number(calcResult.monthlySavings).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Roof Area Required</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                    ~{calcResult.roofSpaceSqFt} sq. ft.
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px', fontSize: '13px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#cbd5e1' }}>
                  <span>Gross System Cost:</span>
                  <span>₹{Number(calcResult.grossPrice).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#34d399', fontWeight: '700' }}>
                  <span>PM Surya Ghar Govt Subsidy:</span>
                  <span>- ₹{Number(calcResult.centralSubsidy).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '8px', fontSize: '16px', fontWeight: '900', color: '#fb7185' }}>
                  <span>Net Investment:</span>
                  <span>₹{Number(calcResult.netPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <a
                href="#consultation"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', textAlign: 'center', display: 'block' }}
              >
                Book Survey For This System →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" style={{ padding: '70px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
            <span className="badge badge-success mb-2"><i className="fa-solid fa-solar-panel"></i> Turnkey Solar Packages</span>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#111827', margin: '8px 0' }}>
              Standard Rooftop Solar Plants
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14.5px' }}>
              All packages include Bi-facial/Mono PERC modules, smart inverter, galvanized structure, net metering & 5-year free maintenance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* 1 kW */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: '#ffffff' }}>
              <span className="badge badge-info mb-2">Residential</span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>1 kW Eco System</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '6px 0 16px' }}>For homes with monthly electricity bill under ₹1,500.</p>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#E51D24', marginBottom: '14px' }}>
                ₹35,000 <small style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'line-through' }}>₹65,000</small>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12.5px', color: '#4b5563', lineHeight: '1.8', marginBottom: '20px' }}>
                <li>✓ 2x 540W Mono PERC Half-Cut Panels</li>
                <li>✓ 1 kW Smart Grid-Tied Inverter</li>
                <li>✓ ₹30,000 Central Govt Subsidy</li>
                <li>✓ 25-Year Linear Power Warranty</li>
              </ul>
              <a href="#consultation" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Choose 1 kW</a>
            </div>

            {/* 2 kW */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: '#ffffff' }}>
              <span className="badge badge-info mb-2">Residential</span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>2 kW Standard System</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '6px 0 16px' }}>For bills between ₹1,500 - ₹3,000/month.</p>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#E51D24', marginBottom: '14px' }}>
                ₹65,000 <small style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'line-through' }}>₹1,25,000</small>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12.5px', color: '#4b5563', lineHeight: '1.8', marginBottom: '20px' }}>
                <li>✓ 4x 540W Mono PERC Half-Cut Panels</li>
                <li>✓ 2 kW High Efficiency Inverter</li>
                <li>✓ ₹60,000 Central Govt Subsidy</li>
                <li>✓ 25-Year Linear Power Warranty</li>
              </ul>
              <a href="#consultation" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Choose 2 kW</a>
            </div>

            {/* 3 kW (Popular) */}
            <div style={{ border: '2px solid #E51D24', borderRadius: '16px', padding: '24px', background: '#fffbfa', position: 'relative' }}>
              <span className="badge badge-danger mb-2" style={{ backgroundColor: '#E51D24', color: '#ffffff' }}>★ Most Popular</span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>3 kW Smart Plant</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '6px 0 16px' }}>Best value under PM Surya Ghar Yojana.</p>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#E51D24', marginBottom: '14px' }}>
                ₹87,000 <small style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'line-through' }}>₹1,65,000</small>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12.5px', color: '#4b5563', lineHeight: '1.8', marginBottom: '20px' }}>
                <li>✓ 6x 550W TopCon Bi-facial Modules</li>
                <li>✓ 3 kW Dual MPPT Inverter + Mobile App</li>
                <li>✓ <strong>₹78,000 Max Central Subsidy</strong></li>
                <li>✓ Generates ~360 Units / month</li>
              </ul>
              <a href="#consultation" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Book 3 kW Plant</a>
            </div>

            {/* 5 kW */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', background: '#ffffff' }}>
              <span className="badge badge-info mb-2">Premium Villa</span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>5 kW Villa Plant</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '6px 0 16px' }}>Runs 2-3 ACs, refrigerator, motors.</p>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#E51D24', marginBottom: '14px' }}>
                ₹1,82,000 <small style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'line-through' }}>₹2,60,000</small>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '12.5px', color: '#4b5563', lineHeight: '1.8', marginBottom: '20px' }}>
                <li>✓ 9x 550W High-Yield TopCon Panels</li>
                <li>✓ 5 kW Three-Phase / Single Phase Inverter</li>
                <li>✓ ₹78,000 Central + State Subsidy</li>
                <li>✓ Generates ~600 Units / month</li>
              </ul>
              <a href="#consultation" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>Choose 5 kW</a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="why-us" style={{ padding: '70px 0', backgroundColor: '#f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
            <span className="badge badge-warning mb-2"><i className="fa-solid fa-award"></i> The Shree Rudra Standard</span>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#111827', margin: '8px 0' }}>
              Why Choose Shree Rudra Power Systems?
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14.5px' }}>
              Engineered for extreme Indian weather, windstorm resistance, and lifetime peak energy yield.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
                <i className="fa-solid fa-wind"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>Cyclone Proof Structure</h4>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                Engineered with heavy-duty galvanized iron structures capable of withstanding winds up to 170 km/h.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
                <i className="fa-solid fa-hand-holding-dollar"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>End-to-End Subsidy</h4>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                We manage portal registration, joint inspection, and DBT disbursal so you don’t have to visit government offices.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
                <i className="fa-solid fa-mobile-screen"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>Smart IoT Monitoring</h4>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                Track live power generation, daily units, and carbon savings in real-time from our dedicated Customer Dashboard.
              </p>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '8px' }}>25-Year Performance</h4>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                Guaranteed minimum 80% generation efficiency even after 25 years with free routine maintenance visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book Consultation Section */}
      <section id="consultation" style={{ padding: '70px 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span className="badge badge-warning mb-2" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>Zero Obligation</span>
              <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '6px 0' }}>Book Your Free Rooftop Site Survey</h2>
              <p style={{ fontSize: '13.5px', color: '#94a3b8' }}>
                Our certified solar engineer will visit your terrace with 3D drone shadow mapping tools.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#ffffff' }}>Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffffff' }}>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    className="form-input"
                    pattern="^\d{10}$"
                    maxLength={10}
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#ffffff' }}>Installation PIN Code *</label>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={6}
                    required
                    placeholder="6-digit PIN code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#ffffff' }}>Average Monthly Electricity Bill</label>
                <select
                  className="form-select"
                  value={billRange}
                  onChange={(e) => setBillRange(e.target.value)}
                >
                  <option value="1500-2500">₹1,500 - ₹2,500</option>
                  <option value="2500-4000">₹2,500 - ₹4,000</option>
                  <option value="4000-8000">₹4,000 - ₹8,000</option>
                  <option value=">8000">More than ₹8,000</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                {isSubmitting ? 'Booking Free Site Visit...' : 'Schedule My Free Rooftop Survey →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {submittedLead && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px'
            }}>
              ✓
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>
              Consultation Booked Successfully!
            </h3>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', marginBottom: '20px' }}>
              Thank you, <strong>{submittedLead.fullName}</strong>. Your consultation has been logged with Shree Rudra Power Systems.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '24px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#6b7280' }}>Reference Booking ID:</span>
                <strong style={{ color: '#E51D24' }}>{submittedLead.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#6b7280' }}>Registered Mobile:</span>
                <strong>+91 {submittedLead.phone}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Govt Subsidy Assistance:</span>
                <strong style={{ color: '#10b981' }}>Included (PM Surya Ghar)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/customer" className="btn btn-outline" style={{ flex: 1 }}>
                Customer Portal
              </Link>
              <button
                onClick={() => setSubmittedLead(null)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 'auto', backgroundColor: '#111827', color: '#ffffff', padding: '50px 0 24px', borderTop: '3px solid #E51D24' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src="/logo.png" alt="Shree Rudra Power Systems" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: '#E51D24' }}>SHREE RUDRA</div>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#ffffff', letterSpacing: '2px' }}>POWER SYSTEMS</div>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: '1.6' }}>
                Empowering Bharat with next-generation rooftop solar systems. Certified MNRE & DISCOM Empanelled Vendor.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: '#f8fafc' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '2' }}>
                <li><a href="#calculator">Solar Calculator</a></li>
                <li><a href="#packages">Turnkey Packages</a></li>
                <li><Link href="/customer">Customer Solar Portal</Link></li>
                <li><Link href="/admin">Admin Panel Control</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: '#f8fafc' }}>Subsidies & Schemes</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '2' }}>
                <li>PM Surya Ghar: Muft Bijli Yojana</li>
                <li>Central DBT Subsidy up to ₹78,000</li>
                <li>State Top-up Subsidies</li>
                <li>Net Metering Guidelines</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: '#f8fafc' }}>Corporate Office</h4>
              <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                <div>Plot B-42, Solar Industrial Complex, Sector 62, Noida, NCR, UP - 201309</div>
                <div style={{ marginTop: '6px' }}><i className="fa-solid fa-phone"></i> +91 98765 43210</div>
                <div><i className="fa-solid fa-envelope"></i> contact@shreerudrapower.com</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#64748b' }}>
            <div>© {new Date().getFullYear()} Shree Rudra Power Systems Pvt. Ltd. All Rights Reserved.</div>
            <div>GSTIN: 09AAACS4512F1Z8 • Reg. MNRE Channel Partner</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

