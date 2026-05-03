const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/parks', require('./routes/parks'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/events', require('./routes/events'));
app.use('/api/bookmarks', require('./routes/bookmarks'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port ' + (process.env.PORT || 5000));
    });
  })
  .catch((err) => console.error('MongoDB error:', err));
