# How to Update Resources

Edit one root file: `resources.portal.json`.

That file is the source of truth. Build automatically syncs it into `apps-src/portal/public/resources.json`.

## Fastest Way To Add A Resource

Add a new object to the JSON array in `resources.portal.json`.

Use either:
- `downloadUrl`: full URL (`https://...`)
- `path`: short site path (`/headline-to-story/`)

Example:

```json
{
  "title": "Headline to Story",
  "description": "Create a headline and transform it into a story.",
  "subject": "Writing",
  "type": "Website",
  "thumbnail": "https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?q=80&w=735&auto=format&fit=crop",
  "path": "/headline-to-story/",
  "tags": ["Writing", "Creativity"]
}
```

## What Is Automatic

- `id` auto-generated if omitted
- `type` defaults to `Website`
- `rating` defaults to `0`
- `tags` defaults to `[]`
- Subject filters auto-generated from the resource list

## Commands

```bash
npm run resources:sync
npm run build
npm run preview:site
```

## Consistent Resource Image Prompt

Use a 16:9 landscape image (recommended: 1600 x 900 px). Replace the bracketed details but keep the rest of the prompt unchanged:

> Create a warm, handcrafted storybook-gouache illustration for the Tutor Razed learning portal. Show [SUBJECT OR ACTIVITY] through [ONE CLEAR CENTRAL SUBJECT], set in a recognizable Pacific Northwest coastal environment with evergreen forest, rocky shoreline, distant blue mountains, soft sea mist, ferns, cedar, and calm ocean details where appropriate. Use simplified friendly shapes, softly textured brushwork, subtle paper grain, crisp readable silhouettes, and carefully layered foreground, middle ground, and background. Palette: deep evergreen, spruce, dark teal, sea blue, misty blue-grey, warm cream, muted cedar brown, with one restrained coral or golden accent. Lighting is gentle natural daylight with a welcoming, curious, adventurous mood. Compose as a clean educational card thumbnail: one obvious focal point, low visual clutter, important details inside the centre 70 percent, and enough tonal separation to remain readable at small size. Match a cohesive modern Pacific Northwest children’s field-guide aesthetic. [AGE DIRECTION]. No words, letters, numbers, captions, logos, borders, interface elements, photorealism, glossy 3D rendering, neon colours, anime styling, or crowded composition.

Choose one age direction:

- **K–4:** Extra friendly and playful; rounded forms, expressive animal guide or child-safe object, brighter sea colours, gentle whimsy, no danger.
- **5–8:** Adventurous and exploratory; richer environmental detail, active discovery, balanced playfulness and realism.
- **9–12:** Mature illustrated field-guide tone; restrained expressions, more natural proportions, sophisticated composition, quieter colours, no childish mascots.

For a coherent set, reuse the same age direction, palette, aspect ratio, lighting, and rendering language for every image. Change only the central subject, activity, and a few supporting environmental details.
