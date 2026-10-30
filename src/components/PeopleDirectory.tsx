import Avatar from "./Avatar";
import {
  useEffect,
  useState,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import type { Article, DirectoryPage, Entry, Mode } from "../lib/directory";
import { cardHrefFor, memberships } from "../lib/directory";
import { matchesSearch } from "../lib/search";
import styles from "./PeopleDirectory.module.css";
import starCardStyles from "./star-card.module.css";

interface Props {
  children?: ReactNode;
  page: DirectoryPage;
  entries: Entry[];
  categories: { sub: DirectoryPage[] };
}
const navigation = [
  { label: "Everyone", slug: "" },
  { label: "Stories", slug: "stories" },
  { label: "Stars", slug: "stars" },
  { label: "Working groups", slug: "wg" },
  { label: "Ambassadors", slug: "ambassadors" },
  { label: "Speakers", slug: "speakers" },
];
const labels: Record<string, string> = {
  stories: "Stories",
  stars: "Stars",
  wg: "Working groups",
  ambassadors: "Ambassadors",
  speakers: "Speakers",
};
const url = (slug: string) => (slug ? `/${slug}/` : "/");
const compareArticles = (a: Article, b: Article) =>
  Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
  Date.parse(b.recordedAt) - Date.parse(a.recordedAt);

export default function PeopleDirectory({
  page,
  entries,
  categories,
  children,
}: Props) {
  const [mode, setMode] = useState<Mode>(page.mode);
  const [search, setSearch] = useState("");
  const [explicitMode, setExplicitMode] = useState(false);
  const isStars = page.slug === "stars" || page.slug.startsWith("stars/");
  const [selectedStar, setSelectedStar] = useState<Entry | null>(null);
  const starDialog = useRef<HTMLDialogElement>(null);
  const selectedMembership =
    selectedStar?.memberships.find((m) => m.page === page.slug) ??
    selectedStar?.memberships
      .filter((m) => m.page.startsWith("stars/"))
      .toSorted((a, b) => b.page.localeCompare(a.page))[0];
  useEffect(() => {
    if (selectedStar && starDialog.current && !starDialog.current.open)
      starDialog.current.showModal();
  }, [selectedStar]);
  const isStories = page.slug === "stories";
  const hasArticles = entries.some((p) => p.articles.length);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requested = params.get("view");
    if (
      requested === "grid" ||
      (requested === "list" && !isStories) ||
      (requested === "article" && hasArticles)
    ) {
      setMode(requested);
      setExplicitMode(true);
    }
    setSearch(params.get("q") ?? "");
  }, [hasArticles, isStories]);
  function changeMode(next: Mode) {
    setMode(next);
    setExplicitMode(true);
    const current = new URL(location.href);
    current.searchParams.set("view", next);
    history.replaceState(null, "", current);
  }
  useEffect(() => {
    for (const link of document.querySelectorAll<HTMLAnchorElement>(
      "[data-directory-link]",
    )) {
      const target = new URL(link.href);
      if (
        explicitMode &&
        mode !== "article" &&
        !(mode === "list" && target.pathname === "/stories/")
      )
        target.searchParams.set("view", mode);
      else target.searchParams.delete("view");
      link.href = target.href;
    }
  }, [mode, explicitMode]);
  const query = search.trim().toLocaleLowerCase();
  const visible = entries.filter(
    (p) =>
      (mode !== "article" || p.articles.length > 0) && matchesSearch(p, query),
  );
  if (mode === "article" && (isStories || page.slug === "")) {
    const latestArticle = (person: Entry) =>
      [...person.articles].sort(compareArticles)[0];
    visible.sort(
      (a, b) =>
        compareArticles(latestArticle(a), latestArticle(b)) ||
        a.name.localeCompare(b.name, "en"),
    );
  }
  const active = visible.filter((p) => p.active),
    previous = visible.filter((p) => !p.active);
  const activeTitle = (() => {
    const count = active.length;
    if (page.slug === "wg/tsc") return `${count} TSC`;
    if (page.slug === "ambassadors")
      return `${count} ${count === 1 ? "Ambassador" : "Ambassadors"}`;
    if (page.slug === "wg" || page.slug.startsWith("wg/"))
      return `${count} active ${count === 1 ? "member" : "members"}`;
    if (page.slug === "stories") {
      const stories = new Set(
        active.flatMap((person) =>
          person.articles.map((article) => article.href),
        ),
      ).size;
      return `${stories} ${stories === 1 ? "story" : "stories"}`;
    }
    if (page.slug === "stars" || page.slug.startsWith("stars/"))
      return `${count} ${count === 1 ? "star" : "stars"}`;
    if (page.slug === "speakers" || page.slug.startsWith("speakers/"))
      return `${count} ${count === 1 ? "speaker" : "speakers"}`;
    return `${count} ${count === 1 ? "person" : "people"} to discover`;
  })();
  const previousTitle =
    page.slug === "wg/tsc" || page.slug === "ambassadors"
      ? `${previous.length} Emeriti`
      : page.slug === "wg" || page.slug.startsWith("wg/")
        ? `${previous.length} older ${previous.length === 1 ? "member" : "members"}`
        : `${previous.length} previously active ${previous.length === 1 ? "person" : "people"}`;
  function filterHref(slug: string) {
    return (
      url(slug) + (explicitMode && mode !== "article" ? `?view=${mode}` : "")
    );
  }
  const isWorkingGroup = page.slug === "wg" || page.slug.startsWith("wg/");
  function renderArticles(p: Entry) {
    const profile = `/profiles/${p.slug}/`;
    return [...p.articles].sort(compareArticles).map((a, index) => (
      <li
        key={a.href}
        id={index === 0 ? p.anchor : undefined}
        className={styles.person}
      >
        {a.image && (
          <a href={a.href} className={styles.storyImage}>
            <img
              src={a.image}
              alt={a.imageAlt ?? ""}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.storyImageStripes} aria-hidden="true" />
          </a>
        )}
        <div className={styles.storyDetails}>
          <div className={styles.article}>
            <h2>
              <a href={a.href}>{a.title}</a>
            </h2>
            <div className={`${styles.identity} ${styles.storyIdentity}`}>
              <a
                href={profile}
                className={`${styles.avatar} ${styles.authorAvatar} ${p.currentTsc ? styles.gold : p.currentAmbassador ? styles.ambassador : ""}`}
                aria-label={`Meet ${p.name}`}
              >
                <Avatar name={p.name} src={p.avatarUrl} />
              </a>
              <h3>
                <a href={profile}>{p.name}</a>
              </h3>
              {p.githubUsername && (
                <span className={styles.username}>@{p.githubUsername}</span>
              )}
            </div>
            <p>{a.description}</p>
            <a className={styles.profileLink} href={a.href}>
              Read the story <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </li>
    ));
  }
  function renderPerson(p: Entry) {
    const profile = `/profiles/${p.slug}/`;
    const ambassadorList = page.slug === "ambassadors" && mode === "list";
    const ambassador = p.memberships.find((m) => m.page === "ambassadors");
    const featuredStories =
      mode === "list" &&
      !isStories &&
      p.featuredStories.map((story) => (
        <h4 className={styles.featuredStory} key={story.href}>
          <a href={story.href}>Featured story: {story.title}</a>
        </h4>
      ));
    const ambassadorRoles = [
      ...p.localNames.map((local) => `${local} organizer`),
      ...(ambassador?.maintainerProjects ?? []).map(
        (project) => `${project} maintainer`,
      ),
    ];
    const meetings = p.count
      ? `${p.count} meeting${p.count === 1 ? "" : "s"} attended`
      : undefined;
    const attendanceMemberships = memberships.filter(
      (m) =>
        m.person === p.slug && m.page.startsWith("wg/") && m.page !== "wg/tsc",
    );
    const groupCount = new Set(attendanceMemberships.map((m) => m.page)).size;
    const context = [
      ...new Set(
        p.memberships.map((m) =>
          mode === "list" && m.page.startsWith("stars/")
            ? m.label.replace(/^Class of /, "Star of ")
            : m.label,
        ),
      ),
    ];
    const lastAttended = (
      page.slug === "wg" && mode === "list"
        ? attendanceMemberships
        : p.memberships
    )
      .map((m) => m.lastActive ?? "")
      .sort()
      .at(-1);
    const groups = [
      ...new Map(
        p.memberships
          .filter((m) => m.page.startsWith("wg/"))
          .map((m) => [m.page, m]),
      ).values(),
    ];
    const starCardImage = /^stars\/\d{4}$/.test(page.slug)
      ? p.memberships.find((m) => m.page === page.slug)?.image
      : undefined;
    const starCardHref = starCardImage ? cardHrefFor(starCardImage) : undefined;
    const tscTerm =
      page.slug === "wg/tsc" && mode === "list"
        ? p.memberships.find((m) => m.page === "wg/tsc")
        : undefined;
    return (
      <li key={p.slug} id={p.anchor} className={styles.person}>
        <a
          href={starCardHref ?? profile}
          className={`${styles.avatar} ${p.currentTsc ? styles.gold : p.currentAmbassador ? styles.ambassador : ""}`}
          aria-label={
            isStars ? `View star card for ${p.name}` : `Meet ${p.name}`
          }
          aria-haspopup={isStars && !starCardHref ? "dialog" : undefined}
          onClick={
            isStars && !starCardHref
              ? (event) => {
                  if (
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return;
                  event.preventDefault();
                  setSelectedStar(p);
                }
              : undefined
          }
          title={p.name}
          style={{ viewTransitionName: p.transitionName } as CSSProperties}
        >
          <Avatar name={p.name} src={p.avatarUrl} />
        </a>
        <div className={styles.details}>
          <div className={styles.identity}>
            <h3>
              {mode === "article" ? p.name : <a href={profile}>{p.name}</a>}
            </h3>
            {p.githubUsername && (
              <span className={styles.username}>@{p.githubUsername}</span>
            )}
          </div>
          {mode !== "article" && isWorkingGroup && (
            <>
              <div className={styles.memberMeta}>
                {p.location && <span>{p.location}</span>}
                {tscTerm ? (
                  tscTerm.termStart && (
                    <span>
                      Term: {tscTerm.termStart} – {tscTerm.termEnd}
                    </span>
                  )
                ) : mode === "list" ? (
                  <span>
                    Attends {groupCount} {groupCount === 1 ? "group" : "groups"}
                  </span>
                ) : (
                  meetings && <span>{meetings}</span>
                )}
                {!tscTerm && lastAttended && (
                  <span>
                    Last attended{" "}
                    <time dateTime={lastAttended}>
                      {mode === "list"
                        ? lastAttended.slice(0, 4)
                        : lastAttended}
                    </time>
                  </span>
                )}
                {p.memberships.some((m) => m.chair) && <span>TSC chair</span>}
                {p.memberships
                  .filter((m) => mode !== "list" && m.affiliation)
                  .map((m) => (
                    <span key={m.page}>
                      {m.affiliation}
                      {m.emeriti ? " (during term)" : ""}
                    </span>
                  ))}
                <a href={profile}>View profile ↗</a>
              </div>
              {featuredStories}
              {page.slug === "wg" && (
                <ul
                  className={styles.groupLinks}
                  aria-label={`${p.name}'s working groups`}
                >
                  {groups.map((m) => (
                    <li key={m.page}>
                      <a href={`${url(m.page)}#${p.anchor}`}>
                        {m.page === "wg/tsc"
                          ? "TSC"
                          : m.label.replace(/ WG$/, "")}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {mode !== "article" && !isWorkingGroup && (
            <>
              {p.location && <p className={styles.location}>{p.location}</p>}
              {featuredStories}
              {ambassadorList ? (
                <>
                  {ambassadorRoles.length > 0 && (
                    <ul
                      className={styles.ambassadorRoles}
                      aria-label="Community roles"
                    >
                      {ambassadorRoles.map((role) => (
                        <li key={role}>{role}</li>
                      ))}
                    </ul>
                  )}
                  {!ambassador?.emeriti && !!ambassador?.interests?.length && (
                    <p className={styles.context}>
                      Ask me about {ambassador.interests.join(", ")}.
                    </p>
                  )}
                </>
              ) : (
                <p className={styles.context}>
                  {meetings ?? context.slice(0, 3).join(" · ")}
                  {!meetings && context.length > 3
                    ? ` · +${context.length - 3} more`
                    : ""}
                </p>
              )}
              {p.memberships.some((m) => m.chair) && (
                <p className={styles.context}>TSC chair</p>
              )}
              {p.memberships
                .filter((m) => mode !== "list" && m.affiliation)
                .map((m) => (
                  <p key={m.page} className={styles.location}>
                    {m.affiliation}
                    {m.emeriti ? " · affiliation during term" : ""}
                  </p>
                ))}
              {p.memberships.filter((m) => m.lastActive).length > 0 && (
                <p className={styles.location}>
                  Last attended:{" "}
                  {p.memberships
                    .map((m) => m.lastActive ?? "")
                    .sort()
                    .at(-1)}
                </p>
              )}
              {p.memberships
                .flatMap((m) => (m.talk ? [m.talk] : []))
                .map((t) => (
                  <p className={styles.talk} key={t.id}>
                    <a href={`${profile}#talk-${t.id}`}>
                      {t.title} <span aria-hidden="true">↗</span>
                    </a>
                  </p>
                ))}
              <a className={styles.profileLink} href={profile}>
                View profile <span aria-hidden="true">↗</span>
              </a>
            </>
          )}
        </div>
      </li>
    );
  }
  return (
    <div className={styles.directory}>
      <div className={styles.filters}>
        <div className={styles.secondaryNavigation}>
          <nav className={styles.navigation} aria-label="Main navigation">
            {navigation.map((item) => (
              <a
                key={item.slug}
                href={filterHref(item.slug)}
                aria-current={
                  (
                    item.slug
                      ? page.slug === item.slug ||
                        page.slug.startsWith(`${item.slug}/`)
                      : page.slug === ""
                  )
                    ? "page"
                    : undefined
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
          {categories.sub.length > 0 && (
            <nav
              className={styles.subcategories}
              aria-label={`${labels[page.slug.split("/")[0]]} categories`}
            >
              <a
                href={filterHref(page.slug.split("/")[0])}
                aria-current={!page.parent ? "page" : undefined}
              >
                All
              </a>
              {categories.sub.map((p) => (
                <a
                  key={p.slug}
                  href={filterHref(p.slug)}
                  aria-current={page.slug === p.slug ? "page" : undefined}
                >
                  {p.slug.startsWith("stars/")
                    ? p.slug.split("/")[1]
                    : p.title
                        .replace(" Working Group", "")
                        .replace("Technical Steering Committee", "TSC")}
                </a>
              ))}
            </nav>
          )}
          <h1 className={styles.pageHeading}>
            {page.heading ? (
              <>
                {page.heading.firstLine}
                <br />
                <em>{page.heading.secondLine}</em>
              </>
            ) : (
              page.title
            )}
          </h1>
        </div>
        <div className={styles.controls}>
          <div className={styles.modes} role="group" aria-label="Display mode">
            {(
              [
                "grid",
                ...(!isStories ? ["list"] : []),
                ...(hasArticles ? ["article"] : []),
              ] as Mode[]
            ).map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={mode === value}
                onClick={() => changeMode(value)}
              >
                {value === "grid"
                  ? "▦ Grid"
                  : value === "list"
                    ? "☰ List"
                    : "Articles"}
              </button>
            ))}
          </div>
          <div className={styles.searchGroup}>
            <label>
              <span className={styles.srOnly}>Search people</span>
              <input
                type="search"
                placeholder="Find a name or username…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
      {children}
      <div data-view={mode} className={styles.results}>
        <section aria-label="Active people">
          <h2 className={styles.sectionTitle} aria-live="polite">
            {activeTitle}
          </h2>
          {active.length > 0 && (
            <ul className={styles.people}>
              {active.map((p) =>
                mode === "article" ? renderArticles(p) : renderPerson(p),
              )}
            </ul>
          )}
        </section>
        {previous.length > 0 && (
          <section
            aria-label="Previously active people"
            className={styles.previous}
          >
            <h2 className={styles.sectionTitle}>{previousTitle}</h2>
            {page.slug === "wg/tsc" && (
              <p className={styles.previousIntro}>
                We thank these former TSC members for their technical leadership
                and stewardship of GraphQL. Their work reviewing proposals,
                guiding technical decisions, and shaping the GraphQL
                specification has helped the language evolve for the whole
                community.
              </p>
            )}
            {page.slug === "ambassadors" && (
              <p className={styles.previousIntro}>
                We celebrate and thank these former GraphQL Ambassadors for the
                time, experience, and care they have shared with the program and
                the wider GraphQL community. Their contributions have helped
                make GraphQL stronger, more welcoming, and more connected.
              </p>
            )}
            <ul className={styles.people}>
              {previous.map((p) =>
                mode === "article" ? renderArticles(p) : renderPerson(p),
              )}
            </ul>
          </section>
        )}
        {visible.length === 0 && (
          <p className={styles.empty}>
            No people match your search. Try another name or username.
          </p>
        )}
      </div>
      {isStars && (
        <dialog
          ref={starDialog}
          className={styles.starDialog}
          aria-labelledby="star-dialog-name"
          onClose={() => setSelectedStar(null)}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              event.currentTarget.close();
          }}
        >
          <button
            className={styles.dialogClose}
            type="button"
            aria-label="Close star card"
            autoFocus
            onClick={() => starDialog.current?.close()}
          >
            ×
          </button>
          {selectedStar && (
            <>
              <div className={styles.dialogHeading}>
                <p className={styles.date}>
                  {memberships
                    .filter(
                      (m) =>
                        m.person === selectedStar.slug &&
                        m.page.startsWith("stars/"),
                    )
                    .toSorted((a, b) => b.page.localeCompare(a.page))
                    .map((m) => m.label)
                    .join(" · ")}
                </p>
                <div className={styles.identity}>
                  <h2 id="star-dialog-name">{selectedStar.name}</h2>
                  <div className={styles.dialogProfileLinks}>
                    {selectedStar.githubUsername && (
                      <span>@{selectedStar.githubUsername}</span>
                    )}
                    <a href={`/profiles/${selectedStar.slug}/`}>
                      View full profile
                    </a>
                  </div>
                </div>
              </div>
              <p>
                Thank you {selectedStar.githubUsername ?? selectedStar.name} for
                being a Star in {selectedMembership?.page.split("/")[1]}!
              </p>
              {selectedMembership?.image && (
                <figure className={styles.starCard}>
                  <img
                    className={starCardStyles.card}
                    src={selectedMembership.image}
                    alt={`GraphQL Stars contribution card for ${selectedStar.name}, ${selectedMembership.label}`}
                  />
                </figure>
              )}
            </>
          )}
        </dialog>
      )}
    </div>
  );
}
