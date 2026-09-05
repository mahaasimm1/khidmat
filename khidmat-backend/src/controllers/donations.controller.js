const supabase = require('../config/supabaseClient');

// ---------- CREATE DONATION ----------
// Any logged-in user (donor or admin) can make a donation.
async function createDonation(req, res) {
  try {
    const { cause_id, amount, type } = req.body;

    if (!cause_id || amount === undefined) {
      return res.status(400).json({ error: 'cause_id and amount are required' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const allowedTypes = ['one_time', 'zakat', 'recurring'];
    const donationType = allowedTypes.includes(type) ? type : 'one_time';

    // Confirm the cause exists before accepting the donation
    const { data: cause, error: causeError } = await supabase
      .from('causes')
      .select('id, raised_amount')
      .eq('id', cause_id)
      .maybeSingle();

    if (causeError) {
      console.error(causeError);
      return res.status(500).json({ error: 'Error validating cause' });
    }
    if (!cause) {
      return res.status(404).json({ error: 'Cause not found' });
    }

    // Insert the donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert([{
        user_id: req.user.id,
        cause_id,
        amount,
        type: donationType,
        status: 'completed' // Sprint 1: no real payment gateway yet
      }])
      .select('id, user_id, cause_id, amount, type, status, created_at')
      .single();

    if (donationError) {
      console.error(donationError);
      return res.status(500).json({ error: 'Error creating donation' });
    }

    // Update the cause's raised_amount to reflect this donation
    const { error: updateError } = await supabase
      .from('causes')
      .update({ raised_amount: (cause.raised_amount || 0) + amount })
      .eq('id', cause_id);

    if (updateError) {
      // Donation was recorded but the running total failed to update.
      // Log it clearly so it can be reconciled rather than silently losing the donation.
      console.error('Donation saved but failed to update cause raised_amount:', updateError);
    }

    return res.status(201).json({ donation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- LIST MY DONATIONS ----------
async function getMyDonations(req, res) {
  try {
    const { data: donations, error } = await supabase
      .from('donations')
      .select('id, cause_id, amount, type, status, created_at, causes(title)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching donations' });
    }

    // Flatten the joined cause title into cause_title for a clean response shape
    const formatted = donations.map(d => ({
      id: d.id,
      cause_id: d.cause_id,
      cause_title: d.causes ? d.causes.title : null,
      amount: d.amount,
      type: d.type,
      status: d.status,
      created_at: d.created_at
    }));

    return res.status(200).json({ donations: formatted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- LIST DONATIONS FOR A SPECIFIC CAUSE (admin only) ----------
async function getDonationsByCause(req, res) {
  try {
    const { causeId } = req.params;

    const { data: donations, error } = await supabase
      .from('donations')
      .select('id, user_id, amount, type, status, created_at')
      .eq('cause_id', causeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching donations for cause' });
    }

    return res.status(200).json({ donations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

// ---------- LIST ALL DONATIONS (admin dashboard) ----------
async function getAllDonations(req, res) {
  try {
    const { data: donations, error } = await supabase
      .from('donations')
      .select('id, amount, type, status, created_at, users(name), causes(title)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error fetching donations' });
    }

    const formatted = donations.map(d => ({
      id: d.id,
      donor_name: d.users ? d.users.name : null,
      cause_title: d.causes ? d.causes.title : null,
      amount: d.amount,
      type: d.type,
      status: d.status,
      created_at: d.created_at
    }));

    return res.status(200).json({ donations: formatted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}

module.exports = { createDonation, getMyDonations, getDonationsByCause, getAllDonations };