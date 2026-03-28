export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { phone_number, wallet_code } = req.body;
    const response = await fetch('https://rfpdev.me/api/check-wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_number,
        wallet_code,
        api_key: process.env.API_KEY
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
}
