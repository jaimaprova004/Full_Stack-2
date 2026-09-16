(async ()=>{
  try{
    // login as alice
    const login = await fetch('http://localhost:3000/api/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username: 'alice', password: 'password' })
    });
    if (!login.ok) { console.error('Login failed', await login.text()); return; }
    const lj = await login.json();
    const token = lj.token;
    console.log('Logged in as', lj.username);
    // create a post
    const create = await fetch('http://localhost:3000/api/posts', {
      method:'POST', headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`},
      body: JSON.stringify({ title: 'Live demo post', body: 'Created for the presentation.' })
    });
    const cj = await create.json();
    if (!create.ok) { console.error('Create failed', cj); return; }
    console.log('Created post', cj.id);
    // fetch posts
    const posts = await fetch('http://localhost:3000/api/posts', { headers: { Authorization: `Bearer ${token}` } });
    const pj = await posts.json();
    console.log('POSTS', JSON.stringify(pj));
  } catch (err){ console.error('ERR', err.message); }
})();
