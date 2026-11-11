const https = require('https');

const PIN_CACHE = {};

// Accurate prefix overrides
const PREFIX_OVERRIDES = {
  '227406': { district: 'Amethi (Sultanpur)', state: 'Uttar Pradesh' },
  '227': { district: 'Amethi / Sultanpur', state: 'Uttar Pradesh' },
  '228': { district: 'Sultanpur', state: 'Uttar Pradesh' },
  '229': { district: 'Raebareli', state: 'Uttar Pradesh' },
  '226': { district: 'Lucknow', state: 'Uttar Pradesh' },
  '225': { district: 'Barabanki', state: 'Uttar Pradesh' },
  '201': { district: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
  '302': { district: 'Jaipur', state: 'Rajasthan' },
  '110': { district: 'New Delhi', state: 'Delhi' }
};

// Comprehensive Indian Pincode Resolver (2-digit fallback)
const PIN_PREFIX_MAP = {
  '11': { district: 'New Delhi', state: 'Delhi' },
  '12': { district: 'Gurugram / Faridabad', state: 'Haryana' },
  '13': { district: 'Ambala / Panipat', state: 'Haryana' },
  '14': { district: 'Ludhiana / Jalandhar', state: 'Punjab' },
  '15': { district: 'Bathinda / Patiala', state: 'Punjab' },
  '16': { district: 'Chandigarh', state: 'Chandigarh' },
  '17': { district: 'Shimla / Solan', state: 'Himachal Pradesh' },
  '18': { district: 'Jammu', state: 'Jammu & Kashmir' },
  '19': { district: 'Srinagar', state: 'Jammu & Kashmir' },
  '20': { district: 'Noida / Greater Noida / Aligarh', state: 'Uttar Pradesh' },
  '21': { district: 'Prayagraj / Fatehpur', state: 'Uttar Pradesh' },
  '22': { district: 'Lucknow / Amethi / Sultanpur', state: 'Uttar Pradesh' },
  '23': { district: 'Mirzapur / Sonbhadra', state: 'Uttar Pradesh' },
  '24': { district: 'Dehradun / Haridwar / Bareilly', state: 'Uttarakhand / UP' },
  '25': { district: 'Meerut / Ghaziabad / Muzaffarnagar', state: 'Uttar Pradesh' },
  '26': { district: 'Pilibhit / Lakhimpur', state: 'Uttar Pradesh' },
  '27': { district: 'Gorakhpur / Basti', state: 'Uttar Pradesh' },
  '28': { district: 'Agra / Mathura / Jhansi', state: 'Uttar Pradesh' },
  '30': { district: 'Jaipur / Alwar / Dausa', state: 'Rajasthan' },
  '31': { district: 'Udaipur / Bhilwara / Chittorgarh', state: 'Rajasthan' },
  '32': { district: 'Kota / Bharatpur / Sawai Madhopur', state: 'Rajasthan' },
  '33': { district: 'Bikaner / Sikar / Jhunjhunu', state: 'Rajasthan' },
  '34': { district: 'Jodhpur / Barmer / Pali', state: 'Rajasthan' },
  '36': { district: 'Rajkot / Jamnagar / Junagadh', state: 'Gujarat' },
  '37': { district: 'Kutch / Bhuj', state: 'Gujarat' },
  '38': { district: 'Ahmedabad / Gandhinagar', state: 'Gujarat' },
  '39': { district: 'Surat / Vadodara / Bharuch', state: 'Gujarat' },
  '40': { district: 'Mumbai / Thane / Navi Mumbai / Goa', state: 'Maharashtra' },
  '41': { district: 'Pune / Satara / Solapur / Kolhapur', state: 'Maharashtra' },
  '42': { district: 'Nashik / Dhule / Jalgaon', state: 'Maharashtra' },
  '43': { district: 'Aurangabad / Nanded / Jalna', state: 'Maharashtra' },
  '44': { district: 'Nagpur / Amravati / Akola', state: 'Maharashtra' },
  '45': { district: 'Indore / Ujjain / Dewas', state: 'Madhya Pradesh' },
  '46': { district: 'Bhopal / Sehore / Hoshangabad', state: 'Madhya Pradesh' },
  '47': { district: 'Gwalior / Morena / Shivpuri', state: 'Madhya Pradesh' },
  '48': { district: 'Jabalpur / Sagar / Rewa', state: 'Madhya Pradesh' },
  '49': { district: 'Raipur / Bilaspur / Durg-Bhilai', state: 'Chhattisgarh' },
  '50': { district: 'Hyderabad / Secunderabad / Rangareddy', state: 'Telangana' },
  '51': { district: 'Kurnool / Kadapa / Anantapur', state: 'Andhra Pradesh' },
  '52': { district: 'Vijayawada / Guntur', state: 'Andhra Pradesh' },
  '53': { district: 'Visakhapatnam / Kakinada', state: 'Andhra Pradesh' },
  '56': { district: 'Bengaluru Urban / Rural', state: 'Karnataka' },
  '57': { district: 'Mangaluru / Mysuru / Hassan', state: 'Karnataka' },
  '58': { district: 'Hubballi / Belagavi', state: 'Karnataka' },
  '59': { district: 'Belagavi / Bagalkot', state: 'Karnataka' },
  '60': { district: 'Chennai / Kanchipuram / Tiruvallur', state: 'Tamil Nadu' },
  '61': { district: 'Thanjavur / Tiruchirappalli', state: 'Tamil Nadu' },
  '62': { district: 'Madurai / Dindigul', state: 'Tamil Nadu' },
  '63': { district: 'Salem / Vellore / Erode', state: 'Tamil Nadu' },
  '64': { district: 'Coimbatore / Tirupur', state: 'Tamil Nadu' },
  '67': { district: 'Kozhikode / Kannur', state: 'Kerala' },
  '68': { district: 'Kochi / Ernakulam / Thrissur', state: 'Kerala' },
  '69': { district: 'Thiruvananthapuram / Kollam', state: 'Kerala' },
  '70': { district: 'Kolkata / South 24 Parganas', state: 'West Bengal' },
  '71': { district: 'Howrah / Hooghly', state: 'West Bengal' },
  '72': { district: 'Midnapore / Bankura', state: 'West Bengal' },
  '73': { district: 'Siliguri / Darjeeling / Jalpaiguri', state: 'West Bengal' },
  '74': { district: 'North 24 Parganas / Nadia', state: 'West Bengal' },
  '75': { district: 'Bhubaneswar / Puri / Khordha', state: 'Odisha' },
  '76': { district: 'Cuttack / Kendrapara', state: 'Odisha' },
  '77': { district: 'Rourkela / Sambalpur', state: 'Odisha' },
  '78': { district: 'Guwahati / Kamrup', state: 'Assam' },
  '79': { district: 'Shillong / Agartala / Imphal', state: 'North East' },
  '80': { district: 'Patna / Nalanda', state: 'Bihar' },
  '81': { district: 'Bhagalpur / Munger', state: 'Bihar' },
  '82': { district: 'Gaya / Aurangabad', state: 'Bihar' },
  '83': { district: 'Ranchi / Jamshedpur', state: 'Jharkhand' },
  '84': { district: 'Dhanbad / Bokaro', state: 'Jharkhand' },
  '85': { district: 'Purnia / Katihar', state: 'Bihar' }
};

function getFallback(pin) {
  if (PREFIX_OVERRIDES[pin]) {
    const o = PREFIX_OVERRIDES[pin];
    return { district: o.district, state: o.state, city: `${o.district}, ${o.state}`, valid: true };
  }
  for (let len = 4; len >= 2; len--) {
    const sub = pin.substring(0, len);
    if (PREFIX_OVERRIDES[sub]) {
      const o = PREFIX_OVERRIDES[sub];
      return { district: o.district, state: o.state, city: `${o.district}, ${o.state}`, valid: true };
    }
  }
  const prefix2 = pin.substring(0, 2);
  const info = PIN_PREFIX_MAP[prefix2] || { district: 'Solar Service Hub', state: 'India' };
  return {
    district: info.district,
    state: info.state,
    city: `${info.district}, ${info.state}`,
    valid: true
  };
}

function resolvePincode(pin) {
  if (!pin || pin.length !== 6) return null;

  if (PIN_CACHE[pin]) {
    return Promise.resolve(PIN_CACHE[pin]);
  }

  return new Promise((resolve) => {
    const fallback = getFallback(pin);

    // Call India Post API
    const req = https.get(`https://api.postalpincode.in/pincode/${pin}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed[0] && parsed[0].Status === 'Success' && parsed[0].PostOffice && parsed[0].PostOffice.length > 0) {
            const po = parsed[0].PostOffice[0];
            let district = po.District;
            if (po.Block && po.Block !== 'NA' && po.Block !== district) {
              district = `${po.Block} (${district})`;
            }
            const state = po.State;
            const resObj = {
              district: district,
              state: state,
              city: `${district}, ${state}`,
              postOffice: po.Name,
              valid: true
            };
            PIN_CACHE[pin] = resObj;
            return resolve(resObj);
          }
        } catch (e) {}
        PIN_CACHE[pin] = fallback;
        resolve(fallback);
      });
      res.on('error', () => {
        PIN_CACHE[pin] = fallback;
        resolve(fallback);
      });
    });

    req.on('error', () => {
      PIN_CACHE[pin] = fallback;
      resolve(fallback);
    });

    req.setTimeout(2000, () => {
      req.abort();
      PIN_CACHE[pin] = fallback;
      resolve(fallback);
    });
  });
}

module.exports = { resolvePincode, getFallback };
