import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { SubmissionState } from "../../models/submission";
import { Card } from "../molecules/Card";

type SearchCardProps = {
  setSubmitting: (state: SubmissionState) => void;
  lyricsSearchUrl?: string;
  audiusSearchUrl?: string;
} & React.HTMLAttributes<HTMLInputElement>;

export const SearchCard = (props: SearchCardProps) => {
  const {
    audiusSearchUrl = DEFAULT_AUDIUS_SEARCH_URL,
    lyricsSearchUrl = DEFAULT_LYRICS_SEARCH_URL,
    setSubmitting,
  } = props;
  const [searchQuery, setSearchQuery] = useState("");

  const handleTyping = useCallback(
    debounce(() => setSubmitting("idle"), 700),
    []
  );

  const handleChange = (e: any) => {
    const val = e.target.value;
    setSubmitting("submitting");
    setSearchQuery(val);
    handleTyping();
  };

  useEffect(() => {}, [audiusSearchUrl, lyricsSearchUrl, searchQuery]);

  return (
    <Card>
      <label htmlFor="search">Search for tracks</label>
      <input
        {...props}
        type="text"
        name="search"
        id="search"
        value={searchQuery}
        onChange={handleChange}
      />
    </Card>
  );
};

const DEFAULT_LYRICS_SEARCH_URL =
  "http://api.musixmatch.com/ws/1.1/track.search?apikey=" +
  encodeURIComponent(process.env.MSX_KEY) +
  "&q_track=";
const DEFAULT_AUDIUS_SEARCH_URL = "api/audius?tid=";
