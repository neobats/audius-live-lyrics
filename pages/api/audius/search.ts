import { NextApiRequest, NextApiResponse } from "next";
import { mapTracksData } from "../../../handlers/initAudius";
import { audiusSdk } from "../../../handlers/initAudius";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const params = req.body.params;
  const method = req.method;

  if (method !== "GET") {
    res.status(405);
    return;
  }

  const q = params.q;

  try {
    const results = await audiusSdk.tracks.searchTracks(q);

    res.status(200).json({
      tracks: mapTracksData(results),
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};
