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

  // Stubbed SSO response (mock)
  const mockUser = { id: 'u-123', name: 'Test Student', email: 'test.student@university.edu' };
  const mockToken = 'mock-university-sso-token-abc123';

  return res.status(200).json({ user: mockUser, token: mockToken });
}
