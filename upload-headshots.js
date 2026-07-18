/*
 * KTP headshot uploader.
 * Usage (from repo root, with Node on PATH and Cloudinary variables in .env):
 *   node upload-headshots.js "C:\\Users\\amanb\\Downloads" --dry-run   # preview matches, no upload
 *   node upload-headshots.js "C:\\Users\\amanb\\Downloads"             # upload + update pages
 *
 * Name each image file as the member's EXACT site name, e.g. "Kavinram Senthil.png".
 * Files that don't match a member on the site are skipped (never uploaded).
 */
const fs = require("fs");
const path = require("path");

const FOLDER = process.argv[2] || path.join(process.env.USERPROFILE || "", "Downloads");
const CLOUD_FOLDER = "Brother Page/Fall 2026";
const DRY = process.argv.includes("--dry-run");

const PAGES = [
  path.join(__dirname, "app", "brothers", "page.jsx"),
  path.join(__dirname, "app", "alumni", "page.jsx"),
];

// Load the repo's local .env without adding another dependency. Never print
// environment values: the API secret grants write access to Cloudinary.
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

const requiredCloudinaryVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
const missingCloudinaryVars = requiredCloudinaryVars.filter(
  (name) => !process.env[name]
);
if (missingCloudinaryVars.length > 0) {
  console.error(
    `Missing Cloudinary environment variables: ${missingCloudinaryVars.join(", ")}`
  );
  process.exit(1);
}

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");

function memberNames() {
  const set = new Set();
  for (const p of PAGES) {
    const re = /name:\s*"([^"]+)"/g;
    let m;
    const t = fs.readFileSync(p, "utf8");
    while ((m = re.exec(t))) set.add(m[1]);
  }
  return [...set];
}

// Replace the src of every entry whose name === memberName (handles the optional
// `position` line in board objects). Returns number of entries updated.
function updateSrc(memberName, url) {
  const esc = memberName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    '(name: "' + esc + '",\\s*\\r?\\n(?:\\s*position: "[^"]*",\\s*\\r?\\n)?\\s*src: ")[^"]*(")',
    "g"
  );
  let changed = 0;
  for (const p of PAGES) {
    const t = fs.readFileSync(p, "utf8");
    const nt = t.replace(re, (_full, a, b) => {
      changed++;
      return a + url + b;
    });
    if (nt !== t && !DRY) fs.writeFileSync(p, nt, "utf8");
  }
  return changed;
}

(async () => {
  const members = memberNames();
  console.log("Site members found:", members.length);
  if (!fs.existsSync(FOLDER)) {
    console.error("Folder not found:", FOLDER);
    process.exit(1);
  }
  const files = fs
    .readdirSync(FOLDER)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  console.log("Images in folder:", files.length, "(" + FOLDER + ")", DRY ? "[DRY RUN]" : "");

  const normToName = new Map(members.map((n) => [norm(n), n]));
  const matched = [];
  const unmatched = [];
  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    const site = normToName.get(norm(base));
    if (site) matched.push({ file, site });
    else unmatched.push(file);
  }

  console.log("\nMatched " + matched.length + "/" + files.length + ":");
  for (const m of matched) {
    const hits = updateSrc(m.site, "DRYRUN");
    console.log("  " + m.file + "  ->  " + m.site + "  (" + hits + " entr" + (hits === 1 ? "y" : "ies") + ")");
  }
  if (unmatched.length) {
    console.log("\nUNMATCHED (rename to a member's exact site name, or ignore):");
    unmatched.forEach((u) => console.log("  " + u));
  }

  if (DRY) {
    console.log("\nDry run complete — nothing uploaded or edited.");
    return;
  }

  console.log("\nUploading to Cloudinary + updating pages...");
  for (const m of matched) {
    const res = await cloudinary.uploader.upload(path.join(FOLDER, m.file), {
      folder: CLOUD_FOLDER,
      public_id: m.site.replace(/\s+/g, "_"),
      overwrite: true,
      resource_type: "image",
    });
    const n = updateSrc(m.site, res.secure_url);
    console.log("  " + m.site + "  ->  " + res.secure_url + "  (updated " + n + ")");
  }
  console.log("\nDone. Review with: git --no-pager diff");
})().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
