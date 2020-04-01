const app = require('./src/server');
port = process.env.PORT || 3000;

app.listen(port);
console.log(`starting server on port: ${port}`);