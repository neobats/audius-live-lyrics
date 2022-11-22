import React from "react";
import styles from "../../styles/Components.module.css";
import { Track } from "../../utils/hooks/useTrack";
import { Card } from "./Card";

type TrackCardProps = {
  track: Track
} & React.HTMLAttributes<HTMLDivElement>

export const TrackCard = ({ track: { name, artist, artistPhoto } }: TrackCardProps) => (
  <Card className={styles.artistCard}>
    <h1 className={styles.title}>{name}</h1>
    <span className={styles.artistAvatar}>
      <img src={artistPhoto} alt={artist} className={styles.artistPhoto} />
      <h2 className={styles.artistName}>{artist}</h2>
    </span>
  </Card>
)