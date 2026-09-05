const express = require('express');
const router = express.Router();
const {
  getCauses,
  getCauseById,
  createCause,
  updateCause,
  deleteCause
} = require('../controllers/causes.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

// All causes routes require a logged-in user
router.use(authenticate);

router.get('/', getCauses);
router.get('/:id', getCauseById);

// Admin-only write operations
router.post('/', requireRole('admin'), createCause);
router.put('/:id', requireRole('admin'), updateCause);
router.delete('/:id', requireRole('admin'), deleteCause);

module.exports = router;