import { social } from "@/constant/data";
import { getContributions } from "@/lib/contributions";
import SectionHead from "../ui/SectionHead";
import Elevation from "./activity/Elevation";
import TitleBlock from "./activity/TitleBlock";

// A year of GitHub activity, drafted as an elevation drawing. Data is pulled
// on the server from the public contributions calendar and refreshed every
// few hours, so the numbers stay live without a client-side request.

const GITHUB_USER = social.github.split("/").filter(Boolean).pop();

const fmt = (d) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export default async function Activity() {
  const data = await getContributions(GITHUB_USER);

  const cells = data && [
    { label: "Contributions", value: data.total, note: "last 12 months", tone: "accent", wide: true },
    { label: "Longest streak", value: data.longest.length, unit: "days", note: data.longest.start ? `${fmt(data.longest.start)} →` : null },
    { label: "Current streak", value: data.current, unit: "days", note: data.current ? "and counting" : "next one starts today" },
    { label: "Busiest day", value: data.busiest.count, unit: "commits", note: fmt(data.busiest.date) },
    { label: "Days shipped", value: data.activeDays, unit: `/ ${data.days.length}`, note: `${Math.round((data.activeDays / data.days.length) * 100)}% of the year` },
  ];

  return (
    <section id="activity" className="relative w-full px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead
          label="Commit history"
          index="05 / 06"
          title="Elevation"
          count={data ? `${data.total.toLocaleString("en-US")} contributions` : undefined}
        />
        <p className="mt-6 max-w-md text-[color:var(--color-fg-soft)]">
          A year of commits, drawn to scale. Look at it from the side, where every column is a week, or from above, where every dot is a day. Hover anywhere to cut a section through that week.
        </p>

        <div className="mt-12 border-[1.5px] border-[color:var(--color-fg)] bg-[color:var(--color-surface)] shadow-[6px_7px_0_var(--shadow)]">
          <header className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b-[1.5px] border-[color:var(--color-fg)] bg-[#12151c] px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[#f1efe9] md:px-6">
            <span>Survey drawing · GitHub contributions</span>
            <span className="hidden text-[#9aa0ab] sm:inline">Sheet 2 views</span>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline ml-auto text-[#ff6a2b]"
            >
              @{GITHUB_USER} ↗
            </a>
          </header>

          {data ? (
            <>
              <div className="grid-paper px-3 py-6 md:px-8 md:py-8">
                <Elevation data={data} />
              </div>
              <TitleBlock cells={cells} />
            </>
          ) : (
            <div className="grid-paper px-6 py-16 text-center font-mono text-sm text-[color:var(--color-muted)]">
              The survey data didn&apos;t load this time.{" "}
              <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-[color:var(--color-accent)] underline">
                See it on GitHub ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
