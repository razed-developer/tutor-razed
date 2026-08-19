import type { Env } from "./http";
import { AGE_BANDS, STATUSES } from "./resources";

export interface StoryInput {
  id?: string; title?: string; author?: string; description?: string; coverImage?: string;
  readingLevel?: string; sourceUrl?: string; publicDomainNote?: string; status?: string;
  ageBands?: string[]; chunkSize?: number; fullText?: string;
}

const cleanText = (value: unknown) => typeof value === "string" ? value.trim() : "";
const cleanList = (value: unknown) => Array.isArray(value)
  ? [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))]
  : [];

export function chunkStory(text: string, targetWords: number): string[] {
  const paragraphs = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((part) => part.replace(/\s+/g, " ").trim()).filter(Boolean);
  const chunks: string[] = []; let current: string[] = []; let count = 0;
  const flush = () => { if (current.length) chunks.push(current.join("\n\n")); current = []; count = 0; };
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    if (words.length > targetWords * 1.5) {
      flush();
      const sentences = paragraph.match(/[^.!?]+(?:[.!?]+[”’"']?|$)/g) ?? [paragraph];
      for (const sentence of sentences) {
        const sentenceWords = sentence.trim().split(/\s+/).filter(Boolean);
        if (count && count + sentenceWords.length > targetWords) flush();
        current.push(sentence.trim()); count += sentenceWords.length;
      }
    } else {
      if (count && count + words.length > targetWords) flush();
      current.push(paragraph); count += words.length;
    }
  }
  flush(); return chunks;
}

export function validateStory(input: StoryInput) {
  const required = ["title", "author", "sourceUrl", "publicDomainNote", "fullText"] as const;
  for (const field of required) if (!cleanText(input[field])) throw new Response(`${field} is required`, { status: 400 });
  if (input.status && !STATUSES.includes(input.status as typeof STATUSES[number])) throw new Response("Invalid status", { status: 400 });
  const ageBands = cleanList(input.ageBands);
  if (!ageBands.length || ageBands.some((band) => !AGE_BANDS.includes(band as typeof AGE_BANDS[number]))) throw new Response("Choose at least one valid age band", { status: 400 });
  const chunkSize = Math.round(Number(input.chunkSize ?? 140));
  if (chunkSize < 40 || chunkSize > 500) throw new Response("Chunk size must be between 40 and 500 words", { status: 400 });
  const passages = chunkStory(cleanText(input.fullText), chunkSize);
  if (!passages.length) throw new Response("Story text is required", { status: 400 });
  return { ...input, title: cleanText(input.title), author: cleanText(input.author), description: cleanText(input.description), coverImage: cleanText(input.coverImage), readingLevel: cleanText(input.readingLevel), sourceUrl: cleanText(input.sourceUrl), publicDomainNote: cleanText(input.publicDomainNote), fullText: cleanText(input.fullText), ageBands, chunkSize, passages };
}

export async function listStories(env: Env, publicOnly: boolean) {
  const where = publicOnly ? "WHERE s.status = 'published'" : "";
  const rows = await env.DB!.prepare(`SELECT s.*,
    COALESCE((SELECT json_group_array(age_band) FROM story_age_bands WHERE story_id=s.id),'[]') age_bands,
    (SELECT COUNT(*) FROM story_passages WHERE story_id=s.id) passage_count,
    (SELECT COALESCE(SUM(word_count),0) FROM story_passages WHERE story_id=s.id) word_count
    FROM stories s ${where} ORDER BY s.updated_at DESC`).all<Record<string, unknown>>();
  return rows.results.map((row) => ({ id: row.id, title: row.title, author: row.author, description: row.description, coverImage: row.cover_image, readingLevel: row.reading_level, sourceUrl: row.source_url, publicDomainNote: row.public_domain_note, status: row.status, chunkSize: row.chunk_size, ageBands: JSON.parse(String(row.age_bands)), passageCount: row.passage_count, wordCount: row.word_count, publishedAt: row.published_at }));
}

export async function getStory(env: Env, id: string, publicOnly: boolean) {
  const story = await env.DB!.prepare(`SELECT s.*,
    COALESCE((SELECT json_group_array(age_band) FROM story_age_bands WHERE story_id=s.id),'[]') age_bands
    FROM stories s WHERE s.id=? ${publicOnly ? "AND s.status='published'" : ""}`).bind(id).first<Record<string, unknown>>();
  if (!story) return null;
  const passages = await env.DB!.prepare("SELECT passage_number,text,word_count FROM story_passages WHERE story_id=? ORDER BY passage_number").bind(id).all<Record<string, unknown>>();
  return { id: story.id, title: story.title, author: story.author, description: story.description, coverImage: story.cover_image, readingLevel: story.reading_level, sourceUrl: story.source_url, publicDomainNote: story.public_domain_note, status: story.status, chunkSize: story.chunk_size, ageBands: JSON.parse(String(story.age_bands)), fullText: passages.results.map((row) => row.text).join("\n\n"), passages: passages.results.map((row) => ({ number: row.passage_number, text: row.text, wordCount: row.word_count })) };
}

export async function replaceStoryContent(db: D1Database, id: string, input: ReturnType<typeof validateStory>) {
  const statements: D1PreparedStatement[] = [db.prepare("DELETE FROM story_age_bands WHERE story_id=?").bind(id), db.prepare("DELETE FROM story_passages WHERE story_id=?").bind(id)];
  for (const band of input.ageBands) statements.push(db.prepare("INSERT INTO story_age_bands(story_id,age_band) VALUES (?,?)").bind(id, band));
  input.passages.forEach((text, index) => statements.push(db.prepare("INSERT INTO story_passages(story_id,passage_number,text,word_count) VALUES (?,?,?,?)").bind(id, index + 1, text, text.split(/\s+/).length)));
  await db.batch(statements);
}
