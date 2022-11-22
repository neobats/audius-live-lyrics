import Head from "next/head";
import { useState } from "react";
import { Footer, SearchCard, TrackCard } from "../components";
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

          <SearchCard submissionState={[submitting, setSubmitting]} placeholder="Some Mud Propaganda" />

          {hasActiveTrack() && (
            <TrackCard track={activeTrack} />
          )}
        </main>

      <Footer copyright={props.lyrics.lyrics_copyright}/>
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
