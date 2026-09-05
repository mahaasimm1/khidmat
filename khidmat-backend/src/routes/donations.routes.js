const express = require('express');
const router = express.Router();
const {
  createDonation,
  getMyDonations,
  getDonationsByCause,
  getAllDonations
} = require('../controllers/donations.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

// All donation routes require a logged-in user
router.use(authenticate);

// IMPORTANT: specific routes ('/me') must come before parameterized ones ('/cause/:causeId')
// so Express doesn't try to match '/me' as a cause ID.
router.post('/', createDonation);
router.get('/me', getMyDonations);
router.get('/cause/:causeId', requireRole('admin'), getDonationsByCause);
router.get('/', requireRole('admin'), getAllDonations);

module.exports = router;