import { Track } from "@audius/sdk/dist/sdk/index";

type User = Track["user"];

export type Artist = {
  handle: User["handle"];
  name: User["name"];
  photo: string;
  id: string;
};

export type TrackResponse = {
  title: Track["title"];
  artist: Artist;
  genre: Track["genre"];
  artwork?: string;
  description: Track["description"];
};

export type ColorResponse = {
  main?: [number, number, number]
  accent: [number, number, number]
}
