const https = require('https');

const candidates = [
  'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1622484212850-eb596d769edc?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1000&q=80'
];

async function check(url) {
  return new Promise((resolve) => {
    https.get(url, { method: 'HEAD' }, (res) => {
      console.log(url, res.statusCode);
      resolve();
    }).on('error', (e) => {
      console.log(url, 'ERR', e.message);
      resolve();
    });
  });
}

(async () => {
  for (const c of candidates) await check(c);
})();
