import { readdir, readFile, stat, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

type DocumentRecord = {
  id: string;
  title: string;
  content: string;
};

function cleanText(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+\n/g, "\n")
    .trim();
}

function makeId(fileName: string): string {
  const stem = fileName.replace(/\.pdf$/i, "");
  const slug = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const hash = crypto.createHash("sha1").update(fileName).digest("hex").slice(0, 8);
  return `${slug || "document"}-${hash}`;
}

async function main(): Promise<void> {
  const pdfModule = await import("pdf-parse");
  const PDFParseCtor = (pdfModule as unknown as { PDFParse?: new (options: { data: Buffer }) => { getText: () => Promise<{ text: string }>; destroy: () => Promise<void> } })
    .PDFParse;
  if (!PDFParseCtor) {
    throw new Error("pdf-parse PDFParse export is unavailable in this runtime.");
  }

  const projectRoot = process.cwd();
  const dataDir = path.join(projectRoot, "data");
  const pdfDir = path.join(dataDir, "pdfs");
  const outputFile = path.join(dataDir, "documents.json");

  await mkdir(pdfDir, { recursive: true });

  const files = await readdir(pdfDir);
  const pdfFiles = files.filter((file) => file.toLowerCase().endsWith(".pdf"));

  const documents: DocumentRecord[] = [];

  for (const file of pdfFiles) {
    const fullPath = path.join(pdfDir, file);
    const fileStats = await stat(fullPath);
    if (!fileStats.isFile()) continue;

    const buffer = await readFile(fullPath);
    const parser = new PDFParseCtor({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    const content = cleanText(parsed.text || "");
    if (!content) continue;

    documents.push({
      id: makeId(file),
      title: file.replace(/\.pdf$/i, ""),
      content,
    });
  }

  await writeFile(outputFile, `${JSON.stringify(documents, null, 2)}\n`, "utf-8");
  console.log(`Converted ${documents.length} PDF(s) -> ${path.relative(projectRoot, outputFile)}`);
}

main().catch((error) => {
  console.error("PDF conversion failed:", error);
  process.exit(1);
});
