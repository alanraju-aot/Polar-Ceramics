const http = require('http');

http.get('http://localhost:5173/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status Code:', res.statusCode);
    console.log('HTML Length:', data.length);
    const titleMatch = data.match(/<title>(.*?)<\/title>/);
    console.log('Document Title:', titleMatch ? titleMatch[1] : 'Not Found');
    console.log('Main Script Included:', data.includes('src="/src/main.jsx"'));
  });
}).on('error', (err) => {
  console.error('Error connecting to server:', err.message);
});
