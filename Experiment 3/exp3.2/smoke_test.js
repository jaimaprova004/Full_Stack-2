(async ()=>{
  try{
    const login = await fetch('http://localhost:3000/api/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username: 'alice', password: 'password' })
    });
    const lj = await login.json().catch(()=>({ raw: null }));
    console.log('LOGIN_STATUS', login.status);
    console.log('LOGIN_BODY', JSON.stringify(lj));
    if (!login.ok) return;
    const token = lj.token;
    const posts = await fetch('http://localhost:3000/api/posts',{ headers: { Authorization: `Bearer ${token}` } });
    const pj = await posts.json().catch(()=>({ raw: null }));
    console.log('POSTS_STATUS', posts.status);
    console.log('POSTS_BODY', JSON.stringify(pj));
  } catch (err){
    console.error('ERROR', err.message);
  }
})();
