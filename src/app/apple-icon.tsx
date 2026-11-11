import { ImageResponse } from "next/og";
import { LOGO_MARK_D, LOGO_TILE_D, LOGO_VIEWBOX } from "@/components/logo-art";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// iOS home-screen icon — full-bleed dark tile (iOS rounds the corners).
export default function AppleIcon() {
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
        <svg viewBox={LOGO_VIEWBOX} width="180" height="180">
          <path d={LOGO_TILE_D} fill="#ededed" fillRule="evenodd" />
          <path d={LOGO_MARK_D} fill="#0a0a0a" fillRule="evenodd" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
