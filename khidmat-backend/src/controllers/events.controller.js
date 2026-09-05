const supabase = require('../config/supabaseClient');

// ---------- LIST ALL EVENTS ----------
async function getEvents(req, res) {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, description, cause_id, location, event_date, status, created_at')
      .order('event_date', { ascending: true });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching events' });
    }

    return res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- GET SINGLE EVENT ----------
async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select('id, title, description, cause_id, location, event_date, status, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching event' });
    }

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- CREATE EVENT (admin only) ----------
async function createEvent(req, res) {
  try {
    const { title, description, cause_id, location, event_date } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ error: 'title and event_date are required' });
    }

    // If a cause_id was provided, make sure it actually exists
    if (cause_id) {
      const { data: cause, error: causeError } = await supabase
        .from('causes')
        .select('id')
        .eq('id', cause_id)
        .maybeSingle();

      if (causeError) {
        console.error(causeError);
        return res.status(500).json({ error: 'Error validating cause_id' });
      }
      if (!cause) {
        return res.status(400).json({ error: 'cause_id does not match any existing cause' });
      }
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert([{
        title,
        description: description || null,
        cause_id: cause_id || null,
        location: location || null,
        event_date,
        created_by: req.user.id
      }])
      .select('id, title, description, cause_id, location, event_date, status, created_at')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error creating event' });
    }

    return res.status(201).json({ event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- UPDATE EVENT (admin only) ----------
async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { title, description, cause_id, location, event_date, status } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (cause_id !== undefined) updates.cause_id = cause_id;
    if (location !== undefined) updates.location = location;
    if (event_date !== undefined) updates.event_date = event_date;
    if (status !== undefined) updates.status = status;
    updates.updated_at = new Date().toISOString();

    const { data: event, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select('id, title, description, cause_id, location, event_date, status, created_at')
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error updating event' });
    }

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- DELETE EVENT (admin only) ----------
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    const { data: deleted, error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error deleting event' });
    }

    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };