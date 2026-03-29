export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { account_number, bank_code } = req.body || {};

  if (!account_number || !bank_code) {
    return res.status(400).json({ status: 'error', message: 'account_number dan bank_code wajib diisi' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ status: 'error', message: 'API_KEY belum dikonfigurasi' });
  }

  try {
    const response = await fetch('https://rfpdev.xyz/api/check-rekening', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ account_number, bank_code, api_key: apiKey }),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch {
      console.error('Non-JSON response:', text);
      return res.status(502).json({ status: 'error', message: 'Response tidak valid dari API' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
