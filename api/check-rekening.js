export default async function handler(req, res) {
  // 1. Tambahkan Header CORS (Biar nggak diblokir browser sendiri)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { account_number, bank_code } = req.body || {};
  const apiKey = process.env.API_KEY;

  // 2. Validasi Input (Biar nggak ngirim data kosong ke pusat)
  if (!account_number || !bank_code) {
    return res.status(400).json({ status: 'error', message: 'Nomor rekening dan kode bank wajib diisi' });
  }

  try {
    const response = await fetch('https://rfpdev.xyz/api/check-rekening', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify({ 
        account_number, 
        bank_code, 
        api_key: apiKey 
      }),
    });

    // 3. Gunakan cara ini untuk baca JSON biar nggak crash kalau responnya kosong
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error Detail:", error); // Muncul di log Vercel kalau gagal
    return res.status(500).json({ 
      status: 'error', 
      message: 'Gagal menghubungi server pusat rfpdev' 
    });
  }
}
