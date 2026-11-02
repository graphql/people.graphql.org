import { readFile, readdir, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import {
  workingGroups,
  directoryPages,
  starsPage,
  tscPage,
  workingGroupPage,
  conferencePage,
} from "../src/config/directory-pages.mjs";
import { talkTitle } from "./talk-title.mjs";

async function writeIfChanged(file, contents) {
  try {
    if ((await readFile(file, "utf8")) === contents) return;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await writeFile(file, contents);
}

const root = fileURLToPath(new URL("../", import.meta.url));
const read = async (file) =>
  JSON.parse(await readFile(path.join(root, file), "utf8"));
const exists = async (file) => {
  try {
    await access(path.join(root, file));
    return true;
  } catch {
    return false;
  }
};
const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const nameKey = (value) =>
  value.trim().normalize("NFKC").toLowerCase().replace(/\s+/g, " ");
const people = new Map();
const identities = new Map();
const identityAliases = await read("src/data/identity-aliases.json");
const memberships = [];
const publicLocations = new Map();
function recordPublicLocation(slug, location) {
  if (!location?.trim()) return;
  const values = publicLocations.get(slug) ?? new Set();
  values.add(location.trim());
  publicLocations.set(slug, values);
}
const pages = [...directoryPages];

// Existing registry entries own their public identity and stable URL.
await mkdir(path.join(root, "src/content/people"), { recursive: true });
for (const file of (
  await readdir(path.join(root, "src/content/people"))
).filter((f) => f.endsWith(".json"))) {
  const person = await read(`src/content/people/${file}`);
  people.set(file.slice(0, -5), person);
  for (const id of person.sourceIds ?? [])
    identities.set(id, file.slice(0, -5));
}
const existingSlugs = new Set(people.keys());
const knownNames = new Map();
function indexName(name, slug) {
  const key = nameKey(name);
  const values = knownNames.get(key) ?? new Set();
  values.add(slug);
  knownNames.set(key, values);
}
for (const [slug, p] of people) indexName(p.name, slug);
async function personFor({ name, github, location, org, sourceId }) {
  github = github?.trim().replace(/^@/, "").toLowerCase();
  let slug = identityAliases[sourceId] ?? identities.get(sourceId);
  if (identityAliases[sourceId] && github) github = identityAliases[sourceId];
  if (!slug && github)
    slug =
      [...people].find(
        ([, p]) => p.githubUsername?.toLowerCase() === github,
      )?.[0] ?? github;
  // Name-only records remain separate until their sourceId is explicitly assigned in the registry.
  if (!slug) slug = slugify(name);
  if (
    !identityAliases[sourceId] &&
    !identities.has(sourceId) &&
    !github &&
    people.has(slug) &&
    people.get(slug).name !== name
  )
    slug += "-" + slugify(sourceId);
  let person = people.get(slug);
  if (!person) {
    const local =
      github && (await exists(`public/avatars/${github}.png`))
        ? `/avatars/${github}.png`
        : undefined;
    person = {
      name,
      ...(github ? { githubUsername: github } : {}),
      avatarUrl: local,
      ...(location ? { location } : {}),
      ...(org ? { organization: org } : {}),
      sourceIds: [],
    };
    people.set(slug, person);
  }
  if (!existingSlugs.has(slug) && name.length > person.name.length)
    person.name = name;
  if (location && !person.location) person.location = location;
  if (org && !person.organization) person.organization = org;
  if (!person.sourceIds.includes(sourceId)) person.sourceIds.push(sourceId);
  identities.set(sourceId, slug);
  indexName(name, slug);
  return slug;
}
const join = (person, page, details = {}) =>
  memberships.push({ person, page, ...details });
const years = (await readdir(path.join(root, "src/content/stars")))
  .filter((x) => /^\d{4}$/.test(x))
  .sort()
  .reverse();
for (const year of years) {
  pages.push(starsPage(year));
  for (const file of (
    await readdir(path.join(root, `src/content/stars/${year}`))
  )
    .filter((x) => x.endsWith(".json"))
    .sort()) {
    const s = await read(`src/content/stars/${year}/${file}`);
    const id = await personFor({
      ...s,
      sourceId: s.github
        ? `github:${s.github.toLowerCase()}`
        : `star:${slugify(s.name)}`,
    });
    const card = `/stars/${year}/${s.github?.toLowerCase()}.png`;
    join(id, `stars/${year}`, {
      label: `Class of ${year}`,
      tsc: s.tsc ?? false,
      ...((await exists(`public${card}`)) ? { image: card } : {}),
    });
  }
}
for (const file of (await readdir(path.join(root, "src/content/stories")))
  .filter((f) => f.endsWith(".md"))
  .sort()) {
  const source = await readFile(
    path.join(root, "src/content/stories", file),
    "utf8",
  );
  const s = parse(source.split(/^---\s*$/m)[1]);
  const id = await personFor({
    ...s,
    sourceId: s.github ? `github:${s.github.toLowerCase()}` : `story:${file}`,
  });
  join(id, "stories", {
    label: s.title,
    article: {
      title: s.title,
      description: s.description,
      href: `/stories/${file.slice(0, -3)}/`,
      publishedAt: String(s.publishedAt),
      recordedAt: String(s.recordedAt),
      ...(s.hero ? { image: s.hero.src, imageAlt: s.hero.alt } : {}),
    },
  });
}

pages.push(tscPage);
for (const m of (await read("src/content/tsc/members.json")).members) {
  const id = await personFor({
    ...m,
    sourceId: `github:${m.github.toLowerCase()}`,
  });
  join(id, "wg/tsc", {
    label: m.chair ? "Chair" : "TSC member",
    emeriti: m.emeriti,
    chair: m.chair,
    affiliation: m.affiliation,
    termStart: m.termStart,
    termEnd: m.termEnd,
  });
}
for (const [repo, group] of Object.entries(workingGroups)) {
  const { slug, name } = group;
  pages.push(workingGroupPage(group));
  for (const m of (await read(`src/content/wgs/${repo}.json`)).attendees) {
    const id = await personFor({
      ...m,
      sourceId: `github:${m.github.toLowerCase()}`,
    });
    recordPublicLocation(id, m.location);
    join(id, `wg/${slug}`, {
      label: `${name} WG`,
      count: m.count,
      lastActive: m.lastMeeting,
    });
  }
}
for (const m of (await read("src/content/ambassadors/members.json")).members) {
  const id = await personFor({
    ...m,
    location: m.location?.name,
    sourceId: m.github
      ? `github:${m.github.toLowerCase()}`
      : `ambassador:${slugify(m.name)}`,
  });
  recordPublicLocation(id, m.location?.name);
  join(id, "ambassadors", {
    label: "GraphQL Ambassador",
    emeriti: m.emeriti,
    cohort: m.cohort,
    term: m.term,
    interests: m.askMeAbout,
    graphqlLocals: m.graphqlLocals ?? [],
    links: m.links,
  });
}
const speakerData = await read("src/content/talks/graphqlconf/speakers.json");
const aliases = new Map();
for (const group of speakerData.equal)
  for (const username of group) aliases.set(username, group[0]);
const speakerIds = new Map();
const speakerLinks = new Map();
const speakerBios = new Map();
for (const speaker of speakerData.speakers) {
  const username = aliases.get(speaker.username) ?? speaker.username;
  const about = speaker.about?.replace(/<\/?b\s*>/gi, "").trim();
  if (
    about &&
    !/^(?:tbd|tbc|todo|n\/?a|none|placeholder|coming soon|to be (?:announced|determined|confirmed|added|updated)|bio coming soon|lorem ipsum)[.!\s]*$/i.test(about) &&
    !speakerBios.has(username)
  )
    speakerBios.set(username, {
      about,
      ...(speaker._years?.length
        ? { aboutYear: Math.max(...speaker._years) }
        : {}),
    });
  const links = speakerLinks.get(username) ?? [];
  for (const link of [
    ...(speaker.socialurls ?? []).map(({ service, url }) => ({
      label: service || "Website",
      url,
    })),
    ...(speaker.url ? [{ label: "Website", url: speaker.url }] : []),
  ]) {
    try {
      const value = link.url.trim();
      const url = new URL(
        /^[\w.-]+\.[a-z]{2,}(?:[/?#]|$)/i.test(value)
          ? `https://${value}`
          : value,
      );
      if (!["http:", "https:"].includes(url.protocol)) continue;
      if (!links.some((existing) => existing.url === url.href))
        links.push({ ...link, url: url.href });
    } catch {
      // Ignore malformed source links rather than breaking profile rendering.
    }
  }
  speakerLinks.set(username, links);
}
const possibleMatches = [];
for (const s of speakerData.speakers) {
  const username = aliases.get(s.username) ?? s.username;
  if (speakerIds.has(username)) {
    speakerIds.set(s.username, speakerIds.get(username));
    continue;
  }
  const githubLink = s.socialurls?.find((l) =>
    /^https?:\/\/(www\.)?github.com\/[^/]+\/?$/i.test(l.url?.trim() ?? ""),
  );
  const github = githubLink?.url.trim().split("/")[3];
  const id = await personFor({
    name: s.name,
    github,
    org: s.company,
    sourceId: `speaker:${username}`,
  });
  speakerIds.set(username, id);
  speakerIds.set(s.username, id);
  if (!github) {
    const candidates = [...(knownNames.get(nameKey(s.name)) ?? [])].filter(
      (x) => x !== id,
    );
    if (candidates.length)
      possibleMatches.push({
        speaker: id,
        sourceId: `speaker:${username}`,
        name: s.name,
        candidates,
      });
  }
}
for (const file of (
  await readdir(path.join(root, "src/content/talks/graphqlconf"))
)
  .filter((f) => f.startsWith("schedule-"))
  .sort()
  .reverse()) {
  const year = file.match(/\d{4}/)[0];
  const page = `speakers/graphqlconf-${year}`;
  pages.push(conferencePage(year));
  for (const event of await read(`src/content/talks/graphqlconf/${file}`)) {
    if (event.active === "N" || /^\s*cancel(?:led|ed)\b/i.test(event.name)) continue;
    for (const speaker of event.speakers ?? []) {
      const username = aliases.get(speaker.username) ?? speaker.username;
      const id =
        speakerIds.get(username) ??
        (await personFor({
          name: speaker.name,
          org: speaker.company,
          sourceId: `speaker:${username}`,
        }));
      const raw = event.video_stream ?? "";
      let videoId;
      try {
        const u = new URL(raw);
        if (["www.youtube.com", "youtube.com"].includes(u.hostname))
          videoId = u.searchParams.get("v");
        else if (u.hostname === "youtu.be") videoId = u.pathname.slice(1);
      } catch {}
      join(id, page, {
        label: `GraphQLConf ${year}`,
        ...(speakerBios.get(username) ?? {}),
        ...(speakerLinks.get(username)?.length
          ? { links: speakerLinks.get(username) }
          : {}),
        talk: {
          title: talkTitle(event.name, event.speakers),
          id: event.id,
          ...(videoId && /^[\w-]{11}$/.test(videoId) ? { videoId } : {}),
        },
      });
    }
  }
}
// Only people represented in the imported sources appear in directories.
const used = new Set(memberships.map((m) => m.person));
for (const [slug, person] of [...people].sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  // A GitHub identity alone does not establish the source of a location.
  // Keep only locations supplied by WG GitHub data or ambassador records.
  const locations = publicLocations.get(slug);
  if (locations?.size) {
    if (!locations.has(person.location)) person.location = [...locations][0];
  } else {
    delete person.location;
  }
  await writeIfChanged(
    path.join(root, `src/content/people/${slug}.json`),
    JSON.stringify(person, null, 2) + "\n",
  );
}
await mkdir(path.join(root, "src/data"), { recursive: true });
await writeIfChanged(
  path.join(root, "src/data/directory.json"),
  JSON.stringify(
    {
      pages,
      people: Object.fromEntries(
        [...people].filter(([slug]) => used.has(slug)),
      ),
      memberships,
    },
    null,
    2,
  ) + "\n",
);
await writeIfChanged(
  path.join(root, "src/data/identity-review.json"),
  JSON.stringify(possibleMatches, null, 2) + "\n",
);
console.log(
  `Imported ${used.size} people, ${memberships.length} participations, ${pages.length} directory pages. ${possibleMatches.length} speaker identities need review.`,
);
