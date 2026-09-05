#!/bin/bash
# =========================================================
# Khidmat Backend — Project Scaffold Script
# Run this once inside an empty folder to create the full
# structure with starter files.
# =========================================================

set -e

echo "Creating folder structure..."
mkdir -p src/config src/routes src/controllers src/middleware src/utils

# ---------- .env ----------
cat > .env << 'EOF'
SUPABASE_URL=your_project_url_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=make_up_a_long_random_string_here
PORT=5000
EOF

# ---------- .gitignore ----------
cat > .gitignore << 'EOF'
node_modules/
.env
EOF

# ---------- src/config/supabaseClient.js ----------
cat > src/config/supabaseClient.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
EOF

# ---------- src/middleware/auth.middleware.js ----------
cat > src/middleware/auth.middleware.js << 'EOF'
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verifies the JWT sent in the Authorization header (Bearer <token>)
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Restricts access to specific roles, e.g. requireRole('admin')
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
EOF

# ---------- src/routes/auth.routes.js ----------
cat > src/routes/auth.routes.js << 'EOF'
const express = require('express');
const router = express.Router();

// TODO: implement signup/login controllers
router.post('/signup', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;
EOF

# ---------- src/routes/causes.routes.js ----------
cat > src/routes/causes.routes.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;
EOF

# ---------- src/routes/events.routes.js ----------
cat > src/routes/events.routes.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;
EOF

# ---------- src/routes/donations.routes.js ----------
cat > src/routes/donations.routes.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;
EOF

# ---------- src/server.js ----------
cat > src/server.js << 'EOF'
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
EOF

# ---------- package.json ----------
if [ ! -f package.json ]; then
  npm init -y > /dev/null
fi

echo "Installing dependencies..."
npm install express dotenv cors @supabase/supabase-js bcryptjs jsonwebtoken > /dev/null
npm install --save-dev nodemon > /dev/null

# Add dev/start scripts to package.json using node (avoids sed portability issues)
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = 'nodemon src/server.js';
pkg.scripts.start = 'node src/server.js';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo ""
echo "Done. Project structure created and dependencies installed."
echo "Next steps:"
echo "  1. Fill in your real values in .env"
echo "  2. Run: npm run dev"
echo "  3. Visit: http://localhost:5000/health"