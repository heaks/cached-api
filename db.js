const mongoose = require('mongoose');

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017';

mongoose.connect(url, { useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));