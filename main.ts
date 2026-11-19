// Entry program for the make.fun bounty "Post a GTA 6 meme on X"
// (gta6-meme-x-01), written for Node 22 with the standard library only.
//
// The entry itself is a post on X: the meme in meme.png went out as the
// post's first picture from a public account, its text carries a link to
// make.fun and my play code, and POST.json in this repository names the
// post's address. The house reads the post from X and hands its first
// picture and its text to the judge, so nothing this program writes about
// the post is ever judged. Its one job is to deliver POST.json: copy the
// file from the repository root into the output directory, byte for byte,
// where the gate reads it. Before copying, it checks that POST.json really
// is what the gate expects — a JSON object naming a post on X — and fails
// loudly otherwise, rather than delivering a file the gate cannot use.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The grader's /output exists; a local run's may not, so create it first.
mkdirSync(outputDir, { recursive: true });

const postPath = join(botDir, "POST.json");

// A malformed POST.json would only surface as an unreadable entry at the
// gate, so check its shape before copying: it must be a JSON object whose
// "url" is the address of a post on X, as the starter's placeholder shows.
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
const url =
  post !== null && typeof post === "object"
    ? (post as { url?: unknown }).url
    : undefined;
if (
  typeof url !== "string" ||
  !url.startsWith("https://x.com/") ||
  !url.includes("/status/")
) {
  console.error(
    'POST.json must name a post on X: {"url": "https://x.com/<handle>/status/<id>"}',
  );
  process.exit(1);
}

try {
  copyFileSync(postPath, join(outputDir, "POST.json"));
} catch (err) {
  // Without POST.json in the output the entry cannot be graded: fail loudly.
  console.error(
    `could not copy POST.json from ${botDir}: ${(err as Error).message}`,
  );
  process.exit(1);
}
