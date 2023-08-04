import { useEffect, useState } from "react";
import { Layout, SearchCard, TrackCard } from "../components";
import { SubmissionState } from "../models/submission";
import styles from "../styles/Home.module.css";
import { useCSSVars, useTrack } from "../utils/hooks";


export default function Home(props) {
  const [submitting, setSubmitting] = useState<SubmissionState>("idle"); // idle, submitting, error
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

  useEffect(() => {
    if (submitting !== "submitting") {
      return;
    }
  
    // submitting
    

  }, [submitting]);

  return (
  <Layout
    copyright={props.lyrics.lyrics_copyright}
    scriptTrackingUrl={props.lyrics.script_tracking_url}
    errorText="hello"
  >
    {activeTrackLyrics && activeTrackLyrics.length > 50 
    ? (
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

      <SearchCard setSubmitting={setSubmitting} placeholder="Some Mud Propaganda" />

      {hasActiveTrack() && (
        <TrackCard track={activeTrack} />
      )}
    </main>
    </Layout>
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
