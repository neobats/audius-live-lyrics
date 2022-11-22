import debounce from "lodash/debounce";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useCSSVars } from "../hooks/useCSSVars";
import { useTrack } from "../hooks/useTrack";
import styles from "../styles/Home.module.css";


export default function Home(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState("idle"); // idle, submitting, error
  const [activeTrackLyrics, setActiveTrackLyrics] = useState(
    props.lyrics?.lyrics_body || ""
  );
  const {
    error: trackError,
    track: activeTrack,
    colors,
  } = useTrack("q51Vb");

  useCSSVars(activeTrack, colors)

  const prepLyrics = (lyrics: string) => lyrics.split("\n").map((line, index) => (
    <span key={line.slice(0, 10) + index} className={styles.lyricLine}>{line}</span>
  ))

  const hasActiveTrack = () =>
    activeTrack.art || activeTrack.name || activeTrack.artist;

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
    if (submitting !== "submitting") {
      return;
    }

  }, [submitting]);

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
          <img src={activeTrack.art} alt={activeTrack.name} className={styles.bgPhoto}/>
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
              <div className={styles.artistCard}>
                <h1 className={styles.title}>{activeTrack.name}</h1>
                <span className={styles.artistAvatar}>
                  <img src={activeTrack.artistPhoto} alt={activeTrack.artist} className={styles.artistPhoto} />
                  <h2 className={styles.artistName}>{activeTrack.artist}</h2>
                </span>
              </div>
            </article>
          )}
        </main>

        <footer className={styles.footer}>
          <p>
            Made with{" "}
            <span role="img" aria-label="headphones">
              🎧
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
      `?track_id=213429765&apikey=${encodeURIComponent(process.env.MSX_KEY)}`
  );
  const json = await resp.json();
  const lyrics = json.message.body.lyrics || null;
  // const lyrics = null
  return {
    props: { lyrics },
  };
}
