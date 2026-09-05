const supabase = require('../config/supabaseClient');

// ---------- LIST ALL CAUSES ----------
async function getCauses(req, res) {
  try {
    const { data: causes, error } = await supabase
      .from('causes')
      .select('id, title, description, category, target_amount, raised_amount, zakat_eligible, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching causes' });
    }

    return res.status(200).json({ causes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- GET SINGLE CAUSE ----------
async function getCauseById(req, res) {
  try {
    const { id } = req.params;

    const { data: cause, error } = await supabase
      .from('causes')
      .select('id, title, description, category, target_amount, raised_amount, zakat_eligible, status, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching cause' });
    }

    if (!cause) {
      return res.status(404).json({ error: 'Cause not found' });
    }

    return res.status(200).json({ cause });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- CREATE CAUSE (admin only) ----------
async function createCause(req, res) {
  try {
    const { title, description, category, target_amount, zakat_eligible } = req.body;

    if (!title || target_amount === undefined) {
      return res.status(400).json({ error: 'title and target_amount are required' });
    }

    if (typeof target_amount !== 'number' || target_amount < 0) {
      return res.status(400).json({ error: 'target_amount must be a non-negative number' });
    }

    const { data: cause, error } = await supabase
      .from('causes')
      .insert([{
        title,
        description: description || null,
        category: category || null,
        target_amount,
        zakat_eligible: !!zakat_eligible,
        created_by: req.user.id
      }])
      .select('id, title, description, category, target_amount, raised_amount, zakat_eligible, status, created_at')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error creating cause' });
    }

    return res.status(201).json({ cause });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- UPDATE CAUSE (admin only) ----------
async function updateCause(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, target_amount, zakat_eligible, status } = req.body;

    // Build update object with only provided fields (partial update)
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (target_amount !== undefined) updates.target_amount = target_amount;
    if (zakat_eligible !== undefined) updates.zakat_eligible = !!zakat_eligible;
    if (status !== undefined) updates.status = status;
    updates.updated_at = new Date().toISOString();

    const { data: cause, error } = await supabase
      .from('causes')
      .update(updates)
      .eq('id', id)
      .select('id, title, description, category, target_amount, raised_amount, zakat_eligible, status, created_at')
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error updating cause' });
    }

    if (!cause) {
      return res.status(404).json({ error: 'Cause not found' });
    }

    return res.status(200).json({ cause });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- DELETE CAUSE (admin only) ----------
async function deleteCause(req, res) {
  try {
    const { id } = req.params;

    const { data: deleted, error } = await supabase
      .from('causes')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error deleting cause' });
    }

    if (!deleted) {
      return res.status(404).json({ error: 'Cause not found' });
    }

    return res.status(200).json({ message: 'Cause deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

module.exports = { getCauses, getCauseById, createCause, updateCause, deleteCause };