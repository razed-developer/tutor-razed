# Tutor Site

This repository builds and deploys a multi-app site to Cloudflare Pages from one source repo.

It supports two kinds of subsites:

- React/Vite apps in `apps-src/`
- static HTML/CSS/JS sites in `static-src/`

The final published output is assembled into `site/` and deployed by Cloudflare Pages.

## How It Works

At the root level:

- `apps.manifest.json` defines which React/Vite apps are part of the site
- `static-src/` contains static sites that are copied as-is
- `scripts/assemble.mjs` builds apps and assembles the final `site/`
- `wrangler.toml` tells Cloudflare Pages to publish `site/`

Build flow:

1. Sync portal resources from `resources.portal.json`
2. Build each app listed in `apps.manifest.json`
3. Copy each app's `dist/` output into `site/`
4. Copy each `static-src/<name>/` folder into `site/<name>/`
5. Publish `site/` through Cloudflare Pages

## Project Structure

```text
apps-src/
  portal/
  headline-to-story/
  ...
static-src/
  multiplication/
  polygons/
  ...
scripts/
apps.manifest.json
resources.portal.json
package.json
site/
```

## Manifest

All React/Vite apps must be listed in `apps.manifest.json`.

Example:

```json
{
  "apps": [
    { "name": "portal", "path": "apps-src/portal", "mount": "/" },
    { "name": "headline-to-story", "path": "apps-src/headline-to-story", "mount": "/headline-to-story/" }
  ]
}
```

Fields:

- `name`: app id used by root scripts
- `path`: relative path to the app folder
- `mount`: final published path

Rules:

- every app name must be unique
- every mount path must be unique
- root app should use `/`
- non-root apps should usually use `/<app-name>/`

## Static Sites

Static sites live in `static-src/<site-name>/`.

Example:

```text
static-src/fractions-game/
  index.html
  style.css
  script.js
```

This becomes:

```text
site/fractions-game/
```

Rules:

- each static site must be a direct child of `static-src/`
- the folder name becomes the published path
- a static site folder name cannot conflict with an app mount folder

## Clone And Run

Prerequisites:

- Node.js 20 recommended
- npm

Install app dependencies:

```powershell
npm run install:apps
```

Build the full site:

```powershell
npm run build
```

Preview the assembled site locally:

```powershell
npm run preview:site
```

Run one React/Vite app in development mode:

```powershell
npm run dev -- portal
```

## Root Commands

- `npm run apps:list` prints all manifest-listed apps
- `npm run install:apps` runs `npm install` in each manifest-listed app
- `npm run ci:apps` runs `npm ci` in each manifest-listed app
- `npm run build` assembles the full deployable `site/`
- `npm run dev -- <app-name>` runs one app locally in dev mode
- `npm run preview:site` serves the final assembled `site/`
- `npm run resources:sync` syncs `resources.portal.json` into the portal app

## Adding A React/Vite App

1. Create or copy the app into `apps-src/<app-name>/`
   Remove any nested `.git/` folder if the app came from another repository.
2. Make sure it has a working `build` script and outputs `dist/`
3. Add it to `apps.manifest.json`
4. Set its Vite `base` to match its manifest mount
5. Commit its `package-lock.json`
6. Run `npm run build`
7. Run `npm run preview:site`

Import checklist for apps copied from another repo:

- remove the copied app's `.git/` folder before running `git add`
- keep only source files and the app's own `package.json` and `package-lock.json`
- do not keep copied `node_modules/`, `dist/`, `coverage/`, `playwright-report/`, or `test-results/`
- confirm the app path in `apps.manifest.json` matches the folder name
- confirm the Vite `base` exactly matches the manifest mount
- run `npm run build` from the repo root to verify the app assembles into `site/`

Example Vite base:

```ts
base: "/my-new-app/"
```

Important:

- every manifest-listed app must have its own `package-lock.json`
- if the app is linked from the portal, also update `resources.portal.json`

## Adding A Static Site

1. Create `static-src/<site-name>/`
2. Put the full site inside that folder
3. Run `npm run build`
4. Run `npm run preview:site`

If you want the portal to link to it, also update `resources.portal.json`.

## Deployment

This repo is configured for Cloudflare Pages.

Cloudflare Pages settings:

- Production branch: `main`
- Build command: `npm run ci:apps && npm run build`
- Build output directory: `site`
- Node.js version: `20`

The committed `wrangler.toml` also declares `site` as the Pages build output directory.

To connect the repository:

1. In Cloudflare, open **Workers & Pages**.
2. Create a Pages project and connect `razed-developer/tutor-razed`.
3. Select the `main` production branch.
4. Enter the build command and output directory shown above.
5. Save and deploy.

After the first successful Cloudflare deployment, disable GitHub Pages in the repository settings if it is still enabled.

## Notes For Reuse

If you clone this repo to run your own site:

- replace the app and static site content with your own
- update `apps.manifest.json`
- update `resources.portal.json` if you use the portal listing
- make sure each React/Vite app has the correct `base`
- make sure each manifest-listed app has a committed `package-lock.json`

The internal `doc/` folder contains personal notes and is gitignored.
