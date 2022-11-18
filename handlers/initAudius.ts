import { sdk } from "@audius/sdk";
import { Track } from "@audius/sdk/dist/sdk/index";
import Web3 from "web3";
import { Artist } from "../models/audius";

export const audiusSdk = sdk({
  appName: "live-lyrics",
  ethWeb3Config: undefined
});
console.log("web3", Boolean(Web3))

export const mapUserToArtist = (user: Track["user"]): Artist => ({
  name: user.name,
  handle: user.handle,
  photo: user.profile_picture["150x150"] || "",
  id: user.id
})

export const mapTrackData = ({
  title,
  user,
  genre,
  artwork,
  description,
}: Track) => ({
  title,
  artist: mapUserToArtist(user),
  genre,
  artwork: artwork["1000x1000"] || artwork["480x480"] || artwork["150x150"] || "",
  description,
});

export const mapTracksData = (tracks: Track[]) => tracks.map(mapTrackData);
