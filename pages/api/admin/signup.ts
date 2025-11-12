import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  user?: { id: string; name: string; email: string };
  token?: string;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Forward to backend admin signup endpoint
    const backendUrl = process.env.BACKEND_URL || "http://172.19.192.1:8001";
    const response = await fetch(`${backendUrl}/api/admin/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json(data);
    } else {
      return res
        .status(response.status)
        .json({ error: data.detail || "Admin signup failed" });
    }
  } catch (error) {
    console.error("Error forwarding to backend:", error);
    return res.status(500).json({ error: "Server error" });
  }
}