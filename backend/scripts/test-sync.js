(async function(){
  const base = 'http://localhost:4000';
  try {
    // try register (may fail if user exists)
    const r = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_sync@example.com', password: 'Password123!', name: 'Sync Tester' }),
    });
    if (r.ok) console.log('Registered test user');
    else console.log('Register response status', r.status);
  } catch (err) {
    console.warn('Register error', err.message);
  }

  try {
    const loginRes = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_sync@example.com', password: 'Password123!' }),
    });
    if (!loginRes.ok) {
      const t = await loginRes.text();
      console.error('Login failed:', loginRes.status, t);
      process.exit(1);
    }
    const login = await loginRes.json();
    const token = login.access_token;
    console.log('Token:', token);

    const payload = { tasks: [{ title: 'offline-sync-test', description: 'synced by automated test', status: 'PENDING' }] };
    const syncRes = await fetch(`${base}/tasks/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const body = await syncRes.text();
    console.log('Sync status:', syncRes.status);
    try { console.log('Sync body:', JSON.parse(body)); } catch(e) { console.log('Sync body (raw):', body); }
  } catch (err) {
    console.error('Error during login/sync:', err.message);
    process.exit(1);
  }
})();
