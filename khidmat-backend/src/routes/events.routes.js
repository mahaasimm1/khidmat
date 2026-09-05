const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/events.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

// All events routes require a logged-in user
router.use(authenticate);

router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin-only write operations
router.post('/', requireRole('admin'), createEvent);
router.put('/:id', requireRole('admin'), updateEvent);
router.delete('/:id', requireRole('admin'), deleteEvent);

module.exports = router;