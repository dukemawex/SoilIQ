import express from 'express';
import serverless from 'serverless-http';
import { withCors } from '../../src/utils/http.js';
import { supabaseAdmin } from '../../src/utils/supabase.js';

const app = express();
app.use(express.json());
withCors(app);

app.post('/auth/register', async (req, res) => {
  const { email, password, full_name, phone, country, state_province, language } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) return res.status(400).json({ error: error.message });

  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: data.user.id,
    full_name,
    phone,
    country,
    state_province,
    language: language || 'en'
  });

  if (profileError) return res.status(400).json({ error: profileError.message });

  const login = await supabaseAdmin.auth.signInWithPassword({ email, password });
  res.json({ user: data.user, session: login.data.session });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  res.json(data);
});

app.post('/auth/logout', async (req, res) => {
  const { refresh_token } = req.body || {};
  if (refresh_token) {
    await supabaseAdmin.auth.admin.signOut(refresh_token);
  }
  res.json({ success: true });
});

export const handler = serverless(app);
