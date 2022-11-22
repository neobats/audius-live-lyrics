import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { SubmissionState } from "../../models/submission";
import { Card } from "../molecules/Card";

type SearchCardProps = {
  submissionState: ReturnType<
    typeof useState<SubmissionState>
  >
} & React.HTMLAttributes<HTMLInputElement>

export const SearchCard = ({ defaultValue, submissionState, ...props }: SearchCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = submissionState
  

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
  )
}