import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { primaryUnit as unit } from "@/data/units";

// Polaroid look with the wordmark (SPEC §8). Rendered once at build time.
export const alt = `${unit.name}: a retro staycation at ${unit.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const read = (...p: string[]) => readFile(join(process.cwd(), ...p));
const dataUri = async (mime: string, ...p: string[]) =>
  `data:${mime};base64,${(await read(...p)).toString("base64")}`;

export default async function Image() {
  const [font, photo, tape, daisy, star, vinyl, sparkle, sage, mustard] =
    await Promise.all([
      read("node_modules/@fontsource/shrikhand/files/shrikhand-latin-400-normal.woff"),
      dataUri("image/jpeg", "src/assets/photos/living-room.jpg"),
      ...["tape-mustard", "daisy-smiley-pink", "star", "vinyl-orange", "sparkle", "blob-sage", "blob-mustard"].map(
        (n) => dataUri("image/svg+xml", "public/stickers", `${n}.svg`),
      ),
    ]);

  const ink = "#4A0D29";
  const abs = (style: React.CSSProperties) => ({ position: "absolute" as const, ...style });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#F8F1DF",
          fontFamily: "Shrikhand",
          color: ink,
          position: "relative",
        }}
      >
        {/* eslint-disable @next/next/no-img-element */}
        <img src={sage} width={420} height={420} style={abs({ left: -250, top: -250 })} alt="" />
        <img src={mustard} width={460} height={460} style={abs({ right: -170, bottom: -210 })} alt="" />

        <div style={{ display: "flex", flexDirection: "column", marginLeft: 90, width: 560 }}>
          <div style={{ fontSize: 34, color: "#6C295C" }}>Introducing</div>
          <div style={{ fontSize: 118, lineHeight: 0.95, marginTop: 10 }}>The</div>
          <div style={{ fontSize: 118, lineHeight: 0.95 }}>Retrohub</div>
          <div style={{ fontSize: 30, marginTop: 26, color: "#6C295C" }}>{unit.tagline}</div>
          <div style={{ fontSize: 22, marginTop: 10, opacity: 0.75 }}>{unit.location}</div>
        </div>

        <div
          style={abs({
            right: 120,
            top: 60,
            display: "flex",
            flexDirection: "column",
            padding: "14px 14px 56px",
            background: "#FFFDF7",
            borderRadius: 12,
            transform: "rotate(3deg)",
            boxShadow: "0 18px 30px -10px rgba(74,13,41,0.35)",
          })}
        >
          <img src={photo} width={330} height={440} style={{ objectFit: "cover", borderRadius: 4 }} alt="" />
          <img src={tape} width={150} height={62} style={abs({ left: 104, top: -30, transform: "rotate(-6deg)" })} alt="" />
          <img src={vinyl} width={110} height={110} style={abs({ left: -60, bottom: 30 })} alt="" />
        </div>

        <img src={daisy} width={110} height={110} style={abs({ right: 70, top: 20, transform: "rotate(12deg)" })} alt="" />
        <img src={star} width={84} height={84} style={abs({ left: 600, top: 70, transform: "rotate(-10deg)" })} alt="" />
        <img src={sparkle} width={64} height={64} style={abs({ left: 640, bottom: 80 })} alt="" />
      </div>
    ),
    { ...size, fonts: [{ name: "Shrikhand", data: font, style: "normal", weight: 400 }] },
  );
}
