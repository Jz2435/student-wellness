import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Forward the request to the FastAPI backend
    const backendUrl = process.env.BACKEND_URL || "http://172.19.192.1:8001";
    const response = await fetch(`${backendUrl}/api/self-report`, {
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
      return res.status(response.status).json(data);
    }
  } catch (error) {
    console.error("Error forwarding to backend:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
