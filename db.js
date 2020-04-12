const mongoose = require('mongoose');

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017';

mongoose.connect(url, { useUnifiedTopology: true });
