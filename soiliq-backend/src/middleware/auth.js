import { supabaseAdmin } from '../utils/supabase.js';
import { extractBearerToken } from '../utils/http.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });

    req.user = data.user;
    req.accessToken = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed', details: error.message });
  }
};
