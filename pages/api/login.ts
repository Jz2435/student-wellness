import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  user?: { id: string; name: string; email?: string };
  token?: string;
  error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  // Accept a JSON payload { email, password } and perform a lightweight mock validation
  try {
  const { email, password } = req.body || {};

    if (!email || typeof email !== 'string' || email.indexOf('@') === -1) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ error: 'Password must not be empty' });
    }

    // On success return mock user and token
    const mockUser = { id: 'u-123', name: 'Test Student', email };
    const mockToken = 'mock-university-sso-token-abc123';

    return res.status(200).json({ user: mockUser, token: mockToken });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
