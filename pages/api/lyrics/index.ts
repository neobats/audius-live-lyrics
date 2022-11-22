import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const params = req.query;
  const method = req.method;

  if (method !== "GET") {
    res.status(405);
    return;
  }

  const tid = params.tid instanceof Array ? params.tid[0] : params.tid;

  try {
    const response = await fetch(
      "https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=" + tid
      + "&apikey=" + process.env.MUSIXMATCH_API_KEY
    );
    const json = await response.json();
    res.status(200).json({ track: json });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
