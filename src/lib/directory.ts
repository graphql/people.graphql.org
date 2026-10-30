import localGroups from "../content/locals/groups.json" with { type: "json" };
import raw from "../data/directory.json" with { type: "json" };
export interface Person {
  name: string;
  githubUsername?: string;
  avatarUrl?: string;
  location?: string;
  organization?: string;
  sourceIds: string[];
}
export interface Article {
  title: string;
  description: string;
  href: string;
  publishedAt: string;
  recordedAt: string;
  image?: string;
  imageAlt?: string;
}
export interface Membership {
  person: string;
  page: string;
  label: string;
  emeriti?: boolean;
  lastActive?: string;
  count?: number;
  chair?: boolean;
  tsc?: boolean;
  affiliation?: string | null;
  termStart?: string | null;
  termEnd?: string | null;
  cohort?: string;
  term?: string;
  interests?: string[];
  about?: string;
  aboutYear?: number;
  maintainerProjects?: string[];
  graphqlLocals?: string[];
  links?: { label: string; url: string }[];
  image?: string;
  article?: Article;
  talk?: { title: string; id: string; videoId?: string };
}
export type Mode = "grid" | "list" | "article";
export interface DirectoryPage {
  heading?: { firstLine: string; secondLine: string };
  slug: string;
  title: string;
  description: string;
  action: { label: string; href: string };
  parent: string;
  mode: Mode;
}
export interface Entry extends Person {
  slug: string;
  anchor: string;
  active: boolean;
  currentTsc: boolean;
  currentAmbassador: boolean;
  localNames: string[];
  memberships: Membership[];
  count: number;
  articles: Article[];
  featuredStories: Article[];
  transitionName: string;
}
const data = raw as {
  pages: DirectoryPage[];
  people: Record<string, Person>;
  memberships: Membership[];
};
export const pages = data.pages;
export const people = data.people;
export const memberships = data.memberships;
export const locals = localGroups;
export const localsForPerson = (slug: string) =>
  locals.filter((local) =>
    local.organizers.some((organizer) => organizer.person === slug),
  );
const currentTsc = new Set(
  memberships
    .filter((m) => m.page === "wg/tsc" && m.emeriti === false)
    .map((m) => m.person),
);
export const isCurrentTsc = (slug: string) => currentTsc.has(slug);
const currentAmbassadors = new Set(
  memberships
    .filter((m) => m.page === "ambassadors" && m.emeriti === false)
    .map((m) => m.person),
);
export const isCurrentAmbassador = (slug: string) =>
  currentAmbassadors.has(slug);
export const hrefFor = (slug: string) => (slug ? `/${slug}/` : "/");
export const pageFor = (slug: string) => pages.find((p) => p.slug === slug)!;
const starYears = pages
  .map((p) => p.slug.match(/^stars\/(\d{4})$/)?.[1])
  .filter((y): y is string => !!y)
  .sort();
export const montageFor = (slug: string) => {
  const year =
    slug === "stars" ? starYears.at(-1) : slug.match(/^stars\/(\d{4})$/)?.[1];
  return year && `/stars/${year}/montage.png`;
};
export const cardHrefFor = (image: string) =>
  image.replace(/^\/stars\/(\d{4})\/(.+)\.png$/, "/stars/$1/cards/$2/");
export const transitionName = (slug: string) => `person-${slug}`;
export function isActive(m: Membership, now = new Date()) {
  if (m.emeriti !== undefined) return !m.emeriti;
  if (!m.lastActive) return true;
  const cutoff = new Date(now);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 2);
  return new Date(`${m.lastActive.slice(0, 10)}T23:59:59Z`) >= cutoff;
}
export function entriesFor(page: DirectoryPage): Entry[] {
  const selected = memberships.filter(
    (m) =>
      !page.slug || m.page === page.slug || m.page.startsWith(page.slug + "/"),
  );
  const grouped = new Map<string, Membership[]>();
  for (const m of selected)
    grouped.set(m.person, [...(grouped.get(m.person) ?? []), m]);
  const result = [...grouped].map(([slug, ms]) => ({
    ...people[slug],
    slug,
    anchor: people[slug].githubUsername ?? slug,
    active:
      ms.some((m) => isActive(m)) ||
      (!page.slug &&
        localsForPerson(slug).some((local) =>
          isActive({
            person: slug,
            page: "",
            label: local.name,
            lastActive: local.lastMet,
          }),
        )),
    currentTsc: isCurrentTsc(slug),
    currentAmbassador: isCurrentAmbassador(slug),
    localNames: localsForPerson(slug).map((local) => local.name),
    memberships: ms,
    count: ms.reduce((n, m) => n + (m.count ?? 0), 0),
    featuredStories: memberships
      .filter((m) => m.person === slug)
      .flatMap((m) => (m.article ? [m.article] : [])),
    articles: ms.flatMap((m) => (m.article ? [m.article] : [])),
    transitionName: transitionName(slug),
  }));
  // All directories share one build-time shuffle, preserved through hydration.
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function categoriesFor(slug: string) {
  const root = slug.split("/")[0];
  return {
    sub: pages.filter((p) => p.parent === root && p.parent !== ""),
  };
}
