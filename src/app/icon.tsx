import { ImageResponse } from "next/og";
import { LOGO_MARK_D, LOGO_TILE_D, LOGO_VIEWBOX } from "@/components/logo-art";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Tab icon fallback for browsers without SVG favicon support.
// Dark pair (ink tile, bg mark) — the brand's home theme.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ededed",
        }}
      >
        <svg viewBox={LOGO_VIEWBOX} width="32" height="32">
          <path d={LOGO_TILE_D} fill="#ededed" fillRule="evenodd" />
          <path d={LOGO_MARK_D} fill="#0a0a0a" fillRule="evenodd" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
