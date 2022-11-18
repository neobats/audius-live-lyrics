import debounce from "lodash/debounce";
import Head from "next/head";
import tinyColor from "tinycolor2"
import { useCallback, useEffect, useState } from "react";
import { ColorResponse, TrackResponse } from "../models/audius";
import styles from "../styles/Home.module.css";


export default function Home(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState("idle"); // idle, submitting, error
  const [activeTrackLyrics, setActiveTrackLyrics] = useState(
    props.lyrics?.lyrics_body || ""
  );
  const [activeTrackName, setActiveTrackName] = useState("");
  const [activeTrackArt, setActiveTrackArt] = useState("");
  const [activeTrackArtist, setActiveTrackArtist] = useState("");
  const [activeTrackArtistPhoto, setActiveTrackArtistPhoto] = useState("");
  const [mainColor, setMainColor] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const [accentColorFull, setAccentColorFull] = useState<string | null>(null);

  console.log(props);
  const welcome = "Welcome! Search a track to begin";

  const toRGBA = (color?: [number, number, number], opacity = 0.45) =>
    (color || [15, 15, 15])
      .reduce((rgba, current) => rgba.concat(`${current}, `), "rgba(")
      .concat(`${opacity})`);

  const prepLyrics = (lyrics: string) => lyrics.split("\n").map((line, index) => (
    <span key={line.slice(0, 10) + index} className={styles.lyricLine}>{line}</span>
  ))

  const hasActiveTrack = () =>
    activeTrackArt || activeTrackName || activeTrackArtist;

  const handleTyping = useCallback(
    debounce(() => setSubmitting("idle"), 700),
    []
  );

  const handleChange = (e: any) => {
    const val = e.target.value;
    setSearchQuery(val);
    handleTyping();
  };

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch("api/audius?tid=OxRvl");
        if (response.status !== 200) {
          throw "Error, no 200 receieved";
        }
        const trackData = await response.json();
        const track: TrackResponse = trackData.track;
        const colors: ColorResponse = trackData.colors;

        setActiveTrackArt(track.artwork);
        setActiveTrackName(track.title);
        setActiveTrackArtist(track.artist.handle);
        setActiveTrackArtistPhoto(track.artist.photo);

        setMainColor(toRGBA(colors.main, 1));
        setAccentColor(toRGBA(colors.accent));
        setAccentColorFull(toRGBA(colors.accent, 1));
      } catch (e) {
        setSubmitting("error");
        console.error(e);
      }
    };
    fetcher();
  }, []);

  useEffect(() => {
    if (submitting !== "submitting") {
      return;
    }
  }, [submitting]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg-photo", `url(${activeTrackArt})`);
    root.style.setProperty("--artist-photo", `url(${activeTrackArtistPhoto})`);
    root.style.setProperty("--bg-main", mainColor);
    root.style.setProperty("--bg-accent", accentColor);
    root.style.setProperty("--bg-accent-full", accentColorFull);
    root.style.setProperty("--title-content", `"${welcome}"`);

    const tinyAccent = tinyColor(accentColor)
    const accentIsDark = tinyAccent.isDark()
    const accentFontColor = accentIsDark ? "white" : "black"
    root.style.setProperty("--card-color", accentFontColor);
    const inputAccent = accentIsDark ? tinyAccent.darken(20) : tinyAccent.lighten(20)
    root.style.setProperty("--bg-card-input", inputAccent.toRgbString());

  }, [activeTrackArt, activeTrackArtistPhoto, mainColor, accentColor]);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <Head>
          <title>Audius Live Lyrics</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {activeTrackLyrics && activeTrackLyrics.length > 50 ? (
          <p className={styles.lyrics}>{prepLyrics(activeTrackLyrics)}</p>
        )
        : (
          <img src={activeTrackArt} alt={activeTrackName} className={styles.bgPhoto}/>
        )}

        <main className={styles.main}>
          {submitting === "submitting" && (
            <p>Hold your horses, we&apos;re getting your results!</p>
          )}
          {submitting === "error" && (
            <p>Encountered an error trying to load your results. Try again?</p>
          )}

          <article>
            <div className={styles.card}>
              <label htmlFor="search">Search for tracks</label>
              <input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                placeholder="Some Mud Propaganda"
                onChange={handleChange}
              />
            </div>
          </article>

          {hasActiveTrack() && (
            <article>
              <div className={styles.card}>
                <h1 className={styles.title}>{activeTrackName}</h1>
                <h2 className={styles.title}>{activeTrackArtist}</h2>
              </div>
            </article>
          )}
        </main>

        <footer className={styles.footer}>
          <p>
            Made with{" "}
            <span role="img" aria-label="heart">
              ❤️
            </span>{" "}
            in the JAX metro
          </p>
          <p>{props.lyrics.lyrics_copyright}</p>
        </footer>
      </div>
      <script type="text/javascript" src={props.lyrics.script_tracking_url} />
    </div>
  );
}

export async function getServerSideProps() {
  const resp = await fetch(
    "http://api.musixmatch.com/ws/1.1/track.lyrics.get" +
      `?track_id=234540077&apikey=${encodeURIComponent(process.env.MSX_KEY)}`
  );
  const json = await resp.json();
  const lyrics = json.message.body.lyrics || null;
  // const lyrics = null
  return {
    props: { lyrics },
  };
}
