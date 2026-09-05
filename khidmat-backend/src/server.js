const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const causesRoutes = require('./routes/causes.routes');
const eventsRoutes = require('./routes/events.routes');
const donationsRoutes = require('./routes/donations.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/causes', causesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/donations', donationsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
