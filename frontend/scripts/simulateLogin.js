import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const resp = await axios.post('http://127.0.0.1:8000/api/login', {
    email: 'mahasiswa@test.com',
    password: '123456'
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const data = resp.data;
  const token = data.access_token;
  const user = data.user;

  const store = {
    token: token,
    user: user,
    savedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.resolve(__dirname, '..', '.local_storage_sim.json'), JSON.stringify(store, null, 2));
  console.log('Simulated localStorage saved to frontend/.local_storage_sim.json');
  console.log(store);
} catch (err) {
  if (err.response) {
    console.error('Server responded with', err.response.status, err.response.data);
  } else {
    console.error('Request failed', err.message);
  }
  process.exit(1);
}
