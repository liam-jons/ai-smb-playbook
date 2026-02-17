import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
} from 'docx';

/* ------------------------------------------------------------------ */
/*  Markdown → docx generation                                         */
/* ------------------------------------------------------------------ */

interface ParsedBlock {
  type: 'heading1' | 'heading2' | 'heading3' | 'bullet' | 'separator' | 'body';
  text: string;
}

/** Parse a markdown string into a flat list of typed blocks. */
function parseMarkdown(md: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];

  for (const line of md.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'heading3', text: trimmed.slice(4) });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading2', text: trimmed.slice(3) });
    } else if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'heading1', text: trimmed.slice(2) });
    } else if (/^---+$/.test(trimmed)) {
      blocks.push({ type: 'separator', text: '' });
    } else if (/^[-*]\s+/.test(trimmed)) {
      blocks.push({ type: 'bullet', text: trimmed.replace(/^[-*]\s+/, '') });
    } else {
      blocks.push({ type: 'body', text: trimmed });
    }
  }

  return blocks;
}

/** Convert inline markdown (bold, italic, code, links) into TextRun[]. */
function inlineRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  // Pattern: **bold**, *italic*, `code`, [text](url)
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      runs.push(new TextRun(text.slice(lastIndex, match.index)));
    }

    if (match[2]) {
      // **bold**
      runs.push(new TextRun({ text: match[2], bold: true }));
    } else if (match[3]) {
      // *italic*
      runs.push(new TextRun({ text: match[3], italics: true }));
    } else if (match[4]) {
      // `code`
      runs.push(new TextRun({ text: match[4], font: 'Courier New' }));
    } else if (match[5]) {
      // [text](url) → just text
      runs.push(new TextRun(match[5]));
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    runs.push(new TextRun(text.slice(lastIndex)));
  }

  return runs.length > 0 ? runs : [new TextRun(text)];
}

/** Generate a .docx Blob from a markdown string. */
export async function generateDocx(markdown: string): Promise<Blob> {
  const blocks = parseMarkdown(markdown);
  const children: Paragraph[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'heading1':
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: inlineRuns(block.text),
          }),
        );
        break;

      case 'heading2':
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: inlineRuns(block.text),
          }),
        );
        break;

      case 'heading3':
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: inlineRuns(block.text),
          }),
        );
        break;

      case 'bullet':
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: inlineRuns(block.text),
          }),
        );
        break;

      case 'separator':
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '\u2014\u2014\u2014',
                color: '999999',
              }),
            ],
            spacing: { before: 200, after: 200 },
          }),
        );
        break;

      case 'body':
        children.push(
          new Paragraph({
            children: inlineRuns(block.text),
            spacing: { after: 120 },
          }),
        );
        break;
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}

/** Trigger a file download from a Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
