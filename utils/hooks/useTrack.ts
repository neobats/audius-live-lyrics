import { useEffect, useState } from "react";
import { ColorResponse, TrackResponse } from "../../models/audius";

export type TrackColors = {
  main: string;
  accent: string;
  accentFull: string;
};

export type Track = {
  name: string;
  artist: string;
  art: string;
  artistPhoto: string;
};

export type UseTrackReturnType = {
  error: string;
  track: Track;
  colors: TrackColors;
};

export const useTrack = (tid: string): UseTrackReturnType => {
  const [trackError, setTrackError] = useState("");
  const [trackName, setTrackName] = useState("");
  const [trackArt, setTrackArt] = useState("");
  const [trackArtist, setTrackArtist] = useState("");
  const [trackArtistPhoto, setTrackArtistPhoto] = useState("");

  const [mainColor, setMainColor] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const [accentColorFull, setAccentColorFull] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch("api/audius?tid=" + tid);
        if (response.status !== 200) {
          throw "Error, no 200 received";
        }

        const trackData = await response.json();
        const track: TrackResponse = trackData.track;
        const colors: ColorResponse = trackData.colors;

        setTrackArt(track.artwork);
        setTrackName(track.title);
        setTrackArtist(track.artist.handle);
        setTrackArtistPhoto(track.artist.photo);

        setMainColor(toRGBA(colors.main, 1));
        setAccentColor(toRGBA(colors.accent));
        setAccentColorFull(toRGBA(colors.accent, 1));
      } catch (e) {
        console.error(e);
        setTrackError(e);
      }
    };
    fetcher();
  }, [tid]);

  return {
    error: trackError,
    track: {
      name: trackName,
      art: trackArt,
      artist: trackArtist,
      artistPhoto: trackArtistPhoto,
    },
    colors: {
      main: mainColor,
      accent: accentColor,
      accentFull: accentColorFull,
    },
  };
};

const toRGBA = (color?: [number, number, number], opacity = 0.45) =>
  (color || [15, 15, 15])
    .reduce((rgba, current) => rgba.concat(`${current}, `), "rgba(")
    .concat(`${opacity})`);

// q51Vb
