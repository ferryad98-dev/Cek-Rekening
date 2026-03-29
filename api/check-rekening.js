export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { account_number, bank_code } = req.body;
  const API_KEY = process.env.API_KEY; // Ambil dari Vercel Dashboard

  try {
    const response = await fetch('https://rfpdev.xyz/api/check-rekening', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_number, bank_code, api_key: API_KEY })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Server API Bermasalah' });
  }
}
