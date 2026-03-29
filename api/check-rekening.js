export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { account_number, bank_code } = req.body || {};
  const apiKey = process.env.API_KEY;

  try {
const response = await fetch('https://rfpdev.xyz/api/check-rekening', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Referer': 'https://rfpdev.xyz/',
    'Origin': 'https://rfpdev.xyz',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  },
  body: JSON.stringify({ account_number, bank_code, api_key: apiKey }),
});

    const contentType = response.headers.get("content-type");
    
    // Cek apakah balasannya beneran JSON?
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      // Kalau dapetnya HTML (Cloudflare/Error page)
      const textError = await response.text();
      console.log("Respon bukan JSON:", textError.substring(0, 100)); // Liat dikit isinya di log
      return res.status(500).json({ status: 'error', message: 'Server pusat memblokir akses (Cloudflare/Bot Detection)' });
    }

  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Gagal koneksi ke server pusat' });
  }
}
