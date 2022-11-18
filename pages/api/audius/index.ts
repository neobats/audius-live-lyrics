import { NextApiRequest, NextApiResponse } from "next";
import { audiusSdk, mapTrackData } from "../../../handlers/initAudius";
import { getPaletteFromURL } from "color-thief-node";
import sample from "lodash/sample";

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
    const results = await audiusSdk.tracks.getTrack({ trackId: tid });
    const track = mapTrackData(results);

    const trackPhoto = track.artwork;
    const accentColors = await getPaletteFromURL(trackPhoto, 5);
    const mainColor = accentColors.shift();
    const sampleColor = sample(accentColors);

    res.status(200).json({
      track,
      colors: {
        main: mainColor,
        accent: sampleColor,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
