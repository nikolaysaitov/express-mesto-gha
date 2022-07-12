const cors = require('cors');

const allowedCors = {
  origin: [
    'https://saitovkms.nomoredomains.xyz/',
    'http://saitovkms.nomoredomains.xyz/',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

module.exports = cors(allowedCors);