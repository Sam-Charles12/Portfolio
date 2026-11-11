import { ImageResponse } from "next/og";
import { LOGO_MARK_D, LOGO_MARK_VIEWBOX } from "@/components/logo-art";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// iOS home-screen icon — light mark, transparent (iOS composites on
// black and rounds the corners).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <svg viewBox={LOGO_MARK_VIEWBOX} width="180" height="180">
          <path d={LOGO_MARK_D} fill="#ededed" fillRule="evenodd" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
