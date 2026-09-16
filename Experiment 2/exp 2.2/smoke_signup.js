(async ()=>{
  try{
    // try signing up a new user
    const signup = await fetch('http://localhost:3000/api/signup',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username: 'dave', password: 'password', roles: ['editor'] })
    });
    console.log('SIGNUP_STATUS', signup.status);
    console.log('SIGNUP_BODY', await signup.text());
    // login as that user
    const login = await fetch('http://localhost:3000/api/login',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username: 'dave', password: 'password' })
    });
    console.log('LOGIN_STATUS', login.status);
    console.log('LOGIN_BODY', await login.text());
  } catch (err){ console.error('ERR', err.message); }
})();
