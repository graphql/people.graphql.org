# People of GraphQL

A static site showcasing the GraphQL community, built with Astro and a shared React people directory.

## Run locally

Use Node.js 22.19 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:4321. The dev server rebuilds the directory when content, identity aliases or page configuration changes.

| Command                   | Purpose                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| `npm run check`           | Check Astro and TypeScript                                           |
| `npm test`                | Test directory rules and talk titles                                 |
| `npm run build`           | Build the static site into `dist/`                                   |
| `npm run test:site`       | Check the built site's links, anchors and assets; run after building |
| `npm run preview`         | Serve the built site locally                                         |
| `npm run directory:build` | Rebuild the directory data from local sources                        |
| `npm run montages:build`  | Compose each year's Stars cards into one social preview image        |

Both `dev` and `build` rebuild the directory and the Stars montages (`public/stars/<year>/montage.png`, used as the social preview image for Stars directories) first. Builds use local data and do not fetch content from the network.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and checks the site with Node.js 24, then publishes `dist/` on every push to `main`. You can also run it manually from the Actions tab on `main`.

## Site structure

- `/`: everyone, grouped into active and previously active participants.
- `/stories/`: people with stories; `/stories/<id>/` displays each article, and `/stories/about/` explains the series.
- `/stars/`: all Stars, with annual directories at `/stars/<year>/`, a page for each card at `/stars/<year>/cards/<github-username>/` and background at `/stars/about/`.
- `/wg/`: working-group participants and the TSC, with directories for each group and `/wg/tsc/` for current and emeritus TSC members.
- `/ambassadors/`: current and emeritus ambassadors.
- `/speakers/`: GraphQLConf speakers, with event directories at `/speakers/graphqlconf-<year>/`.
- `/profiles/<slug>/`: a person's participation, stories, talks and available Stars cards.

Directories share search, navigation and grid/list views. Article view is available where there are stories and is the default for `/stories/`. Use `?view=list` or `?view=article` to link to a view; explicit grid/list choices carry across category links. Search covers names, usernames, locations, organizations, participation labels and story titles. Counts represent people, not appearances.

## Content and identities

Edit a person's public identity in `src/content/people/<slug>.json`. The filename determines their stable profile URL; use a GitHub username or URL-safe name for new slugs. Records hold the name, optional GitHub username, portrait, location and organization, plus `sourceIds` linking their source records.

The directory builder combines these identities with:

| Source                                 | Content                                         |
| -------------------------------------- | ----------------------------------------------- |
| `src/content/stars/<year>/*.json`      | Annual Stars recognition                        |
| `src/content/stories/*.md`             | Stories and article metadata                    |
| `src/content/wgs/*.json`               | Working-group attendance and last meeting dates |
| `src/content/tsc/members.json`         | TSC membership and terms                        |
| `src/content/ambassadors/members.json` | Ambassador cohorts and profiles                 |
| `src/content/talks/graphqlconf/`       | Conference speakers, aliases and schedules      |

It creates new person records, preserves existing curated identity fields, fills missing location/organization fields and updates source IDs. Only people represented in these sources appear in directories.

**Do not edit `src/data/directory.json` directly:** it is generated. Preserve `sourceIds` when editing people. To resolve duplicate identities, map the source ID to the canonical slug in `src/data/identity-aliases.json`, then run `npm run directory:build`. GitHub usernames match case-insensitively; review suggested speaker matches in the generated `src/data/identity-review.json` before merging.

### Refreshing sources and portraits

These commands access the network:

- `npm run wgs:sync`: clone or update working-group repositories in `repos/` and regenerate attendance data.
- `npm run avatars:refresh`: refresh Stars portraits.
- `npm run avatars:refresh:wgs`: refresh working-group portraits using canonical GitHub identities and update person records. Resolve identities with `directory:build` first.

Run `npm run directory:build` after refreshing sources or portraits. You can also edit a person's `avatarUrl` directly; missing or failed portraits fall back to initials.

### Activity and ordering

TSC and ambassador activity follows their explicit `emeriti` status. Working-group participants are active if their last meeting falls within the preceding two years; unknown dates remain active. Stars recognition, stories and speaking appearances do not expire. One active participation makes a person active within the directory being viewed. Rebuild the site to update the activity cutoff.

Directories are shuffled at build time, with the resulting order preserved during hydration. Article view on Everyone and Stories sorts by newest publication date.

### Adding a story

Create `src/content/stories/<id>.md`; its filename becomes `/stories/<id>/`.

```yaml
---
title: A story headline
name: Interview subject
description: A short introduction
publishedAt: 2026-09-16
github: github-username
links:
  - label: Personal website
    url: https://example.com
hero:
  src: /stories/your-photo.jpg
  alt: Describe the photograph
  caption: Photo caption and credit
---
```

Write the article in Markdown below the frontmatter. `github`, `links` and `hero` are optional. Put photographs in `public/stories/`; the directory uses portraits, while articles and profile story cards use hero photographs. Optional `sidebar` and `relatedLinks` fields are defined in `src/content.config.ts`; existing stories provide examples.

### Stars cards and conference talks

Place optional Stars contribution cards at `public/stars/<year>/<github-username>.png`. Each card gets its own page at `/stars/<year>/cards/<github-username>/`, and profiles show cards only for the matching year. Historical Stars `tsc` flags describe that class, not the current TSC roster.

Conference imports exclude cancelled events and events without speakers. Talks display video embeds only when a supported YouTube URL is available.

## Where to make changes

| File                                 | Responsibility                                         |
| ------------------------------------ | ------------------------------------------------------ |
| `src/config/directory-pages.mjs`     | Directory copy, actions, default views and group names |
| `scripts/build-directory.mjs`        | Import local sources and resolve identities            |
| `src/lib/directory.ts`               | Grouping, activity, ordering and navigation            |
| `src/components/DirectoryPage.astro` | Directory shell, introduction and action               |
| `src/components/PeopleDirectory.tsx` | Search, view controls and people sections              |
| `src/pages/[...directory].astro`     | Directory routes                                       |
| `src/pages/profiles/[slug].astro`    | Profile pages                                          |
| `src/pages/stories/[id].astro`       | Story rendering                                        |
| `src/layouts/Layout.astro`           | Document shell, header and footer                      |
| `src/styles/global.css`              | Fonts, theme tokens and element defaults               |
| `src/styles/shared.module.css`       | Shared layout and typography                           |

Component and page styles live in adjacent `*.module.css` files. Shared font sizes use rem-based tokens. Format the project with `npx prettier --write .`; generated build output, dependencies and the package lock are excluded.

The site supports light/dark themes and reduced-motion preferences. In supporting browsers, cross-document view transitions animate portraits between pages. Social links share `SocialLink.astro` and `src/lib/social-links.ts`; `src/scripts/external-links.ts` handles external links from Markdown and interactive components.
