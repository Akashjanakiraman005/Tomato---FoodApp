import http from 'http';

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/user/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('BODY:', data);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

const postData = JSON.stringify({
  name: 'New User',
  email: 'newuser123@example.com',
  password: 'password123'
});

req.write(postData);
req.end();
