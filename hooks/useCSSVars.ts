import { useEffect } from "react";
import tinyColor from "tinycolor2";
import { Track, TrackColors } from "../hooks/useTrack";
import { CSSVars } from "../models/colors";
import { setCssVars } from "../utils/setCssVar";

export const useCSSVars = <T = CSSVars>(
  track: Track,
  colors: TrackColors,
  vars?: T,
) => {

  useEffect(() => {
    const tinyAccent = tinyColor(colors.accent)
    const accentIsDark = tinyAccent.isDark()
    const accentFontColor = accentIsDark ? "white" : "black"
    const inputAccent = accentIsDark ? tinyAccent.darken(20) : tinyAccent.lighten(20)

    const baseVars: T = vars || CSS_VARS as T
    const newVars = {
      ...baseVars,
      "--bg-photo": `url(${track.art})`,
      "--artist-photo": `url(${track.artistPhoto})`,
      "--bg-main": colors.main,
      "--bg-accent": colors.accent,
      "--bg-accent-full": colors.accentFull,
      "--card-color": accentFontColor,
      "--bg-card-input": inputAccent.toRgbString(),
    }
    setCssVars(newVars)

  }, [track, colors, vars]);
}

const CSS_VARS = {
  "--bg-photo": "",
  "--artist-photo": "",
  "--bg-main": "",
  "--bg-accent": "",
  "--bg-accent-full": "",
  "--card-color": "",
  "--bg-card-input": "",
}