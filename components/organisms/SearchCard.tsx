import debounce from "lodash/debounce";
import { useCallback, useState } from "react";
import { SubmissionState } from "../../models/submission";
import { Card } from "../molecules/Card";

type SearchCardProps = {
  setSubmitting: (state: SubmissionState) => void;
} & React.HTMLAttributes<HTMLInputElement>

export const SearchCard = ({ setSubmitting, ...props }: SearchCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleTyping = useCallback(
    debounce(() => setSubmitting("idle"), 700),
    []
  );

  const handleChange = (e: any) => {
    const val = e.target.value;
    setSubmitting("submitting")
    setSearchQuery(val);
    handleTyping();
  };

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