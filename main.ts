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
// where the gate reads it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The grader's /output exists; a local run's may not, so create it first.
mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(join(botDir, "POST.json"), join(outputDir, "POST.json"));
} catch (err) {
  // Without POST.json in the output the entry cannot be graded: fail loudly.
  console.error(
    `could not copy POST.json from ${botDir}: ${(err as Error).message}`,
  );
  process.exit(1);
}
